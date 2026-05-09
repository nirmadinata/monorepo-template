## Why

The repository already has agent-facing guidance in `AGENTS.md` files and an Opencode `/sync-agents` command for that narrow surface, but it does not have a single workflow for broader project documentation. Human-readable docs similar to the layered `docs/` set in the referenced Djavacoal repository do not exist here today, and the current `apps/web-cms/README.md` still contains scaffold-heavy framework boilerplate instead of current project guidance.

## What Changes

- Add a new Opencode command for documentation maintenance that inspects the current repository state and creates or updates both `AGENTS.md` files and human-readable project docs.
- Define a maintained human-readable docs surface under `docs/` with a docs index and focused guides for repository onboarding, current features/workspace surfaces, and AGENTS-writing guidance.
- Support whole-repository and scoped documentation sync so the command can update the nearest relevant docs while still keeping root-level documentation aligned when repository-wide facts change.
- Replace stale scaffold-oriented documentation with factual, current-state docs that describe what exists today rather than planned architecture.

## Capabilities

### New Capabilities

- `documentation-maintenance`: Defines a repository documentation sync command that keeps agent-facing and human-readable docs aligned with the current codebase.

### Modified Capabilities

- None.

## Impact

- `.opencode/command/` command inventory and any mirrored prompt or command surfaces that expose Opencode workflows.
- Root and package/app `AGENTS.md` files, including the existing `apps/web-cms/AGENTS.md`.
- New human-readable docs under `docs/` plus replacement or synchronization of scaffold-heavy docs such as `apps/web-cms/README.md` where appropriate.
- Documentation maintenance workflow for both AI agents and human contributors working in the repository.
