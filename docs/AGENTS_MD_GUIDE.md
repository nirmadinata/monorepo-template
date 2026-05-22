# AGENTS.md Guide

This guide explains how `AGENTS.md` files should work in this repository.

## Purpose

`AGENTS.md` files are the agent-facing companion to the repository's human-readable docs. They should give AI agents the minimum factual context needed to work safely and efficiently in a specific scope.

In this repository today:

- `AGENTS.md` at the root is the canonical starting point for maintained runtime work
- `apps/web-cms/AGENTS.md` and `apps/web-landing/AGENTS.md` add the current app-specific guidance
- repository-local tooling directories can also contain checked-in `AGENTS.md` files for installed skills or references, such as `.agents/skills/vercel-react-best-practices/AGENTS.md`

## When To Add A New `AGENTS.md`

Add a new package-level or app-level `AGENTS.md` when all of these are true:

- the area is a maintained runtime surface or owned package/app
- it has local responsibilities that are more specific than the root guide
- agents are likely to edit it without enough context from the root guide alone

Do not add extra `AGENTS.md` files for placeholder directories, generated output, or areas that do not own maintained runtime code.

Do not treat a skill-local `AGENTS.md` inside `.agents/`, `.github/skills/`, `.claude/`, `.codex/`, or `.opencode/` as a replacement for a runtime package/app guide. Those files are valid repository artifacts, but they document the skill or reference bundle that owns them.

## What To Include

Keep each `AGENTS.md` focused on what exists today.

Useful sections usually include:

- purpose of the app or package
- current surface or responsibilities
- important directories, files, routes, or exports
- local commands or bindings when they matter
- editing rules or constraints that are specific to that area

## Writing Rules

- Be factual
- Be concise
- Use present tense
- Keep details close to the code they describe
- Prefer current-state documentation over architecture aspirations
- Avoid generic framework boilerplate when local facts are more useful

## Maintenance Triggers

Update the relevant `AGENTS.md` file when:

- feature directories move
- route responsibilities change
- package/app scripts change
- bindings or environment expectations change
- maintained packages or apps are added or removed
- a file mentioned as important in the guide changes role or location

## Relationship To `docs/`

- `AGENTS.md` files are for agent workflow and operational context
- `docs/*.md` files are for broader human-readable guidance
- shared facts such as commands, paths, and maintained surfaces must stay aligned across both

## Helpful Commands

- `/sync-agents` for `AGENTS.md` synchronization only
- `/sync-docs` for `AGENTS.md` plus human-readable documentation synchronization

## Checklist Before Finishing

- Re-read the `AGENTS.md` files you changed
- Confirm paths and commands match the codebase
- Confirm the guide describes what exists today
- Update related `docs/*.md` files when the human-readable surface also drifted
