# Monorepo Quality Setup Guide: ESLint, Prettier, and Husky

This guide explains how to set up a production-grade linting and formatting workflow in a Turborepo/pnpm monorepo.

## 1. Directory Structure

A quality-focused monorepo should share configurations to ensure consistency.

```text
shad/
├── apps/
│   └── app-1/ (Vite/Next)
├── packages/
│   ├── eslint-config/      <-- Shared rules
│   └── ui/
├── eslint.config.js       <-- Root Bridge Config
├── .husky/                <-- Git Hooks
└── package.json           <-- Root scripts & lint-staged
```

---

## 2. Setup Shared ESLint Config

In `packages/eslint-config/`, create shared files like `base.js` and `react-internal.js`.

### base.js (Logic & Imports)

```javascript
import js from "@eslint/js";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export const config = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
];
```

---

## 3. Setup Prettier

Prettier handles formatting (spaces, semi-colons).

1. **Install:** `pnpm add -D -w prettier`
2. **Add Script:** In the root `package.json`:
   ```json
   "scripts": {
     "format": "prettier --write \"**/*.{ts,tsx,md,json,css}\""
   }
   ```

---

## 4. The "Root Bridge" Config (Critical)

ESLint 9 needs a root configuration to identify workspace files correctly when running from the root (e.g., during a commit).

Create `eslint.config.js` in the root:

```javascript
import { nextJsConfig } from "@workspace/eslint-config/next-js";
import { config as reactInternalConfig } from "@workspace/eslint-config/react-internal";

export default [
  { ignores: ["**/node_modules/**", "**/dist/**"] },
  // Map specific folders to specific shared configs
  ...nextJsConfig.map((c) => ({ ...c, files: ["apps/web/**"] })),
  ...reactInternalConfig.map((c) => ({
    ...c,
    files: ["apps/app-1/**", "packages/ui/**"],
  })),
];
```

---

## 5. Setup Husky & lint-staged

This prevents messy code from ever being committed.

1. **Install:** `pnpm add -D -w husky lint-staged`
2. **Initialize:** `npx husky init`
3. **Configure lint-staged:** In the root `package.json`:
   ```json
   "lint-staged": {
     "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
     "*.{json,md,css}": ["prettier --write"]
   }
   ```
4. **Setup Hook:** Edit `.husky/pre-commit`:
   ```bash
   pnpm lint-staged
   ```

---

## 6. Developer Workflow

- **Initial Setup:** Team runs `pnpm install` (Husky activates automatically via the `prepare` script).
- **Daily Dev:** Team writes code. If they forget to format, Husky fixes it during `git commit`.
- **Manual Check:** Run `pnpm lint` from root to check the entire monorepo.
