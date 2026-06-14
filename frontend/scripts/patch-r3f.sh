#!/usr/bin/env bash
set -e
python3 - <<'PY'
import glob, re
NEEDLE = "if (RESERVED_PROPS.includes(prop)) continue;"
ADD = NEEDLE + "\n    if (typeof prop === 'string' && prop.startsWith('x-')) continue;"
for path in glob.glob("/app/frontend/node_modules/@react-three/fiber/dist/events-*.js"):
    src = open(path).read()
    # First, remove any prior partial patches
    src = src.replace(ADD, NEEDLE)
    # Re-apply to ALL occurrences (applyProps + diffProps)
    src = src.replace(NEEDLE, ADD)
    open(path, "w").write(src)
    cnt = src.count("prop.startsWith('x-')")
    print(f"patched {path}: {cnt} occurrences")
PY
