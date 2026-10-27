#!/usr/bin/env bash
# Generează fișele de colorat gata făcute în pdf/: câte un PDF pentru fiecare lume și vârstă.
# Folosește Chrome în mod headless pe index.html?print=1&tema=...&varsta=...
# Rulare: ./scripts/fa-pdf.sh
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PROFIL="$(mktemp -d)"
trap 'rm -rf "$PROFIL"' EXIT
mkdir -p pdf

for tema in catei printese dinozauri spatiu unicorni; do
  for varsta in mic mijlociu mare; do
    "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
      --user-data-dir="$PROFIL" --virtual-time-budget=8000 \
      --print-to-pdf="pdf/$tema-$varsta.pdf" \
      "file://$PWD/index.html?print=1&tema=$tema&varsta=$varsta" >/dev/null 2>&1
    echo "pdf/$tema-$varsta.pdf"
  done
done
