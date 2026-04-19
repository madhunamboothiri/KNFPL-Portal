# KNFPL Portal — CLAUDE.md

## Project Overview

**Kerala Namboothiries Premier League (KNFPL)** — a full-stack football tournament management portal with a dark UEFA-style dashboard UI.
Monorepo with a React/TypeScript frontend and a .NET 10 / PostgreSQL backend.

Open `SoccerTournament.sln` in Visual Studio to load both projects.

---

## Monorepo Structure

```
KNFPL-Portal/
├── SoccerTournament.sln
├── CLAUDE.md
├── frontend/
│   ├── SoccerTournament.Frontend.esproj
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
│       ├── index.css                     # Design tokens, global CSS classes, keyframes
│       ├── types/
│       │   └── index.ts                  # All shared TypeScript interfaces
│       ├── services/
│       │   └── api.ts                    # Typed fetch wrapper (auth/users/roles/profile)
│       ├── components/
│       │   ├── AppLayout.tsx             # Sidebar + Navbar shell wrapper
│       │   ├── Navbar.tsx                # Top bar — page title, breadcrumb, user avatar
│       │   ├── Sidebar.tsx               # Left nav
│       │   ├── DobMaskInput.tsx          # DD/MM/YYYY masked input + native datepicker
│       │   ├── LoadingOverlay.tsx        # Semi-transparent section spinner
│       │   ├── Hero.tsx
│       │   ├── TabNav.tsx
│       │   ├── SectionHeader.tsx
│       │   ├── MatchCard.tsx
│       │   ├── StandingsTable.tsx
│       │   ├── TeamCard.tsx
│       │   └── StatsCard.tsx
│       └── pages/
│           ├── LoginPage.tsx             # KNFPL branded login
│           ├── FirstLoginPage.tsx        # Mandatory first-login setup (password + profile)
│           ├── DashboardPage.tsx         # Live counts: users, tournaments, active tournaments
│           ├── ProfilePage.tsx           # Current user profile + password change
│           ├── UsersPage.tsx             # SuperAdmin user management (CRUD + tournament assignment)
│           └── TournamentsPage.tsx       # Tournament management (SuperAdmin CRUD, TournamentAdmin read)
│
└── backend/
    ├── schema.sql                        # Raw SQL: tables + seed data (run once)
    └── SoccerTournament.API/
        ├── SoccerTournament.API.csproj
        ├── appsettings.json
        ├── Program.cs
        ├── Database/
        │   ├── Migrations/
        │   │   ├── 001_initial.sql
        │   │   ├── 002_users_extended_fields.sql   # phone, address, dob, profile_image
        │   │   ├── 003_never_logged.sql            # never_logged BOOLEAN flag
        │   │   ├── 004_tournaments.sql             # tournaments + tournament_admins tables
        │   │   └── 005_users_audit_fields.sql      # created_by, modified_at, modified_by on users
        │   ├── MigrationRunner.cs
        │   ├── IDbConnectionFactory.cs
        │   └── DbConnectionFactory.cs
        ├── Models/
        │   ├── User.cs
        │   ├── UserDto.cs
        │   ├── Role.cs
        │   ├── Tournament.cs
        │   ├── TournamentDto.cs
        │   ├── LoginRequest.cs
        │   ├── LoginResponse.cs                    # includes TournamentBrief + UserDto.AssignedTournaments
        │   ├── CreateUserRequest.cs
        │   ├── UpdateUserRequest.cs
        │   ├── CreateTournamentRequest.cs
        │   ├── UpdateTournamentRequest.cs
        │   ├── UpdateProfileRequest.cs
        │   ├── ChangePasswordRequest.cs
        │   └── CompleteFirstLoginRequest.cs        # first-login setup payload
        ├── Repositories/
        │   ├── IUserRepository.cs / UserRepository.cs   # includes tournament-assignment helpers
        │   ├── IRoleRepository.cs / RoleRepository.cs
        │   └── ITournamentRepository.cs / TournamentRepository.cs
        ├── Services/
        │   ├── IAuthService.cs / AuthService.cs
        │   ├── IUserService.cs / UserService.cs
        │   └── ITournamentService.cs / TournamentService.cs
        └── Controllers/
            ├── AuthController.cs         # POST /api/auth/login (no [Authorize])
            ├── UsersController.cs        # CRUD /api/users      ([Authorize])
            ├── ProfileController.cs      # GET/PUT /api/profile ([Authorize])
            ├── RolesController.cs        # GET /api/roles       ([Authorize])
            └── TournamentsController.cs  # CRUD /api/tournaments ([Authorize])
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
| Auth storage | `localStorage` (keys: `token`, `user`) |

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
| `--border-glow` | `#2a2810` | Subtle gold-tinted border |
| `--text-primary` | `#ffffff` | Headings, section titles |
| `--text-secondary` | `#aaa` | Inactive nav links, subtitles |
| `--text-muted` | `#666` | Hero subtitle |
| `--text-dim` | `#555` | Labels, inactive states |
| `--text-faint` | `#444` | Match date, loser scores |
| `--text-ghost` | `#333` | Table column headers |
| `--success` | `#27ae60` | Success toast text/border |
| `--success-bg` | `#0d1a10` | Success toast background |
| `--error` | `#c0392b` | Error toast/inline error text/border |
| `--error-bg` | `#1a0e0e` | Error toast background |

---

### Typography

Font family (all elements): `'Arial Black', Arial, sans-serif`

| Element | Font size | Weight | Letter spacing | Transform |
|---|---|---|---|---|
| Section title | `11px` | 900 | `3px` | uppercase |
| Section "view all" | `10px` | 700 | `2px` | uppercase |
| Form label | `9px` | 700 | `2px` | uppercase |
| Form input text | `12px` | 400 | — | — |
| Action button | `9px` | 900 | `2px` | uppercase |
| Table header | `9px` | 700 | `2px` | uppercase |
| Table cell | `13px` | 400/700 | — | — |
| Toast / badge | `9–11px` | 700 | `1.5–2px` | uppercase |
| Nav logo text | `13px` | 900 | `2px` | uppercase |
| Hero title | `38px` | 900 | `-1px` | uppercase |

---

### Component-Level Color Rules

#### Generic Card
```
background:    #111520
border:        1px solid #1c1e2a
border-top:    2px solid #F5C518   ← gold top accent (all new cards/modals)
```

#### Section Title (used in cards, pages)
```
left bar:      3px × 16px, background #F5C518
title:         color #fff, 11px/900, 3px letter-spacing, uppercase
right action:  optional — place SaveBtn or link here
border-bottom: 1px solid #16181f, padding-bottom 12px, margin-bottom 20px
```

#### Form Input (INPUT constant)
```
background:    #0a0e1a
border:        1px solid #1c1e2a
color:         #fff
padding:       9px 12px
font-size:     12px
font-family:   'Arial Black', Arial, sans-serif
box-sizing:    border-box
error state:   border-color #c0392b
read-only:     color #555, cursor not-allowed
```

#### Form Label (LABEL constant)
```
font-size:       9px
font-weight:     700
letter-spacing:  2px
text-transform:  uppercase
color:           #555
margin-bottom:   5px
```

#### Action Button (SaveBtn pattern)
```
background:      #F5C518
color:           #000
padding:         6px 14px
font-size:       9px
font-weight:     900
letter-spacing:  2px
text-transform:  uppercase
display:         flex, align-items center, gap 6px
— always compact width (not full-width)
— always includes an icon to the left of the label
— shows animated spinner (.spin) when loading, replaces icon
— disabled + opacity 0.7 while loading
```

#### Password Input
```
— text input with paddingRight: 38px
— absolute-positioned eye-toggle button at right: 10px
— icon color: #555 idle → #F5C518 on hover
```

#### Date of Birth (DobMaskInput)
```
— text input showing DD/MM/YYYY mask
— calendar icon button at right (absolute, 34px wide)
— icon color: #555 idle → #F5C518 on hover
— clicking icon calls dateInput.showPicker() (no dependency)
— emits YYYY-MM-DD to onChange when 8 digits are entered, '' otherwise
— syncs display from parent value prop when externally changed (API load)
```

#### Toast Notifications
```
position:  fixed, bottom 60px, right 24px
z-index:   500

Success:
  background  #0d1a10
  border      1px solid #27ae60
  color       #27ae60

Error:
  background  #1a0e0e
  border      1px solid #c0392b
  color       #c0392b

font: 11px/700, 1.5px letter-spacing, uppercase
auto-dismiss: 3500ms
```

#### Inline Field Error
```
font-size:       9px
color:           #c0392b
letter-spacing:  0.5px
margin-top:      4px
line-height:     1.4
```

To standardize inline errors across components we use two utility classes in `src/index.css`:

```
.field-error    // styles the inline error text (9px, #c0392b, spacing)
.error-border   // applies red border to inputs/selects/textareas
```

Usage (React):
```tsx
<input style={INPUT} className={errors.email ? 'error-border' : ''} />
{errors.email && <div className="field-error">{errors.email}</div>}
```

This replaces ad-hoc inline `borderColor` and duplicated error styles so all controls share a consistent error appearance.

#### Loading Overlay (LoadingOverlay component)
```
position:    absolute, inset 0
background:  rgba(10,14,26,0.6)
z-index:     10
— shown over a card section during async saves
— parent card must have position: relative
```

#### Navbar
```
background:        #0a0e1a
border-bottom:     1px solid #1c1e2a
height:            56px

Avatar (with image):  32×32px circle, border 1px solid #F5C518, objectFit cover
Avatar (no image):    32×32px circle, gradient bg, first initial, color #F5C518
— Navbar calls api.profile.get() on mount to hydrate profileImage from DB
— Dispatching window.dispatchEvent(new Event('userUpdated')) after any profile save
  triggers Navbar to re-read localStorage and update avatar reactively
```

#### Login Page
```
page background:   #0a0e1a
logo:              /KNFPLLogo.png, 80×80px
title:             "KNFPL", #F5C518, 20px/900, 5px letter-spacing
subtitle:          "Kerala Namboothiries Premier League", #aaa, 10px/700
card:              #111520, border 1px solid #1c1e2a, border-top 2px solid #F5C518
error message:     color #c0392b (red — never gold)
submit button:     compact SaveBtn pattern, right-aligned, with sign-in arrow icon
```

---

### CSS Classes (src/index.css)

| Class | What it does |
|---|---|
| `.hero-section` | `position: relative; overflow: hidden` |
| `.hero-section::before` | Radial gold glow, top-right corner |
| `.hero-section::after` | 1px gold-to-transparent gradient line at bottom |
| `.section-title-bar` | `display: flex; align-items: center; gap: 10px` |
| `.section-title-bar::before` | 3px × 16px `#F5C518` vertical bar |
| `.spin` | `animation: spin 0.7s linear infinite` — applied to spinner SVG wrappers |

---

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
| POST | `/api/auth/login` | None | Returns JWT + UserDto (includes `neverLogged`) |
| GET | `/api/users` | Bearer JWT | List all users |
| POST | `/api/users` | Bearer JWT | Create a user (multipart/form-data) |
| PUT | `/api/users/{id}` | Bearer JWT | Update a user (multipart/form-data) |
| DELETE | `/api/users/{id}` | Bearer JWT | Delete a user |
| GET | `/api/roles` | Bearer JWT | List all roles |
| GET | `/api/profile` | Bearer JWT | Get current user's full profile |
| PUT | `/api/profile` | Bearer JWT | Update current user's profile (multipart/form-data) |
| PUT | `/api/profile/password` | Bearer JWT | Change current user's password |
| PUT | `/api/profile/first-login` | Bearer JWT | Complete first-login setup — sets password, profile fields, and flips `never_logged = true` (multipart/form-data) |
| GET | `/api/tournaments` | Bearer JWT | List tournaments (SuperAdmin sees all; TournamentAdmin sees only assigned) |
| POST | `/api/tournaments` | Bearer JWT (SuperAdmin) | Create a tournament (multipart/form-data) |
| PUT | `/api/tournaments/{id}` | Bearer JWT (SuperAdmin) | Update a tournament (multipart/form-data) |
| DELETE | `/api/tournaments/{id}` | Bearer JWT (SuperAdmin) | Delete a tournament |

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

### UserDto shape (returned by all user endpoints)
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "role": "string",
  "phoneNumber": "string | null",
  "address": "string | null",
  "dateOfBirth": "YYYY-MM-DD | null",
  "profileImage": "base64string | null",
  "neverLogged": false,
  "createdAt": "ISO datetime",
  "assignedTournaments": [{ "id": "uuid", "name": "string" }]  // TournamentAdmin only, else []
}
```

> `neverLogged` is `false` when an admin-created user has not yet completed first-login setup.
> It becomes `true` after the user completes `PUT /api/profile/first-login`.
> The login response always includes this field so the frontend can gate routing.

### TournamentDto shape
```json
{
  "id": "uuid",
  "name": "string",
  "type": "5s | 7s | 9s | 11s",
  "logo": "base64string | null",
  "numberOfTeams": 0,
  "isActive": true,
  "createdAt": "ISO datetime",
  "createdByName": "string | null",
  "modifiedAt": "ISO datetime | null",
  "modifiedByName": "string | null"
}
```

---

## Database Schema

```sql
roles (
  id            UUID PRIMARY KEY,
  name          VARCHAR UNIQUE
)

users (
  id            UUID PRIMARY KEY,
  name          VARCHAR NOT NULL,
  email         VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  role_id       UUID REFERENCES roles(id),
  phone_number  VARCHAR,
  address       TEXT,
  date_of_birth DATE,
  profile_image BYTEA,
  never_logged  BOOLEAN NOT NULL DEFAULT TRUE,   -- FALSE = first login pending
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  created_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  modified_at   TIMESTAMPTZ,
  modified_by   UUID REFERENCES users(id) ON DELETE SET NULL
)

tournaments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR NOT NULL,
  type            VARCHAR(5) NOT NULL CHECK (type IN ('5s','7s','9s','11s')),
  logo            BYTEA,
  number_of_teams INT NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  modified_at     TIMESTAMPTZ,
  modified_by     UUID REFERENCES users(id) ON DELETE SET NULL
)

tournament_admins (
  tournament_id   UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (tournament_id, user_id)
)
```

Seeded roles (fixed UUIDs):
- `00000000-0000-0000-0000-000000000001` — SuperAdmin
- `00000000-0000-0000-0000-000000000002` — TournamentAdmin
- `00000000-0000-0000-0000-000000000003` — TeamManager
- `00000000-0000-0000-0000-000000000004` — Player

Default admin: `admin@soccer.local` / `Admin@123`

**Never use EF migrations** — schema changes go in numbered SQL files under `Database/Migrations/`.

---

## Backend Conventions

- **Connection factory is a singleton.** Repositories use `using var conn = _db.CreateConnection()` — connection is disposed after each query.
- **All SQL is raw and parameterized.** Use Dapper's `@ParamName` syntax. Never concatenate user input into SQL strings.
- **Repositories handle data access only.** Business logic lives in Services.
- **Password hashing** in `UserService` using `BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12)`.
- **JWT generation** in `AuthService.GenerateJwt`. Claims: `sub` (userId), `email`, `name`, `role`, `jti`.
- **Profile image** stored as `BYTEA` in DB, returned as Base64 string in `UserDto.ProfileImage`.
- **`ProfileController`** reads the current user's ID from `ClaimTypes.NameIdentifier` JWT claim.
- CORS is configured for `http://localhost:5173` and `http://localhost:3000`.

---

## Frontend Conventions

- **`api.ts` is the only file that calls `fetch`.** All HTTP calls go through `api.auth.*`, `api.users.*`, `api.roles.*`, `api.profile.*`, `api.tournaments.*`.
- **JWT** is read/written only via `localStorage.getItem/setItem('token')`.
- **User object in localStorage** (`key: 'user'`) stores `{ id, name, email, role, profileImage, neverLogged }`. Always include both fields when updating this object. After any profile save, dispatch `window.dispatchEvent(new Event('userUpdated'))` so the Navbar avatar updates reactively.
- **`PrivateRoute` in `App.tsx`** redirects to `/login` if no token is found. If the stored user has `neverLogged === false`, it redirects to `/first-login` before allowing access to any protected page.
- **First-login flow** — when admin creates a user, `neverLogged` is set to `false`. On the user's first login the frontend detects this and forces them to `/first-login` where they must set a new password and fill in phone, address, and date of birth (all mandatory). On success `neverLogged` becomes `true` and they land on the dashboard.
- **User object in localStorage** (`key: 'user'`) stores `{ id, name, email, role, profileImage, neverLogged }`. Always include both `profileImage` and `neverLogged` when updating this object.
- **Component props are typed** via interfaces in `src/types/index.ts`. Add new types there, not inline.
- **Hover effects** on interactive cards use `onMouseEnter/onMouseLeave` with inline style mutation.
- **Error messages shown to users** must always be plain English — never raw API response bodies or HTTP status strings.

---

## Generic UI Patterns (apply to all new pages)

These patterns are established on `ProfilePage` and `UsersPage` and must be followed consistently.

### 1. Page-level constants
Every page/component file that renders form elements must define these at the top:
```tsx
const FONT = "'Arial Black', Arial, sans-serif"

const INPUT: React.CSSProperties = {
  width: '100%', background: '#0a0e1a', border: '1px solid #1c1e2a',
  color: '#fff', padding: '9px 12px', fontSize: 12,
  outline: 'none', fontFamily: FONT, boxSizing: 'border-box',
}

const LABEL: React.CSSProperties = {
  display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: 2,
  textTransform: 'uppercase' as const, color: '#555', marginBottom: 5, fontFamily: FONT,
}
```

### 2. SectionTitle pattern
```tsx
<div style={{ display:'flex', alignItems:'center', gap:10, paddingBottom:12, borderBottom:'1px solid #16181f', marginBottom:20 }}>
  <span style={{ display:'inline-block', width:3, height:16, background:'#F5C518', flexShrink:0 }} />
  <span style={{ fontSize:11, fontWeight:900, color:'#fff', letterSpacing:'3px', textTransform:'uppercase', fontFamily:FONT, flex:1 }}>
    Section Title
  </span>
  {/* optional: <SaveBtn /> or link on the right */}
</div>
```

### 3. Field + error pattern
```tsx
<div style={{ display:'flex', flexDirection:'column', marginBottom:14 }}>
  <label style={LABEL}>Field Label *</label>
  <input style={{ ...INPUT, borderColor: errors.field ? '#c0392b' : '#1c1e2a' }} />
  {errors.field && (
    <div style={{ fontSize:9, color:'#c0392b', fontFamily:FONT, letterSpacing:0.5, marginTop:4 }}>
      {errors.field}
    </div>
  )}
</div>
```

### 4. Action button with icon and spinner
```tsx
<button type="submit" disabled={loading} style={{
  background:'#F5C518', color:'#000', border:'none', padding:'6px 14px',
  fontSize:9, fontWeight:900, letterSpacing:2, textTransform:'uppercase',
  cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
  fontFamily:FONT, display:'flex', alignItems:'center', gap:6,
}}>
  {loading
    ? <span className="spin"><svg ...spinner.../></span>
    : <svg ...icon... />}
  {loading ? 'Saving…' : 'Save'}
</button>
```
- Button is always **compact** (not full-width) and **right-aligned** inside its container.
- Use `justifyContent: 'flex-end'` on the wrapper when placing below a form.

### 5. Toast notifications
```tsx
// success
{ background:'#0d1a10', border:'1px solid #27ae60', color:'#27ae60' }

// error
{ background:'#1a0e0e', border:'1px solid #c0392b', color:'#c0392b' }

// auto-dismiss after 3500ms
```

### 6. Password input with eye toggle
Use the `PasswordInput` component from `ProfilePage` — copy it into new pages that need it.

### 7. Date of birth field
Always use `<DobMaskInput>` from `src/components/DobMaskInput.tsx`.
- `value` prop: `YYYY-MM-DD` or `''`
- `onChange` prop: receives `YYYY-MM-DD` when complete, `''` otherwise
- Do **not** use `<input type="date">` directly anywhere.

### 8. Loading overlay during saves
Wrap the card content div with `position: relative` and place `<LoadingOverlay show={saving} />` inside it.

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

RBAC enforcement: add `[Authorize(Roles = "SuperAdmin")]` on controller actions as features are built out.

---

## Extending the Project

**Add a new feature (e.g. Tournaments):**
1. Add SQL migration file: `Database/Migrations/00N_tournaments.sql`
2. Create `Models/Tournament.cs`, `Models/CreateTournamentRequest.cs`
3. Create `Repositories/ITournamentRepository.cs` + `TournamentRepository.cs` (Dapper)
4. Create `Services/ITournamentService.cs` + `TournamentService.cs`
5. Create `Controllers/TournamentsController.cs`
6. Register in `Program.cs` (`AddScoped`)
7. Add type to `frontend/src/types/index.ts`
8. Add method to `frontend/src/services/api.ts`
9. Build the React page following **Generic UI Patterns** above
10. Add route to `App.tsx` and nav item to `Sidebar.tsx`

---

## Planned / Not Yet Implemented

- **Activity log** — user action history (login, profile update, password change, CRUD events) stored in `activity_logs` DB table
- **RBAC enforcement** — `[Authorize(Roles = "...")]` attributes on controller actions
- **Match / team / player management** pages
- **Dashboard** — Total Users, Total Tournaments, Active Tournaments are live; Total Players is a placeholder
- **Audit field backend plumbing** — `created_by`/`modified_by` columns exist on users table (migration 005) but UserRepository/UserService actor-ID wiring is not yet complete
