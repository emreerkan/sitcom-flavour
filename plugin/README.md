# sitcom-flavour

Seasons Claude's replies with a sitcom line matched to the situation: a line
when a hotfix is heading for prod, a different one when the tests go green.

Lines never appear in code, comments, commits, PRs or docs, and the plugin
stays quiet during incidents or when you're clearly frustrated.

## Install

```
/plugin install sitcom-flavour@sitcom-flavour
```

Start a new session. Silicon Valley is on by default.

## Configure

```
/flavour                           # status
/flavour list                      # available shows
/flavour silicon-valley,community  # up to 3 shows
/flavour frequency sometimes       # rare | sometimes | often
/flavour off
```

Settings live in `~/.claude/sitcom-flavour.conf`. The environment variables
`SITCOM_FLAVOUR_SHOWS` and `SITCOM_FLAVOUR_FREQUENCY` override the file, which
is handy for per-project settings.

## Shows

Silicon Valley, Brooklyn Nine-Nine, The Office (US), Parks and Recreation,
Community, Arrested Development, Seinfeld, How I Met Your Mother, Friends,
The IT Crowd, The Good Place, The Big Bang Theory, Young Sheldon, Ted Lasso,
It's Always Sunny in Philadelphia.

## How it works

A `SessionStart` hook reads your config and injects the selected quote banks
as context at startup, on resume, on `/clear` and after compaction. No MCP
server, no network access, bash only. At most 3 shows load at once, and a
bank costs 150-400 tokens.

Hooks don't run on the Claude apps, so the plugin works in Claude Code and
Cowork.

## Personal banks

Put your own lines in `~/.claude/sitcom-flavour/banks/<show>.md`. A file named
after a bundled show extends that bank; any other name adds a show of your own.

Homepage: https://ada.tools/sitcom-flavour/
Source: https://github.com/emreerkan/sitcom-flavour (MIT)

Quotes are short excerpts, used for commentary, and belong to their
respective rights holders.
