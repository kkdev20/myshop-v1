# MyShop Frontend (Next.js)

Minimal Next.js frontend that fetches products from the Laravel API.

Quick start (local):

1. Start Laravel backend (default `APP_URL` is `http://127.0.0.1:8000`):

```powershell
cd C:\xampp\htdocs\myshop-lav
php artisan serve --host=127.0.0.1 --port=8000
```

2. Start frontend:

```powershell
cd C:\xampp\htdocs\myshop-lav\frontend
npm install
npm run dev
```

Open http://localhost:3000 — the frontend will call `${NEXT_PUBLIC_API_URL}/products`.

Tailwind setup
----------------
This repo includes Tailwind config and PostCSS. After running `npm install` in `frontend/`, build tooling will pick up Tailwind automatically. If you need to regenerate the Tailwind config, run:

```powershell
npx tailwindcss init -p
```

Ensure you have the devDependencies installed (`tailwindcss`, `postcss`, `autoprefixer`). Then the development server will process Tailwind classes when you run `npm run dev`.

Vercel deploy notes:
- Create a new project and set the Root Directory to `frontend`.
- Set Environment Variable `NEXT_PUBLIC_API_URL` to your backend API base (e.g. `https://api.example.com/api`).
- Build Command: `npm run build` (Vercel auto-detects Next.js).

CORS: Make sure Laravel allows the Vercel origin in `config/cors.php`.

Running Cypress
----------------
This project includes a very small Cypress setup for E2E checks.

1. Start both backend and frontend locally (see above).
2. In another terminal, install dev deps and open Cypress UI:

```powershell
cd C:\xampp\htdocs\myshop-lav\frontend
npm install
npm run cypress:open
```

3. Or run headless:

```powershell
npm run cypress:run
```

The included test checks that the homepage renders and that at least one product item is present (or shows the empty state).
