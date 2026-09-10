# IT Service Desk & Ticket Management System

A professional, responsive IT Service Desk built with **React + TypeScript**, using **JSON Server**
as a mock backend. It implements full CRUD for tickets, users, and categories, role-based access
control (RBAC), a complete ticket lifecycle, assignment, comments, resolution tracking, search,
filtering, sorting, pagination, and a role-specific dashboard for Admins, Support Agents, and
Employees.

## Table of contents

- [Project overview](#project-overview)
- [Technologies used](#technologies-used)
- [Project structure](#project-structure)
- [Installation](#installation)
- [Running the app](#running-the-app)
- [Login credentials](#login-credentials)
- [Role permissions](#role-permissions)
- [Ticket lifecycle](#ticket-lifecycle)
- [API endpoints](#api-endpoints)
- [Form validation](#form-validation)
- [Deployment](#deployment)
- [Known limitations](#known-limitations)

## Project overview

Three roles share one system:

- **Admin** — full control: manage tickets, users, categories; assign/reassign/unassign agents;
  view dashboard-wide statistics and reports.
- **Support Agent** — works their assigned queue: update status/priority, comment, add
  resolutions, resolve and close tickets they own.
- **Employee** — raises tickets, tracks their own requests, comments on them, cancels an open
  ticket, or reopens one that's been resolved.

Every screen, menu item, and button is gated by the same permission rules defined once in
`src/utils/permissions.ts`, so the UI never shows an action a role isn't allowed to take.

## Technologies used

- React 18 + TypeScript
- Vite
- Tailwind CSS
- JSON Server (mock REST API — the **only** backend, no external APIs)
- Axios
- React Router v6
- Git / GitHub

## Project structure

```
src/
├── components/
│   ├── Navbar/          # Top bar: user menu, mobile nav toggle
│   ├── Sidebar/          # Role-based navigation
│   ├── Dashboard/        # StatCard used across all three dashboards
│   ├── Tickets/          # Table, filters, form, assignment/resolution modals, timeline
│   ├── Users/            # User table + add/edit modal
│   ├── Categories/       # Category add/edit modal
│   ├── Comments/         # Comment thread + composer
│   └── common/           # Modal, badges, pagination, loading/empty/error states, layout
├── pages/
│   ├── Login/
│   ├── Dashboard/        # DashboardPage (role-aware) + ReportsPage (Admin)
│   ├── Tickets/          # List, create, details
│   ├── Users/
│   ├── Categories/
│   └── Profile/
├── services/             # api.ts (axios instance) + one service per resource
├── types/                # TypeScript interfaces for User, Ticket, Comment, Category
├── hooks/                # useTickets, useUsers, useCategories, usePagination
├── context/              # AuthContext (RBAC session), ToastContext (notifications)
├── routes/               # ProtectedRoute, RoleRoute guards
└── utils/                # permissions.ts (RBAC rules), validation.ts, date.ts
```

`App.tsx` only wires routes together — all logic lives in the folders above.

## Installation

> **Requires Node.js 18+ and npm.**

```bash
git clone <your-repo-url>
cd it-service-desk
npm install
```

Copy the environment example if you want to point the app at a JSON Server instance running
somewhere other than `http://localhost:4000`:

```bash
cp .env.example .env
```

## Running the app

You need **two terminals** — one for the mock API, one for the frontend.

**Terminal 1 — start JSON Server** (serves `db.json` on port 4000):

```bash
npm run server
```

**Terminal 2 — start the React app** (Vite dev server on port 5173):

```bash
npm run dev
```

Then open **http://localhost:5173**.

Other scripts:

```bash
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build locally
npm run lint        # run ESLint
```

## Login credentials

Seeded in `db.json` — use any of these on the login screen (also available as one-tap "Demo
accounts" buttons on the login page itself):

| Role           | Email                          | Password      |
|----------------|---------------------------------|---------------|
| Admin          | admin@servicedesk.io            | admin123      |
| Support Agent  | agent@servicedesk.io            | agent123      |
| Employee       | employee@servicedesk.io         | employee123   |

Two extra seeded accounts for testing multi-agent assignment and deactivated-user login blocking:

| Role                       | Email                          | Password    | Notes               |
|----------------------------|---------------------------------|-------------|----------------------|
| Support Agent              | priya.agent@servicedesk.io      | agent123    | Second active agent  |
| Support Agent (Inactive)   | sam.whitfield@servicedesk.io    | agent123    | Login is blocked     |

## Role permissions

| Feature              | Admin | Support Agent | Employee   |
|-----------------------|:-----:|:--------------:|:----------:|
| Dashboard              | Full  | Own data        | Own data   |
| Create Ticket          | Yes   | Yes             | Yes        |
| View All Tickets       | Yes   | No              | No         |
| View Assigned Tickets  | Yes   | Yes             | No         |
| View Own Tickets       | Yes   | Yes             | Yes        |
| Edit Ticket            | Yes   | Assigned only   | Own + Open only |
| Delete Ticket          | Yes   | No              | No         |
| Assign / Reassign      | Yes   | No              | No         |
| Update Status          | Yes   | Assigned only   | Limited (Cancel/Reopen) |
| Update Priority        | Yes   | Assigned only   | No         |
| Add Comments           | Yes   | Assigned only   | Own tickets |
| Add Resolution         | Yes   | Assigned only   | No         |
| Manage Users           | Yes   | No              | No         |
| Manage Categories      | Yes   | No              | No         |

## Ticket lifecycle

```
Open → Assigned → In Progress → Pending → Resolved → Closed
Open → Cancelled
Pending → In Progress
Resolved → Open (Reopened)
```

The set of status buttons shown on a ticket's detail page is computed per-role in
`getAllowedNextStatuses()` (`src/utils/permissions.ts`):

- **Employee** can only Cancel an `Open` ticket they created, or Reopen a `Resolved` one.
- **Support Agent** can move an assigned ticket through `In Progress → Pending → Resolved → Closed`.
- **Admin** can move any ticket along any valid edge of the graph above.

Moving a ticket to `Resolved` opens the resolution form (resolution summary + notes); everything
else is a direct one-click transition. Every transition, comment, assignment, and resolution is
appended to the ticket's **activity timeline**, shown in chronological order on the detail page.

## API endpoints

JSON Server exposes standard REST routes over `db.json`:

**Users**
```
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id   (app uses PATCH for partial updates)
DELETE /users/:id
```

**Tickets**
```
GET    /tickets
GET    /tickets/:id
POST   /tickets
PUT    /tickets/:id (app uses PATCH for partial updates)
DELETE /tickets/:id
```

**Comments**
```
GET    /comments?ticketId=:id
GET    /comments/:id
POST   /comments
PUT    /comments/:id
DELETE /comments/:id
```

**Categories**
```
GET    /categories
GET    /categories/:id
POST   /categories
PUT    /categories/:id
DELETE /categories/:id
```

All requests go through `src/services/api.ts`, a single Axios instance, so the base URL only
needs to change in one place (`VITE_API_URL`).

## Form validation

Implemented in `src/utils/validation.ts` and enforced on every form before submit:

- Required-field checks on every form (ticket, user, category, resolution)
- Email format validation
- Phone number format validation
- Minimum length for ticket description (15 chars) and resolution notes (10 chars)
- Required category, priority, status, and contact-method selections
- Inline, field-level error messages — no silent failures

## Deployment

The frontend is a static Vite build and deploys cleanly to **Netlify** or **Vercel**.

1. Push this repository to GitHub.
2. In Netlify/Vercel, import the repo.
   - Build command: `npm run build`
   - Publish/output directory: `dist`
3. Set an environment variable `VITE_API_URL` pointing at a **publicly reachable** JSON Server
   instance (JSON Server itself needs to be hosted somewhere reachable from the deployed frontend
   — e.g. Render, Railway, or any small Node host — since `localhost:4000` only exists on your own
   machine).
4. Deploy. Confirm the login page loads and that ticket data appears (i.e. the deployed frontend
   can reach your hosted JSON Server).

## Known limitations

- **JSON Server is a mock API**: passwords are stored and compared in plain text in `db.json`,
  which is fine for local development but must never be used as-is in production.
- Authentication is session-only via `localStorage` (stores the logged-in user's id) — there's no
  real token/JWT layer, matching the "mock backend" scope of this project.
- Concurrent edits from two browser tabs use last-write-wins (no optimistic-locking), consistent
  with JSON Server's simple REST semantics.
