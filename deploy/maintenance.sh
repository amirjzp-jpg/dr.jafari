#!/usr/bin/env bash
# Lock or unlock the whole site with an "under maintenance" page. Run as root on the server:
#
#   bash /opt/dr-jafari/deploy/maintenance.sh on
#   bash /opt/dr-jafari/deploy/maintenance.sh off
#
# Sets MAINTENANCE in /etc/dr-jafari.env and restarts the site (no rebuild).
set -euo pipefail
ENV_FILE="${ENV_FILE:-/etc/dr-jafari.env}"
[ "$(id -u)" -eq 0 ] || { echo "Run this as root."; exit 1; }
case "${1:-}" in
  on) value=1 ;;
  off) value=0 ;;
  *) echo "Usage: $0 on|off"; exit 1 ;;
esac
if grep -q '^MAINTENANCE=' "$ENV_FILE"; then
  sed -i "s/^MAINTENANCE=.*/MAINTENANCE=$value/" "$ENV_FILE"
else
  echo "MAINTENANCE=$value" >> "$ENV_FILE"
fi
systemctl restart dr-jafari
sleep 3
code=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/ || true)
echo "Maintenance $1. The site now answers $code (503 = locked, 200 = open)."
