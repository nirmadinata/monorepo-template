## Context

This template repository currently exposes three different layers of agent context: top-level operating instructions, OpenSpec workflows, and skill-specific reference material under hidden folders. The root `AGENTS.md` does not describe the actual repository layout or stack, and there are no package-level AGENTS files in the maintained workspaces. As a result, an agent can see global coding preferences but still miss local facts such as Bun workspace usage, Turbo task names, the absence of app code, or the current scope of `@repo/db`.

## Goals / Non-Goals

**Goals:**

- Make the root `AGENTS.md` describe the real template stack, workspace layout, and documentation workflow.
- Add scoped AGENTS guidance for maintained packages so agents can reason locally before editing.
- Define a repeatable workflow rule that agents read relevant AGENTS files before planning or implementation and update them when their work changes documented context.
- Keep the documentation honest about incomplete template areas so agents do not infer nonexistent runtime surfaces.

**Non-Goals:**

- Changing runtime behavior, package exports, schema definitions, or build tooling.
- Creating speculative AGENTS files for empty or unowned directories.
- Replacing OpenSpec prompts or external skill references.

## Decisions

1. Use the root `AGENTS.md` as the canonical entry point for repository-wide guidance.
   Rationale: it is already present, already referenced by agent tooling, and is the most reliable place to define cross-cutting workflow rules.
   Alternative considered: duplicating the same workflow rules in prompt files. Rejected because it would split the source of truth and still leave package-specific context undocumented.

2. Add package-level `AGENTS.md` only where the repository currently has an owned package surface.
   Rationale: `packages/db` is the only maintained package in the current workspace and has enough code surface to warrant local guidance. Empty app scaffolding should not get fake package docs.
   Alternative considered: generating AGENTS files for every folder under `packages/` and `apps/`. Rejected because it would document placeholders as if they were active modules.

3. Require AGENTS maintenance as part of task completion when work changes repository or package context.
   Rationale: the main failure mode here is documentation drift. Making AGENTS updates part of task completion keeps the docs useful for future agent sessions.
   Alternative considered: treating AGENTS as static bootstrap docs. Rejected because this is a template repo whose package surfaces will evolve over time.

4. Document the template using observed facts rather than hypothetical future architecture.
   Rationale: this repository is meant for future projects, so the useful guidance is what exists today: Bun workspaces, Turbo tasks, Ultracite linting, OpenSpec change flow, and the database package scaffolding around Drizzle and Cloudflare D1.

## Risks / Trade-offs

- [Risk] AGENTS guidance can become stale as the template grows. → Mitigation: explicitly require agents to update relevant AGENTS files when they change documented context.
- [Risk] Root guidance may become too long if it tries to document every sub-area. → Mitigation: keep the root file focused on repo-wide rules and push package details into local AGENTS files.
- [Risk] Future packages may be added without local AGENTS coverage. → Mitigation: document the expectation that each maintained package gets an AGENTS file once it has real ownership boundaries.
