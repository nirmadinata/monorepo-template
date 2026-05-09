## Context

The repository currently has one narrow documentation maintenance command, `.opencode/command/sync-agents.md`, that only targets `AGENTS.md` files. That is useful for agent-facing guidance, but it does not cover broader human-readable docs and it does not provide one place to keep the repository's documentation set aligned.

The current repo also lacks a maintained root `docs/` surface. The main human-readable app doc at `apps/web-cms/README.md` is still the generated TanStack Start scaffold, so it does not reflect the repository's current Better Auth, Cloudflare, D1, Hono, or dashboard surfaces. The referenced Djavacoal docs layout shows the kind of output the user wants: a small set of curated, readable guides anchored by a `docs/README.md` index plus focused docs for onboarding, feature overview, and AGENTS-writing guidance.

This change is cross-cutting because it touches Opencode command behavior, repository documentation conventions, and the relationship between agent-facing and human-facing documentation.

## Goals / Non-Goals

**Goals:**

- Introduce a new Opencode command that can create or update both `AGENTS.md` files and human-readable docs in one workflow.
- Define a minimal, maintainable docs surface for this repository under `docs/` that is factual, current-state oriented, and understandable by humans.
- Support whole-repository and scoped sync so documentation maintenance can stay close to the code being changed.
- Reuse the successful parts of `/sync-agents` instead of rewriting AGENTS synchronization logic from scratch.

**Non-Goals:**

- Automatically generate exhaustive product manuals for every future feature in the monorepo.
- Replace OpenSpec artifacts or treat `docs/` as a substitute for implementation specs.
- Create a generalized docs-site generator, navigation framework, or static site build pipeline.
- Standardize documentation conventions for external repositories beyond this template.

## Decisions

### Decision: Add a separate documentation command instead of expanding `/sync-agents`

The repository should add a new Opencode command dedicated to documentation maintenance, rather than turning `/sync-agents` into a broader catch-all command. `/sync-agents` already has a clear and useful scope: align `AGENTS.md` files with the current codebase. The new command should orchestrate both agent-facing and human-readable docs while leaving `/sync-agents` intact for targeted AGENTS-only work.

Alternative considered: expand `/sync-agents` to also update `docs/` and README files. Rejected because it would blur the command's current contract and make it harder to use narrowly when only AGENTS guidance changed.

### Decision: Use a layered docs surface under `docs/`

The new command should maintain a small curated set of human-readable docs under `docs/` rather than scattering general documentation across arbitrary files. The initial surface should include:

- `docs/README.md` as the entry point and document index
- a quick-start/onboarding guide for new contributors and AI agents
- a current feature/workspace overview grounded in what exists today
- a guide for writing and maintaining `AGENTS.md` files in this repository

This matches the requested documentation style and gives the command a concrete target set.

Alternative considered: update only existing README files. Rejected because the repository currently does not have a clear human-readable docs hub, and README-only maintenance would not give users a coherent docs surface.

### Decision: Treat `AGENTS.md` and human-readable docs as separate audiences with shared facts

The command should inspect one repository state but produce two kinds of outputs:

- `AGENTS.md` files: concise, operational, code-adjacent instructions for agents
- `docs/*.md` files and selected README updates: explanatory, human-readable project documentation

Both surfaces should agree on paths, commands, maintained apps/packages, and current capabilities, but they should not be forced into the same structure or tone.

Alternative considered: generate both surfaces from one identical template. Rejected because the audiences and reading patterns are different, even when the underlying facts are shared.

### Decision: Support scope-aware sync with root-level consistency checks

Like `/sync-agents`, the new command should accept an optional scope and prioritize the nearest governing docs for that area. It should still update root-level docs when repository-wide facts change. This keeps package/app-specific details close to the code while preserving a coherent repository overview.

Alternative considered: always regenerate the full docs set regardless of scope. Rejected because it adds unnecessary churn for localized changes and makes targeted use less practical.

### Decision: Prefer factual synchronization over generated prose expansion

The command should be optimized for synchronizing documentation with the actual repo state, not for inventing aspirational documentation. Its workflow should explicitly inspect current manifests, scripts, feature locations, route surfaces, tooling directories, and maintained packages/apps before updating docs.

Alternative considered: produce richer narrative docs from minimal inspection. Rejected because the repository guidance already emphasizes documenting what exists today, and speculative docs would drift quickly.

## Risks / Trade-offs

- [Two documentation surfaces can drift] -> Keep the command responsible for inspecting one source of truth and verifying that agent-facing and human-readable docs agree on key facts.
- [Docs churn from broad updates] -> Support scope-aware sync and update only the docs that are actually affected.
- [Generated docs could retain scaffold boilerplate] -> Require inspection of current repo surfaces and explicitly replace stale scaffolding when it no longer matches reality.
- [Overlap with `/sync-agents`] -> Keep `/sync-agents` narrowly focused and position the new command as the broader documentation workflow.

## Migration Plan

Add the new command documentation under `.opencode/command/`, create the initial `docs/` files, and update any overlapping guidance so the new workflow is discoverable. Keep `/sync-agents` available for AGENTS-only maintenance. If rollback is needed, remove the new command and the new `docs/` files together, leaving the existing AGENTS sync workflow intact.

## Open Questions

- None. The requested behavior is specific enough to define an initial command contract and documentation surface without blocking ambiguities.
