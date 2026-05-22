# Documentation

This directory is the repository's human-readable documentation surface. It complements the root `AGENTS.md` and package/app `AGENTS.md` files instead of replacing them.

Start with `../AGENTS.md` if you are an AI agent or if you need the canonical workflow guidance for working in this repository.

## Read Order

1. `../AGENTS.md` for repository-wide workflow rules and current workspace context
2. `./AI_AGENT_QUICK_START.md` for a concise project walkthrough
3. `./FEATURES_OVERVIEW.md` for the current maintained runtime and feature map
4. `./AGENTS_MD_GUIDE.md` when creating or updating `AGENTS.md` files
5. `../apps/web-cms/README.md` or `../apps/web-landing/README.md` when working in a maintained app

## Documentation Files

### `../AGENTS.md`

Canonical repository-level guide for AI agents.

Use it for:

- required workflow ordering
- repository constraints and current workspace map
- package/app guidance lookup rules
- agent tooling and installed skill discovery expectations
- repository-local Opencode command and plugin surfaces

### `AI_AGENT_QUICK_START.md`

Concise repository orientation for AI agents and new contributors.

Use it for:

- quick repo snapshot
- common commands
- current runtime surfaces
- high-signal pitfalls and workflow shortcuts

### `FEATURES_OVERVIEW.md`

Current map of maintained apps, features, and key integrations.

Use it for:

- understanding what exists today
- locating feature and integration code
- seeing how runtime surfaces fit together

### `AGENTS_MD_GUIDE.md`

Repository-specific guide for writing and maintaining `AGENTS.md` files.

Use it for:

- deciding when a new `AGENTS.md` is needed
- keeping guidance factual and current-state oriented
- matching the repo's preferred structure and tone

### `../apps/web-cms/README.md`

Human-readable app guide for the maintained `web-cms` application.

Use it for:

- app-specific commands
- environment and Worker bindings
- route and integration entry points

### `../apps/web-landing/README.md`

Human-readable app guide for the maintained `web-landing` application.

Use it for:

- app-specific commands
- localization behavior and important paths
- Cloudflare Worker bindings and deployment workflow

## Additional `AGENTS.md` Files

The maintained runtime guidance starts with the root `AGENTS.md` plus the nearest app or package guide.

The repository can also contain `AGENTS.md` files inside repository-local tooling directories when a checked-in skill or reference set vendors one. Today that includes `.agents/skills/vercel-react-best-practices/AGENTS.md`.

Treat those as local skill artifacts, not as replacements for the root or app/package guides.

## Documentation Maintenance Commands

- `/sync-docs`: synchronize both `AGENTS.md` files and human-readable docs together
- `/sync-agents`: synchronize only `AGENTS.md` files
- `/opsx-explore`: OpenSpec exploration workflow command
- `/opsx-propose`, `/opsx-apply`, `/opsx-archive`: OpenSpec change workflow commands

## Conventions

- `AGENTS.md` files stay concise, operational, and close to the code they describe
- `docs/*.md` files are human-readable and navigable
- Shared facts such as commands, paths, maintained apps, and feature locations should stay consistent across both surfaces
- Skill-local documentation under `.agents/`, `.github/skills/`, `.claude/`, `.codex/`, or `.opencode/` may ship their own docs, but maintained runtime guidance still starts at the root guide and the nearest app/package guide
- Documentation should describe what exists today, not future architecture

## Update Triggers

Update this docs surface when:

- maintained apps or packages change
- important commands or scripts change
- feature directories move or responsibilities shift
- routes, public APIs, auth behavior, or bindings change
- starter or scaffold boilerplate no longer matches the actual project
