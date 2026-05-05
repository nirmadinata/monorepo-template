## Context

The repository already uses `AGENTS.md` files as the primary agent-facing workflow contract. That guidance tells agents to read repository and package-specific `AGENTS.md` files before planning or editing, but it does not yet define how repository-installed skills should influence that workflow. This repository also contains agent-tooling content under hidden directories such as `.agents/skills/` and `.github/skills/`, which means task-specific guidance can exist locally even when the top-level workflow never requires agents to look for it.

Because the requested change is workflow guidance rather than product code, the main design concern is consistency: agents need a deterministic order for discovering skills, deciding whether a skill applies, and incorporating that skill into planning without replacing the existing `AGENTS.md` requirement.

## Goals / Non-Goals

**Goals:**

- Define a clear ordering between reading `AGENTS.md` files and checking for installed repository-local skills.
- Specify which repository locations count as installed skill sources for this workflow.
- Require agents to use relevant skills as task context when a matching installed skill exists.
- Keep the requirement specific enough to validate in documentation and future prompt reviews.

**Non-Goals:**

- Standardize one global skill file format across every agent ecosystem.
- Require agents to use irrelevant skills or exhaustively scan arbitrary directories.
- Change package-level `AGENTS.md` requirements outside the root workflow unless later implementation work determines that is necessary.
- Define implementation details for every external agent platform or editor integration.

## Decisions

### Decision: Keep `AGENTS.md` as the first workflow entry point

The new guidance will extend, not replace, the current rule that agents read the root `AGENTS.md` before planning or editing. Skill discovery will happen after that initial read so the root guide remains the authoritative place that tells agents which local skill sources matter.

Alternative considered: making skill discovery the first step. This was rejected because it fragments the workflow contract and weakens the role of `AGENTS.md` as the repository's primary agent-facing entry point.

### Decision: Treat repository-local agent tooling directories as explicit skill sources

The guidance will name the expected local skill locations, including `.agents/`, `.agent/`, `.github/skills/`, and similar repository-local agent tooling folders when present. This gives agents a concrete discovery surface without requiring broad heuristics across unrelated hidden directories.

Alternative considered: requiring agents to inspect every hidden folder for possible skills. This was rejected because it is noisy, expensive, and difficult to validate.

### Decision: Require skill use only when a relevant installed skill matches the task

The workflow will require agents to actively use and refer to a matching installed skill when one covers the current task. If no relevant skill exists, the agent continues with normal repository guidance. This preserves momentum while still turning installed skills into first-class task context.

Alternative considered: always invoking at least one installed skill for every task. This was rejected because many tasks will not map to any local skill and forcing one would create artificial coupling.

### Decision: Capture the behavior as an added requirement under the existing `agent-guidance` capability

The OpenSpec delta will extend the existing `agent-guidance` capability with a new normative requirement focused on skill discovery and use. The current AGENTS-related requirements stay intact, and the new requirement makes the added workflow expectation separately testable.

Alternative considered: modifying the existing AGENTS-reading requirement directly. This was rejected because the skill-discovery behavior is a separate concern and is easier to validate as its own requirement.

## Risks / Trade-offs

- [Directory ambiguity] → Limit the required discovery surface to repository-local agent tooling directories explicitly named in guidance, with room for similar folders when present.
- [Over-triggering irrelevant skills] → Require applicability to the current task before a skill becomes mandatory context.
- [Instruction conflicts between AGENTS and skills] → Keep `AGENTS.md` as the primary workflow contract and treat skills as task-specific detail layered underneath it.
- [Repository drift] → Capture the behavior in OpenSpec so future changes to prompts or AGENTS files can be checked against a normative requirement.
