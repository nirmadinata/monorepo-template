## Why

The repository is a reusable Bun monorepo template, but its root AGENTS guidance is generic and does not explain the actual stack, workspace layout, or how agents should scope work inside this template. That gap makes planning noisy and increases the chance that an agent will miss package-specific constraints or leave project documentation stale after finishing work.

## What Changes

- Replace the root AGENTS guidance with repository-specific documentation for the Bun, Turbo, Ultracite, and OpenSpec workflow used in this template.
- Add package-level AGENTS documentation for each maintained package, starting with `packages/db`, so agents can understand local responsibilities, exports, and constraints before editing.
- Establish explicit agent workflow rules: read the relevant AGENTS files before planning or implementation, and update any impacted AGENTS files after completing work.
- Document the current template surface honestly, including unfinished areas such as the placeholder app workspace and the partially scaffolded database package.

## Capabilities

### New Capabilities

- `agent-guidance`: Defines how repository and package AGENTS files describe project context, local ownership boundaries, and required agent workflow expectations.

### Modified Capabilities

- None.

## Impact

- Affected docs: `AGENTS.md`, `packages/*/AGENTS.md`, and the new OpenSpec change artifacts.
- Affected workflow: planning and implementation expectations for AI agents working in this repository.
- Runtime impact: none; this change only updates documentation and agent-operating guidance.
