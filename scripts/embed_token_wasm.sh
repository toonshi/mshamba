#!/bin/bash
set -euo pipefail

TOKEN_CANISTER=fungible_token
TOKEN_WASM_PATH=".dfx/local/canisters/$TOKEN_CANISTER/$TOKEN_CANISTER.wasm"
OUT_MODULE="src/factory/wasm_bytes.mo"
TMP_HEX="wasm_bytes.tmp"

# 1) Build the token canister so the .wasm exists
dfx build "$TOKEN_CANISTER"

if [ ! -f "$TOKEN_WASM_PATH" ]; then
  echo "ERROR: Wasm not found at $TOKEN_WASM_PATH"
  exit 1
fi

# 2) Dump bytes as 0xAA, 0xBB, ... lines into a temp file
hexdump -v -e '1/1 "0x%02X, "' "$TOKEN_WASM_PATH" > "$TMP_HEX"

# 3) Generate a simple static Motoko module that only defines the array (module must be static)
cat > "$OUT_MODULE" <<'EOF'
module {
  // static wasm bytes as [Nat8]
  public let array : [Nat8] = [
EOF

# append bytes (trim trailing space/newline)
sed -e ':a;N;$!ba;s/\n/ /g' "$TMP_HEX" >> "$OUT_MODULE"

cat >> "$OUT_MODULE" <<'EOF'
  ];
}
EOF

rm -f "$TMP_HEX"
echo "✅ Embedded $TOKEN_CANISTER.wasm into $OUT_MODULE"
