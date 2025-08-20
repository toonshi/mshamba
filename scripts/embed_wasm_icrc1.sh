#!/usr/bin/env bash
set -euo pipefail

# You can override the URL by setting LEDGER_WASM_URL in your env.
LEDGER_WASM_URL="${LEDGER_WASM_URL:-https://github.com/dfinity/ic/releases/download/release-2025-08-07_03-33-base/icrc1-ledger-canister.wasm.gz}"

# locate project root (search up to 6 levels)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$SCRIPT_DIR"
FOUND=0
for i in 0 1 2 3 4 5; do
  if [ -f "$ROOT/dfx.json" ]; then FOUND=1; break; fi
  ROOT="$(cd "$ROOT/.." && pwd)"
done
if [ "$FOUND" -ne 1 ]; then
  echo "dfx.json not found in ancestor dirs; run the script from inside the project."
  exit 1
fi

OUT_DIR="$ROOT/src/factory/wasm_bytes_icrc1"
OUT_FILE="$OUT_DIR/lib.mo"

TMP="$(mktemp -d)"
cd "$TMP"

echo "[*] Downloading ICRC-1 ledger wasm from: $LEDGER_WASM_URL"
# download (curl preferred)
if command -v curl >/dev/null 2>&1; then
  curl -L -o ledger.wasm.gz "$LEDGER_WASM_URL" || true
else
  wget -O ledger.wasm.gz "$LEDGER_WASM_URL" || true
fi

# Accept either .wasm.gz or .wasm
if [ -f ledger.wasm.gz ] && file ledger.wasm.gz | grep -qi gzip; then
  gunzip -f ledger.wasm.gz
elif [ -f ledger.wasm.gz ]; then
  mv ledger.wasm.gz ledger.wasm
fi

if [ ! -f ledger.wasm ]; then
  echo "Error: ledger.wasm not found after download"
  rm -rf "$TMP"
  exit 1
fi

# Convert to hex bytes with xxd (portable)
xxd -i ledger.wasm > wasm_c_bytes.c

# Extract bytes from the generated C-like file robustly
BYTES=$(sed -n 's/.*{ *\(.*\) *};.*/\1/p' wasm_c_bytes.c | tr -d '\n' | sed 's/,[[:space:]]*/, /g' )

if [ -z "$BYTES" ]; then
  echo "Error: could not extract bytes from wasm_c_bytes.c"
  rm -rf "$TMP"
  exit 1
fi

mkdir -p "$OUT_DIR"

cat > "$OUT_FILE" <<'MO'
module {
  public let array : [Nat8] = [
MO

# print each byte on its own line with indentation and comma
echo "$BYTES" | tr ',' '\n' | sed 's/^/    /' >> "$OUT_FILE"

# close module and add a computed length value (optional)
cat >> "$OUT_FILE" <<'MO'
  ];

  // Computed length of the array (useful if you need the length)
  public let wasm_len : Nat = Array.size(array);
}
MO

echo "[*] Wrote $OUT_FILE"
rm -rf "$TMP"
echo "[✓] Done."
