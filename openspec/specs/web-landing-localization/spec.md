## ADDED Requirements

### Requirement: Web landing resolves locale from a cookie without localized routing

The `web-landing` application SHALL resolve its active locale from an app-owned locale cookie, support only `en` and `id`, default to `en` when the cookie is missing or invalid, and keep the same URL structure for every supported language.

#### Scenario: Request has no locale cookie

- **WHEN** a user requests a `web-landing` page without the locale cookie present
- **THEN** the application renders the page in English
- **AND** the request URL remains unchanged without locale prefixes or locale-specific redirects

#### Scenario: Request has a valid locale cookie

- **WHEN** a user requests a `web-landing` page with a locale cookie value of `id`
- **THEN** the application renders the page in Indonesian
- **AND** the request URL remains unchanged without locale prefixes or locale-specific redirects

#### Scenario: Request has an invalid locale cookie

- **WHEN** a user requests a `web-landing` page with a locale cookie value outside the supported locale list
- **THEN** the application falls back to English rendering
- **AND** it does not treat the invalid cookie value as a supported locale

### Requirement: Web landing exposes shared translations through next-intl

The `web-landing` application SHALL provide app-owned `next-intl` message catalogs for `en` and `id` so server-rendered and client-rendered UI can read localized copy from the same message source.

#### Scenario: Server-rendered UI reads messages

- **WHEN** a server-rendered `web-landing` page needs localized copy
- **THEN** the page reads translations through the configured `next-intl` locale context for the active request locale

#### Scenario: Client-rendered UI reads messages

- **WHEN** a client component in `web-landing` needs localized copy
- **THEN** the component reads translations from the same `next-intl` message catalog already loaded for the active locale

### Requirement: Users can switch between English and Indonesian

The `web-landing` application SHALL provide a language-switching flow that allows users to choose `en` or `id`, persists the selection in the locale cookie, and keeps the user on the same route after the change.

#### Scenario: User switches to Indonesian

- **WHEN** a user selects Indonesian from the language control
- **THEN** the application stores `id` in the locale cookie
- **AND** the current page re-renders in Indonesian without navigating to a locale-prefixed route

#### Scenario: User switches to English

- **WHEN** a user selects English from the language control
- **THEN** the application stores `en` in the locale cookie
- **AND** the current page re-renders in English without navigating to a locale-prefixed route

### Requirement: Paraglide artifacts are removed from web landing

The `web-landing` application SHALL remove the checked-in Paraglide-generated assets and SHALL not keep app-local runtime references that imply Paraglide remains an active localization system.

#### Scenario: Repository is inspected after the change

- **WHEN** the implementation is complete
- **THEN** `apps/web-landing` no longer contains the obsolete `src/paraglide` generated output
- **AND** the package’s active localization path is `next-intl`
