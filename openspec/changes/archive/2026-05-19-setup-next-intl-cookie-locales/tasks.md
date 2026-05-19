## 1. Localization Foundation

- [x] 1.1 Add supported locale constants and `next-intl` request configuration for cookie-based locale resolution with `en` fallback.
- [x] 1.2 Create app-owned `next-intl` message catalogs for English and Indonesian.
- [x] 1.3 Update the root layout and any required providers so server and client UI can consume the active locale and messages.

## 2. Language Switching

- [x] 2.1 Add an app-owned locale mutation path that validates `en` and `id` and writes the locale cookie.
- [x] 2.2 Add or update the landing-page language control to switch languages while keeping the current route unchanged.

## 3. Paraglide Removal

- [x] 3.1 Remove `apps/web-landing/src/paraglide` and any remaining Paraglide-related references or config from the package.
- [x] 3.2 Verify the package contains a single supported localization path based on `next-intl`.

## 4. Validation

- [x] 4.1 Run the narrowest useful app-level validation for `apps/web-landing` to confirm the app renders with both locales.
- [x] 4.2 Update any app-level documentation or guidance files if the implemented localization surface changes documented package facts.
