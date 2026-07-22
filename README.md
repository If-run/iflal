# Mobile Distributor Pro

A production React + TypeScript + Firebase ERP for mobile phone distributors — inventory (with IMEI tracking), billing, customers, credit & cheque tracking, reports, and more. Works online, offline, and installs as a PWA on desktop, Android, and iPhone.

Full system design: see [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create a Firebase project
1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
2. In your new project, enable:
   - **Authentication** → Sign-in method → **Email/Password**
   - **Firestore Database** → Create database (production mode)
   - **Storage** → Get started
3. Go to **Project Settings → General → Your apps → Add app → Web**, and copy the config values shown.

### 3. Configure environment variables
```bash
cp .env.example .env
```
Paste your Firebase config values into `.env`.

### 4. Run locally
```bash
npm run dev
```
Open the printed local URL. On first run, use **"First time here? Create your shop's account"** to create your owner login, then set up your 4-digit PIN.

### 5. Deploy Firestore & Storage rules
```bash
npm install -g firebase-tools
firebase login
firebase use --add        # select your Firebase project
firebase deploy --only firestore:rules,storage:rules
```

### 6. Build for production
```bash
npm run build
```
Output goes to `dist/`.

### 7. Deploy to Firebase Hosting (optional, or use GitHub Pages/Netlify/Vercel)
```bash
firebase deploy --only hosting
```

---

## Module Changelog

### ✅ Module 1 — Project Scaffold + Firebase Authentication + PIN Lock
- Vite + React + TypeScript + Tailwind CSS scaffold
- Firebase Auth (email/password) with persistent sessions
- Firestore initialized with offline persistence (multi-tab safe)
- Firebase Storage initialized (unused until Inventory module)
- Device-local PIN lock (IndexedDB via Dexie), layered on top of Firebase Auth
- Protected routing (`/dashboard` placeholder proves the auth → PIN → app flow end-to-end)
- Zod validation for sign-in, sign-up, and PIN forms
- Base UI primitives: Button, Input, Label, Card (shadcn-style, hand-rolled, Tailwind-based)
- Firestore & Storage security rules (scoped to `users/{uid}` and `settings/{uid}` for now)

**Not yet built (arrives in later modules):** Sidebar/Topbar/MobileNav, Billing, Inventory, Customers, Bill History, Credit & Cheque, Reports, Expenses, Suppliers, offline sync queue, PWA packaging, barcode/IMEI scanning.

---

## Testing Instructions for Module 1

1. Run `npm run dev`, open the app — you should land on the sign-up/sign-in screen.
2. Click **"Create your shop's account"**, fill in shop name/email/password, submit.
   - ✅ Should redirect straight to the PIN setup screen (no page reload needed).
3. Set a 4-digit PIN, confirm it.
   - ✅ Should land on the placeholder Dashboard showing your signed-in email.
4. Refresh the page.
   - ✅ Should skip the login screen (Firebase session persisted) but ask for your PIN again.
5. Enter the wrong PIN.
   - ✅ Should show "Incorrect PIN, try again" and clear the dots.
6. Enter the correct PIN.
   - ✅ Should unlock into the Dashboard.
7. Click **Sign out** in the top bar.
   - ✅ Should return to the full login screen.
8. Try signing in with a wrong password.
   - ✅ Should show "Incorrect email or password."
9. Turn off your network connection after signing in once, then reload.
   - ✅ Firestore/Auth should still resolve from local persistence (full data won't appear until later modules add real collections, but no crash/blank screen should occur).

---

## Suggested Git Commit

```
git add .
git commit -m "feat(auth): Module 1 - project scaffold, Firebase Auth, and device PIN lock"
```
