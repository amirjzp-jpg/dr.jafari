#!/usr/bin/env bash
# One-time setup of the production server (Ubuntu 24.04, run as root).
#
#   apt-get update && apt-get install -y git
#   git clone https://github.com/amirjzp-jpg/dr.jafari.git /opt/dr-jafari
#   bash /opt/dr-jafari/deploy/setup-server.sh
#
# Installs Node, PostgreSQL and nginx, builds the site, runs it as a systemd
# service behind nginx, and sets up the firewall, nightly database backups and
# the 15-minute reminder job. It does NOT set up HTTPS: that needs the domain to
# point at this server first (see deploy/enable-https.sh).
#
# Safe to run again: existing secrets, the database and a certbot-edited nginx
# config are left alone. Nothing secret is printed.
set -euo pipefail
trap 'echo; echo "Stopped at line $LINENO. Fix the problem above and run the script again; it is safe to repeat."' ERR

DOMAIN="${DOMAIN:-dandanpezeshkishiraz.ir}"
APP_USER=drjafari
APP_DIR=/opt/dr-jafari
ENV_FILE=/etc/dr-jafari.env
NGINX_CONF=/etc/nginx/sites-available/dr-jafari
SWAP_GB=3

say() { printf '\n==> %s\n' "$*"; }

[ "$(id -u)" -eq 0 ] || { echo "Run this as root."; exit 1; }
[ -d "$APP_DIR/.git" ] || { echo "Clone the repository to $APP_DIR first (see the top of this file)."; exit 1; }
. /etc/os-release
[ "${VERSION_ID:-}" = "24.04" ] || echo "Warning: written for Ubuntu 24.04, this is ${PRETTY_NAME:-unknown}."

export DEBIAN_FRONTEND=noninteractive NEEDRESTART_MODE=a

# ---------------------------------------------------------------- swap
# The build needs more memory than a 1 GB server has; swap covers the gap.
if [ "$(swapon --show --noheadings | wc -l)" -eq 0 ]; then
  say "Adding ${SWAP_GB} GB of swap"
  fallocate -l "${SWAP_GB}G" /swapfile
  chmod 600 /swapfile
  mkswap /swapfile >/dev/null
  swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo 'vm.swappiness=10' > /etc/sysctl.d/99-swap.conf
  sysctl -q -p /etc/sysctl.d/99-swap.conf
fi

# ---------------------------------------------------------------- packages
say "Installing packages"
apt-get update -y
apt-get install -y ca-certificates curl gnupg git sudo openssl cron ufw fail2ban unattended-upgrades \
  nginx postgresql certbot python3-certbot-nginx

if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 22 ]; then
  say "Installing Node.js 22"
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
echo "node $(node -v), npm $(npm -v)"

cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
EOF

# ---------------------------------------------------------------- app user
id "$APP_USER" >/dev/null 2>&1 || useradd --system --create-home --home-dir "/home/$APP_USER" --shell /usr/sbin/nologin "$APP_USER"
chown -R "$APP_USER:$APP_USER" "$APP_DIR"

# ---------------------------------------------------------------- secrets + database
systemctl enable --now postgresql >/dev/null

if [ ! -f "$ENV_FILE" ]; then
  say "Creating $ENV_FILE"
  phones=""
  while :; do
    read -r -p "Staff mobile numbers allowed into /admin (Latin digits, comma-separated, e.g. 09121234567,09129876543): " phones
    phones="${phones//[[:space:]]/}"
    [[ "$phones" =~ ^09[0-9]{9}(,09[0-9]{9})*$ ]] && break
    echo "Not valid. Each number is 11 digits starting with 09."
  done

  db_pass="$(openssl rand -hex 24)"
  umask 077
  cat > "$ENV_FILE" <<EOF
DATABASE_URL=postgres://$APP_USER:$db_pass@127.0.0.1:5432/$APP_USER
OTP_SECRET=$(openssl rand -hex 32)
CRON_SECRET=$(openssl rand -hex 32)
ADMIN_PHONES=$phones
NEXT_PUBLIC_SITE_URL=https://$DOMAIN
SITE_INDEXABLE=true
# sms.ir: fill these in later (see docs/DEPLOY.md), then run: systemctl restart dr-jafari
SMSIR_API_KEY=
SMSIR_TEMPLATE_OTP=
SMSIR_TEMPLATE_CONFIRMED=
SMSIR_TEMPLATE_REMINDER=
EOF
  chown "root:$APP_USER" "$ENV_FILE"
  chmod 640 "$ENV_FILE"

  say "Creating the database"
  sudo -u postgres psql -v ON_ERROR_STOP=1 -q <<EOF
DO \$\$
BEGIN
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = '$APP_USER') THEN
    ALTER ROLE $APP_USER LOGIN PASSWORD '$db_pass';
  ELSE
    CREATE ROLE $APP_USER LOGIN PASSWORD '$db_pass';
  END IF;
END
\$\$;
EOF
  sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$APP_USER'" | grep -q 1 \
    || sudo -u postgres createdb -O "$APP_USER" "$APP_USER"
else
  echo "$ENV_FILE already exists, keeping it."
fi

# ---------------------------------------------------------------- build
as_app() {
  sudo -H -u "$APP_USER" bash -c "cd $APP_DIR && set -a && . $ENV_FILE && set +a && export NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=1536 && $*"
}

say "Installing dependencies (a few minutes)"
as_app "npm ci --no-audit --no-fund"
say "Applying database migrations"
as_app "npm run db:migrate"
say "Building the site (this is the slow step: 3 to 8 minutes on a small server)"
as_app "npm run build"

# ---------------------------------------------------------------- service
say "Installing the service"
cat > /etc/systemd/system/dr-jafari.service <<EOF
[Unit]
Description=Dr. Jafari clinic website
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
User=$APP_USER
Group=$APP_USER
WorkingDirectory=$APP_DIR
EnvironmentFile=$ENV_FILE
Environment=NODE_ENV=production
ExecStart=$(command -v node) $APP_DIR/node_modules/next/dist/bin/next start -H 127.0.0.1 -p 3000
Restart=always
RestartSec=3
LimitNOFILE=4096
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full
ProtectHome=true

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable dr-jafari >/dev/null
systemctl restart dr-jafari

# ---------------------------------------------------------------- nginx
# Rewritten only until certbot has edited it (it adds the ssl_certificate lines).
if [ ! -f "$NGINX_CONF" ] || ! grep -q ssl_certificate "$NGINX_CONF"; then
  say "Configuring nginx"
  cat > "$NGINX_CONF" <<EOF
# www goes to the bare domain.
server {
    listen 80;
    listen [::]:80;
    server_name www.$DOMAIN;
    return 301 https://$DOMAIN\$request_uri;
}

server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name $DOMAIN;
    server_tokens off;
    client_max_body_size 1m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        # The app reads the right-most entry, the one nginx appends (docs/SECURITY.md).
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
    }
}
EOF
fi
rm -f /etc/nginx/sites-enabled/default
ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/dr-jafari
nginx -t
systemctl enable --now nginx >/dev/null
systemctl reload nginx

# ---------------------------------------------------------------- firewall
say "Firewall"
ssh_port="$(sshd -T 2>/dev/null | awk '/^port /{print $2; exit}')"
ssh_port="${ssh_port:-22}"
ufw allow "${ssh_port}/tcp" >/dev/null
ufw allow 80/tcp >/dev/null
ufw allow 443/tcp >/dev/null
ufw --force enable >/dev/null
systemctl enable --now fail2ban >/dev/null

# ---------------------------------------------------------------- jobs
say "Reminder job (every 15 minutes) and nightly backup"
cat > /usr/local/bin/dr-jafari-cron.sh <<'EOF'
#!/usr/bin/env bash
# Sends due reminder SMS and runs the daily clean-up. Calls the app on localhost.
secret="$(grep '^CRON_SECRET=' /etc/dr-jafari.env | cut -d= -f2-)"
printf 'header = "Authorization: Bearer %s"\n' "$secret" \
  | curl -fsS -m 60 -K - http://127.0.0.1:3000/api/cron/reminders >/dev/null \
  || { logger -t dr-jafari-cron "reminder call failed"; exit 1; }
EOF
cat > /usr/local/bin/dr-jafari-backup.sh <<'EOF'
#!/usr/bin/env bash
# Nightly database dump, kept 14 days.
set -euo pipefail
dir=/var/backups/dr-jafari
mkdir -p "$dir"
chmod 700 "$dir"
out="$dir/db-$(date +%F).sql.gz"
runuser -u postgres -- pg_dump drjafari | gzip > "$out.tmp"
mv "$out.tmp" "$out"
find "$dir" -name 'db-*.sql.gz' -mtime +14 -delete
EOF
chmod 755 /usr/local/bin/dr-jafari-cron.sh /usr/local/bin/dr-jafari-backup.sh
cat > /etc/cron.d/dr-jafari <<'EOF'
*/15 * * * * root /usr/local/bin/dr-jafari-cron.sh
10 3 * * * root /usr/local/bin/dr-jafari-backup.sh
EOF
chmod 644 /etc/cron.d/dr-jafari

# ---------------------------------------------------------------- check
say "Checking"
sleep 4
app="$(curl -s -o /dev/null -w '%{http_code}' -m 20 http://127.0.0.1:3000/ || true)"
web="$(curl -s -o /dev/null -w '%{http_code}' -m 20 -H "Host: $DOMAIN" http://127.0.0.1/ || true)"
cron_out="$(/usr/local/bin/dr-jafari-cron.sh 2>&1 && echo ok || echo failed)"
echo "site (port 3000):  $app   (200 is good)"
echo "through nginx:     $web   (200 is good)"
echo "reminder job:      $cron_out"
if [ "$app" != "200" ] || [ "$web" != "200" ]; then
  echo; echo "Something is not right. Look at: journalctl -u dr-jafari -n 50 --no-pager"
  exit 1
fi

cat <<EOF

Done. The site runs on this server.

Not done yet (needs the domain):
  1. In HostIran's DNS, point $DOMAIN and www.$DOMAIN to this server's IP.
  2. When they resolve, run:  bash $APP_DIR/deploy/enable-https.sh

Settings file (secrets): $ENV_FILE
Later updates:           bash $APP_DIR/deploy/update.sh
EOF
