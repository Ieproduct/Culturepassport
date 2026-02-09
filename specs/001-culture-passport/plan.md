# Implementation Plan: CulturePassport

**Branch**: `001-culture-passport` | **Date**: 2026-02-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-culture-passport/spec.md`

## Summary

CulturePassport เป็นระบบติดตาม onboarding พนักงานใหม่ที่มี 3 roles (Admin, Manager, Employee) แต่ละ role มี dashboard แยก — Admin 10 tabs, Manager 2 tabs, Employee 3 tabs Frontend สร้างด้วย React + MUI v5 + IE Design System tokens, backend ใช้ Supabase (PostgreSQL + Auth + Storage + Edge Functions) deploy frontend บน Railway

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: React 18+, Material UI v5, @supabase/supabase-js, Vite
**Storage**: Supabase PostgreSQL (managed) + Supabase Storage (file uploads)
**Auth**: Supabase Auth (email/password)
**Testing**: Vitest + React Testing Library (frontend), Supabase local dev (integration)
**Target Platform**: Web browser (desktop + tablet + mobile)
**Project Type**: Web application (frontend-only + Supabase BaaS)
**Performance Goals**: All pages render < 2s, Supabase queries < 500ms
**Constraints**: 8px grid spacing (Constitution II), 44px min touch target (Constitution IV), RLS on all tables
**Scale/Scope**: ~50-200 users, 11 Supabase tables, 15 tabs across 3 dashboards, 2 Edge Functions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| **I. Clean Architecture** | ✅ PASS | Frontend layers: pages → hooks → services (Supabase client). No business logic in components. |
| **II. 8px Grid Design System** | ✅ PASS | IE Design System tokens created in `frontend/src/theme/`. All spacing via `theme.spacing()`. |
| **III. Component Composability** | ✅ PASS | MUI-First approach. Functional components + hooks only. Shared components (CascadingFilter, DataTable, StatsCard). |
| **IV. Responsive-First Design** | ✅ PASS | MUI breakpoints (xs/sm/md/lg/xl). 44px touch targets in theme. MUI Grid/Stack/Box for layout. |
| **V. Scalable Data Architecture (Supabase)** | ✅ PASS | Supabase-only. RLS on all tables. Edge Functions for admin operations. Migrations via Supabase CLI. |
| **VI. Team Maintainability** | ✅ PASS | PascalCase components, camelCase hooks/utils, snake_case DB. Named exports. TypeScript strict. |

**Gate Result**: ALL PASS — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-culture-passport/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (Supabase table schemas + RLS policies)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
frontend/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── .env.local                          # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
├── src/
│   ├── main.tsx                        # App entry point
│   ├── App.tsx                         # Router + AuthProvider + ThemeProvider
│   ├── lib/
│   │   └── supabase.ts                # Supabase client singleton
│   ├── theme/                          # ✅ Already created
│   │   ├── index.ts
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── shadows.ts
│   │   ├── typography.ts
│   │   └── theme.ts
│   ├── types/
│   │   ├── database.ts                # Supabase generated types (supabase gen types)
│   │   └── index.ts                   # App-level type definitions
│   ├── contexts/
│   │   └── AuthContext.tsx             # Supabase Auth context + session + role
│   ├── hooks/
│   │   ├── useAuth.ts                 # Auth hook (login, logout, session, role)
│   │   ├── useProfiles.ts            # CRUD profiles
│   │   ├── useMissions.ts            # CRUD missions
│   │   ├── useUserMissions.ts        # UserMission operations (assign, start, submit, review)
│   │   ├── useExams.ts               # CRUD exam templates
│   │   ├── useMasterData.ts          # CRUD companies, departments, positions, categories
│   │   ├── useRoadmap.ts             # CRUD milestones
│   │   ├── useAnnouncements.ts       # CRUD announcements + dismiss
│   │   └── useCascadingFilter.ts     # Shared cascading filter logic
│   ├── components/
│   │   ├── common/
│   │   │   ├── StatsCard.tsx          # Reusable stats card (icon, label, value, color)
│   │   │   ├── DataTable.tsx          # Reusable MUI DataGrid wrapper (pagination, sort, search)
│   │   │   ├── CascadingFilter.tsx    # Company → Department → Position filter
│   │   │   ├── ConfirmDialog.tsx      # Delete confirmation dialog
│   │   │   ├── StatusBadge.tsx        # Mission status chip (color-coded)
│   │   │   ├── FileUpload.tsx         # Supabase Storage upload component
│   │   │   └── EmptyState.tsx         # Empty state placeholder
│   │   └── layout/
│   │       ├── Navbar.tsx             # Top navbar (name, role badge, avatar, logout)
│   │       ├── DashboardLayout.tsx    # Layout wrapper (Navbar + content + footer)
│   │       └── Footer.tsx             # Copyright + version
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx     # 10-tab container
│   │   │   ├── OverviewTab.tsx
│   │   │   ├── UsersTab.tsx
│   │   │   ├── MissionsTab.tsx
│   │   │   ├── AssignTab.tsx
│   │   │   ├── ExamsTab.tsx
│   │   │   ├── MasterDataTab.tsx
│   │   │   ├── CreateAccountTab.tsx
│   │   │   ├── RoadmapTab.tsx
│   │   │   ├── AnnouncementsTab.tsx
│   │   │   └── ExportTab.tsx
│   │   ├── manager/
│   │   │   ├── ManagerDashboard.tsx   # 2-tab container
│   │   │   ├── TeamOverviewTab.tsx
│   │   │   └── PendingReviewsTab.tsx
│   │   └── employee/
│   │       ├── EmployeeDashboard.tsx  # 3-tab container
│   │       ├── OverviewTab.tsx
│   │       ├── MissionsTab.tsx
│   │       └── RoadmapTab.tsx
│   ├── guards/
│   │   └── RoleGuard.tsx              # Route guard component (redirect by role)
│   └── utils/
│       ├── formatDate.ts
│       └── exportHelpers.ts           # CSV/JSON generation (client-side for small data)
└── tests/
    ├── setup.ts
    ├── components/
    ├── hooks/
    └── pages/

supabase/
├── config.toml                         # Supabase local dev config
├── migrations/
│   ├── 00001_create_profiles.sql
│   ├── 00002_create_companies_departments_positions.sql
│   ├── 00003_create_categories.sql
│   ├── 00004_create_missions.sql
│   ├── 00005_create_user_missions.sql
│   ├── 00006_create_exam_templates.sql
│   ├── 00007_create_roadmap_milestones.sql
│   ├── 00008_create_announcements.sql
│   └── 00009_create_rls_policies.sql
├── functions/
│   ├── create-user/
│   │   └── index.ts                    # Admin create user Edge Function
│   └── export-data/
│       └── index.ts                    # Admin export Edge Function
└── seed.sql                            # Dev seed data (3 roles, sample missions, etc.)
```

**Structure Decision**: Frontend-only web app + Supabase BaaS. ไม่มี backend directory เพราะใช้ Supabase ตรง. Supabase config อยู่ที่ `supabase/` directory (Supabase CLI standard).

## Environments

| Environment | Branch | Railway Service | Supabase Project | Auto Deploy |
|-------------|--------|----------------|------------------|-------------|
| **DEV** | `develop` | `culturepassport-dev` | `culturepassport-dev` | ✅ auto on push |
| **UAT** | `staging` | `culturepassport-uat` | `culturepassport-uat` | ✅ auto on PR merge |
| **PROD** | `main` | `culturepassport-prod` | `culturepassport-prod` | 🔒 manual after UAT approval |

### Environment Variables (per environment)

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_ENVIRONMENT=dev|uat|prod
```

### Branch Strategy

```
feature/xxx ──→ develop (DEV) ──→ staging (UAT) ──→ main (PROD)
                  │                   │                  │
              auto deploy         auto deploy       manual deploy
              culturepassport-dev culturepassport-uat culturepassport-prod
```

### Migration Strategy

- DEV: `supabase db push` ตรงจาก local (rapid iteration)
- UAT: `supabase db push --linked` จาก CI pipeline (ต้อง code review แล้ว)
- PROD: `supabase db push --linked` manual trigger หลัง UAT sign-off

## Complexity Tracking

> No constitution violations — table empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
