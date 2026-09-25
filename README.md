# sitcom-flavour

A Claude Code plugin that seasons Claude's replies with sitcom lines matched to the situation. You get "Cool motive. Still murder." when a hotfix is heading straight to prod, "I've made a huge mistake." before a rollback, and "Noice." when the tests go green.

It never shows up in code, comments, commits, PRs or docs, and it stays quiet during incidents.

## Shows

| Slug | Show |
|---|---|
| `silicon-valley` | Silicon Valley |
| `b99` | Brooklyn Nine-Nine |
| `the-office` | The Office (US) |
| `parks-and-rec` | Parks and Recreation |
| `community` | Community |
| `arrested-development` | Arrested Development |
| `seinfeld` | Seinfeld |
| `himym` | How I Met Your Mother |
| `friends` | Friends |
| `it-crowd` | The IT Crowd |
| `good-place` | The Good Place |
| `big-bang-theory` | The Big Bang Theory |
| `young-sheldon` | Young Sheldon |
| `ted-lasso` | Ted Lasso |
| `always-sunny` | It's Always Sunny in Philadelphia |

## Install

```
/plugin marketplace add emreerkan/sitcom-flavour
/plugin install sitcom-flavour@sitcom-flavour
```

Start a new session. Silicon Valley is on by default.

## Update

```
/plugin marketplace update sitcom-flavour
/plugin update sitcom-flavour@sitcom-flavour
```

Restart Claude Code to apply. The same thing from a shell:

```
claude plugin marketplace update sitcom-flavour
claude plugin update sitcom-flavour@sitcom-flavour
```

## Configure

```
/flavour                           # status
/flavour list                      # available shows
/flavour silicon-valley,community  # up to 3 shows
/flavour frequency sometimes       # rare | sometimes | often
/flavour off
```

If another plugin also defines `/flavour`, use the full name `/sitcom-flavour:flavour`.

Settings are saved in `~/.claude/sitcom-flavour.conf`. A file with three shows selected looks like this:

```
shows=silicon-valley,b99,community
frequency=rare
```

The environment variables `SITCOM_FLAVOUR_SHOWS` and `SITCOM_FLAVOUR_FREQUENCY` override the file, which is handy for per-project settings via `.claude/settings.json` → `env`.

## Personal banks

Put your own lines in `~/.claude/sitcom-flavour/banks/<show>.md`, using the same format as the plugin banks. A file named after a bundled show (`b99.md`) is appended to that bank. Any other name adds a new show you can select with `/flavour`. Personal banks are never published, so they're the place for lines that are too spicy for the shared banks.

## How it works

A `SessionStart` hook reads the config and injects the selected banks as context at startup, on resume, on `/clear` and after compaction. There's no MCP server and no network access. It needs only bash.

At most 3 shows load at once, so the token cost stays small. A bank runs 150–400 tokens, around 250 on average.

## Website

https://ada.tools/sitcom-flavour/ is built from [`website/`](website/).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. Quotes are short excerpts, used for commentary, and belong to their respective rights holders.
