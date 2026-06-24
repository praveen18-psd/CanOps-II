# CanOps — Smart Water Can Delivery Platform

Monorepo containing three applications built from the CanOps BRD v1.0.

```
canops/
├── backend/      Express + TypeScript REST API
├── web/          React + Vite + Tailwind  (Admin Dashboard)
└── mobile/       Expo + React Native      (Delivery Person App)
```

---

## Quick Start

**Prerequisites:** Node.js 18+, npm 9+

### 1. Install all dependencies
```bash
cd "CanOps II"
cd web && npm install && cd ..
cd backend && npm install && cd ..
cd mobile && npm install && cd ..
```

### 2. Start the backend API
```bash
cd backend && npm run dev
# → http://localhost:4000
```

### 3. Start the admin web app
```bash
cd web && npm run dev
# → http://localhost:3000
```

### 4. Start the mobile app
```bash
cd mobile && npx expo start
# → Scan QR with Expo Go (iOS/Android), or press 'w' for web
```

---

## Applications

### Admin Web App (`web/`)
Full dealer operations dashboard. Responsive — works on desktop, tablet, and mobile browsers.

| Page | Description |
|------|-------------|
| Dashboard | Live metrics, order status overview, zone performance, weekly charts |
| Orders | View, filter, assign orders; manage statuses |
| Customers | Add/manage customers, credit wallets, track dues |
| Delivery Team | Add riders, toggle active status, view progress |
| Route Overview | Live SVG map of all riders with click-to-expand panels |
| Inventory | Track 20L can stock, dispatches, returns, alerts |
| Wallet & Dues | Credit wallets, track outstanding dues, transaction history |
| Analytics | Weekly trends, zone breakdown, delivery performance, top customers |
| Notifications | Compose & send bulk WhatsApp/SMS with templates |
| Settings | Business profile, pricing, service zones, referral program, holidays |

### Delivery Mobile App (`mobile/`)
Cross-platform (iOS + Android + Web) app for field delivery staff.

| Screen | Description |
|--------|-------------|
| Login | Mobile OTP authentication |
| Home (Deliveries) | Daily delivery list with progress, tabs, quick actions |
| Route | One-tap optimization, Google Maps deep-link, stop list |
| Delivery Detail | Confirm delivery, report failure with reason, cash tracking |
| Shift Summary | End-of-day totals, shareable report, submit to dealer |

### Backend API (`backend/`)
Express + TypeScript REST API with in-memory mock data.

```
POST  /api/auth/dealer/login
POST  /api/auth/delivery/login
GET   /api/orders
POST  /api/orders
PATCH /api/orders/:id/assign
PATCH /api/orders/:id/status
GET   /api/customers
POST  /api/customers
PATCH /api/customers/:id/wallet
GET   /api/delivery-persons
POST  /api/delivery-persons
PATCH /api/delivery-persons/:id
GET   /api/inventory
GET   /api/analytics/summary
GET   /api/analytics/weekly
GET   /api/analytics/zones
GET   /api/dealer
PATCH /api/dealer
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Web Frontend | React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide, React Router v6 |
| Mobile | Expo SDK 51, React Native, React Navigation (Stack + Bottom Tabs), @expo/vector-icons |
| Backend | Node.js, Express 4, TypeScript, JWT, UUID |
| Database (prod) | PostgreSQL (swap mock data for Prisma/Drizzle ORM) |
| Maps | Google Maps Platform (web SVG mockup; mobile opens native app) |
| Payments | Razorpay / PayU (integration-ready endpoints) |
| Push Notifications | Firebase Cloud Messaging (FCM) |

---

## Production Roadmap

1. **Database**: Replace in-memory arrays with PostgreSQL via Prisma
2. **Auth**: Production JWT with refresh tokens; OTP via MSG91/Twilio
3. **Maps**: Add Google Maps API key to enable live tracking
4. **Payments**: Integrate Razorpay for wallet top-up
5. **Push**: Wire FCM tokens for real-time order status updates
6. **WhatsApp**: Connect WATI/Interakt for automated notifications
7. **Localization**: i18n for Tamil, Telugu, Kannada, Malayalam, English

---

*CanOps BRD v1.0 — Confidential*
