# FIS Ski World Cup Tracker - Development Guide

## Project Overview

- **Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, React Router
- **Backend:** Supabase (optional)
- **Deployment:** GitHub Pages via GitHub Actions
- **Live URL:** <https://shonegrad.github.io/fis-ski-tracker/>

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Development Rules

### 1. Browser Tab Management
>
> ⚠️ **ALWAYS check for existing browser tabs before opening new ones**

Before running `npm run dev` with `open: true` or opening localhost URLs:

1. Check if a tab is already open at `http://localhost:3000/`
2. Refresh the existing tab instead of opening a new one
3. The dev server auto-opens a tab - reuse it throughout the session

```bash
# Check if dev server is already running
lsof -i :3000

# If running, just refresh the existing browser tab
```

### 2. Port Hygiene

- Default port: `3000`
- Kill orphan processes before starting:

  ```bash
  lsof -ti :3000 | xargs kill -9 2>/dev/null
  npm run dev
  ```

### 3. Commit Workflow

```bash
# 1. Build to verify no errors
npm run build

# 2. Add and commit
git add .
git commit -m "type: description"

# 3. Push (auto-deploys to GitHub Pages)
git push
```

Commit types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`

### 4. Code Organization

| Directory | Purpose |
|-----------|---------|
| `src/pages/` | Route-level components (lazy loaded) |
| `src/components/` | Reusable UI components |
| `src/components/ui/` | Radix-based primitive components |
| `src/context/` | React Context providers |
| `src/services/` | Data fetching and API logic |
| `src/data/` | Static data and mock data |

### 5. Adding New Routes

1. Create component in `src/pages/YourPage.tsx`
2. Export as default: `export default function YourPage()`
3. Add lazy import in `src/router.tsx`:

   ```tsx
   const YourPage = lazy(() => import('./pages/YourPage'));
   ```

4. Add route config with Suspense wrapper

### 6. Using App Context

```tsx
import { useAppContext } from '../context/AppContext';

function MyComponent() {
  const { selectedSeason, isDarkMode, toggleTheme } = useAppContext();
  // ...
}
```

### 7. TypeScript

- Strict mode enabled
- Use explicit types for props interfaces
- Avoid `any` - use `unknown` or proper types

### 8. Styling

- Use Tailwind utility classes
- Custom CSS variables defined in `src/index.css`
- Dark mode: classes automatically applied via `dark:` prefix

---

## GitHub Pages Deployment

Deployments happen automatically on push to `main`:

1. Push triggers `.github/workflows/deploy.yml`
2. Builds with `npm run build`
3. Deploys `build/` folder to GitHub Pages

**Base URL:** Configured in `vite.config.ts` as `/fis-ski-tracker/`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `lsof -ti :3000 \| xargs kill -9` |
| Build fails | Check TypeScript errors first |
| Routing broken on GH Pages | Verify `base` in vite.config.ts |
| Styles not updating | Hard refresh (Cmd+Shift+R) |
