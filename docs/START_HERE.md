# AlKahaf Docs - Start Here

This is the primary entry point for project documentation.

## Current Reality

- Backend is Node.js + Express + Sequelize on MySQL.
- Frontend is static HTML/CSS/JS served from `frontend/`.
- Main backend entrypoint is `backend/src/server.js`.
- Main local env template is `backend/.env.example`.

## First 15 Minutes

1. Read `README.md` (root project overview).
2. Configure backend env from `backend/.env.example`.
3. Run backend:
   - `cd backend`
   - `npm install`
   - `npm run migrate`
   - `npm run dev`
4. Run frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## Core Docs (Keep These Handy)

- `docs/README.md` - documentation map and usage.
- `docs/QUICK_REFERENCE.md` - operational shortcuts.
- `docs/ENV_SETUP_GUIDE.md` - env variables and setup.
- `docs/PROJECT_STRUCTURE.md` - repository and deployment layout.
- `docs/QUICK_TEST.md` - fast API and deployment checks.

## Backend Docs

- `docs/backend/README.md` - backend overview.
- `docs/backend/QUICKSTART.md` - quick backend startup.
- `docs/backend/QUICK_REFERENCE.md` - backend command/reference cheatsheet.
- `docs/backend/API_DOCUMENTATION.md` - API endpoint docs.
- `docs/backend/DEPLOYMENT.md` - backend deployment guide.
- `docs/backend/INDEX.md` - backend documentation index.

## Guides

- `docs/guides/CPANEL_DEPLOYMENT_GUIDE.md` - cPanel deployment process.
- `docs/guides/FRONTEND_DEPLOYMENT_GUIDE.md` - frontend deployment flow.
- `docs/guides/AUTH_COMPLETION_GUIDE.md` - authentication feature notes.
- `docs/guides/SIMPLE_GIT_WORKFLOW.md` - lightweight git workflow.

## Source of Truth Rules

- If docs conflict with code, trust code in `backend/src/` and `frontend/`.
- If docs conflict with env template, trust `backend/.env.example`.
- Prefer updating existing docs over adding new one-off status files.

## Documentation Maintenance

- Keep this file short and stable.
- Add new durable docs under `docs/` or `docs/backend/`.
- Avoid temporary report/status markdown files unless strictly necessary.
