# FillGap — Architecture Documentation

This document describes the technical architecture of FillGap: an AI-powered platform that analyzes a resume and/or self-description against a job description and generates a structured interview preparation report (match score, technical/behavioral questions, skill gaps, and a learning roadmap).

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, plain CSS (no Tailwind) |
| Backend | Node.js, Express |
| Database | MongoDB (Atlas), Mongoose ODM |
| AI | Google GenAI SDK — Gemini (`gemini-3.5-flash`), Interactions API with structured JSON output |
| Auth | JWT (access + refresh tokens), HTTP-only cookies |
| Email | Nodemailer + Brevo SMTP, Mailgen templates |
| File Parsing | `pdf-parse` (resume text extraction) |
| File Upload | `multer` (in-memory storage) |
| Validation (AI output) | Zod (`z.fromJSONSchema`) |
| Icons | `lucide-react` |

---

## 2. Folder Structure

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
          Dashboard, Report
      services/    
          interview.service.js
      styles/
    shared/
      api.js           
```

---

## 3. Database Schema

### 3.1 `User` (`user.model.js`)

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
- `isPasswordCorrect(password)` — bcrypt compare
- `generateAccessToken()` — short-lived JWT, signed with `ACCESS_TOKEN_SECRET`
- `generateRefreshToken()` — longer-lived JWT, signed with `REFRESH_TOKEN_SECRET`
- `generateTemporaryToken()` — returns `{ unHashedToken, hashedToken, tokenExpiry }`; the unhashed token is emailed to the user, the hashed version is stored in the DB (10-minute expiry). Used for both email verification and password reset.

**Pre-save hook:** password is re-hashed only `if (this.isModified("password"))`.

### 3.2 `InterviewReport` (`interviewReport.model.js`)

| Field | Type | Notes |
|---|---|---|
| `user` | ObjectId (ref `User`) | owner of the report |
| `jobDescription` | String | required |
| `resume` | String | extracted PDF text, optional |
| `selfDescription` | String | optional |
| `title` | String | required — short AI-generated summary of the fit |
| `matchScore` | Sub-schema | `{ accuracy: Number, matchScoreTitle: String, matchScoreDescription: String }` |
| `technicalQuestions` | Array of `{ question, intention, answer }` | |
| `behavioralQuestions` | Array of `{ question, intention, answer }` | |
| `skillGaps` | Array of `{ lucideIcon, skill, description, severity }` | `severity` enum: `LOW`, `MEDIUM`, `HIGH` |
| `roadmap` | Array of `{ day: Number, topic, advice }` | |
| `createdAt` / `updatedAt` | Date | via `timestamps: true` |

At least one of `resume` / `selfDescription` must be provided (enforced in the controller, not the schema).

---

## 4. API Reference

Base URL: `/api/v1`

### 4.1 Auth routes (`/api/v1/auth`)

| Method | Path | Auth | Controller | Description |
|---|---|---|---|---|
| POST | `/register` | — | `registerUser` | Creates user, sends email verification link |
| POST | `/login` | — | `loginUser` | Validates credentials, issues access + refresh cookies |
| GET | `/verify-email/:verificationToken` | — | `emailVerification` | Verifies email via hashed-token lookup |
| POST | `/refresh-token` | — (uses refresh cookie) | `refreshAccessToken` | Issues new access + refresh tokens |
| POST | `/forgot-password` | — | `forgotPasswordRequest` | Emails a password-reset link |
| POST | `/reset-password/:resetToken` | — | `resetForgotPassword` | Sets new password via hashed-token lookup |
| POST | `/logout` | JWT | `logoutUser` | Clears refresh token + cookies |
| GET | `/me` | JWT | `getCurrentUser` | Returns current authenticated user |
| POST | `/resend-email-verification` | JWT | `resendEmailVerification` | Re-sends verification email |
| POST | `/change-password` | JWT | `changeCurrentPassword` | Changes password (requires old password) |

### 4.2 Interview routes (`/api/v1/interview`)

| Method | Path | Auth | Controller | Description |
|---|---|---|---|---|
| POST | `/` | JWT + `upload.single("resume")` | `generateReport` | Generates a new AI interview report |
| GET | `/report/:interviewReportId` | JWT | `getReportById` | Fetches one report (owner-only) |
| GET | `/report` | JWT | `getAllReports` | Fetches all of the user's reports (summary fields only) |

---

## 5. Authentication Flow

### 5.1 Registration → Email Verification

1. `POST /register` — creates the user (`isEmailVerified: false`), generates a temporary token pair via `generateTemporaryToken()`.
2. The **hashed** token + expiry are stored on the user document; the **unhashed** token is emailed as a link.
3. User clicks the link → frontend `VerifyEmail.jsx` reads `:token` from the URL, calls `GET /verify-email/:verificationToken`.
4. Backend re-hashes the incoming token and looks up a user with a matching hash **and** an unexpired `emailVerificationExpiry`. If found, flips `isEmailVerified: true` and clears the token fields.
5. If the user never verifies, `POST /resend-email-verification` (protected) regenerates and re-sends a new token, invalidating the old one.

### 5.2 Login → Token Issuance

1. `POST /login` validates credentials via `isPasswordCorrect`.
2. `generateAccessAndRefreshToken()` creates both tokens, persists the refresh token on the `User` document (`user.refreshToken`), and returns both.
3. Both tokens are set as **HTTP-only, secure cookies** (`accessToken`, `refreshToken`) — inaccessible to frontend JavaScript, mitigating XSS token theft.

### 5.3 Silent Refresh (Frontend Interceptor)

`shared/api.js` wraps every request through a single axios instance with a response interceptor:

- On any `401`, **except** for the `/refresh-token` and `/me` endpoints themselves, it:
  1. Queues concurrent failing requests (`failedQueue`) so only **one** refresh call fires even if multiple requests fail simultaneously.
  2. Calls `POST /refresh-token` (refresh token cookie sent automatically via `withCredentials`).
  3. On success, retries the original failed request and releases the queue.
  4. On failure, rejects the queue and the original request — the calling component's own `try/catch` decides what to do next (no forced hard-reload).
- `/me` is explicitly excluded from triggering a refresh, since a `401` there simply means "not logged in yet" — an expected, non-error state on first page load, not a session that needs recovering.

**Backend validation (`refreshAccessToken`):** decodes the refresh token, loads the user, and — critically — compares the incoming token against `user.refreshToken` stored in the DB. This is what makes logout and token revocation meaningful: clearing `user.refreshToken` server-side invalidates the session even if a copy of the old token still exists somewhere.

### 5.4 Logout

`POST /logout` clears `user.refreshToken` in the DB and clears both cookies. Frontend additionally resets `user` to `null` in `AuthContext` so the UI updates immediately without waiting for a subsequent failed request.

### 5.5 Forgot / Reset Password

Same hashed-temporary-token pattern as email verification, on separate fields (`forgotPasswordToken`, `forgotPasswordExpiry`):
1. `POST /forgot-password` — emails a reset link containing the unhashed token.
2. `POST /reset-password/:resetToken` — re-hashes the token, looks up a matching, unexpired user document, sets the new password, and clears the reset fields.

### 5.6 Change Password (authenticated)

`POST /change-password` — requires the current password to be re-verified via `isPasswordCorrect` before allowing the new password to be set. Does not require re-verifying the refresh/access tokens beyond the existing `verifyJWT` middleware.

---

## 6. Interview Report Generation Flow

1. **Request arrives** at `POST /api/v1/interview` with `multipart/form-data`: `jobDescription`, optional `selfDescription`, optional `resume` file.
2. **Validation:** `jobDescription` is required; at least one of `resume` file or `selfDescription` must be present.
3. **Resume extraction (if provided):** `pdf-parse`'s `PDFParse` class extracts raw text from the uploaded PDF buffer (in-memory, via `multer.memoryStorage()` — never written to disk).
4. **Prompt construction (`ai.service.js`):** builds a single prompt combining the job description with whichever candidate inputs exist, and requests structured JSON output matching `interviewJsonSchema` (title, matchScore, technicalQuestions, behavioralQuestions, skillGaps, roadmap).
5. **Gemini call:** `client.interactions.create()` (Google GenAI Interactions API) with `response_format` set to JSON matching the schema. Uses `gemini-3.5-flash`.
6. **Validation of AI output:** the raw JSON is parsed and validated against a Zod schema derived from the same JSON schema (`z.fromJSONSchema`), guarding against malformed or incomplete model output before it reaches the database.
7. **Persistence:** the validated report, plus the original inputs and `req.user._id`, is saved as a new `InterviewReport` document.
8. **Response:** the full report document is returned to the frontend, which redirects to `/interview/report/:reportId`.

### Error handling specific to this flow
- **Rate limiting:** Gemini free-tier 429 errors are caught explicitly in `ai.service.js` and re-thrown as a friendly `ApiError(429, "Our AI model is currently busy...")` rather than a raw SDK stack trace reaching the client.
- **Ownership:** `getReportById` checks `interviewReport.user.toString() === req.user._id.toString()` and returns `403` if the requesting user doesn't own the report.
- **Summary fetches:** `getAllReports` excludes heavy fields (`jobDescription`, `resume`, `selfDescription`, and all report sections) via `.select()`, returning only lightweight metadata for list views.

---

## 7. Error Handling Architecture

- **`ApiError`** — a custom error class carrying a `statusCode` and `message`, thrown throughout controllers/services for any expected failure case (validation, not found, unauthorized, etc.).
- **`asyncHandler`** — wraps every controller function, catching thrown/rejected errors and forwarding them to Express's `next(error)`, so no controller needs its own try/catch boilerplate for routing errors onward.
- **Global error middleware** (`app.js`, registered last, after all routes) — catches everything forwarded via `next(error)`, responds with `{ success: false, message }` and the error's `statusCode` (defaulting to `500` for unexpected errors).
- **`ApiResponse`** — a matching success-response class (`{ statusCode, data, message, success }`), used consistently across every successful controller response for a predictable response shape on the frontend.

---

## 8. Frontend State Architecture

Two independent React Contexts, each with their own `loading` flag — intentionally **not shared**, to avoid one feature's async action (e.g. resending a verification email) triggering another feature's full-screen loading UI (e.g. the Dashboard's "Preparing your report..." loader):

- **`AuthContext`** — `user`, `loading` (true only during the initial `getMe()` check on app load).
- **`InterviewContext`** — `report`, `allReports`, `loading` (tied to report generation/fetching).

Route protection is handled by `Protected.jsx`, gating the `MainLayout` (Navbar + Dashboard/Report/ChangePassword + PreviousReport) behind an authenticated `user`.

---

## 9. Known Inconsistencies / Future Cleanup

- `POST /register` and `POST /resend-email-verification` construct the verification link as `http://localhost:5173/api/v1/auth/verify-email/:token` — mirroring the backend's API path structure rather than a clean frontend route. `AppRoutes.jsx` currently defines its matching route at that same path for consistency, but a cleaner convention (matching `/verify-email/:token`, as used for `/reset-password/:token`) would be preferable and should be updated together on both sides if changed.
- Hardcoded `http://localhost:5173` origins in email link construction (`forgotPasswordRequest`, `registerUser`, `resendEmailVerification`) will need to move to an environment variable (e.g. `FRONTEND_URL`) before deployment.
- `cookie` options (`secure: true`) require HTTPS in production; confirm deployment target serves both frontend and backend over HTTPS, or these cookies will silently fail to be set.
