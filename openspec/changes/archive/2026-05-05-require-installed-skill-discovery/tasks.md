## 1. Update agent workflow guidance

- [x] 1.1 Update the root `AGENTS.md` to require agents to check repository-local installed skill directories after reading the root guide and before planning or executing work.
- [x] 1.2 Document which local directories count as installed skill sources for this repository, including `.agents/`, `.agent/`, `.github/skills/`, and any other similar repository-local agent tooling folders that should be recognized.
- [x] 1.3 Clarify in `AGENTS.md` that agents must use and refer to a relevant installed skill when one matches the task, and may continue with normal repository guidance when none applies.

## 2. Align overlapping agent instructions

- [x] 2.1 Review repository-local prompt or agent instruction files that restate workflow expectations and update any conflicting guidance so it matches the `AGENTS.md` ordering.
- [x] 2.2 Keep the guidance factual to the current repository by naming only the skill locations that exist today or are intentionally supported as local agent tooling conventions.

## 3. Verify the change

- [x] 3.1 Check the updated guidance against the `agent-guidance` spec scenarios in this change to confirm AGENTS-first ordering, skill discovery, and relevant-skill usage are all covered.
- [x] 3.2 Run the narrowest available validation for the edited documentation or prompt files and confirm the OpenSpec change remains ready for `/opsx:apply` follow-through.
