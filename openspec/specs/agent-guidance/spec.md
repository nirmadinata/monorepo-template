## ADDED Requirements

### Requirement: Agents use AGENTS files as planning context

The repository SHALL provide AGENTS guidance that tells AI agents to read the root `AGENTS.md` and any relevant package-level `AGENTS.md` files before planning or implementing changes.

#### Scenario: Planning work in a package

- **WHEN** an agent is preparing work that touches a specific package or workspace area
- **THEN** the agent is instructed to read the root `AGENTS.md` first
- **AND** the agent is instructed to read the nearest package-level `AGENTS.md` before planning or editing in that area

### Requirement: Agents discover and use installed repository skills

The repository SHALL provide agent workflow guidance that requires agents to check for relevant installed skills in repository-local agent tooling directories before planning or performing a task, and to use those skill instructions when they match the requested work.

#### Scenario: Relevant local skill exists for the task

- **WHEN** an agent has read the root `AGENTS.md` and is preparing to plan or execute work
- **THEN** the agent checks the repository's installed skill locations, including directories such as `.agents/`, `.agent/`, `.github/skills/`, or other similar repository-local agent tooling folders when present
- **AND** if a relevant installed skill matches the task, the agent uses that skill as part of its working instructions before continuing

#### Scenario: No relevant local skill exists

- **WHEN** an agent checks the repository's installed skill locations for the current task and finds no matching skill
- **THEN** the agent may continue using the normal repository guidance without invoking an unrelated skill

#### Scenario: Skill discovery follows AGENTS guidance

- **WHEN** an agent is beginning work in the repository
- **THEN** the workflow still starts by reading the root `AGENTS.md`
- **AND** skill discovery happens as an additional required step before planning or task execution, not as a replacement for `AGENTS.md` guidance

### Requirement: Maintained packages expose local agent context

Each maintained package with owned source code SHALL provide a package-level `AGENTS.md` that summarizes its purpose, current scope, important files or exports, and local constraints that agents should understand before editing.

#### Scenario: Reviewing a maintained package

- **WHEN** an agent opens a maintained package in this repository
- **THEN** the package contains a local `AGENTS.md` with package-specific context
- **AND** that context is more specific than the repository-wide guidance in the root `AGENTS.md`

### Requirement: Agent-facing docs stay aligned with completed work

Agent workflow guidance SHALL require agents to update all relevant AGENTS files before considering a task complete when their changes alter repository structure, package responsibilities, commands, or other documented working context.

#### Scenario: Completing work that changes documented context

- **WHEN** an agent finishes a task that changes facts described in an applicable `AGENTS.md`
- **THEN** the agent updates the affected `AGENTS.md` files in the same change
- **AND** the task is not considered complete until those agent-facing docs are aligned with the new state
