#!/usr/bin/env bash
# Get the free HTTPS certificate and turn on the redirect (run as root, after the
# domain's DNS points at this server):
#   bash /opt/dr-jafari/deploy/enable-https.sh
set -euo pipefail

DOMAIN="${DOMAIN:-dandanpezeshkishiraz.ir}"

[ "$(id -u)" -eq 0 ] || { echo "Run this as root."; exit 1; }

here="$(ip -4 route get 1.1.1.1 | sed -n 's/.*src \([0-9.]*\).*/\1/p')"
for host in "$DOMAIN" "www.$DOMAIN"; do
  there="$(getent ahostsv4 "$host" | awk '{print $1; exit}')"
  echo "$host -> ${there:-(not found)}   (this server: $here)"
  if [ "$there" != "$here" ]; then
    echo
    echo "$host does not point at this server yet. Set the DNS records in HostIran's panel and wait a few minutes."
    echo "(Behind NAT the server's own address can differ from its public one. If the DNS record is the IP you were given, run: FORCE=1 bash $0)"
    [ "${FORCE:-}" = "1" ] || exit 1
  fi
done

if ! curl -fsS -m 15 -o /dev/null https://acme-v02.api.letsencrypt.org/directory; then
  echo "Cannot reach Let's Encrypt from this server. Tell the person who set this up; a paid certificate is the fallback."
  exit 1
fi

read -r -p "Email for certificate expiry notices: " email
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m "$email" --redirect
nginx -t
systemctl reload nginx
certbot renew --dry-run
echo
echo "HTTPS is on. Open https://$DOMAIN"
