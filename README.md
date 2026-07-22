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

**Not yet built (arrives in later modules):** Billing, Inventory, Customers, Bill History, Credit & Cheque, Reports, Expenses, Suppliers, offline sync queue, PWA packaging, barcode/IMEI scanning.

### ✅ Module 2 — Core Layout (Sidebar, Topbar, Mobile Nav) + Routing Shell
- Full route map wired up via nested React Router routes (`/billing`, `/dashboard`, `/inventory/phones`, `/inventory/accessories`, `/customers`, `/bills`, `/credit-cheque`, `/reports`, `/expenses`, `/suppliers`, `/settings`), all behind one shared `ProtectedRoute` + `AppLayout` using `<Outlet/>`
- **Billing is the landing view** (index route redirects to `/billing`), matching the agreed preference
- Desktop **Sidebar** (hidden below `md`) with active-route highlighting, built from a single shared `NAV_ITEMS` config — no duplicated nav lists between desktop and mobile
- Mobile **bottom nav** (shown only below `md`) with a curated subset of items (Billing, Dashboard, Phones, Bills, Settings), matching the original app's mobile nav
- **Topbar** showing the current page title (derived from the route) and a sign-out control
- `SyncStatusPill` reflecting real browser online/offline state (via new `useOnlineStatus` hook) — the pending-write-count feature is added once the sync queue exists in Module 15
- Reusable `EmptyState` component — used for every not-yet-built page now, and reusable later for genuine empty-list states ("No phones yet", etc.)
- Every page beyond Dashboard/Billing/Settings placeholder now clearly states which module builds its real content

**Not yet built (arrives in later modules):** Actual page content for Billing, Inventory, Customers, Bill History, Credit & Cheque, Reports, Expenses, Suppliers. Settings arrives next in Module 3.

---

## Testing Instructions for Module 1

1. Run `npm run dev`, open the app — you should land on the sign-up/sign-in screen.
2. Click **"Create your shop's account"**, fill in shop name/email/password, submit.
   - ✅ Should redirect straight to the PIN setup screen (no page reload needed).
3. Set a 4-digit PIN, confirm it.
   - ✅ Should land on the app.
4. Refresh the page.
   - ✅ Should skip the login screen (Firebase session persisted) but ask for your PIN again.
5. Enter the wrong PIN.
   - ✅ Should show "Incorrect PIN, try again" and clear the dots.
6. Enter the correct PIN.
   - ✅ Should unlock into the app.
7. Try signing in with a wrong password.
   - ✅ Should show "Incorrect email or password."
8. Turn off your network connection after signing in once, then reload.
   - ✅ Firestore/Auth should still resolve from local persistence (full data won't appear until later modules add real collections, but no crash/blank screen should occur).

---

## Testing Instructions for Module 2

1. Run `npm run dev`, sign in and unlock with your PIN (from Module 1).
2. ✅ You should land on **/billing**, showing the "Billing arrives in Module 7" placeholder — not the Dashboard.
3. Resize the browser window wide (desktop size).
   - ✅ A dark **Sidebar** should appear on the left with all 10 nav items, "Billing" highlighted as active.
   - ✅ The Topbar should show "Billing" as the title, plus an "Online"/"Offline" pill.
4. Click through every sidebar item (Dashboard, Phones, Accessories, Customers, Bill History, Credit & Cheque, Reports, Expenses, Suppliers, Settings).
   - ✅ Each should navigate to its own URL, show its own placeholder message naming the module that builds it, and highlight correctly in the sidebar.
5. Shrink the browser window to a phone width (or open on an actual phone).
   - ✅ The sidebar should disappear; a **bottom nav bar** should appear instead with 5 icons: Billing, Dashboard, Phones, Bills, Settings.
   - ✅ Tapping each should navigate correctly and highlight the active tab.
6. Turn off your device's network connection.
   - ✅ The sync pill should switch to "Offline — changes will sync later" within a second or two.
7. Turn the network back on.
   - ✅ The pill should switch back to "Online."
8. Click the sign-out icon in the top-right of the Topbar.
   - ✅ Should return to the full login screen (as in Module 1).
9. Manually type a nonexistent URL path (e.g. `/nonsense`) into the address bar.
   - ✅ Should redirect back to `/billing` rather than showing a blank page or crash.

---

## Suggested Git Commit

```
git add .
git commit -m "feat(layout): Module 2 - Sidebar, Topbar, MobileNav, and full routing shell"
```
