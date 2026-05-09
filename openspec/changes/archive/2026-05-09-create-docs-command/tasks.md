## 1. Command Definition

- [x] 1.1 Add a new Opencode command under `.opencode/command/` that defines a repository and scoped documentation sync workflow for both `AGENTS.md` files and human-readable docs.
- [x] 1.2 Reuse or mirror the verified parts of the existing `/sync-agents` workflow so AGENTS synchronization remains consistent inside the broader documentation command.
- [x] 1.3 Update any overlapping command or prompt surfaces that need to reference the new documentation command so its purpose and scope are discoverable.

## 2. Human-Readable Docs Surface

- [x] 2.1 Create a root `docs/README.md` that indexes the maintained human-readable documentation set and points readers to the root `AGENTS.md` first for canonical agent workflow guidance.
- [x] 2.2 Add focused human-readable docs for quick-start/onboarding, current repository or feature overview, and AGENTS-writing guidance using the current repository state rather than framework starter boilerplate.
- [x] 2.3 Replace or update stale scaffold-oriented docs, including `apps/web-cms/README.md` if it still describes generated starter behavior instead of the current app.

## 3. Sync Rules And Scope Handling

- [x] 3.1 Implement scope-aware documentation targeting so the new command prioritizes the nearest relevant docs for a provided path while still updating root docs when repository-level facts change.
- [x] 3.2 Ensure the command writes shared facts consistently across `AGENTS.md` files and human-readable docs while keeping audience-specific structure and tone.
- [x] 3.3 Keep documentation output factual and current-state oriented by inspecting maintained apps, packages, scripts, routes, tooling directories, and feature locations before writing docs.

## 4. Verification

- [x] 4.1 Re-read every documentation file updated by the new command and confirm paths, commands, maintained surfaces, and current responsibilities match the codebase.
- [x] 4.2 Run the narrowest useful validation for the changed documentation and command files, and confirm the OpenSpec change is ready for `/opsx-apply` implementation.
