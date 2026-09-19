#!/usr/bin/env bash
# Runs the SessionStart hook under several configs and checks the JSON output.
set -uo pipefail
cd "$(dirname "$0")/plugin"
export CLAUDE_PLUGIN_ROOT="$PWD"
export CLAUDE_CONFIG_DIR="$(mktemp -d)"
trap 'rm -rf "$CLAUDE_CONFIG_DIR"' EXIT
fail=0

run() { bash hooks/session-start.sh; }
ctx() { run | python3 -c 'import json,sys; print(json.load(sys.stdin)["hookSpecificOutput"]["additionalContext"])'; }
check() { if eval "$2"; then echo "ok   $1"; else echo "FAIL $1"; fail=1; fi; }

check "default loads b99"              '[[ "$(ctx)" == *"Active shows: b99."* ]]'
check "output is valid JSON"           'run | python3 -m json.tool >/dev/null'
for f in banks/*.md; do s=$(basename "$f" .md)
  check "bank $s loads"                "SITCOM_FLAVOUR_SHOWS=$s ctx | grep -q \"Active shows: $s.\""
done
check "caps at 3 shows"                '[[ "$(SITCOM_FLAVOUR_SHOWS=b99,the-office,community,silicon-valley ctx)" == *"Active shows: b99, the-office, community."* ]]'
check "rejects path traversal"         '[ -z "$(SITCOM_FLAVOUR_SHOWS=../../etc/passwd run)" ]'
check "skips unknown show"             '[[ "$(SITCOM_FLAVOUR_SHOWS=nope,community ctx)" == *"Active shows: community."* ]]'
check "all unknown emits nothing"      '[ -z "$(SITCOM_FLAVOUR_SHOWS=nope run)" ]'
check "off disables lines"             '[[ "$(SITCOM_FLAVOUR_SHOWS=off ctx)" == *"Sitcom flavour is off"* ]]'
check "bad frequency falls back"       '[[ "$(SITCOM_FLAVOUR_FREQUENCY=always ctx)" == *"Frequency: rare."* ]]'
printf 'shows=community\nfrequency=often\n' > "$CLAUDE_CONFIG_DIR/sitcom-flavour.conf"
check "reads config file"              '[[ "$(ctx)" == *"Active shows: community. Frequency: often."* ]]'
check "env overrides config"           '[[ "$(SITCOM_FLAVOUR_SHOWS=b99 ctx)" == *"Active shows: b99."* ]]'
mkdir -p "$CLAUDE_CONFIG_DIR/sitcom-flavour/banks"
printf '### Extra\n- "personal-line-xyz"\n' > "$CLAUDE_CONFIG_DIR/sitcom-flavour/banks/b99.md"
printf '## Mine\n- "my-show-line"\n' > "$CLAUDE_CONFIG_DIR/sitcom-flavour/banks/my-show.md"
check "personal bank extends plugin bank" '[[ "$(SITCOM_FLAVOUR_SHOWS=b99 ctx)" == *"Noice"*"personal-line-xyz"* ]]'
check "personal-only show loads"       '[[ "$(SITCOM_FLAVOUR_SHOWS=my-show ctx)" == *"Active shows: my-show."*"my-show-line"* ]]'
check "personal show is listed"        '[[ "$(ctx)" == *"Available shows: arrested-development, b99, community, my-show,"* ]]'
exit $fail
