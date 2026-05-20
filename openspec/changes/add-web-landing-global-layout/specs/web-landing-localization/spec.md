## MODIFIED Requirements

### Requirement: Web landing exposes shared translations through next-intl

The `web-landing` application SHALL provide app-owned `next-intl` message catalogs for `en` and `id` so server-rendered and client-rendered UI, including shared global layout elements, can read localized copy from the same message source.

#### Scenario: Server-rendered UI reads messages

- **WHEN** a server-rendered `web-landing` page needs localized copy
- **THEN** the page reads translations through the configured `next-intl` locale context for the active request locale

#### Scenario: Client-rendered UI reads messages

- **WHEN** a client component in `web-landing` needs localized copy
- **THEN** the component reads translations from the same `next-intl` message catalog already loaded for the active locale

### Requirement: Users can switch between English and Indonesian

The `web-landing` application SHALL provide a language-switching flow that allows users to choose `en` or `id`, persists the selection in the locale cookie, keeps the user on the same route after the change, and makes the language control available from the shared global layout.

#### Scenario: User switches to Indonesian

- **WHEN** a user selects Indonesian from the language control
- **THEN** the application stores `id` in the locale cookie
- **AND** the current page re-renders in Indonesian without navigating to a locale-prefixed route

#### Scenario: User switches to English

- **WHEN** a user selects English from the language control
- **THEN** the application stores `en` in the locale cookie
- **AND** the current page re-renders in English without navigating to a locale-prefixed route

#### Scenario: Language control is available from the shared shell

- **WHEN** a user views a public route rendered inside the shared global layout
- **THEN** the shell exposes the language switcher without requiring route-specific duplication
