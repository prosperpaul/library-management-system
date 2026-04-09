# LibraryOS — School Library Management System

A full-stack school library management system built with **Next.js 16**, **React 19**, and **TypeScript** on the frontend, backed by an **Express.js + MongoDB** REST API. Designed to be clean, responsive, and production-ready.

---

## Features

### Core Modules
| Module | Description |
|---|---|
| **Books** | Add, search, paginate, and delete books. Linked to authors via searchable dropdown. |
| **Authors** | Manage authors with nationality and bio. |
| **Students** | Register and browse students in a card grid layout. |
| **Attendants** | Manage library staff with shift assignments (Morning / Afternoon / Evening / Night). |
| **Borrow** | Issue and return books. Tracks active loans and flags overdue returns. |
| **Dashboard** | Overview stats — total books, students, active borrows, overdue count, and recent activity. |

### Authentication & Access Control
- JWT-based authentication (token stored in `localStorage`)
- Two roles: **Admin** and **Attendant**
- Admins can add/delete records across all modules
- Attendants have read-only access (Add/Delete buttons are hidden)
- Auth state managed via React Context (`AuthContext`)

### UI & UX
- Dark theme with a warm gold (`#c8a96e`) accent color
- Skeleton loading states on all tables and card grids
- Animated entrance transitions on all pages (`fadeUp`, `scaleIn`)
- Toast notifications for all success and error feedback (auto-dismiss after ~4s)
- Confirm modal dialog replacing browser `confirm()` on all delete actions
- Responsive layout — sidebar collapses on mobile, grid adapts with `clamp()` and `auto-fill`
- Custom focus rings and hover states via global CSS classes
- Dot-grid background on auth pages

---

## Tech Stack

**Frontend**
- [Next.js 16](https://nextjs.org/) (App Router)
- React 19 + TypeScript
- Inline styles + global CSS (no external UI library)

**Backend** *(separate repository)*
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication (`jsonwebtoken`)
- bcrypt password hashing

---

## Project Structure

```
library-system-client/
├── app/
│   ├── page.tsx              # Dashboard
│   ├── books/page.tsx        # Books management
│   ├── authors/page.tsx      # Authors management
│   ├── students/page.tsx     # Students management
│   ├── attendants/page.tsx   # Attendants management
│   ├── borrow/page.tsx       # Borrow & return tracker
│   ├── login/page.tsx        # Login page
│   ├── register/page.tsx     # Registration page
│   ├── forgot-password/      # Password reset page
│   ├── layout.tsx            # Root layout (AppShell)
│   └── globals.css           # Global styles, animations, CSS classes
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx       # Navigation sidebar with role badge
│   │   └── Topbar.tsx        # Page header with Add button and user info
│   └── ui/
│       ├── Toast.tsx          # Auto-dismiss toast notifications
│       └── ConfirmModal.tsx   # Styled confirmation dialog
├── context/
│   └── AuthContext.tsx        # Auth state, login/logout, user role
├── lib/
│   └── api.ts                 # Typed fetch wrapper (get/post/put/delete)
└── .env.local                 # Environment variables (see below)
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- The backend API running locally or deployed

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd library-system-client

# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Replace the URL with your backend's base URL.

### Running Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

---

## API Endpoints Used

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Login and receive JWT |
| `POST` | `/auth/register` | Create a new account |
| `POST` | `/auth/forgot-password` | Request password reset |
| `GET/POST` | `/books` | List or add books |
| `DELETE` | `/books/:id` | Delete a book |
| `GET/POST` | `/authors` | List or add authors |
| `DELETE` | `/authors/:id` | Delete an author |
| `GET/POST` | `/students` | List or register students |
| `GET/POST` | `/attendants` | List or add attendants |
| `DELETE` | `/attendants/:id` | Remove an attendant |
| `GET/POST` | `/borrow` | List borrows or issue a new borrow |
| `PUT` | `/borrow/:id/return` | Mark a book as returned |

---

## Roles & Permissions

| Action | Admin | Attendant |
|---|:---:|:---:|
| View all records | ✅ | ✅ |
| Add books / authors / students / attendants | ✅ | ❌ |
| Delete books / authors / attendants | ✅ | ❌ |
| Issue borrow | ✅ | ✅ |
| Mark book returned | ✅ | ✅ |

---

## Screenshots

> Add screenshots of the Dashboard, Books page, and Borrow page here for best portfolio impact.

---

## License

MIT
