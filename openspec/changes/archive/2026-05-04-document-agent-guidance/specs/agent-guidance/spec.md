## ADDED Requirements

### Requirement: Agents use AGENTS files as planning context

The repository SHALL provide AGENTS guidance that tells AI agents to read the root `AGENTS.md` and any relevant package-level `AGENTS.md` files before planning or implementing changes.

#### Scenario: Planning work in a package

- **WHEN** an agent is preparing work that touches a specific package or workspace area
- **THEN** the agent is instructed to read the root `AGENTS.md` first
- **AND** the agent is instructed to read the nearest package-level `AGENTS.md` before planning or editing in that area

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
