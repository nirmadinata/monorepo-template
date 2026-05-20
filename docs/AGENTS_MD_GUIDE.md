# AGENTS.md Guide

This guide explains how `AGENTS.md` files should work in this repository.

## Purpose

`AGENTS.md` files are the agent-facing companion to the repository's human-readable docs. They should give AI agents the minimum factual context needed to work safely and efficiently in a specific scope.

In this repository today:

- `AGENTS.md` at the root is the canonical starting point
- `apps/web-cms/AGENTS.md` adds app-specific guidance
- `apps/web-landing/AGENTS.md` adds app-specific guidance

## When To Add A New `AGENTS.md`

Add a new package-level or app-level `AGENTS.md` when all of these are true:

- the area is a maintained runtime surface or owned package/app
- it has local responsibilities that are more specific than the root guide
- agents are likely to edit it without enough context from the root guide alone

Do not add extra `AGENTS.md` files for placeholder directories, generated output, or areas that do not own maintained runtime code.

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
