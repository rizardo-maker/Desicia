#!/usr/bin/env bash
# Headless Chromium for taste-skill's browser checks on machines with no Chrome installed
# (CI runners, cloud sandboxes). Uses the self-contained @sparticuz/chromium build from npm.
#
#   source <(./scripts/setup-chrome.sh)     # exports CHROME_PATH and CHROME for this shell
#
# On a normal dev machine with Chrome/Edge/Chromium installed you do not need this.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIR="$ROOT/.cache/chrome"            # .cache is git-ignored
WRAP="$DIR/chrome"

if [[ ! -x "$WRAP" ]]; then
  mkdir -p "$DIR"
  ( cd "$DIR" && [[ -f package.json ]] || npm init -y >/dev/null )
  ( cd "$DIR" && npm i --silent @sparticuz/chromium@latest >/dev/null )
  node - "$DIR" <<'NODE'
const [dir] = process.argv.slice(2);
const fs = require('fs'), zlib = require('zlib'), path = require('path'), { execSync } = require('child_process');
const bin = path.join(dir, 'node_modules/@sparticuz/chromium/bin');
fs.writeFileSync(path.join(dir, 'chromium'), zlib.brotliDecompressSync(fs.readFileSync(path.join(bin, 'chromium.br'))));
fs.chmodSync(path.join(dir, 'chromium'), 0o755);
for (const f of ['al2023', 'fonts', 'swiftshader']) {
  const tar = path.join(dir, f + '.tar');
  fs.writeFileSync(tar, zlib.brotliDecompressSync(fs.readFileSync(path.join(bin, f + '.tar.br'))));
  execSync(`tar xf ${tar} -C ${dir}`); fs.unlinkSync(tar);
}
NODE
  cat > "$WRAP" <<EOF
#!/usr/bin/env bash
export LD_LIBRARY_PATH="$DIR/lib:$DIR/swiftshader\${LD_LIBRARY_PATH:+:\$LD_LIBRARY_PATH}"
export FONTCONFIG_PATH="$DIR/fonts"
exec "$DIR/chromium" --no-sandbox --no-zygote --single-process --disable-dev-shm-usage \\
  --use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader "\$@"
EOF
  chmod +x "$WRAP"
fi
echo "export CHROME_PATH='$WRAP'"
echo "export CHROME='$WRAP'"
