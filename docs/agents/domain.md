# Domain Docs

This repository uses a single-context domain documentation layout.

## Before exploring

Read these when they exist:

- `CONTEXT.md` at the repository root
- Relevant ADRs under `docs/adr/`

If they do not exist, proceed silently. Domain-modeling skills create them when terminology or architectural decisions are resolved.

## Layout

```text
/
├── CONTEXT.md
├── docs/
│   └── adr/
└── pages, components, lib, and other source directories
```

## Vocabulary

Use the terminology defined in `CONTEXT.md`. Avoid introducing synonyms that conflict with its glossary.

## ADR conflicts

If proposed work contradicts an existing ADR, surface the conflict explicitly rather than silently overriding the recorded decision.
