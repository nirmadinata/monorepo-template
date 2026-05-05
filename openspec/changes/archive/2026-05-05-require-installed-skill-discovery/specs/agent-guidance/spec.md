## ADDED Requirements

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
