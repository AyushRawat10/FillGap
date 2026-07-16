# FillGap — Architecture Documentation

This document describes the technical architecture of FillGap: an AI-powered platform that analyzes a resume and/or self-description against a job description and generates a structured interview preparation report (match score, technical/behavioral questions, skill gaps, and a learning roadmap).

*Last updated to reflect the deployed architecture (Vercel + Render), including the proxy-based cookie strategy and Brevo HTTP API email integration.*

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, plain CSS (no Tailwind) |
| Backend | Node.js, Express |
| Database | MongoDB (Atlas), Mongoose ODM |
| AI | Google GenAI SDK — Gemini (`gemini-3.5-flash`), Interactions API with structured JSON output |
| Auth | JWT (access + refresh tokens), HTTP-only cookies |
| Email | Brevo Transactional Email **HTTP API** (via `axios`) + Mailgen for HTML templates |
| File Parsing | `pdf-parse` (resume text extraction) |
| File Upload | `multer` (in-memory storage) |
| Validation (AI output) | Zod (`z.fromJSONSchema`) |
| Icons | `lucide-react` |
| Hosting | Frontend: Vercel · Backend: Render · Database: MongoDB Atlas |

---

## 2. Deployment Topology

```
Browser
  |
  |-- https://<frontend>.vercel.app/           (React app, static)
  |      |
  |      +-- /api/*  ----  Vercel rewrite proxy  ---->  https://fillgap.onrender.com/api/*
  |                                                             |
  |                                                             v
  |                                                     Express backend (Render)
  |                                                             |
  |                                                             +-- MongoDB Atlas
  |                                                             +-- Google Gemini API
  |                                                             +-- Brevo Email API
```

**Why a proxy, not a direct cross-origin call:** the frontend (Vercel) and backend (Render) live on different domains. Cookie-based auth across genuinely different domains requires `SameSite=None; Secure`, which browsers increasingly block by default under third-party cookie restrictions regardless of correct configuration. Routing all `/api/*` calls through a Vercel rewrite (`Frontend/vercel.json`) makes every request appear same-origin from the browser's perspective — the browser only ever talks to its own domain; Vercel silently forwards the request server-side to Render. This makes auth cookies **first-party**, sidestepping third-party cookie blocking entirely, with no custom domain purchase required.

```json
// Frontend/vercel.json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://fillgap.onrender.com/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
(The second rule is a standard SPA fallback — without it, reloading on any client-side route like `/dashboard` returns Vercel's own 404, since no real file exists at that path server-side.)

**Frontend `baseURL` configuration (`shared/api.js`):**
```javascript
baseURL: import.meta.env.VITE_API_URL || "",
```
`VITE_API_URL` is left **empty** in Vercel's environment variables — requests are made as relative paths (`/api/v1/...`), which the proxy rule above intercepts and forwards.

**Cookie options** (`auth.controller.js`) intentionally do **not** set `sameSite: "none"`, since the proxy makes requests same-origin — the browser's default (`SameSite=Lax`) is sufficient here:
```javascript
const options = {
    httpOnly: true,
    secure: true,
};
```

---

## 3. Folder Structure

```
Backend/
  src/
    app.js  
    controllers/
      auth.controller.js  
      interview.controller.js  
    database/
      db.database.js  
    middlewares/
      auth.middleware.js      
      file.middleware.js      
    models/
      user.model.js           
      interviewReport.model.js 
    routes/
      auth.route.js
      interview.route.js
    services/
      ai.service.js            
    utils/
      api-error.util.js        
      api-response.util.js    
      async-handler.util.js   
      mail.util.js            
      constant.util.js
  server.js                  

Frontend/
  vercel.json                  
  src/
    auth/
      components/
        AlertMessage.jsx
        ConfirmationModal.jsx
        Loader.jsx
        Protected.jsx 
      context/        
        AuthContext.jsx
      hooks/          
        useAuth.hook.js
      pages/          
      Login.jsx 
        Register.jsx 
        ForgotPassword.jsx 
        ResetPassword.jsx 
        VerifyEmail.jsx  
        ChangePassword.jsx 
        Landing.jsx 
        Privacy.jsx 
        Terms.jsx 
        Contact.jsx
      routes/         
        AppRoutes.jsx
      services/       
        auth.service.js
      styles/
    interview/
      components/     
        Navbar.jsx 
        PreviousReport.jsx
      contexts/        
        InterviewContext.jsx 
      hooks/           
        useInterview.hook.js
      layouts/         
        MainLayout.jsx 
      pages/           
        Dashboard.jsx 
        Report.jsx
      services/        
        interview.service.js
      styles/
    shared/
      api.js          
```

---

## 4. Database Schema

### 4.1 `User` (`user.model.js`)

| Field | Type | Notes |
|---|---|---|
| `username` | String | required, unique, trimmed, lowercase, indexed |
| `email` | String | required, unique, trimmed, lowercase |
| `fullname` | String | optional |
| `password` | String | required, hashed via bcrypt pre-save hook |
| `isEmailVerified` | Boolean | default `false` |
| `refreshToken` | String | current valid refresh token (server-side session tracking) |
| `emailVerificationToken` | String | SHA-256 hash of the emailed token |
| `emailVerificationExpiry` | Date | |
| `forgotPasswordToken` | String | SHA-256 hash of the emailed reset token |
| `forgotPasswordExpiry` | Date | |
| `createdAt` / `updatedAt` | Date | via `timestamps: true` |

**Instance methods:**
- `isPasswordCorrect(password)` - bcrypt compare
- `generateAccessToken()` - short-lived JWT, signed with `ACCESS_TOKEN_SECRET`
- `generateRefreshToken()` - longer-lived JWT, signed with `REFRESH_TOKEN_SECRET`
- `generateTemporaryToken()` - returns `{ unHashedToken, hashedToken, tokenExpiry }` (10-minute expiry); used for both email verification and password reset

### 4.2 `InterviewReport` (`interviewReport.model.js`)

| Field | Type | Notes |
|---|---|---|
| `user` | ObjectId (ref `User`) | owner of the report |
| `jobDescription` | String | required |
| `resume` | String | extracted PDF text, optional |
| `selfDescription` | String | optional |
| `title` | String | required - short AI-generated summary of the fit |
| `matchScore` | Sub-schema | `{ accuracy, matchScoreTitle, matchScoreDescription }` |
| `technicalQuestions` | Array of `{ question, intention, answer }` | |
| `behavioralQuestions` | Array of `{ question, intention, answer }` | |
| `skillGaps` | Array of `{ lucideIcon, skill, description, severity }` | `severity` enum: `LOW`, `MEDIUM`, `HIGH` |
| `roadmap` | Array of `{ day: Number, topic, advice }` | |
| `createdAt` / `updatedAt` | Date | via `timestamps: true` |

---

## 5. API Reference

Base URL: `/api/v1` (proxied through the frontend domain in production - see Section 2)

### 5.1 Auth routes (`/api/v1/auth`)

| Method | Path | Auth | Controller | Description |
|---|---|---|---|---|
| POST | `/register` | - | `registerUser` | Creates user, sends email verification link |
| POST | `/login` | - | `loginUser` | Validates credentials, issues access + refresh cookies |
| GET | `/verify-email/:verificationToken` | - | `emailVerification` | Verifies email via hashed-token lookup |
| POST | `/refresh-token` | - (uses refresh cookie) | `refreshAccessToken` | Issues new access + refresh tokens |
| POST | `/forgot-password` | - | `forgotPasswordRequest` | Emails a password-reset link |
| POST | `/reset-password/:resetToken` | - | `resetForgotPassword` | Sets new password via hashed-token lookup |
| POST | `/logout` | JWT | `logoutUser` | Clears refresh token + cookies |
| GET | `/me` | JWT | `getCurrentUser` | Returns current authenticated user |
| POST | `/resend-email-verification` | JWT | `resendEmailVerification` | Re-sends verification email |
| POST | `/change-password` | JWT | `changeCurrentPassword` | Changes password (requires old password) |

### 5.2 Interview routes (`/api/v1/interview`)

| Method | Path | Auth | Controller | Description |
|---|---|---|---|---|
| POST | `/` | JWT + `upload.single("resume")` | `generateReport` | Generates a new AI interview report |
| GET | `/report/:interviewReportId` | JWT | `getReportById` | Fetches one report (owner-only) |
| GET | `/report` | JWT | `getAllReports` | Fetches all of the user's reports (summary fields only) |

---

## 6. Authentication Flow

### 6.1 Registration -> Email Verification

1. `POST /register` creates the user (`isEmailVerified: false`) and generates a temporary token pair.
2. The **hashed** token + expiry are stored on the user document; the **unhashed** token is emailed as a link: `${process.env.FRONTEND_URL}/verify-email/${unHashedToken}`.
3. User clicks the link -> `VerifyEmail.jsx` reads `:token` from the URL, calls `GET /verify-email/:verificationToken`.
4. Backend re-hashes the incoming token, looks up a matching, unexpired user, flips `isEmailVerified: true`.
5. `POST /resend-email-verification` (protected) regenerates and re-sends a new token if the user missed the original.

### 6.2 Login -> Token Issuance

1. `POST /login` validates credentials via `isPasswordCorrect`.
2. `generateAccessAndRefreshToken()` creates both tokens, persists the refresh token on the `User` document, and sets both as HTTP-only cookies.

### 6.3 Silent Refresh (Frontend Interceptor)

`shared/api.js` wraps every request through a single axios instance with a response interceptor:

- On any `401` (except `/refresh-token` and `/me` themselves), it:
  1. Queues concurrent failing requests so only **one** refresh call fires even under simultaneous failures.
  2. Calls `POST /refresh-token`.
  3. On success, retries the original request and releases the queue.
  4. On failure, rejects the queue and the original request - no forced redirect; the calling component decides what to do.
- `/me` is excluded from triggering a refresh, since a `401` there is an expected "not logged in yet" state on first load, not a session needing recovery.

**Backend validation (`refreshAccessToken`):** compares the incoming refresh token against `user.refreshToken` stored in the DB - this is what makes logout a real revocation, not just a cookie clear.

> **Status note:** auto-refresh has had intermittent issues during deployment testing. If still misbehaving, check: (1) the refresh request actually reaches the backend (Network tab - confirm it's not silently failing via the proxy), (2) `refreshAccessToken`'s cookie-setting doesn't fail due to a mismatch with how `loginUser` originally set them, (3) confirm `/refresh-token` isn't being excluded/matched incorrectly by the `originalRequest.url.includes(...)` checks when requests go through the Vercel proxy (proxied URLs may look different from direct-to-Render URLs).

### 6.4 Logout

`POST /logout` clears `user.refreshToken` in the DB and clears both cookies. Frontend also resets `user` to `null` in `AuthContext` immediately.

### 6.5 Forgot / Reset Password

Same hashed-temporary-token pattern as email verification, on `forgotPasswordToken`/`forgotPasswordExpiry`. Reset link: `${process.env.FRONTEND_URL}/reset-password/${unHashedToken}`.

### 6.6 Change Password (authenticated)

`POST /change-password` re-verifies the current password via `isPasswordCorrect` before allowing a new one to be set.

---

## 7. Interview Report Generation Flow

1. `POST /api/v1/interview` receives `multipart/form-data`: `jobDescription`, optional `selfDescription`, optional `resume` file.
2. Validation: `jobDescription` required; at least one of `resume`/`selfDescription` required.
3. If a resume is provided, `pdf-parse` extracts text from the in-memory buffer (`multer.memoryStorage()` - never written to disk).
4. `ai.service.js` builds a prompt combining the job description with whichever candidate inputs exist, requesting structured JSON matching `interviewJsonSchema` via Gemini's Interactions API (`gemini-3.5-flash`).
5. The raw JSON response is validated against a Zod schema derived from the same JSON schema, guarding against malformed model output.
6. The validated report is saved as a new `InterviewReport` document, linked to `req.user._id`.
7. The full report is returned; the frontend redirects to `/interview/report/:reportId`.

**Rate limiting:** Gemini free-tier `429` errors are caught explicitly and re-thrown as `ApiError(429, "Our AI model is currently busy...")`.

**Ownership:** `getReportById` checks `interviewReport.user.toString() === req.user._id.toString()`, returning `403` otherwise.

---

## 8. Email Delivery

Email is sent via **Brevo's Transactional Email HTTP API** (`POST https://api.brevo.com/v3/smtp/email`), not SMTP.

**Why:** SMTP (via `nodemailer`) reliably timed out (`ETIMEDOUT`) when deployed on Render - a common restriction on PaaS free tiers, which often block or throttle outbound SMTP ports (25/465/587) even with fully correct credentials. The HTTP API uses standard HTTPS, identical in nature to the Gemini API calls the backend already makes successfully, sidestepping the restriction entirely.

`mail.util.js` still uses **Mailgen** to generate the HTML email body (`mailGenerator.generate(...)`), then sends that HTML via a plain `axios.post` to Brevo's API rather than through an SMTP transport.

Required env vars: `BREVO_API_KEY`, `MAIL_FROM_NAME`, `MAIL_FROM_EMAIL`. (Old SMTP-specific vars - `BREVO_SMTP_HOST/PORT/USER/PASS` - and the `nodemailer` dependency are no longer used.)

---

## 9. Error Handling Architecture

- **`ApiError`** - custom error class carrying `statusCode` + `message`.
- **`asyncHandler`** - wraps every controller, forwarding thrown/rejected errors to Express's `next(error)`.
- **Global error middleware** (`app.js`, registered last) - responds `{ success: false, message }` with the error's `statusCode` (default `500`).
- **`ApiResponse`** - matching success-response class (`{ statusCode, data, message, success }`).

---

## 10. Frontend State Architecture

Two independent React Contexts, each with their own `loading` flag - deliberately not shared, so one feature's async action doesn't trigger another feature's full-screen loading UI:

- **`AuthContext`** - `user`, `loading` (true only during the initial `getMe()` check on app load).
- **`InterviewContext`** - `report`, `allReports`, `loading` (tied to report generation/fetching).

Route protection: `Protected.jsx` gates `MainLayout` (Navbar + Dashboard/Report/ChangePassword + PreviousReport) behind an authenticated `user`.

---

## 11. Environment Variables

**Backend (Render):**

| Variable | Purpose |
|---|---|
| `PORT` | Server port (Render auto-assigns) |
| `MONGODB_URI` | Atlas connection string |
| `ACCESS_TOKEN_SECRET` / `ACCESS_TOKEN_EXPIRY` | Access JWT signing |
| `REFRESH_TOKEN_SECRET` / `REFRESH_TOKEN_EXPIRY` | Refresh JWT signing |
| `GEMINI_API_KEY` | Google GenAI SDK |
| `CORS_ORIGIN` | Allowed frontend origin(s) |
| `FRONTEND_URL` | Used to build email verification/reset links |
| `BREVO_API_KEY` | Brevo transactional email HTTP API |
| `MAIL_FROM_NAME` / `MAIL_FROM_EMAIL` | Sender identity on outgoing email |

**Frontend (Vercel):**

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Left empty in production - relies on the `/api` proxy rewrite in `vercel.json` |

---

## 12. Known Inconsistencies / Open Items

- Consider verifying a custom sending domain in Brevo (rather than the default shared sending domain) to improve deliverability and reduce spam-folder placement for verification/reset emails.
