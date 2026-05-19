## Why

`apps/web-landing` already depends on `next-intl`, but its repository state still contains generated Paraglide localization output that does not match the intended localization approach. The landing app needs a single, explicit internationalization setup that uses cookie-based language persistence for English and Indonesian without introducing locale-based routing.

## What Changes

- Add a `next-intl` localization foundation for `apps/web-landing` with `en` as the default locale and `id` as the secondary locale.
- Resolve the active locale from a cookie instead of route segments, subpaths, or domain-based routing.
- Add app-level message loading and request configuration so server-rendered and client-rendered UI read translations from the same source.
- Add a language-switching flow that updates the locale cookie and keeps the user on the same route.
- Remove the leftover Paraglide-generated files and any related configuration or references from `apps/web-landing`.

## Capabilities

### New Capabilities

- `web-landing-localization`: Cookie-based `next-intl` localization for the `web-landing` app with English and Indonesian messages, default English fallback, and no locale routing.

### Modified Capabilities

## Impact

- Affected code: `apps/web-landing/src/app`, new localization helpers/messages, and cleanup of `apps/web-landing/src/paraglide` remnants.
- Dependencies: existing `next-intl` dependency becomes the supported i18n runtime for the app.
- Routing/UI behavior: language selection is persisted through cookies while URLs remain unchanged.
- Documentation and package guidance may need updates when the implementation lands if app-level runtime facts change.
