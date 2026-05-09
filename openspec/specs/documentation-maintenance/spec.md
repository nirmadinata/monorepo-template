## ADDED Requirements

### Requirement: Repository exposes a documentation sync command for agent and human docs

The repository SHALL provide an Opencode command that inspects the current repository state and creates or updates both agent-facing documentation and human-readable project documentation in a single workflow.

#### Scenario: Repository-wide documentation sync is requested

- **WHEN** a user runs the documentation sync command without a scope
- **THEN** the command audits the whole repository
- **AND** it updates the relevant `AGENTS.md` files and maintained human-readable documentation targets based on the current codebase state

#### Scenario: Scoped documentation sync is requested

- **WHEN** a user runs the documentation sync command with a scope such as an app, package, or feature path
- **THEN** the command prioritizes the nearest documentation files that govern that scope
- **AND** it still updates root-level documentation when repository-wide facts changed as part of the inspected work

### Requirement: Documentation sync maintains a curated human-readable docs surface

The documentation sync workflow SHALL maintain a human-readable docs surface under `docs/` that provides a repository documentation index and focused guides for onboarding, current project capabilities, and AGENTS-writing guidance.

#### Scenario: Human-readable docs do not exist yet

- **WHEN** the documentation sync command inspects the repository and the expected `docs/` files are missing
- **THEN** the command creates the missing docs files under `docs/`
- **AND** the created files describe the repository as it exists today rather than generic framework scaffolding

#### Scenario: Human-readable docs already exist

- **WHEN** the documentation sync command inspects an existing `docs/` surface
- **THEN** it updates only the docs whose documented facts have drifted from the current repository state
- **AND** it preserves the docs set as a readable, curated collection rather than an exhaustive code dump

### Requirement: Documentation sync distinguishes agent and human audiences while sharing facts

The documentation sync workflow SHALL keep agent-facing `AGENTS.md` files concise and operational, and SHALL keep human-readable docs explanatory and navigable, while ensuring both surfaces agree on the underlying repository facts.

#### Scenario: Shared repository fact appears in both doc surfaces

- **WHEN** a maintained app, package, script, feature location, or tooling directory is documented in both `AGENTS.md` files and human-readable docs
- **THEN** the command writes those facts consistently across both surfaces
- **AND** it may vary structure and tone to match the intended audience of each file

#### Scenario: Scaffolded docs no longer match the repository

- **WHEN** an existing README or generated starter doc describes framework defaults that are no longer true for the repository
- **THEN** the documentation sync command replaces or updates that content with factual current-state guidance

### Requirement: Documentation sync verifies documentation against inspected code

The documentation sync workflow SHALL verify the documentation files it touched against the inspected repository state before finishing.

#### Scenario: Documentation updates are completed

- **WHEN** the command finishes updating relevant documentation files
- **THEN** it re-reads the updated files to confirm paths, package/app names, and current responsibilities match the inspected codebase
- **AND** it reports which files were updated and what documentation facts were synchronized
