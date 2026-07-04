# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# valibot
- Use `v.parse(schema, data)` instead of `schema.parse(data)` for valibot schema parsing. Confidence: 0.85

# react
- For apps/web-cms: Use react-table for all table-related needs. Confidence: 0.85

# architecture
- For web-cms: Each integration should have its own clients, constants, repository, and util files rather than grouping them into shared files. Confidence: 0.75
- For web-cms: Add barrel export (index.ts) for each integration directory. Confidence: 0.70
- Remove empty stub files rather than keeping them as placeholders. Confidence: 0.70

# code-style
- Avoid `as any` type casts; instead restructure code (e.g., split functions/hooks) to eliminate the need for them. Confidence: 0.70
- Split multi-purpose hooks into separate single-purpose hooks when conditional logic requires type casts to work. Confidence: 0.70

# forms
- For web-cms: Form inputs should have label on top (via props) and error message below the field, built on Shadcn UI + TanStack Form. Confidence: 0.60
