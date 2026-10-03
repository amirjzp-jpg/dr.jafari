#!/usr/bin/env bash
# Set the sms.ir key, the three template IDs and the admin phone numbers in
# /etc/dr-jafari.env, then restart the site. Run as root on the server:
#
#   ADMIN_PHONES=09120000000,09130000000 bash /opt/dr-jafari/deploy/set-env.sh
#
# Secrets are typed at hidden prompts on the server. They are never printed,
# never put in a command line and never committed. Leave a prompt empty to keep
# the value that is already in the file.
set -euo pipefail

ENV_FILE="${ENV_FILE:-/etc/dr-jafari.env}"
[ "$(id -u)" -eq 0 ] || [ -n "${ALLOW_NON_ROOT:-}" ] || { echo "Run this as root."; exit 1; }
[ -f "$ENV_FILE" ] || { echo "$ENV_FILE not found. Run deploy/setup-server.sh first."; exit 1; }

current() { grep -m1 "^$1=" "$ENV_FILE" | cut -d= -f2- || true; }

# Replace the line KEY=... (or add it) without letting special characters in the value matter.
set_kv() {
  local tmp
  tmp="$(mktemp)"
  KEY="$1" VAL="$2" python3 - "$ENV_FILE" "$tmp" <<'PY'
import os, sys
src, dst = sys.argv[1], sys.argv[2]
key, val = os.environ["KEY"], os.environ["VAL"]
out, done = [], False
for line in open(src, encoding="utf-8").read().split("\n"):
    if line.startswith(key + "="):
        if not done:
            out.append(f"{key}={val}")
            done = True
    else:
        out.append(line)
if not done:
    if out and out[-1] == "":
        out.pop()
    out += [f"{key}={val}", ""]
open(dst, "w", encoding="utf-8").write("\n".join(out))
PY
  cat "$tmp" > "$ENV_FILE" # in place, so the file keeps its owner and permissions
  rm -f "$tmp"
}

ask() { # PROMPT -> value on stdout; hidden when SECRET=1
  local v=""
  if [ "${SECRET:-}" = "1" ]; then read -rs -p "$1" v; echo >&2; else read -r -p "$1" v; fi
  printf '%s' "$v"
}

backup="$ENV_FILE.bak-$(date +%Y%m%d-%H%M%S)"
cp -p "$ENV_FILE" "$backup"
chmod 600 "$backup"
echo "Backup of the old settings: $backup (delete it when you are happy)"
echo

# ---- admin phones
phones="${ADMIN_PHONES:-}"
if [ -z "$phones" ]; then
  echo "Current admin numbers: $(current ADMIN_PHONES)"
  phones="$(ask 'Admin mobile numbers, comma-separated, Latin digits (empty keeps them): ')"
fi
phones="${phones//[[:space:]]/}"
if [ -n "$phones" ]; then
  [[ "$phones" =~ ^09[0-9]{9}(,09[0-9]{9})*$ ]] || { echo "Admin numbers must be 11 digits starting with 09, separated by commas."; exit 1; }
  set_kv ADMIN_PHONES "$phones"
fi

# ---- sms.ir key (hidden)
key="$(SECRET=1 ask 'sms.ir API key (hidden, empty keeps the current one): ')"
if [ -n "$key" ]; then
  [[ "$key" =~ ^[A-Za-z0-9_-]{20,128}$ ]] || { echo "That does not look like an API key (letters, digits, - and _ only, 20 to 128 characters)."; exit 1; }
  set_kv SMSIR_API_KEY "$key"
fi
unset key

# ---- template IDs (numbers, not secret)
for pair in "SMSIR_TEMPLATE_OTP:login and booking code" "SMSIR_TEMPLATE_CONFIRMED:booking confirmation" "SMSIR_TEMPLATE_REMINDER:reminder"; do
  name="${pair%%:*}"
  id="$(ask "Template ID for the ${pair#*:} (numbers only, empty keeps the current one): ")"
  if [ -n "$id" ]; then
    [[ "$id" =~ ^[0-9]{1,12}$ ]] || { echo "A template ID is a number like 123456."; exit 1; }
    set_kv "$name" "$id"
  fi
done

# ---- summary (never prints the key)
echo
echo "Settings now:"
n="$(current SMSIR_API_KEY | wc -c)"; n=$((n > 0 ? n - 1 : 0))
if [ "$n" -gt 0 ]; then echo "  SMSIR_API_KEY: set ($n characters)"; else echo "  SMSIR_API_KEY: EMPTY"; fi
for name in SMSIR_TEMPLATE_OTP SMSIR_TEMPLATE_CONFIRMED SMSIR_TEMPLATE_REMINDER; do
  v="$(current "$name")"
  if [ -n "$v" ] && [ "$n" -gt 0 ]; then echo "  $name: $v  -> real SMS ON"; else echo "  $name: ${v:-empty}  -> still test mode (messages go to the log)"; fi
done
echo "  ADMIN_PHONES: $(current ADMIN_PHONES | tr ',' '\n' | sed 's/^\(.......\).*/\1****/' | paste -sd, -)  (last digits hidden)"

# ---- restart
if [ -z "${NO_RESTART:-}" ]; then
  systemctl restart dr-jafari
  sleep 4
  code="$(curl -s -o /dev/null -w '%{http_code}' -m 20 http://127.0.0.1:3000/ || true)"
  echo
  echo "Site restarted; it answers: $code (200 is good)"
  [ "$code" = "200" ] || { echo "Look at: journalctl -u dr-jafari -n 50 --no-pager"; exit 1; }
fi
