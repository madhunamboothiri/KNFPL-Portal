# KNFPL Portal

**Kerala Namboothiries Premier League** — a full-stack football tournament management portal with a dark UEFA-style dashboard UI.

Built with **React + TypeScript** on the frontend and **.NET 10 + PostgreSQL** on the backend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router v6 |
| Backend | .NET 10, ASP.NET Core Web API |
| Database | PostgreSQL |
| ORM | Dapper (raw SQL — no Entity Framework) |
| Auth | JWT Bearer (HS256) + BCrypt password hashing |
| IDE | Visual Studio (open `SoccerTournament.sln`) |

---

## Project Structure

```
KNFPL-Portal/
├── SoccerTournament.sln
├── CLAUDE.md                             # Full project reference for AI-assisted development
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── AppLayout.tsx             # Sidebar + Navbar shell
│       │   ├── Navbar.tsx                # Top bar with reactive user avatar
│       │   ├── Sidebar.tsx
│       │   ├── DobMaskInput.tsx          # DD/MM/YYYY masked date input
│       │   └── LoadingOverlay.tsx        # Section loading spinner
│       ├── pages/
│       │   ├── LoginPage.tsx             # KNFPL branded login
│       │   ├── DashboardPage.tsx
│       │   ├── ProfilePage.tsx           # Profile editing + password change
│       │   └── UsersPage.tsx             # User management (SuperAdmin)
│       ├── services/api.ts               # Typed fetch wrapper
│       └── types/index.ts                # Shared TypeScript interfaces
└── backend/
    ├── schema.sql
    └── SoccerTournament.API/
        ├── Controllers/                  # Auth, Users, Profile, Roles
        ├── Services/                     # AuthService, UserService
        ├── Repositories/                 # UserRepository, RoleRepository (Dapper)
        ├── Models/                       # User, UserDto, requests...
        ├── Database/
        │   └── Migrations/               # Numbered SQL migration files
        └── Program.cs
```

---

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [PostgreSQL 15+](https://www.postgresql.org/)
- Visual Studio 2022+ (with Node.js development workload)

---

### 1 — Database

Run the schema once against your PostgreSQL instance:

```bash
psql -U postgres -d postgres -f backend/schema.sql
```

This creates the `roles` and `users` tables and seeds four default roles plus a SuperAdmin account:

| Email | Password |
|---|---|
| `admin@soccer.local` | `Admin@123` |

> Change the default password immediately after first login.

---

### 2 — Backend

```bash
cd backend/SoccerTournament.API
```

Edit `appsettings.json` with your database credentials and a strong JWT secret:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=soccer_tournament;Username=postgres;Password=YOUR_PASSWORD"
  },
  "Jwt": {
    "Secret": "YOUR_SECRET_KEY_MIN_32_CHARACTERS",
    "Issuer": "SoccerTournamentAPI",
    "Audience": "SoccerTournamentClient",
    "ExpiryHours": 24
  }
}
```

```bash
dotnet restore
dotnet run
# API runs on http://localhost:5000
```

---

### 3 — Frontend

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

Set `VITE_API_URL=http://localhost:5000` in `frontend/.env`.

---

### Visual Studio (run both together)

1. Open `SoccerTournament.sln`
2. Right-click the Solution → **Set Startup Projects**
3. Select **Multiple startup projects**
4. Set both `SoccerTournament.API` and `SoccerTournament.Frontend` to **Start**
5. Press **F5**

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | None | Login — returns JWT + user info |
| `GET` | `/api/users` | Bearer JWT | List all users |
| `POST` | `/api/users` | Bearer JWT | Create a user |
| `PUT` | `/api/users/{id}` | Bearer JWT | Update a user |
| `DELETE` | `/api/users/{id}` | Bearer JWT | Delete a user |
| `GET` | `/api/roles` | Bearer JWT | List all roles |
| `GET` | `/api/profile` | Bearer JWT | Get current user's full profile |
| `PUT` | `/api/profile` | Bearer JWT | Update current user's profile |
| `PUT` | `/api/profile/password` | Bearer JWT | Change current user's password |

All user/profile endpoints accept `multipart/form-data` to support profile image upload.

---

## Database Schema

```sql
roles  (id UUID PK, name VARCHAR UNIQUE)

users  (
  id UUID PK, name, email UNIQUE, password_hash,
  role_id FK → roles, phone_number, address,
  date_of_birth DATE, profile_image BYTEA, created_at
)
```

Schema changes are managed via numbered SQL files in `backend/SoccerTournament.API/Database/Migrations/`. **Never use EF migrations.**

---

## Roles

| Role | Description |
|---|---|
| SuperAdmin | Full system access |
| TournamentAdmin | Manage tournaments and matches |
| TeamManager | Manage own team and players |
| Player | Read-only profile access |

---

## Design

The UI follows a **dark UEFA-style football dashboard** with gold accents (`#F5C518`) on a deep navy background (`#0a0e1a`). All cards use `#111520` surfaces with a gold top border stripe.

Full design system documentation — colors, typography, component rules, and generic UI patterns — is in [`CLAUDE.md`](./CLAUDE.md).

---

## Planned Features

- Activity log (user action history including login events)
- Tournament / match / team / player management
- RBAC enforcement per role
- Live dashboard data (currently static)

---

## License

MIT
