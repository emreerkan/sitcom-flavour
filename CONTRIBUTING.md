# Contributing

## Adding lines

Each bank in `plugin/banks/` is grouped by **situation**, not by character. Claude picks lines by matching the moment, so the heading matters more than the quote.

Use an existing heading where possible, so banks stay comparable across shows:

- Win, clean result, tests green
- Diagnosis proved right
- Fix didn't fix it, recurring bug, flaky test
- Bad practice with a good excuse
- Disaster, broken prod
- Regret, rollback needed
- Wrong claim, misdiagnosis
- Vague request or plan
- Overengineering, scope creep
- Overhyped tool or startup
- Weird legacy code
- Security
- Disagreeing but complying

Format:

```
- "Exact quote." (Character), optional note on when to use it
- *scene or action reference* (Character)
```

Quotes in double quotes must be verbatim. Put paraphrases and scene references in italics, not in quotes.

In the PR description, **cite season and episode** for every new quoted line. Unverifiable quotes won't be merged.

Keep each bank under about 40 lines, since every line costs tokens in every session.

## Adding a show

1. Create `plugin/banks/<slug>.md`, using lowercase letters, digits and dashes only. It should start with `## Show Name`.
2. Add it to the table in `README.md`.
3. Pick shows whose lines work as standalone reactions. Plot-dependent jokes don't land in a code review.

## Testing

```
./test.sh
```
