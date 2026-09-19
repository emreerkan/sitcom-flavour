---
name: flavour
description: Pick sitcom-flavour shows and frequency, or turn it off
argument-hint: "[status | list | off | <show,show,...> | frequency <rare|sometimes|often>]"
disable-model-invocation: true
---

Manage the sitcom-flavour plugin. The config file path, banks directory and available shows are in the `<sitcom-flavour>` block injected at session start. If that block is missing, the plugin's SessionStart hook didn't run: say so and stop.

Arguments: `$ARGUMENTS`

The config file uses `key=value` lines:

```
shows=b99,the-office
frequency=rare
```

Handle the arguments like this:

- **empty or `status`**: read the config file and report the active shows and frequency. If the file doesn't exist, the defaults are `shows=b99` and `frequency=rare`.
- **`list`**: list the available shows.
- **`off`**: set `shows=off`.
- **`frequency <level>`**: set `frequency` to `rare`, `sometimes` or `often`. Reject any other value.
- **a comma-separated list of shows**: check each one against the available shows and reject unknown names. At most 3 shows are loaded; if more are given, say only the first 3 will load. Then set `shows=`.

When writing, keep any key you aren't changing. Create the file if it doesn't exist.

After a change, read the newly selected bank files from the banks directory so they apply for the rest of this session. Future sessions pick them up at startup. Confirm in one line, and feel free to use a line from a newly loaded show.
