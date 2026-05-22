# AlKahaf LMS — Quality Assurance Audit Report

**Report type:** Codebase and architecture review (static analysis of the `AlKahaf` repository).  
**Not included:** Live testing on https://alkahafonlineacademy.com, Lighthouse runs, or cross-browser execution. Treat live verification as a required follow-up.

---

## Executive summary

The stack (Express + Sequelize + JWT + Helmet + rate limiting + vanilla HTML/JS) is a reasonable base, but this review surfaced **several high-impact security and integrity issues** (CORS, optional trial bypass via refresh, static root serving, admin API returning free-trial passwords) and **known product gaps** (contact form, dead `src/js` auth module). Production readiness needs **targeted fixes** plus a **manual/regression pass**.

---

## Bug report table

| Issue | Severity | Steps to reproduce | Expected | Actual | Suggestions |
|-------|----------|-------------------|----------|--------|-------------|
| **Refresh token drops trial claims** — new access JWT is minted without `isTrial` / `trialExpiresAt` | **Critical** | 1) Approve free trial so user is `isTrial` with `trialExpiresAt`. 2) Log in; note access token encodes trial expiry. 3) Call `POST /api/v1/auth/refresh-token` with refresh token. 4) Use new `accessToken` on protected routes after DB trial end. | Trial users remain restricted after expiry (server-side). | `authMiddleware` only checks trial when `decoded.isTrial` is set; refreshed tokens omit it, so JWT trial check may be **skipped** (DB still has flags but API may not enforce the same way for all flows). | In `refreshToken`, load `User` by id; if `isTrial` and not converted to paid, pass `trialData` into `generateTokens`. Prefer **server-side** trial checks using DB (`user.trialExpiresAt`) on sensitive routes, not only JWT. |
| **CORS effectively allows any origin** | **Critical** | Send `Origin: https://evil.example` to API from a browser context. | Unknown origins rejected (or explicit allowlist only). | Else branch still calls `callback(null, true)` — all origins allowed. | Remove the permissive branch; use strict allowlist + `FRONTEND_URL` / `CORS_ORIGIN` only. |
| **`express.static` on monorepo root** | **Critical** (when server runs from repo root) | `GET https://<host>/backend/.env` or similar paths if deployment includes secrets. | Secrets not web-accessible. | `staticPath` is `path.join(__dirname, '../../')` — can expose `backend/.env`, `.git`, etc., if present and reachable. | Serve only a **built** `frontend/dist` (or public) directory; never the whole repo; block dotfiles; keep secrets off the app host. |
| **Admin `GET /api/v1/free-trial` returns rows including `password`** | **High** | As admin, call list endpoint; inspect JSON. | No plaintext credentials in responses. | `findAndCountAll` returns full model; `FreeTrialRequest` stores **plaintext** `password`. | Exclude `password` from attributes; never store raw password on `FreeTrialRequest` — create user immediately with hashed password or use a secure token flow. |
| **Free trial passwords stored plaintext in DB** | **High** | Inspect `FreeTrialRequests` table after a submission. | Passwords hashed at rest. | `create` persists `password` as submitted. | Hash before save or omit column and use invite/set-password link. |
| **Duplicate trial: multiple pending requests same email** | **Medium** | Submit free trial twice with same email before approval. | One active request or clear idempotency. | Duplicate check only for `trialUsed: true`; pending duplicates allowed. | Enforce unique partial index on email for open statuses, or upsert. |
| **Course match for trial approval is fragile** | **Medium** | Approve trial with `courseInterest` not exactly equal to `Course.title`. | User gets enrolled in intended course. | `Op.like` without `%` behaves like exact match on many DBs. | Map `courseInterest` to `PredefinedCourse` / `courseId`, or fuzzy match with admin UI confirmation. |
| **Contact Us form non-functional** | **High** (UX / functional) | Open Contact Us, fill form, submit. | Message sent or queued. | `<form>` has no `action`, inputs lack `name`s, no JS handler; placeholder `contact@example.com`; map is New York. | Implement `POST /api/v1/contact` + wire form; replace placeholders with real PKR/academy details. |
| **`sequelize.sync({ alter: true })` on startup** | **High** (ops) | Deploy/restart production server. | Migrations only; predictable schema. | Auto-alter can cause locks/drift/data risk. | Use migrations only; disable `alter` in production. |
| **Default JWT secrets if env missing** | **High** | Run app without `JWT_SECRET`. | Refuse to start or use strong secrets. | Falls back to `'your-secret-key'`. | Fail fast if secrets missing in production. |
| **Global rate limit 500 / 15 min** | **Medium** | Brute-force login. | Stricter auth limits. | Very high ceiling for all routes. | Separate, stricter limiter for `/auth/login`, `/auth/register`, `/free-trial`. |
| **No global 401 refresh / retry in `assets/js/auth.js`** | **Medium** | Stay on a page until access token expires; trigger API call. | Seamless refresh or redirect to login. | No automatic refresh interceptor (unlike some SPAs). | Central `fetch` wrapper: on 401, try refresh once, then clear session. |
| **`frontend/src/js/auth.js` + `api-service` use wrong token shape** | **Low** (if unused) | Any code path using `src/js` module. | Matches API `accessToken`. | Expects `data.token`, `localStorage` key `token`. | Remove or align with `assets/js` + login response. |
| **`backend/src/services/authService.js` is a TODO stub** | **Low** | Grep imports. | Dead code removed or implemented. | Misleading for maintainers. | Delete or wire to real controller logic. |

---

## Performance score summary

| Area | Assessment |
|------|------------|
| **Lighthouse** | **Not run** in this audit. Run in Chrome DevTools (mobile + desktop) against production and staging; target: Performance ≥ 90 where realistic for a content-heavy LMS. |
| **Likely bottlenecks (from code)** | Large HTML pages with many assets; `morgan('combined')` on every request; 10 MB JSON body limit; no evidence of aggressive asset bundling/minification in the reviewed paths. |
| **Images** | Per project rules, media should be Cloudinary — good for CDN caching; still verify dimensions, `loading="lazy"`, and modern formats where possible. |
| **API chatter** | No centralized client interceptor; risk of duplicate calls from inline scripts unless pages debounce. Profile with Network tab during dashboard load. |

**Action:** Run Lighthouse on home, course list, course detail, login, checkout; record **Performance / Accessibility / Best practices / SEO** and attach to your release checklist.

---

## Security risk summary

| Risk | Level | Notes |
|------|--------|------|
| **CORS wide open** | Critical | CSRF-style abuse from malicious sites if cookies were used; even with Bearer tokens, browser policies are wrong for production. |
| **Trial bypass via refresh** | Critical | Undermines paid access control for trial users. |
| **Static root + secrets on disk** | Critical | Classic misconfiguration vector. |
| **Plaintext trial passwords + admin list leak** | High | GDPR-style data exposure; credential theft if admin account compromised. |
| **JWT defaults** | High | Forgeable tokens if env not set. |
| **SQL injection** | Lower (ORM) | Sequelize parameterized queries help; still validate IDs and avoid raw queries without binding. |
| **XSS** | Medium | Any `innerHTML` with user content is a risk — spot-check dashboards/blog rendering. |
| **Auth** | Medium | No refresh token rotation/blacklist (logout comment acknowledges); tokens in `localStorage` (XSS = full account compromise). |

Helmet is enabled — good baseline. Error handler hides stack in production — good.

---

## QA scope checklist (status)

### 1. Functional testing

| Item | Status |
|------|--------|
| Pages load (no 404/500) | **Partial** — confirm server rewrites vs `.html` paths on production host. |
| Buttons, links, navigation | **Not executed** — manual pass required. |
| Forms (login, signup, payments) | Signup/login wired in `assets/js/auth.js`; contact form **broken**; payments **not verified**. |
| Free trial system | Logic reviewed; duplicate pending + course title match risks noted. |
| Dashboard access | **Not executed** — role-based smoke tests required. |
| Token/session expiration | **Issue found** (refresh vs trial); 401 UX varies by page. |

### 2. UI/UX testing

| Item | Status |
|------|--------|
| Responsive (mobile/tablet/desktop) | **Not executed**. |
| Layout consistency | **Not executed**. |
| Flows: signup → trial → enroll → payment | **Not executed** end-to-end. |
| Confusing/broken UX | Contact page placeholders (email, map) flagged. |

### 3. Performance testing

| Item | Status |
|------|--------|
| Page load speed | **Not measured** — use Lighthouse + RUM. |
| Images/scripts/assets | Review notes above. |
| Lighthouse | **Not run**. |
| Unnecessary/slow API calls | **Not profiled**. |

### 4. Security testing

| Item | Status |
|------|--------|
| JWT/session | Issues: CORS, refresh/trial, default secrets, no blacklist. |
| Sensitive data exposure | Free-trial password in DB and admin list; static root risk. |
| Input sanitization | ORM helps SQLi; validate XSS surfaces. |
| Token expiration / re-login | Refresh flow needs hardening for trials. |

### 5. Cross-browser compatibility

**Not executed.** Run smoke tests on Chrome, Firefox, Edge, and mobile browsers.

### 6. API testing

**Not executed** with Postman/Newman in this audit. Validate status codes, error shapes, and rate limiting under load.

### 7. Database integrity

| Item | Notes |
|------|--------|
| User data consistency | **Not audited** row-level. |
| Free trial (no duplicates) | **Gap:** multiple pending rows per email possible. |
| Email tracking & triggers | Partially wired per project docs (`CLAUDE.md`). |

---

## Automation recommendations

| Layer | Tool | Use |
|-------|------|-----|
| **E2E** | Playwright (preferred) or Selenium | Login, OTP path, student dashboard, enroll, checkout happy path, admin approve course. |
| **API** | Postman / Newman or k6 | Auth, courses, enrollments, free-trial, payments with env-specific base URL. |
| **Security** | OWASP ZAP (baseline), `npm audit` | Periodic on CI. |
| **Visual** | Percy or Chromatic | Optional for template-heavy HTML. |

---

## Recommended remediation order

1. **Strict CORS** and **narrow static file serving** (no monorepo root in production).
2. **Refresh tokens** that preserve trial enforcement — preferably **DB-backed** trial checks on protected learning/payment routes.
3. **Remove plaintext passwords** from free-trial storage and **exclude `password`** from admin list API.
4. **Fail fast** on missing JWT secrets in production; **disable** `sequelize.sync({ alter: true })` in production.
5. **Wire Contact Us** (backend + frontend) and replace placeholder content.
6. **Manual matrix:** browsers × roles × payment × trial lifecycle.
7. **Lighthouse** on production URLs and attach scores to release sign-off.

---

## Document history

| Field | Value |
|-------|--------|
| Audit basis | Repository static review (Express backend, vanilla frontend) |
| Currency / product rules | PKR; Cloudinary for uploads (per `CLAUDE.md`) |

---

*End of report.*
