#!/usr/bin/env bash
# SessionStart hook: injects the selected sitcom banks as additional context.
#
# Config (first match wins):
#   env  SITCOM_FLAVOUR_SHOWS=b99,the-office   SITCOM_FLAVOUR_FREQUENCY=rare|sometimes|often
#   file ${CLAUDE_CONFIG_DIR:-~/.claude}/sitcom-flavour.conf   (shows=..., frequency=...)
#   default shows=silicon-valley frequency=rare
#
# Personal banks in ${CLAUDE_CONFIG_DIR:-~/.claude}/sitcom-flavour/banks/<slug>.md
# extend the plugin bank of the same name, or add a new show.

set -uo pipefail

PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
BANKS_DIR="$PLUGIN_ROOT/banks"
CONF="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/sitcom-flavour.conf"
USER_BANKS_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/sitcom-flavour/banks"
MAX_SHOWS=3

conf_get() {
  [ -f "$CONF" ] || return 0
  sed -n "s/^[[:space:]]*$1[[:space:]]*=[[:space:]]*//p" "$CONF" | tail -n 1 | tr -d '[:space:]'
}

shows="${SITCOM_FLAVOUR_SHOWS:-$(conf_get shows)}"
frequency="${SITCOM_FLAVOUR_FREQUENCY:-$(conf_get frequency)}"
shows="${shows:-silicon-valley}"
frequency="${frequency:-rare}"

available=$(
  for f in "$BANKS_DIR"/*.md "$USER_BANKS_DIR"/*.md; do
    [ -e "$f" ] && basename "$f" .md
  done | sort -u | paste -sd, - | sed 's/,/, /g'
)

case "$frequency" in
  often)     freq_rule="Drop a line in most replies where one genuinely fits." ;;
  sometimes) freq_rule="Drop a line every few replies, when one genuinely fits." ;;
  *)         frequency="rare"
             freq_rule="Sparingly: only when a line actually lands, never as a habit." ;;
esac

footer="Plugin: sitcom-flavour. Banks directory: $BANKS_DIR. Personal banks directory: $USER_BANKS_DIR (a file there extends the plugin bank of the same name, or adds a new show). Available shows: $available. Config file: $CONF. The /flavour command (full name /sitcom-flavour:flavour) changes shows and frequency."

if [ "$shows" = "off" ]; then
  context="<sitcom-flavour>
Sitcom flavour is off. Do not add sitcom lines.
$footer
</sitcom-flavour>"
else
  banks=""
  loaded=""
  count=0
  IFS=',' read -ra requested <<< "$shows"
  for slug in "${requested[@]}"; do
    # Slugs map to filenames, so only allow a safe charset.
    [[ "$slug" =~ ^[a-z0-9-]+$ ]] || continue
    bank=""
    [ -f "$BANKS_DIR/$slug.md" ] && bank=$(cat "$BANKS_DIR/$slug.md")
    [ -f "$USER_BANKS_DIR/$slug.md" ] && bank="$bank
$(cat "$USER_BANKS_DIR/$slug.md")"
    [ -n "$bank" ] || continue
    [ "$count" -ge "$MAX_SHOWS" ] && break
    banks="$banks
$bank
"
    loaded="${loaded:+$loaded, }$slug"
    count=$((count + 1))
  done

  [ "$count" -eq 0 ] && exit 0

  context="<sitcom-flavour>
Season replies with a sitcom line from the banks below. Active shows: $loaded. Frequency: $frequency.

Rules:
- $freq_rule
- Match the line to the situation using the section headings. The right line for the moment beats the famous line.
- Rotate across shows and characters. Don't reuse a line within a session.
- Paraphrasing to fit the context is encouraged (\"Cool fix. Still a race condition.\").
- One line, at the start or end of a reply. Never at the cost of the answer, and never explain the joke.
- Never in code, comments, commit messages, PR descriptions, docs, or anything else that outlives the conversation.
- Skip it entirely during incidents, data loss, or when the user is clearly frustrated.
$banks
$footer
</sitcom-flavour>"
fi

escape_for_json() {
  local s="$1"
  s="${s//\\/\\\\}"
  s="${s//\"/\\\"}"
  s="${s//$'\n'/\\n}"
  s="${s//$'\r'/\\r}"
  s="${s//$'\t'/\\t}"
  printf '%s' "$s"
}

printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"%s"}}\n' "$(escape_for_json "$context")"
