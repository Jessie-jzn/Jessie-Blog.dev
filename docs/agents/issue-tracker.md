# Issue tracker: GitHub

Issues and PRDs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

## Conventions

- Create, read, list, comment on, label, and close issues with `gh issue`.
- Infer the repository from the current Git remote.
- Pull requests are not part of the triage request surface.
- When a skill says “publish to the issue tracker”, create a GitHub issue.
- When a skill says “fetch the relevant ticket”, read the referenced GitHub issue with its comments and labels.

## Wayfinding

- A map is a GitHub issue labelled `wayfinder:map`.
- Child work is represented by linked sub-issues where supported.
- Child labels use `wayfinder:research`, `wayfinder:prototype`, `wayfinder:grilling`, or `wayfinder:task`.
- Use native GitHub issue dependencies for blocking relationships where available.
- Claim work by assigning the issue to the current user.
- Resolve work by posting the answer, closing the child issue, and updating the map’s decisions.
