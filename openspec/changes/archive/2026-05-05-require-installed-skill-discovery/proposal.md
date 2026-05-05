## Why

Agents working in this repository are already required to read `AGENTS.md` files before planning or editing, but the current guidance does not explicitly require them to use installed local skills when those skills already cover the task. That gap leads to duplicated workflow logic in prompts and inconsistent use of repository-provided guidance stored under directories such as `.agents/`, `.agent/`, and similar agent tooling locations.

## What Changes

- Update the repository's agent workflow guidance so agents must actively check for relevant installed skills before planning or performing work.
- Define which local skill locations count as repository-provided agent resources, including `.agents/`, `.agent/`, `.github/skills/`, and similar agent-tooling folders present in the repo.
- Require agents to prefer those installed skills when they match the requested task, and to reference the skill instructions as part of their planning context.
- Clarify how this skill-discovery requirement coexists with the existing requirement to read `AGENTS.md` files first.

## Capabilities

### New Capabilities

<!-- None. -->

### Modified Capabilities

- `agent-guidance`: expand agent workflow requirements so agents discover and use relevant installed skills from repository-local agent tooling directories before planning or executing work.

## Impact

- Root `AGENTS.md` guidance for all agentic AI working in the repository.
- Repository-local skill directories such as `.agents/` and `.github/skills/`, plus any equivalent agent tooling folders that should be treated as available task guidance.
- OpenSpec documentation for the `agent-guidance` capability so the new workflow expectation is explicit and testable.
