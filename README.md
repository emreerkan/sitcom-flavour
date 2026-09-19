# sitcom-flavour

A Claude Code plugin that seasons Claude's replies with sitcom lines matched to the situation. You get "Cool motive. Still murder." when a hotfix is heading straight to prod, "I've made a huge mistake." before a rollback, and "Noice." when the tests go green.

It never shows up in code, comments, commits, PRs or docs, and it stays quiet during incidents.

## Shows

| Slug | Show |
|---|---|
| `b99` | Brooklyn Nine-Nine |
| `the-office` | The Office (US) |
| `parks-and-rec` | Parks and Recreation |
| `community` | Community |
| `arrested-development` | Arrested Development |
| `silicon-valley` | Silicon Valley |

## Install

```
/plugin marketplace add emreerkan/sitcom-flavour
/plugin install sitcom-flavour@sitcom-flavour
```

Start a new session. Brooklyn Nine-Nine is on by default.

## Configure

```
/sitcom-flavour:flavour                       # status
/sitcom-flavour:flavour list                  # available shows
/sitcom-flavour:flavour b99,community         # up to 3 shows
/sitcom-flavour:flavour frequency sometimes   # rare | sometimes | often
/sitcom-flavour:flavour off
```

Settings are saved in `~/.claude/sitcom-flavour.conf`:

```
shows=b99,community
frequency=rare
```

The environment variables `SITCOM_FLAVOUR_SHOWS` and `SITCOM_FLAVOUR_FREQUENCY` override the file, which is handy for per-project settings via `.claude/settings.json` → `env`.

## How it works

A `SessionStart` hook reads the config and injects the selected banks as context at startup, on `/clear` and after compaction. There's no MCP server and no network access. It needs only bash.

At most 3 shows load at once, so the token cost stays small (roughly 300–500 tokens per show).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. Quotes are short excerpts, used for commentary, and belong to their respective rights holders.
