# Shad — Turborepo Monorepo

This project demonstrates how to scale multiple frontend panels without code duplication by consolidating them into a Turborepo-based monorepo with a shared UI system and enforced governance.

A monorepo powered by [Turborepo](https://turbo.build/) with shared [shadcn/ui](https://ui.shadcn.com/) components, housing multiple React applications that share a common design system.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development](#development)
- [Available Scripts](#available-scripts)
- [Adding shadcn/ui Components](#adding-shadcnui-components)
- [Using Shared Components in Apps](#using-shared-components-in-apps)
- [Adding a New App](#adding-a-new-app)
- [Building for Production](#building-for-production)
- [Project Configuration](#project-configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Tech Stack

| Technology                                    | Purpose                                                     |
| --------------------------------------------- | ----------------------------------------------------------- |
| [Turborepo](https://turbo.build/)             | Monorepo build system & task orchestration                  |
| [pnpm](https://pnpm.io/)                      | Fast, disk-efficient package manager with workspace support |
| [React 19](https://react.dev/)                | UI framework                                                |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript                                        |
| [Vite](https://vite.dev/)                     | Build tool & dev server for React apps                      |
| [Next.js](https://nextjs.org/)                | Full-stack React framework (apps/web)                       |
| [Tailwind CSS v4](https://tailwindcss.com/)   | Utility-first CSS framework                                 |
| [shadcn/ui](https://ui.shadcn.com/)           | Accessible, customizable component library                  |
| [Radix UI](https://www.radix-ui.com/)         | Headless, accessible UI primitives                          |

---

## Folder Structure

```
shad/
├── apps/
│   ├── web/                        # Next.js application (port 3000)
│   │   ├── app/                    # Next.js App Router pages
│   │   ├── components.json         # shadcn/ui config for this app
│   │   ├── package.json
│   │   └── ...
│   └── app-1/                      # Vite + React application (port 5173)
│       ├── src/                    # React source code
│       ├── components.json         # shadcn/ui config for this app
│       ├── vite.config.ts
│       ├── package.json
│       └── ...
├── packages/
│   ├── ui/                         # 🎨 Shared shadcn/ui component library
│   │   ├── src/
│   │   │   ├── components/         # All shadcn/ui components (button, accordion, etc.)
│   │   │   ├── hooks/              # Shared React hooks
│   │   │   ├── lib/                # Utility functions (cn, etc.)
│   │   │   └── styles/
│   │   │       └── globals.css     # Global Tailwind + shadcn theme tokens
│   │   ├── components.json         # shadcn/ui config for the UI package
│   │   ├── postcss.config.mjs
│   │   └── package.json
│   ├── eslint-config/              # Shared ESLint configurations
│   └── typescript-config/          # Shared TypeScript configurations
├── turbo.json                      # Turborepo pipeline configuration
├── pnpm-workspace.yaml             # pnpm workspace definition
├── package.json                    # Root scripts & devDependencies
└── pnpm-lock.yaml                  # Lockfile (auto-generated, do not edit)
```

### Key Concepts

- **`apps/`** — Contains deployable applications. Each app is an independent project with its own `package.json`.
- **`packages/`** — Contains shared libraries. These are consumed by apps via `workspace:*` dependencies.
- **`@workspace/ui`** — The shared UI package. All shadcn/ui components live here and are imported by all apps.

---

## Prerequisites

Ensure you have the following installed:

| Tool        | Required Version | Install                         |
| ----------- | ---------------- | ------------------------------- |
| **Node.js** | `>= 20`          | [Download](https://nodejs.org/) |
| **pnpm**    | `10.4.1`         | `npm install -g pnpm@10.4.1`    |

Verify your setup:

```bash
node --version   # Should be >= 20
pnpm --version   # Should be 10.4.1
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd shad
```

### 2. Install dependencies

```bash
pnpm install
```

> **Note:** Always run `pnpm install` from the **root** directory. pnpm workspaces will install dependencies for all apps and packages automatically.

### 3. Start the development servers

```bash
pnpm dev
```

This starts **all** apps simultaneously:

| App     | URL                                            | Framework    |
| ------- | ---------------------------------------------- | ------------ |
| `web`   | [http://localhost:3000](http://localhost:3000) | Next.js      |
| `app-1` | [http://localhost:5173](http://localhost:5173) | Vite + React |

### 4. Start a single app (optional)

```bash
# Run only the web app
pnpm --filter web dev

# Run only app-1
pnpm --filter app-1 dev
```

---

## Development

### Workspace Dependencies

Apps reference shared packages using the `workspace:*` protocol in their `package.json`:

```json
{
  "dependencies": {
    "@workspace/ui": "workspace:*"
  }
}
```

This tells pnpm to use the local version of `@workspace/ui` from `packages/ui` instead of downloading from npm.

### Importing Shared Components

All shared components are exported from `@workspace/ui`:

```tsx
// Import a component
import { Button } from "@workspace/ui/components/button"
import { Accordion } from "@workspace/ui/components/accordion"

// Import utilities
import { cn } from "@workspace/ui/lib/utils"

// Import global styles (in your app's CSS)
@import "@workspace/ui/globals.css";
```

### Tailwind CSS Setup in Apps

Each app that uses `@workspace/ui` components must have its own Tailwind CSS setup:

1. **Install Tailwind** in the app:

   ```bash
   pnpm --filter <app-name> add tailwindcss @tailwindcss/vite
   ```

2. **Import global styles** in the app's main CSS file (e.g., `src/index.css`):

   ```css
   @import "tailwindcss";
   @import "@workspace/ui/globals.css";
   ```

3. **Add the Tailwind Vite plugin** to `vite.config.ts` (for Vite apps):

   ```ts
   import tailwindcss from "@tailwindcss/vite";

   export default defineConfig({
     plugins: [react(), tailwindcss()],
   });
   ```

---

## Available Scripts

All scripts are run from the **root** directory:

| Command                      | Description                                         |
| ---------------------------- | --------------------------------------------------- |
| `pnpm dev`                   | Start all apps in development mode                  |
| `pnpm build`                 | Build all apps and packages for production          |
| `pnpm lint`                  | Lint all apps and packages                          |
| `pnpm format`                | Format all `.ts`, `.tsx`, `.md` files with Prettier |
| `pnpm --filter <name> dev`   | Start a single app (e.g., `pnpm --filter web dev`)  |
| `pnpm --filter <name> build` | Build a single app                                  |

---

## Adding shadcn/ui Components

### ⚠️ Important: Always add components from `packages/ui`

Components must be added from the **shared UI package directory**, not from individual apps:

```bash
# ✅ CORRECT — run from packages/ui
cd packages/ui
pnpm dlx shadcn@latest add <component-name>

# ❌ WRONG — do NOT run from apps/app-1 or apps/web
cd apps/app-1
pnpm dlx shadcn@latest add <component-name>   # This will break!
```

### Examples

```bash
cd packages/ui

# Add a single component
pnpm dlx shadcn@latest add button

# Add multiple components
pnpm dlx shadcn@latest add accordion dialog dropdown-menu

# Add all available components
pnpm dlx shadcn@latest add --all
```

### Why only from `packages/ui`?

- `packages/ui` is the **single source of truth** for all shared components
- Adding from an app directory may create the component in the wrong location
- All apps (`web`, `app-1`, etc.) automatically get access to any component added to `packages/ui`

### Currently installed components

| Component | File                                       |
| --------- | ------------------------------------------ |
| Button    | `packages/ui/src/components/button.tsx`    |
| Accordion | `packages/ui/src/components/accordion.tsx` |
| Input OTP | `packages/ui/src/components/input-otp.tsx` |

---

## Using Shared Components in Apps

Once a component is added to `packages/ui`, any app can use it immediately:

```tsx
// In apps/web or apps/app-1
import { Button } from "@workspace/ui/components/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";

export default function MyPage() {
  return (
    <div>
      <Button variant="outline">Click me</Button>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>Yes!</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
```

---

## Adding a New App

### Vite + React App

1. **Scaffold the app:**

   ```bash
   cd apps
   pnpm create vite
   # Choose: React → TypeScript
   # Name it, e.g., app-2
   ```

2. **Add the shared UI dependency** in the new app's `package.json`:

   ```json
   {
     "dependencies": {
       "@workspace/ui": "workspace:*"
     }
   }
   ```

3. **Set up Tailwind CSS:**

   ```bash
   cd apps/app-2
   pnpm add tailwindcss @tailwindcss/vite
   ```

   Update `vite.config.ts`:

   ```ts
   import tailwindcss from "@tailwindcss/vite";

   export default defineConfig({
     plugins: [react(), tailwindcss()],
   });
   ```

   Replace contents of `src/index.css`:

   ```css
   @import "tailwindcss";
   @import "@workspace/ui/globals.css";
   ```

4. **Set a unique dev port** in `vite.config.ts` (to avoid port conflicts):

   ```ts
   export default defineConfig({
     plugins: [react(), tailwindcss()],
     server: {
       port: 5174, // Different from app-1's 5173
     },
   });
   ```

5. **Install dependencies** from root:

   ```bash
   cd ../..  # back to root
   pnpm install
   ```

6. **Run:** `pnpm dev` — all apps start together!

### Next.js App

```bash
cd apps
npx create-next-app@latest app-name
```

Follow the same dependency setup (`@workspace/ui`, Tailwind, global styles).

---

## Building for Production

```bash
# Build all apps and packages
pnpm build
```

Build outputs:

| App             | Output Directory   | Command      |
| --------------- | ------------------ | ------------ |
| `web` (Next.js) | `apps/web/.next/`  | `next build` |
| `app-1` (Vite)  | `apps/app-1/dist/` | `vite build` |

To preview a production build locally:

```bash
# Next.js app
pnpm --filter web start

# Vite app
pnpm --filter app-1 preview
```

---

## Project Configuration

### `turbo.json`

Defines how Turborepo runs tasks across all packages:

```json
{
  "ui": "stream",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

- **`"ui": "stream"`** — Uses classic log output instead of the interactive TUI
- **`"dependsOn": ["^build"]`** — Builds dependencies before the app
- **`"cache": false`** — Dev tasks are never cached
- **`"persistent": true`** — Dev tasks run continuously

### `pnpm-workspace.yaml`

Tells pnpm where to find workspace packages:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### Package Exports (`packages/ui/package.json`)

The UI package uses the `exports` field to define what can be imported:

```json
{
  "exports": {
    "./globals.css": "./src/styles/globals.css",
    "./lib/*": "./src/lib/*.ts",
    "./components/*": "./src/components/*.tsx",
    "./hooks/*": "./src/hooks/*.ts"
  }
}
```

---

## Troubleshooting

### `Port already in use`

Another dev server is already running. Kill it and retry:

```bash
npx kill-port 3000    # for Next.js
npx kill-port 5173    # for Vite app-1
```

### `Module not found: @workspace/ui`

Run `pnpm install` from the root directory to link workspace packages.

### Turbo TUI hides logs

If running `pnpm dev` shows an interactive TUI instead of readable logs, ensure `turbo.json` has:

```json
{ "ui": "stream" }
```

### shadcn component added in wrong location

If you accidentally ran `shadcn add` from an app directory and the file was created inside the app folder (e.g., `apps/app-1/@workspace/...`):

1. Delete the incorrectly created folder
2. Run `shadcn add` from `packages/ui` instead

### TypeScript errors after adding a new package

```bash
# Restart the TypeScript server in VS Code
Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

---

## Contributing

### Workflow

1. Always run commands from the **root** directory (unless adding shadcn components)
2. Add shared components to **`packages/ui`** — never directly in apps
3. Run `pnpm install` from root after modifying any `package.json`
4. Run `pnpm build` to verify everything compiles before committing
5. Run `pnpm lint` to check for code quality issues

### Naming Conventions

| Item       | Convention                  | Example                       |
| ---------- | --------------------------- | ----------------------------- |
| Apps       | kebab-case                  | `app-1`, `admin-dashboard`    |
| Components | PascalCase                  | `Button.tsx`, `DataTable.tsx` |
| Utilities  | camelCase                   | `utils.ts`, `formatDate.ts`   |
| Hooks      | camelCase with `use` prefix | `useMediaQuery.ts`            |

---

## License

Private — All rights reserved.
