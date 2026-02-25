# Dashboard

Admin dashboard built with `Next.js`, `React`, `TypeScript`, `Tailwind`, `Radix UI`, and `Recharts`.

## Requirements

- `Node.js` LTS (`20.x` or `22.x`)
- `npm` (bundled with Node)

## Local Development

```bash
npm install
npm run dev
```

Default dev server uses Turbopack: `http://localhost:3000`.

Fallback webpack mode:

```bash
npm run dev:webpack
```

## Build & Checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## API & Persistence

The app now uses API routes for writable entities:

- `GET/POST /api/users`
- `GET/POST /api/products`
- `GET/PUT /api/settings`

Data is persisted to `.data/dashboard.json` in the project root (created automatically on first run).

## Troubleshooting (Windows)

### `Unable to acquire lock ... .next/dev/lock`

1. Stop stale `next dev` processes:
```powershell
taskkill /F /IM node.exe
```
2. Remove lock file:
```powershell
npm run dev:unlock
```
3. Start dev again:
```powershell
npm run dev
```

### Dev compilation is very slow / appears infinite

1. Use Node LTS (`20.x` or `22.x`), not experimental/new major releases.
2. Prefer Turbopack (`npm run dev`) over webpack.
3. Avoid running the repo from synced folders (OneDrive/Dropbox). Use a local path like `C:\dev\dashboard`.
4. Clear `.next` and restart:
```powershell
rmdir /s /q .next
npm run dev
```

### Reset local API data

If you want to reset users/products/settings back to seed values:

```powershell
rmdir /s /q .data
```
