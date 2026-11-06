# Template Studio Mobile: Agent Instructions

This is an Expo / React Native mobile application. Prioritize mobile-first patterns, performance and cross-platform compatibility.

## 1. Project

Template Studio is a productivity and project management mobile app for personal and team use. The web app and backend already exist and are complete (sibling repo `..\project-docs`). This repo (`project-docs-mobile`) is the mobile client only.

Features (as defined by the existing project and database):
- Team and personal projects, tasks, assignments, collaboration
- Subscription reminders
- Personal prompt library
- Expense tracking
- Password vault

Stack: Expo SDK 58, React Native, Expo Router, TypeScript.
Always use the SDK version actually installed in `package.json`. Do not upgrade or downgrade Expo, React Native or core packages without approval.
Goal: a premium, consistent, easy-to-use mobile experience.

---

## 2. Hard Rules (never break)

1. **Plan first.** Do not edit, create or delete files until the plan is approved (see section 5). Reading files is always allowed.
2. **No secrets in the app.** Never put database passwords, service-role keys or any private key in mobile code, `app.json` or `EXPO_PUBLIC_*` variables. Only the public URL and anon key may be used on the client.
3. **Never commit secrets.** Do not create or commit `.env` files with real values. Do not touch `.claude/settings.local.json`.
4. **Backend architecture is read-only.** Never modify backend source code, database schema, migrations or RLS policies. The mobile app may read and write data only through existing, approved APIs or authorized database operations permitted by the existing RLS policies. If a required operation is unsupported, stop and report what backend change is needed. Do not implement backend changes yourself. During development, do not write, update or delete live data yourself (including test records) unless explicitly approved.
5. **The web repo `project-docs` is reference only.** Read it to understand auth, API routes and tables. Never edit, run migrations in, or commit to it.
6. **Never invent** tables, columns, relationships or API routes. Use only what exists in the real schema.
7. **No git actions** (commit, push, branch, reset) unless explicitly asked.
8. **Do not change `name`, `slug`, `scheme`, `android.package` or `ios.bundleIdentifier` in `app.json`.** They are placeholders and will be finalized before publishing.
9. **Password vault data is highly sensitive.** Never log, expose or store vault passwords in plain text. Do not implement any vault functionality without an approved security design.
10. **Do not run `eas build`, `eas submit` or `eas update`** unless explicitly asked.

---

## 3. Expo Has Changed: Do Not Trust Your Training Data

Expo ships breaking changes every SDK release. APIs you remember may be renamed, moved or removed. Before writing code that touches an Expo, EAS or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt (an index of all Expo docs with corrections to common LLM misconceptions) and follow its links to the specific page. Never answer from memory.
4. If you cannot fetch the docs, say so in the plan. Do not guess.

### Commands

```bash
npx expo install <package>  # ALWAYS use this instead of npm/yarn/pnpm add (resolves SDK-compatible versions)
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

### Native and build rules

- `ios/` and `android/` do not exist and are generated (Continuous Native Generation). Never create or edit them by hand. Configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build (`npx expo run:android`, or `npx eas-cli@latest build --profile development`). Tell the user when this applies.
- Prefer recommended Expo modules over third-party libraries, and check the installed skills before adding dependencies.
- EAS (build, submit, updates) is covered by rule 10 above. Docs: https://docs.expo.dev/eas/index.md

---

## 4. Project Structure and Navigation

- Use **Expo Router** for all navigation. Routes live in `src/app/`: every file there is a screen, `_layout.tsx` files define navigators.
- Keep non-route code (components, hooks, lib, constants) in `src/`, outside `src/app/`.
- Import `Link`, `router` and `useLocalSearchParams` from `expo-router`.
- Follow existing structure and naming. Do not reorganize folders without approval.
- Docs: https://docs.expo.dev/router/introduction.md

---

## 5. Workflow: Analyse First, Implement Later

Before any change:

1. Inspect the relevant files, components, installed Expo SDK and dependencies.
2. For database work, read the real tables, relationships and RLS policies first, using authorized read-only access only. Never print or expose credentials, private keys or connection strings in logs, source code, plans or reports.
3. For auth, inspect the web app's (`project-docs`) existing authentication flow and backend APIs, then work out how the same authentication can be supported securely on mobile. Do not blindly copy web-only logic (cookies, middleware, server-side sessions). If backend changes are needed, stop and report them instead of making them.
4. Decide which installed skills apply (section 6).
5. Write a step-by-step plan containing:
   - Files to create or change (and why)
   - New dependencies, if any
   - Skill conflicts and how you resolved them
   - Risks, assumptions and open questions
6. Stop and wait for explicit approval.

After approval, change only what the plan covers.

---

## 6. Installed Skills

Use only the skills relevant to the task. Do not invoke all of them every time.

| Skill | Use it for |
|---|---|
| `expo-native-ui` | Primary reference: Expo and React Native components, native screen patterns, navigation, mobile interactions |
| `vercel-react-native-skills` | Performance, optimized lists, animations, component quality, accessibility |
| `sleek-design-mobile-apps` | Visual design only: colors, hierarchy, typography, spacing, look and feel |

Examples:
- Login and signup screens: `expo-native-ui` + `sleek-design-mobile-apps`
- Lists, animations, performance: `vercel-react-native-skills` + `expo-native-ui`

### Priority when skills or sources disagree

1. Existing project files, requirements and architecture
2. Official docs for the Expo SDK version actually installed
3. `expo-native-ui`
4. `vercel-react-native-skills`
5. `sleek-design-mobile-apps` (visuals only, never overrides technical decisions)

Rules:
- Never silently pick one side or blindly merge conflicting advice. Explain the conflict in the plan and say which source wins and why.
- Expo and React Native compatibility beats web-style design suggestions. Do not bring web-only patterns (DOM elements, CSS files) into the app.
- Do not trade accessibility, performance or usability for looks.

---

## 7. UI/UX Standards

- Consistent colors, typography, spacing and reusable components. Define design tokens once and reuse them.
- Support light and dark mode, different screen sizes, safe areas and keyboard handling.
- Every screen that loads data needs loading, empty, error and success states.
- Touch targets at least 44x44 pt, readable text, sufficient contrast, accessibility labels on interactive elements.
- Short, clear form validation messages.
- Animations only where they help. No decoration for its own sake.
- Reuse components; do not duplicate code.

---

## 8. Implementation Rules

- Make only changes related to the approved task.
- Inspect existing files before changing them. Preserve working functionality.
- Avoid new dependencies. If one is needed, justify it in the plan and prefer Expo-supported packages.
- Keep code modular, typed (no `any` without a reason) and readable.
- Inspect the existing authentication provider and session flow before choosing mobile storage.
- Use an appropriate secure storage solution for sensitive authentication tokens.
- Never log access tokens, refresh tokens or session credentials.
- Do not introduce a new authentication provider or change the existing auth architecture without approval.
- Do not touch unrelated screens or features.

---

## 9. Testing and Reporting

After implementation:

1. Run `npx tsc --noEmit` and `npx expo lint`. Use `npx expo-doctor` if dependencies changed.
2. Start the app (`npx expo start`) and check the affected screens where possible.
3. Report:
   - Exact files created, changed and deleted
   - What was implemented
   - What was **tested** and what was **not tested**
   - What remains incomplete or needs a decision

Never claim something works unless it was actually run or checked.
