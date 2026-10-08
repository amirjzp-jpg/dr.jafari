#!/usr/bin/env bash
# Deploy the latest code from GitHub (run as root on the server):
#   bash /opt/dr-jafari/deploy/update.sh
# Pulls main, installs, migrates, rebuilds and restarts. The site is down for the
# build (a few minutes): it is stopped first so the build has the memory it needs.
set -euo pipefail

APP_USER=drjafari
APP_DIR=/opt/dr-jafari
ENV_FILE=/etc/dr-jafari.env

[ "$(id -u)" -eq 0 ] || { echo "Run this as root."; exit 1; }

as_app() {
  sudo -H -u "$APP_USER" bash -c "cd $APP_DIR && set -a && . $ENV_FILE && set +a && export NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=1536 && $*"
}

echo "==> Pulling main"
as_app "git pull --ff-only origin main"

systemctl stop dr-jafari
trap 'systemctl start dr-jafari' EXIT   # start again even if a step fails

echo "==> Installing, migrating, building"
as_app "npm ci --no-audit --no-fund"
as_app "npm run db:migrate"
as_app "npm run build"

systemctl start dr-jafari
trap - EXIT
sleep 4
code="$(curl -s -o /dev/null -w '%{http_code}' -m 20 http://127.0.0.1:3000/ || true)"
echo "site answers: $code (200 is good)"
[ "$code" = "200" ] || { echo "Look at: journalctl -u dr-jafari -n 50 --no-pager"; exit 1; }

echo "==> Notifying search engines (IndexNow: Bing, Yandex)"
as_app "npm run --silent indexnow" || true
