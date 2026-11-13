# Mobile authentication

The mobile client uses the existing backend `POST /api/auth` with `action: login` or `action: register`. Login accepts username/email and password. Registration accepts username (3+ characters), password (4+ characters), optional email and optional recovery key. Password confirmation is validated locally. No Supabase Auth provider or direct database access is added.

## Connection

Set the public backend origin as `EXPO_PUBLIC_API_URL` before starting Expo. Use an HTTPS origin without `/api/auth` at the end. This variable is a public address, never a PostgreSQL connection string. No credentials are included in this repository.

For PowerShell:

```powershell
$env:EXPO_PUBLIC_API_URL = 'https://YOUR-EXISTING-BACKEND'
npx.cmd expo start --clear
```

Until configured, submit buttons are disabled and the screens display a setup notice. Native mobile uses the returned token; future API requests must send `Authorization: Bearer <token>`. Cross-origin browser previews depend on the existing server's CORS policy; this task does not modify it.

## Session lifetime

Session tokens stay in React memory only. Closing or reloading the app signs the user out. No token or password is written to disk, localStorage or AsyncStorage. Installing `expo-secure-store` was blocked by network restrictions; persistent sessions remain pending. Sign out discards the local token; the existing backend does not provide token revocation.

## Scope and verification

Only the mobile repository is changed. Backend source was read to confirm the users schema and existing API contract. Live database metadata and RLS were not inspected; no database connection or live auth request was made. The existing backend's user lookup invokes schema initialization, so development checks must not call that backend under a strict read-only database requirement. Do not create test users or call password-reset during verification.

Current design uses a pure black background with a compact 340-point charcoal card, smaller typography, burgundy primary actions and subtle olive accents. Wallpaper is temporarily disabled per the owner request; its asset is retained. Auth screens stay dark in both system appearance modes. No new dependency is required for the current implementation.

The pre-auth source/assets backup is under `backups/`. It excludes dependencies, Git metadata, Expo caches, `.env*` and `.claude` files. Reinstall dependencies when restoring. No files were deleted.

## Completed checks

- `npx.cmd tsc --noEmit`: passed after Expo regenerated route types.
- Expo web server started on port 8082. Login and signup returned HTTP 200; server-rendered HTML contained the correct login heading and signup confirmation/recovery fields.
- Mocked auth requests passed: missing configuration makes no request, registration payload and endpoint, valid session, 401/409/429/500 handling, malformed session, and network failure. No real credentials or accounts were used.
- `npx.cmd expo lint`: attempted, could not complete because ESLint was absent and its installation was blocked by network restrictions. Automatic dependency additions were reverted.
- `package.json`, `package-lock.json`, and `app.json` match the pre-auth backup.
- Not tested: on-device appearance, keyboard and screen-reader interactions, live auth/database connectivity, persistent sessions. Backend HTTPS origin is still required.

## Files

Changed: `.gitignore`, `src/app/index.tsx`, `src/app/_layout.tsx`.

Added: `src/app/signup.tsx`, `src/app/welcome.tsx`, `src/components/auth-screen.tsx`, `src/components/auth-background.tsx`, `src/lib/auth.ts`, `src/providers/auth-provider.tsx`, `src/theme/colors.ts`, `AUTH-SETUP.md`, and the local backup archive. No files deleted; no backend files changed.

## Compact dark visual revision

Changed `src/components/auth-background.tsx`, `src/components/auth-screen.tsx`, `src/theme/colors.ts`, `src/app/_layout.tsx`, and this document. No files added or deleted. Typecheck passed. ESLint is still unavailable as documented above. No on-device visual verification or live API calls were performed.
