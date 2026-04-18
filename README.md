# Soccer Tournament Portal

A full-stack soccer tournament management system with a dark UEFA-style dashboard UI.

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
├── SoccerTournament.sln          # Visual Studio solution — opens both projects
├── CLAUDE.md                     # Full project reference for AI-assisted development
├── frontend/                     # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/           # Navbar, Hero, MatchCard, StandingsTable, TeamCard, StatsCard ...
│   │   ├── pages/                # LoginPage, DashboardPage
│   │   ├── services/api.ts       # Typed fetch wrapper
│   │   └── types/index.ts        # Shared TypeScript interfaces
│   └── .env.example              # Copy to .env and set VITE_API_URL
└── backend/
    ├── schema.sql                # Raw SQL — run once to bootstrap the database
    └── SoccerTournament.API/
        ├── Controllers/          # AuthController, UsersController, RolesController
        ├── Services/             # AuthService, UserService
        ├── Repositories/         # UserRepository, RoleRepository (Dapper)
        ├── Models/               # User, Role, LoginRequest, LoginResponse ...
        ├── Database/             # IDbConnectionFactory, DbConnectionFactory
        └── Program.cs            # DI, CORS, JWT auth, logging
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

This creates the `users` and `roles` tables and seeds four default roles plus a SuperAdmin account:

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
cp .env.example .env       # set VITE_API_URL=http://localhost:5000
npm install
npm run dev
# App runs on http://localhost:5173
```

---

### Visual Studio (run both together)

1. Open `SoccerTournament.sln`
2. Right-click the Solution → **Set Startup Projects**
3. Select **Multiple startup projects**
4. Set both `SoccerTournament.API` and `SoccerTournament.Frontend` to **Start**
5. Press **F5**

> Requires the **Node.js development** workload installed via the Visual Studio Installer.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | None | Login — returns JWT + user info |
| `GET` | `/api/users` | Bearer JWT | List all users |
| `POST` | `/api/users` | Bearer JWT | Create a new user |
| `GET` | `/api/roles` | Bearer JWT | List all roles |

### Login example

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@soccer.local","password":"Admin@123"}'
```

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

The UI follows a **dark UEFA-style football dashboard** with gold accents, based on a custom HTML mockup.

| Token | Value | Usage |
|---|---|---|
| Background | `#0a0e1a` | Page and navbar |
| Card | `#111520` | All card surfaces |
| Gold | `#F5C518` | Accents, active states, numbers |
| Border | `#1c1e2a` | Card borders |

Full design system documentation (colors, typography, component rules) is in [`CLAUDE.md`](./CLAUDE.md).

---

## License

MIT
