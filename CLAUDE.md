# Soccer Tournament Portal — CLAUDE.md

## Project Overview

A full-stack soccer tournament management system with a dark UEFA-style dashboard UI.
Monorepo with a React/TypeScript frontend and a .NET 10 / PostgreSQL backend.

Open `SoccerTournament.sln` in Visual Studio to load both projects.

---

## Monorepo Structure

```
KNFPL-Portal/
├── SoccerTournament.sln                  # VS solution — opens both projects
├── CLAUDE.md
├── frontend/                             # React + Vite + TypeScript
│   ├── SoccerTournament.Frontend.esproj  # VS JS project (esproj)
│   ├── index.html
│   ├── vite.config.ts                    # Proxies /api → localhost:5000
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── postcss.config.js
│   ├── package.json
│   ├── .env                              # VITE_API_URL=http://localhost:5000
│   └── src/
│       ├── main.tsx
│       ├── App.tsx                       # BrowserRouter + PrivateRoute guard
│       ├── index.css                     # Design tokens, hero pseudo-elements
│       ├── types/
│       │   └── index.ts                  # All shared TypeScript interfaces
│       ├── services/
│       │   └── api.ts                    # Typed fetch wrapper (auth/users/roles)
│       ├── components/
│       │   ├── Navbar.tsx
│       │   ├── Hero.tsx
│       │   ├── TabNav.tsx
│       │   ├── SectionHeader.tsx
│       │   ├── MatchCard.tsx
│       │   ├── StandingsTable.tsx
│       │   ├── TeamCard.tsx
│       │   └── StatsCard.tsx
│       └── pages/
│           ├── LoginPage.tsx
│           └── DashboardPage.tsx         # Static seed data — wire to API later
│
└── backend/
    ├── schema.sql                        # Raw SQL: tables + seed data (run once)
    └── SoccerTournament.API/
        ├── SoccerTournament.API.csproj   # .NET 10, Dapper, Npgsql, BCrypt, JWT
        ├── appsettings.json              # DB conn string + JWT config
        ├── Program.cs                    # DI wiring, CORS, JWT auth, logging
        ├── Database/
        │   ├── IDbConnectionFactory.cs
        │   └── DbConnectionFactory.cs    # NpgsqlConnection factory (singleton)
        ├── Models/
        │   ├── User.cs
        │   ├── Role.cs
        │   ├── LoginRequest.cs
        │   ├── LoginResponse.cs / UserDto.cs
        │   └── CreateUserRequest.cs
        ├── Repositories/                 # Dapper + raw parameterized SQL
        │   ├── IUserRepository.cs / UserRepository.cs
        │   └── IRoleRepository.cs / RoleRepository.cs
        ├── Services/
        │   ├── IAuthService.cs / AuthService.cs    # BCrypt verify + JWT mint
        │   └── IUserService.cs / UserService.cs
        └── Controllers/
            ├── AuthController.cs         # POST /api/auth/login (no [Authorize])
            ├── UsersController.cs        # GET/POST /api/users  ([Authorize])
            └── RolesController.cs        # GET /api/roles       ([Authorize])
```

---

## Tech Stack

### Frontend
| Concern | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Routing | React Router v6 |
| Styling | Tailwind CSS v3 + inline styles for brand colors |
| HTTP client | Native fetch wrapped in `src/services/api.ts` |
| Auth storage | `localStorage` (key: `token`) |

### Backend
| Concern | Choice |
|---|---|
| Runtime | .NET 10 (ASP.NET Core Web API) |
| ORM | **Dapper only** — no Entity Framework |
| Database | PostgreSQL |
| DB driver | Npgsql |
| Password hashing | BCrypt.Net-Next (work factor 12) |
| Auth | JWT Bearer (HS256) |
| Architecture | Controllers → Services → Repositories |

---

## Design System

Source of truth: `uecl_golden_mockup.html` (UEFA-style dark football dashboard with gold accents).
**Never change any color value without explicit instruction.**

---

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg-primary` | `#0a0e1a` | Page background, navbar background |
| `--bg-card` | `#111520` | All card and table-row surfaces |
| `--gold` | `#F5C518` | Primary accent — active states, highlights, numbers |
| `--border` | `#1c1e2a` | Default card/component border |
| `--border-dark` | `#16181f` | Section headers, table row dividers |
| `--border-glow` | `#2a2810` | Subtle gold-tinted border (upcoming match badge, team avatar) |
| `--text-primary` | `#ffffff` | Headings, team names (winner), section titles |
| `--text-secondary` | `#aaa` | Inactive nav links |
| `--text-muted` | `#666` | Hero subtitle |
| `--text-dim` | `#555` | Stat labels in hero, inactive tab labels |
| `--text-faint` | `#444` | Match date, loser scores, standings secondary columns |
| `--text-ghost` | `#333` | Standings table column headers |

---

### Typography

| Element | Font size | Weight | Letter spacing | Transform |
|---|---|---|---|---|
| Nav logo text | `13px` | 900 | `2px` | uppercase |
| Nav logo badge (SCT) | `10px` | 900 | `1px` | uppercase |
| Nav links | `11px` | 700 | `1.5px` | uppercase |
| Nav account button | `11px` | 900 | `1px` | — |
| Hero eyebrow | `10px` | 700 | `3px` | uppercase |
| Hero title | `38px` | 900 | `-1px` | uppercase |
| Hero subtitle | `13px` | 400 | `1px` | uppercase |
| Hero stat number | `30px` | 900 | — | — |
| Hero stat label | `10px` | 400 | `1px` | uppercase |
| Tab labels | `10px` | 700 | `2px` | uppercase |
| Section title | `11px` | 900 | `3px` | uppercase |
| Section "view all" | `10px` | 700 | `2px` | uppercase |
| Match date | `10px` | 400 | `1px` | uppercase |
| Match team name | `13px` | 700 | — | — |
| Match score | `15px` | 900 | — | — |
| Match status badge | `9px` | 700 | `2px` | uppercase |
| Standings headers | `9px` | 700 | `2px` | uppercase |
| Standings team name | `13px` | 700 | — | — |
| Standings points | `14px` | 900 | — | — |
| Team card name | `11px` | 700 | — | — |
| Team card status | `9px` | 400 | `1px` | uppercase |
| Team avatar initials | `11px` | 900 | — | — |
| Stat card number | `28px` | 900 | — | — |
| Stat card label | `9px` | 400 | `2px` | uppercase |

Font family (all elements): `'Arial Black', Arial, sans-serif`

---

### Component-Level Color Rules

#### Navbar
```
background:        #0a0e1a
border-bottom:     2px solid #F5C518
nav-link (active): color #F5C518, border-bottom 2px solid #F5C518
nav-link (idle):   color #aaa, border-bottom transparent
account button:    background #F5C518, color #000
```

#### Hero Section
```
background:        #0a0e1a
border-bottom:     1px solid #1c1f0a
eyebrow text:      #F5C518
title line 1:      #ffffff
title line 2:      #F5C518  (the highlighted word)
subtitle:          #666
stat numbers:      #F5C518
stat labels:       #555
trophy icon:       opacity 0.15

::before  radial glow — top-right corner:
  background: radial-gradient(circle, rgba(245,197,24,0.07) 0%, transparent 70%)
  size: 320×320px, offset: top -60px right -60px

::after   gold gradient line — bottom edge:
  background: linear-gradient(90deg, #F5C518 0%, transparent 60%)
  height: 1px
```

#### Tabs
```
container border-bottom:  1px solid #1c1e2a
tab (active):   color #F5C518, border-bottom 2px solid #F5C518
tab (idle):     color #555, border-bottom transparent
```

#### Section Header
```
border-bottom:   1px solid #16181f
title:           color #fff — preceded by 3px × 16px #F5C518 left bar (::before)
"view all" link: color #F5C518
```

#### Match Card
```
background:           #111520
border:               1px solid #1c1e2a
border (hover):       1px solid #F5C518
date text:            #444
winner team name:     #fff
loser team name:      #555
winner score:         #F5C518
loser score:          #444

Status badge — Live:
  background #F5C518, color #000

Status badge — FT (full time):
  background #16181f, color #444

Status badge — Upcoming:
  border 1px solid #2a2810, color #F5C518, background transparent
```

#### Standings Table
```
header cells:        color #333
border-bottom (header): 1px solid #16181f
row border-bottom:   1px solid #0f1118
row hover (all tds): background #111520
position (default):  color #444
position (qualified — gold badge):
  background #F5C518, color #000, size 20×20px
team name:           color #fff
stat columns:        color #888
points column:       color #F5C518, font-weight 900, font-size 14px

Form dots:
  W (win):  background #F5C518
  D (draw): background #555
  L (loss): background #222, border 1px solid #333
  size: 8×8px circle, margin: 0 1px
```

#### Team Card
```
background:           #111520
border:               1px solid #1c1e2a
border (hover):       1px solid #F5C518
avatar circle:        background #1c1e2a, border 1px solid #2a2810
avatar initials:      color #F5C518
team name:            color #fff
status (approved):    color #F5C518
status (pending):     color #444
```

#### Stats Card (bottom row)
```
background:    #111520
border:        1px solid #1c1e2a
border-top:    2px solid #F5C518   ← gold top accent stripe
number:        color #F5C518
label:         color #444
```

#### Login Page
```
page background:      #0a0e1a
card background:      #111520
card border:          1px solid #1c1e2a
card border-top:      2px solid #F5C518
input background:     #0a0e1a
input border:         1px solid #1c1e2a
input text:           #fff
label text:           #555
error box:            color #F5C518, border 1px solid #2a2810,
                      background rgba(245,197,24,0.05)
submit button:        background #F5C518, color #000
```

---

### CSS Classes (src/index.css)

| Class | What it does |
|---|---|
| `.hero-section` | `position: relative; overflow: hidden` — container for pseudo-elements |
| `.hero-section::before` | Radial gold glow, top-right corner |
| `.hero-section::after` | 1px gold-to-transparent gradient line at bottom |
| `.section-title-bar` | `display: flex; align-items: center; gap: 10px` |
| `.section-title-bar::before` | 3px × 16px `#F5C518` vertical bar left of section titles |

### Tailwind Custom Tokens (tailwind.config.js)

| Tailwind key | Value |
|---|---|
| `colors.primary` | `#0a0e1a` |
| `colors.card` | `#111520` |
| `colors.gold` | `#F5C518` |
| `colors.border-base` | `#1c1e2a` |
| `colors.border-dark` | `#16181f` |
| `colors.muted` | `#555` |
| `colors.dim` | `#444` |
| `fontFamily.sans` | `'Arial Black', Arial, sans-serif` |

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | None | Returns JWT + UserDto |
| GET | `/api/users` | Bearer JWT | List all users |
| POST | `/api/users` | Bearer JWT | Create a user |
| GET | `/api/roles` | Bearer JWT | List all roles |

### Login request / response
```json
// POST /api/auth/login
{ "email": "admin@soccer.local", "password": "Admin@123" }

// 200 OK
{
  "token": "<jwt>",
  "user": { "id": "...", "name": "Super Admin", "email": "...", "role": "SuperAdmin", "createdAt": "..." }
}
```

---

## Database Schema

```sql
roles  (id UUID PK, name VARCHAR UNIQUE)
users  (id UUID PK, name, email UNIQUE, password_hash, role_id FK → roles, created_at)
```

Seeded roles (fixed UUIDs):
- `00000000-0000-0000-0000-000000000001` — SuperAdmin
- `00000000-0000-0000-0000-000000000002` — TournamentAdmin
- `00000000-0000-0000-0000-000000000003` — TeamManager
- `00000000-0000-0000-0000-000000000004` — Player

Default admin: `admin@soccer.local` / `Admin@123`

**Never use EF migrations** — schema is managed entirely via `backend/schema.sql`.

---

## Backend Conventions

- **Connection factory is a singleton.** `DbConnectionFactory` opens a new `NpgsqlConnection` per `CreateConnection()` call. Repositories use `using var conn = _db.CreateConnection()` — connection is disposed after each query.
- **All SQL is raw and parameterized.** Use Dapper's `@ParamName` syntax. Never concatenate user input into SQL strings.
- **Repositories handle data access only.** Business logic (e.g. hashing, DTO mapping) lives in Services.
- **Password hashing** happens in `UserService.CreateAsync` using `BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12)`.
- **JWT generation** is in `AuthService.GenerateJwt`. Claims: `sub` (userId), `email`, `name`, `role`, `jti`.
- CORS is configured for `http://localhost:5173` and `http://localhost:3000`. Add production origin when deploying.

---

## Frontend Conventions

- **`api.ts` is the only file that calls `fetch`.** All HTTP calls go through `api.auth.*`, `api.users.*`, `api.roles.*`.
- **JWT is read/written only via `localStorage.getItem/setItem('token')`** in `api.ts` and `App.tsx`.
- **`PrivateRoute` in `App.tsx`** redirects to `/login` if no token is found. It does not validate the token — expiry is enforced by the API.
- **Static seed data in `DashboardPage.tsx`** (`MATCHES`, `STANDINGS`, `TEAMS`, `STATS` arrays) is placeholder. Replace with `useEffect` + `api.*` calls as endpoints are built.
- **Component props are typed via interfaces** defined in `src/types/index.ts`. Add new types there, not inline.
- **Hover effects on cards** (`MatchCard`, `TeamCard`) use `onMouseEnter/onMouseLeave` with inline style mutation — Tailwind's `hover:` would work too, but the exact border color `#F5C518` is not in the default palette.

---

## Dev Setup

### 1 — Database (run once)
```bash
psql -U postgres -d postgres -f backend/schema.sql
```

### 2 — Backend
```bash
cd backend/SoccerTournament.API
# Edit appsettings.json — update DB password and set a real JWT secret
dotnet restore
dotnet run
# → http://localhost:5000
```

### 3 — Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Visual Studio (both at once)
Right-click Solution → **Set Startup Projects** → **Multiple startup projects** →
set both `SoccerTournament.API` and `SoccerTournament.Frontend` to **Start** → F5.

---

## Environment Config

### `frontend/.env`
```
VITE_API_URL=http://localhost:5000
```
Vite also proxies `/api/*` → `localhost:5000` (see `vite.config.ts`),
so relative `/api/...` paths work in the browser during development.

### `backend/SoccerTournament.API/appsettings.json`
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=soccer_tournament;Username=postgres;Password=<your-password>"
  },
  "Jwt": {
    "Secret": "<min 32 chars — change before deploying>",
    "Issuer": "SoccerTournamentAPI",
    "Audience": "SoccerTournamentClient",
    "ExpiryHours": 24
  }
}
```

---

## Roles

| Role | ID suffix | Intended access |
|---|---|---|
| SuperAdmin | `...0001` | Full system access |
| TournamentAdmin | `...0002` | Manage tournaments and matches |
| TeamManager | `...0003` | Manage own team and players |
| Player | `...0004` | Read-only profile access |

RBAC enforcement is not yet implemented in controllers. Add `[Authorize(Roles = "SuperAdmin")]`
attributes on controller actions as features are built out.

---

## Extending the Project

**Add a new feature (e.g. Tournaments):**
1. Add SQL table to `backend/schema.sql`
2. Create `Models/Tournament.cs`, `Models/CreateTournamentRequest.cs`
3. Create `Repositories/ITournamentRepository.cs` + `TournamentRepository.cs` (Dapper)
4. Create `Services/ITournamentService.cs` + `TournamentService.cs`
5. Create `Controllers/TournamentsController.cs`
6. Register in `Program.cs` (`AddScoped`)
7. Add type to `frontend/src/types/index.ts`
8. Add method to `frontend/src/services/api.ts`
9. Build the React component and wire it into `DashboardPage.tsx`
