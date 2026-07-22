# Mobile Distributor Pro — System Architecture

**Status:** Awaiting approval — no code has been written yet. This document is the foundation every module will be built against.

---

## 1. Guiding Principles

- Single distributor/owner per deployed instance (one Firebase project = one business), but every document is scoped by `ownerId` so the same codebase supports multiple staff logins later without a rewrite.
- Offline-first: the app must be fully usable with no connection. Firestore's offline cache handles most of this natively; IndexedDB is used as a secondary, app-controlled store for data that must survive even an uninstalled Firestore cache (drafts, unsynced sale queue, PIN, device settings).
- Every module is a vertical slice: its own types, service, hook, components, and page — nothing "shared" until it's actually reused a second time.

---

## 2. Folder Structure

```
mobile-distributor-pro/
├── public/
│   ├── manifest.json
│   ├── icons/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── icon-maskable-512.png
│   └── robots.txt
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── layouts/
│   │   ├── AppLayout.tsx              # sidebar + topbar shell (desktop)
│   │   ├── MobileLayout.tsx           # bottom nav shell (mobile)
│   │   └── AuthLayout.tsx             # centered layout for login/PIN
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── PinLockPage.tsx
│   │   ├── dashboard/DashboardPage.tsx
│   │   ├── billing/BillingPage.tsx
│   │   ├── inventory/
│   │   │   ├── PhonesPage.tsx
│   │   │   └── AccessoriesPage.tsx
│   │   ├── customers/
│   │   │   ├── CustomersPage.tsx
│   │   │   └── CustomerDetailPage.tsx
│   │   ├── bills/BillsHistoryPage.tsx
│   │   ├── credit-cheque/CreditChequePage.tsx
│   │   ├── reports/ReportsPage.tsx
│   │   ├── expenses/ExpensesPage.tsx
│   │   ├── suppliers/SuppliersPage.tsx
│   │   └── settings/SettingsPage.tsx
│   │
│   ├── components/
│   │   ├── ui/                        # shadcn/ui primitives (button, input, dialog, table, tabs, badge...)
│   │   ├── shared/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── SyncStatusPill.tsx
│   │   ├── billing/
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── CartPanel.tsx
│   │   │   ├── CustomerAutocomplete.tsx
│   │   │   └── PaymentTypeFields.tsx
│   │   ├── inventory/
│   │   │   ├── PhoneFormModal.tsx
│   │   │   ├── AccessoryFormModal.tsx
│   │   │   ├── ImeiScannerModal.tsx     # html5-qrcode / ZXing
│   │   │   └── BarcodeScannerModal.tsx
│   │   ├── invoice/
│   │   │   ├── InvoiceModal.tsx
│   │   │   ├── InvoicePrintView.tsx
│   │   │   └── invoiceText.ts           # WhatsApp/copy text builder
│   │   └── reports/
│   │       ├── SalesChart.tsx
│   │       ├── TopProductsChart.tsx
│   │       └── PaymentSplitChart.tsx
│   │
│   ├── services/                      # all Firestore/Storage access lives here, never in components
│   │   ├── auth.service.ts
│   │   ├── phones.service.ts
│   │   ├── accessories.service.ts
│   │   ├── customers.service.ts
│   │   ├── sales.service.ts
│   │   ├── expenses.service.ts
│   │   ├── suppliers.service.ts
│   │   ├── settings.service.ts
│   │   └── storage.service.ts          # image uploads (product photos, IMEI photos)
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePinLock.ts
│   │   ├── usePhones.ts
│   │   ├── useAccessories.ts
│   │   ├── useCustomers.ts
│   │   ├── useSales.ts
│   │   ├── useExpenses.ts
│   │   ├── useSuppliers.ts
│   │   ├── useCart.ts
│   │   ├── useOnlineStatus.ts
│   │   └── useSyncQueue.ts
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── SettingsContext.tsx          # shop name, currency, theme
│   │   └── CartContext.tsx
│   │
│   ├── firebase/
│   │   ├── config.ts                    # Firebase app init (env vars)
│   │   ├── firestore.ts                 # Firestore instance + offline persistence setup
│   │   ├── auth.ts                      # Auth instance
│   │   └── storage.ts                   # Storage instance
│   │
│   ├── db/                              # IndexedDB layer (Dexie)
│   │   ├── localDb.ts                   # Dexie schema definition
│   │   ├── syncQueue.ts                 # queued writes made while offline
│   │   └── backup.ts                    # export/import JSON backup
│   │
│   ├── types/
│   │   ├── phone.types.ts
│   │   ├── accessory.types.ts
│   │   ├── customer.types.ts
│   │   ├── sale.types.ts
│   │   ├── expense.types.ts
│   │   ├── supplier.types.ts
│   │   └── settings.types.ts
│   │
│   ├── validation/                      # Zod schemas, one per form
│   │   ├── phone.schema.ts
│   │   ├── accessory.schema.ts
│   │   ├── customer.schema.ts
│   │   ├── sale.schema.ts
│   │   └── expense.schema.ts
│   │
│   ├── utils/
│   │   ├── currency.ts
│   │   ├── date.ts
│   │   ├── csvExport.ts
│   │   ├── pdfExport.ts
│   │   └── id.ts
│   │
│   └── assets/
│       ├── logo.svg
│       └── styles/globals.css
│
├── firestore.rules
├── storage.rules
├── firebase.json
├── .firebaserc
├── .env.example
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

**Rule enforced across all modules:** a page component never calls Firestore directly. Page → hook → service → Firebase. This keeps every file small and keeps Firestore query logic testable and swappable.

---

## 3. Firestore Database Design

All collections are **top-level**, and every document carries an `ownerId` field matching the authenticated user's UID. This is what makes multi-staff/multi-device support possible later without restructuring data.

```
/users/{uid}
    displayName, email, shopName, currency, theme, createdAt

/phones/{phoneId}
    ownerId, brand, model, color, ram, storage, imei, barcode,
    cost, sell, supplier, warranty, notes,
    photoUrl, imeiPhotoUrl,
    status: "Available" | "Reserved" | "Sold",
    saleId (nullable),
    createdAt, updatedAt

/accessories/{accessoryId}
    ownerId, category, name, cost, sell, qty, min, supplier,
    photoUrl, createdAt, updatedAt

/customers/{customerId}
    ownerId, name, phone, nic, address,
    type: "Retail" | "Wholesale" | "Cash" | "Credit",
    createdAt, updatedAt

/sales/{saleId}
    ownerId, customerId (nullable), customerName,
    items: [{ type, refId, name, imei, qty, price }],
    total, profit,
    payment: "cash" | "credit" | "cheque",
    creditStatus ("Pending" | "Paid"), dueDate, paidAmount,
    chequeStatus ("Pending" | "Deposited" | "Cleared" | "Returned"),
    chequeNo, bank, chequeDate,
    date, createdAt

/expenses/{expenseId}
    ownerId, category, note, amount, date, createdAt

/suppliers/{supplierId}
    ownerId, name, phone, email, address, createdAt

/purchases/{purchaseId}
    ownerId, supplierId, items, cost, invoiceRef, date, createdAt

/settings/{uid}   (mirrors /users/{uid} settings subset for fast single-doc reads)
    shopName, currency, theme, pinHash
```

**Why top-level instead of nested under `/users/{uid}/...`:** top-level collections with an `ownerId` field allow simple composite indexes for cross-cutting reports later (e.g. "all sales across branches") without restructuring, and Firestore security rules can still fully isolate data per user via `resource.data.ownerId == request.auth.uid`.

---

## 4. Authentication Flow

1. **Firebase Auth (email + password)** is the real account layer — one owner account per business, created once during setup.
2. On top of that sits the **PIN lock** (unchanged from the current build) — a fast local re-entry screen so the owner doesn't retype a full password every time they reopen the app during the day. The PIN is stored hashed in IndexedDB (device-local), never in Firestore.
3. Flow:
   - App loads → check Firebase Auth session (persisted via `browserLocalPersistence`) →
     - **No session** → `LoginPage` (email/password, or "Create account" on first run).
     - **Session exists** → check local PIN → `PinLockPage` (4-digit) → on success, mount `AppLayout`.
4. `AuthContext` exposes `{ user, loading, signIn, signOut }`; `ProtectedRoute` wraps every authenticated route and redirects to `LoginPage` if no session.
5. Password reset uses Firebase's built-in `sendPasswordResetEmail` — this replaces the old "recovery code" concept now that there's a real backend.

---

## 5. Application Flow & Navigation

**Landing view after unlock:** Billing (matches your existing preference — not Dashboard).

```
PinLockPage / LoginPage
        │
        ▼
   AppLayout (Sidebar desktop / MobileNav mobile)
        │
        ├── /billing        (default route)
        ├── /dashboard
        ├── /inventory/phones
        ├── /inventory/accessories
        ├── /customers
        ├── /customers/:id        (history/detail)
        ├── /bills
        ├── /credit-cheque
        ├── /reports
        ├── /expenses
        ├── /suppliers
        └── /settings
```

Routing uses **React Router v6** with a single `AppRoutes.tsx` defining all paths, nested under `ProtectedRoute`. Deep links (e.g. sharing a link to `/bills`) work correctly since each route renders independently rather than a single-page view-switcher.

---

## 6. Component Tree (top-level)

```
App
 └─ AuthProvider
     └─ SettingsProvider
         └─ Router
             ├─ AuthLayout
             │    ├─ LoginPage
             │    └─ PinLockPage
             └─ ProtectedRoute → AppLayout
                  ├─ Sidebar / MobileNav
                  ├─ Topbar (SyncStatusPill, page actions)
                  └─ <Outlet/>
                       ├─ BillingPage
                       │    ├─ ProductGrid → ProductCard
                       │    └─ CartPanel
                       │         ├─ CustomerAutocomplete
                       │         └─ PaymentTypeFields
                       ├─ DashboardPage → StatCard × n, SalesChart
                       ├─ PhonesPage → PhoneFormModal, ImeiScannerModal
                       ├─ AccessoriesPage → AccessoryFormModal
                       ├─ CustomersPage → CustomerDetailPage
                       ├─ BillsHistoryPage → InvoiceModal
                       ├─ CreditChequePage
                       ├─ ReportsPage → SalesChart, TopProductsChart, PaymentSplitChart
                       ├─ ExpensesPage
                       ├─ SuppliersPage
                       └─ SettingsPage
```

---

## 7. State Management

No external state library (Redux/Zustand) — deliberately, to keep the codebase lean for a single-owner app:

- **`AuthContext`** — current user, auth loading state.
- **`SettingsContext`** — shop name, currency, theme (synced from `/settings/{uid}`, cached in IndexedDB).
- **`CartContext`** — active billing cart (in-memory only, cleared on checkout).
- **Domain hooks** (`usePhones`, `useSales`, etc.) — each wraps a Firestore `onSnapshot` listener scoped to `ownerId`, exposes `{ data, loading, error, add, update, remove }`, and mirrors every write into IndexedDB so the same data is instantly available offline on next load.

This gives every page real-time data with zero prop-drilling, while keeping each hook independently testable and swappable.

---

## 8. Offline Sync Strategy

1. **Firestore offline persistence** (`enableIndexedDbPersistence`) is turned on at app init — this alone lets reads and writes queue and replay automatically when the connection returns, for most cases.
2. **App-level sync queue** (`db/syncQueue.ts`, via Dexie) additionally records every mutating action (add phone, complete sale, mark cheque cleared, etc.) with a timestamp and status (`pending` / `synced` / `failed`). This exists because:
   - It gives the UI something concrete to show ("3 changes waiting to sync") beyond Firestore's opaque internal queue.
   - It's the safety net if Firestore's local cache is ever cleared (e.g. app reinstalled) — the queue plus the last full IndexedDB snapshot can rebuild state.
3. **Conflict resolution:** last-write-wins by `updatedAt` timestamp, appropriate for a single-owner app with at most occasional two-device use (phone + a tablet at the counter), as previously agreed.
4. **Manual backup stays available:** `db/backup.ts` still exports/imports a full JSON snapshot on demand, as a human-controlled safety net independent of any sync logic.

---

## 9. Realtime Sync Strategy

- Every domain hook subscribes via `onSnapshot(query(collection, where('ownerId','==', uid)))`.
- Writes are optimistic: the hook updates local state immediately, then confirms against the Firestore write result; on failure it rolls back and surfaces a toast.
- `SyncStatusPill` in the Topbar reflects real connection state via `useOnlineStatus` (browser `online`/`offline` events) plus pending-queue count from `useSyncQueue`.

---

## 10. Security Rules (Firestore)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isOwner(resourceData) {
      return request.auth != null && request.auth.uid == resourceData.ownerId;
    }
    function isSignedIn() {
      return request.auth != null;
    }

    match /users/{uid} {
      allow read, update: if isSignedIn() && request.auth.uid == uid;
      allow create: if isSignedIn() && request.auth.uid == uid;
    }

    match /settings/{uid} {
      allow read, write: if isSignedIn() && request.auth.uid == uid;
    }

    match /{collection}/{docId}
      where collection in ['phones','accessories','customers','sales','expenses','suppliers','purchases'] {
      allow read, update, delete: if isSignedIn() && isOwner(resource.data);
      allow create: if isSignedIn() && request.resource.data.ownerId == request.auth.uid;
    }
  }
}
```

*(Firestore doesn't support the `where...in` collection-group shorthand shown above literally — the real rules file will spell out each collection block individually with identical logic; shown collapsed here for readability.)*

**Storage rules** follow the same pattern: images live at `/{ownerId}/phones/{phoneId}/...` and `/{ownerId}/accessories/{accessoryId}/...`, with rules requiring `request.auth.uid == ownerId` in the path for both read and write.

---

## 11. Build Order (proposed module sequence)

1. Project scaffold + Firebase config + Auth (login, PIN lock, protected routing)
2. Core layout (Sidebar, Topbar, MobileNav) + routing shell
3. Settings module (shop info, theme, currency) — small, proves the Firestore↔hook↔UI pattern end-to-end
4. Inventory — Phones (incl. IMEI photo, image upload to Storage)
5. Inventory — Accessories
6. Customers (incl. autocomplete, history detail page)
7. Billing (cart, checkout, stock deduction, invoice generation)
8. Invoice sharing (WhatsApp, copy text, CSV download)
9. Bill History
10. Credit & Cheque tracking
11. Dashboard
12. Reports (charts + CSV/PDF export)
13. Expenses
14. Suppliers
15. Offline sync queue + IndexedDB caching layer (hardening pass across all modules)
16. PWA packaging + Firebase Hosting deploy
17. QR/Barcode + IMEI scanner (html5-qrcode/ZXing) as an enhancement pass on Inventory + Billing

---

This is the full architecture. Nothing has been coded yet, per your instructions.

**Waiting for your approval to begin Module 1: Project scaffold + Firebase Authentication + PIN lock.**
