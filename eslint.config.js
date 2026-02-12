import { nextJsConfig } from "@workspace/eslint-config/next-js"
import { config as reactInternalConfig } from "@workspace/eslint-config/react-internal"

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
    ],
  },
  // Apply Next.js rules to the web app
  ...nextJsConfig.map((c) => ({
    ...c,
    files: ["apps/web/**/*.{ts,tsx,js,jsx}"],
  })),
  // Apply React Internal rules to app-1 and UI package
  ...reactInternalConfig.map((c) => ({
    ...c,
    files: [
      "apps/app-1/**/*.{ts,tsx,js,jsx}",
      "packages/ui/**/*.{ts,tsx,js,jsx}",
    ],
  })),
]
