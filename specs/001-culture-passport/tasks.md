# Tasks: CulturePassport

**Input**: Design documents from `/specs/001-culture-passport/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US4 = Auth, US1 = Employee Missions, US2 = Manager Review, US3 = Admin Config)
- Exact file paths included in descriptions

## Story Map (from spec.md)

| Story | Title | Priority | Spec |
|-------|-------|----------|------|
| US4 | Authentication & Role-Based Access | P1 | spec.md, 002-auth-system |
| US1 | Employee Completes Onboarding Missions | P1 | spec.md, 005-employee-dashboard |
| US2 | Manager Reviews Team Progress | P2 | spec.md, 004-manager-dashboard |
| US5 | Admin Creates User Accounts | P2 | spec.md, 003-admin-dashboard |
| US3 | Admin Manages System Configuration | P3 | spec.md, 003-admin-dashboard |
| US6 | Announcement Management | P3 | spec.md, 005-employee-dashboard |

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, tooling — theme already exists

- [x] T001 [P] Create project structure per plan.md — verify `frontend/src/` directories exist: `lib/`, `types/`, `contexts/`, `hooks/`, `components/common/`, `components/layout/`, `pages/admin/`, `pages/manager/`, `pages/employee/`, `guards/`, `utils/`
- [x] T002 [P] Initialize Vite + React + TypeScript project — `frontend/package.json` with dependencies: `react`, `react-dom`, `react-router-dom`, `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`, `@supabase/supabase-js`, `@mui/x-data-grid`
- [x] T003 [P] Configure TypeScript strict mode — `frontend/tsconfig.json` with `strict: true`, path aliases `@/` → `src/`
- [x] T004 [P] Configure ESLint + Prettier — `frontend/.eslintrc.cjs`, `frontend/.prettierrc`
- [x] T005 [P] Configure Vite — `frontend/vite.config.ts` with path aliases, environment variables prefix `VITE_`
- [x] T006 Verify IE Design System theme files — `frontend/src/theme/` (colors.ts, spacing.ts, shadows.ts, typography.ts, theme.ts, index.ts) already created from Figma

**Checkpoint**: Project builds with `npm run dev` → blank page at localhost:5173

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Supabase schema, client, auth context, types, layout — MUST complete before any user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### 2A: Supabase Backend Setup

- [x] T007 Create Supabase migration from contracts — copy `specs/001-culture-passport/contracts/supabase-schema.sql` into `supabase/migrations/00001_create_schema.sql`
- [x] T008 Create Supabase seed data — `supabase/seed.sql` with 3 test accounts (admin, manager, employee) + sample companies, departments, positions, categories, missions, user_missions, milestones, announcements per quickstart.md
- [x] T009 Create Supabase local config — `supabase/config.toml` for local dev
- [ ] T010 Run `supabase db push` to apply migration to DEV project
- [x] T011 Generate TypeScript types — `supabase gen types typescript --linked > frontend/src/types/database.ts` (manual types written instead)

### 2B: Frontend Core Infrastructure

- [x] T012 Create Supabase client singleton — `frontend/src/lib/supabase.ts` using `createClient()` with `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- [x] T013 Create app-level type definitions — `frontend/src/types/index.ts` with `UserRole`, `MissionStatus`, `Profile`, `Mission`, `UserMission`, etc. (extend from database.ts generated types)
- [x] T014 Create environment config — `frontend/.env.local` with DEV Supabase credentials per quickstart.md
- [x] T015 Create AuthContext — `frontend/src/contexts/AuthContext.tsx` with Supabase `onAuthStateChange()`, session state, user profile + role from `profiles` table
- [x] T016 Create useAuth hook — `frontend/src/hooks/useAuth.ts` wrapping AuthContext (login, logout, session, role, profile, loading)
- [x] T017 Create RoleGuard component — `frontend/src/guards/RoleGuard.tsx` redirect unauthorized users per spec 002 User Story 2
- [x] T018 [P] Create DashboardLayout — `frontend/src/components/layout/DashboardLayout.tsx` wrapper with Navbar + content + Footer
- [x] T019 [P] Create Navbar — `frontend/src/components/layout/Navbar.tsx` with user name, role badge, avatar, logout button per spec 002 User Story 5
- [x] T020 [P] Create Footer — `frontend/src/components/layout/Footer.tsx` with copyright + version
- [x] T021 Create App.tsx — `frontend/src/App.tsx` with React Router, ThemeProvider, AuthProvider, route definitions (`/login`, `/admin/*`, `/manager/*`, `/employee/*`) + RoleGuard wrappers
- [x] T022 Create main.tsx — `frontend/src/main.tsx` entry point rendering `<App />`

### 2C: Shared Components

- [x] T023 [P] Create StatsCard — `frontend/src/components/common/StatsCard.tsx` reusable card with icon, label, value, color
- [x] T024 [P] Create DataTable — `frontend/src/components/common/DataTable.tsx` MUI DataGrid wrapper with pagination, sort, search
- [x] T025 [P] Create CascadingFilter component — `frontend/src/components/common/CascadingFilter.tsx` company → department → position dropdowns
- [x] T026 [P] Create useCascadingFilter hook — `frontend/src/hooks/useCascadingFilter.ts` shared filter state + Supabase queries (R6)
- [x] T027 [P] Create ConfirmDialog — `frontend/src/components/common/ConfirmDialog.tsx` delete confirmation dialog
- [x] T028 [P] Create StatusBadge — `frontend/src/components/common/StatusBadge.tsx` mission status chip (color-coded per status)
- [x] T029 [P] Create FileUpload — `frontend/src/components/common/FileUpload.tsx` Supabase Storage upload (max 10MB, whitelist extensions)
- [x] T030 [P] Create EmptyState — `frontend/src/components/common/EmptyState.tsx` empty state placeholder with message + icon

### 2D: Shared Hooks

- [x] T031 [P] Create useProfiles hook — `frontend/src/hooks/useProfiles.ts` CRUD profiles via Supabase
- [x] T032 [P] Create useMissions hook — `frontend/src/hooks/useMissions.ts` CRUD missions via Supabase
- [x] T033 [P] Create useUserMissions hook — `frontend/src/hooks/useUserMissions.ts` assign, start, submit, review operations
- [x] T034 [P] Create useExams hook — `frontend/src/hooks/useExams.ts` CRUD exam templates + scores
- [x] T035 [P] Create useMasterData hook — `frontend/src/hooks/useMasterData.ts` CRUD companies, departments, positions, categories
- [x] T036 [P] Create useRoadmap hook — `frontend/src/hooks/useRoadmap.ts` CRUD milestones
- [x] T037 [P] Create useAnnouncements hook — `frontend/src/hooks/useAnnouncements.ts` CRUD announcements + dismiss

### 2E: Utility Functions

- [x] T038 [P] Create formatDate utility — `frontend/src/utils/formatDate.ts` Thai date formatting
- [x] T039 [P] Create exportHelpers utility — `frontend/src/utils/exportHelpers.ts` CSV/JSON generation (client-side for < 1,000 records per R5)

**Checkpoint**: Foundation ready — `npm run dev` shows login page, auth flow works, shared components render in isolation

---

## Phase 3: User Story 4 — Authentication & Role-Based Access (Priority: P1) 🎯 MVP

**Goal**: Users can log in, get redirected to role-specific dashboard, route guards enforce access control

**Independent Test**: Create 3 accounts → login each → verify redirect → attempt cross-role access → verify block

### Implementation

- [x] T040 Create LoginPage — `frontend/src/pages/LoginPage.tsx` with email + password form, Supabase `signInWithPassword()`, role-based redirect, error handling per spec 002 US1
- [x] T041 Create placeholder AdminDashboard — `frontend/src/pages/admin/AdminDashboard.tsx` with 10 empty tabs (MUI Tabs) + red gradient header
- [x] T042 [P] Create placeholder ManagerDashboard — `frontend/src/pages/manager/ManagerDashboard.tsx` with 2 empty tabs + blue gradient header
- [x] T043 [P] Create placeholder EmployeeDashboard — `frontend/src/pages/employee/EmployeeDashboard.tsx` with 3 empty tabs + green gradient header
- [x] T044 Wire route guards — verify all acceptance scenarios from spec 002 US2: unauthenticated redirect to `/login`, wrong-role redirect to own dashboard
- [x] T045 Implement session persistence — verify refresh keeps user logged in, expired token redirects to login per spec 002 US4

**Checkpoint**: Login works for all 3 roles, redirects correctly, route guards block unauthorized access, logout clears session

---

## Phase 4: User Story 1 — Employee Completes Onboarding Missions (Priority: P1) 🎯 MVP

**Goal**: Employee sees dashboard with progress, views/starts/submits missions, sees roadmap

**Independent Test**: Login employee with 5 missions → verify overview stats → start mission → upload file → submit → verify status change

### Implementation

- [x] T046 [US1] Implement Employee OverviewTab — `frontend/src/pages/employee/OverviewTab.tsx` with probation countdown, progress bar (approved/total*100), 3 StatsCards (completed, in-progress, total) per spec 005 US1
- [x] T047 [US1] Implement Employee MissionsTab — `frontend/src/pages/employee/MissionsTab.tsx` with mission cards sorted by status priority (in_progress → not_started → submitted → approved), status badges per spec 005 US2
- [x] T048 [US1] Implement mission detail modal — within MissionsTab: modal with title, description, category, file upload, text area, submit button. Handle start (not_started → in_progress), submit (in_progress → submitted), view feedback (approved/rejected) per spec 005 US2
- [x] T049 [US1] Implement file upload flow — integrate FileUpload component with Supabase Storage bucket `mission-deliverables/{user_id}/{mission_id}/` per R3
- [x] T050 [US1] Implement resubmit flow — rejected mission shows feedback + "แก้ไขและส่งใหม่" button → status back to submitted per spec 005 US2 scenario 8-9
- [x] T051 [US1] Wire EmployeeDashboard tabs — connect OverviewTab, MissionsTab to EmployeeDashboard.tsx, pass hooks data

**Checkpoint**: Employee can view progress, browse missions, start, submit with file, see feedback — full onboarding mission flow works

---

## Phase 5: User Story 2 — Manager Reviews Team Progress (Priority: P2)

**Goal**: Manager sees team overview, reviews submitted missions with feedback

**Independent Test**: Login manager → see 5 team members → filter → review submitted mission → approve with score 8

### Implementation

- [x] T052 [US2] Implement Manager TeamOverviewTab — `frontend/src/pages/manager/TeamOverviewTab.tsx` with 3 StatsCards (team count, pending reviews, completion rate), member cards (name, position, progress bar, probation badge) per spec 004 US1
- [x] T053 [US2] Implement CascadingFilter integration — wire CascadingFilter component in TeamOverviewTab for member filtering per spec 004 US1 scenario 4
- [x] T054 [US2] Implement Manager PendingReviewsTab — `frontend/src/pages/manager/PendingReviewsTab.tsx` with submitted missions list (mission name, employee name, submit date, review button) per spec 004 US2
- [x] T055 [US2] Implement feedback modal — within PendingReviewsTab: modal with mission details, submitted file preview/download, score slider (1-10), comment textarea, "อนุมัติ" + "ส่งกลับแก้ไข" buttons per spec 004 US2
- [x] T056 [US2] Implement review action — update `user_missions` (status → approved/rejected, feedback_score, feedback_text, reviewed_at) via useUserMissions hook
- [x] T057 [US2] Implement exam score modal — within TeamOverviewTab: "ดูคะแนนสอบ" button → modal showing exam name, score, total, pass/fail per spec 004 US3
- [x] T058 [US2] Wire ManagerDashboard tabs — connect TeamOverviewTab, PendingReviewsTab to ManagerDashboard.tsx

**Checkpoint**: Manager can view team, filter members, review missions with feedback, view exam scores

---

## Phase 6: User Story 3 — Admin Manages System Configuration (Priority: P3) + US5 (P2)

**Goal**: Admin has full 10-tab dashboard with CRUD operations on all entities

**Independent Test**: Login admin → verify all 10 tabs → CRUD each entity type → verify data persistence

### 6A: Admin Core Tabs (P1 from admin spec)

- [x] T059 [US3] Implement Admin OverviewTab — `frontend/src/pages/admin/OverviewTab.tsx` with 4 StatsCards (total employees, total missions, completion rate, pending items) + aggregate queries per spec 003 US1
- [x] T060 [US3] Implement Admin UsersTab — `frontend/src/pages/admin/UsersTab.tsx` with DataTable (name, email, role, department, status, actions) + CascadingFilter + search + edit/delete per spec 003 US2
- [x] T061 [US3] Implement Admin MissionsTab — `frontend/src/pages/admin/MissionsTab.tsx` with DataTable + CRUD modal (title, description, category dropdown, estimated duration) + soft delete per spec 003 US3
- [x] T062 [US3] Implement Admin AssignTab — `frontend/src/pages/admin/AssignTab.tsx` with mission dropdown + employee table with checkboxes + CascadingFilter + assign button → create UserMission records per spec 003 US4

### 6B: Admin P2 Tabs

- [x] T063 [US5] Implement Admin CreateAccountTab — `frontend/src/pages/admin/CreateAccountTab.tsx` with form (name, email, password, role, company, department, position) + conditional probation fields for employee role per spec 003 US7
- [x] T064 [US5] Create Edge Function create-user — `supabase/functions/create-user/index.ts` Deno Edge Function calling `supabase.auth.admin.createUser()` with service_role key, verify caller is admin per R4
- [x] T065 [US3] Implement Admin ExamsTab — `frontend/src/pages/admin/ExamsTab.tsx` with exam list + CRUD modal supporting 3 question types (multiple_choice, true_false, short_answer) stored as JSONB per spec 003 US5
- [x] T066 [US3] Implement Admin MasterDataTab — `frontend/src/pages/admin/MasterDataTab.tsx` with 4 CRUD sections: Companies, Departments (cascading from company), Positions (cascading from department), Categories per spec 003 US6
- [x] T067 [US3] Implement Admin RoadmapTab — `frontend/src/pages/admin/RoadmapTab.tsx` with milestone list + CRUD modal (title, description, target_day, sort_order) per spec 003 US8

### 6C: Admin P3 Tabs

- [x] T068 [US6] Implement Admin AnnouncementsTab — `frontend/src/pages/admin/AnnouncementsTab.tsx` with announcement list + CRUD + active/inactive toggle per spec 003 US9
- [x] T069 [US3] Implement Admin ExportTab — `frontend/src/pages/admin/ExportTab.tsx` with CascadingFilter + "Export CSV" / "Export JSON" buttons per spec 003 US10
- [x] T070 [US3] Create Edge Function export-data — `supabase/functions/export-data/index.ts` Deno Edge Function for large dataset export (> 1,000 records) per R5

### 6D: Wire Admin Dashboard

- [x] T071 [US3] Wire AdminDashboard tabs — connect all 10 tabs to AdminDashboard.tsx, ensure tab navigation works without page reload

**Checkpoint**: Admin can manage all entities, create accounts, assign missions, create exams, manage master data, export data

---

## Phase 7: User Story 6 — Announcement Management (Priority: P3)

**Goal**: Announcements created by admin appear as popups for employees, dismissible

### Implementation

- [x] T072 [US6] Implement Employee Announcement Popup — within EmployeeDashboard: query active announcements not dismissed, show popup with title + content + dismiss button per spec 005 US4
- [x] T073 [US6] Implement Employee RoadmapTab — `frontend/src/pages/employee/RoadmapTab.tsx` with vertical timeline of milestones, completed/upcoming styling based on target_day vs probation_start per spec 005 US3
- [x] T074 [US6] Wire remaining Employee tabs — connect RoadmapTab to EmployeeDashboard, verify announcement popup on all tabs

**Checkpoint**: Full employee experience with announcements + roadmap

---

## Phase 8: Supabase Storage Configuration

**Purpose**: Configure storage buckets and policies

- [x] T075 Create Supabase Storage bucket `mission-deliverables` — private, max 10MB, allowed MIME types per data-model.md
- [x] T076 [P] Create Supabase Storage bucket `avatars` — public, max 2MB, allowed MIME types per data-model.md
- [x] T077 Create Storage access policies — employees can upload to `mission-deliverables/{user_id}/`, read own files; admin can read all

**Checkpoint**: File uploads work end-to-end

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T078 [P] Responsive design verification — fix Stack direction, maxWidth, table overflow, footer padding for mobile/tablet/desktop
- [x] T079 [P] Touch target verification — MUI default button/icon sizes meet 44x44px requirement
- [x] T080 [P] Spacing audit — all spacing uses theme.spacing() on 8px grid
- [x] T081 [P] Empty states — all lists/tables show EmptyState component when data is empty
- [x] T082 [P] Error handling — add error alerts to all pages, fix useCascadingFilter/useMasterData error handling, add try-catch to TeamOverviewTab/PendingReviewsTab
- [x] T083 [P] Form validation — add disabled submit buttons, required props, min/max constraints to all forms
- [x] T084 Environment configuration — create .env.example, nixpacks.toml, add code-splitting to vite.config.ts, install serve
- [ ] T085 Run quickstart.md validation — follow quickstart.md steps on fresh clone to verify setup works

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup ─────────────────────────┐
                                        ▼
Phase 2: Foundational ──────────────────┤ BLOCKS ALL STORIES
                                        ▼
Phase 3: Auth (US4, P1) ───────────────┐
                                        │ Login required for all dashboards
                                        ▼
┌─────────────────────────┬─────────────┴──────────────┐
│ Phase 4: Employee (P1)  │ Phase 5: Manager (P2)      │ Phase 6: Admin (P3)
│ US1 — Missions          │ US2 — Review               │ US3 + US5 — Config
└──────────┬──────────────┴────────────┬───────────────┘
           ▼                           ▼
Phase 7: Announcements (P3)    Phase 8: Storage Config
           │                           │
           └───────────┬───────────────┘
                       ▼
              Phase 9: Polish
```

### User Story Dependencies

- **US4 (Auth)**: MUST complete first — login is required for all other stories
- **US1 (Employee)**: Depends on US4 (auth) + Phase 2 (hooks, components). Can start after Phase 3
- **US2 (Manager)**: Depends on US4 (auth) + Phase 2. Can start after Phase 3. Benefits from US1 being done (to have submitted missions to review)
- **US5 (Admin Create User)**: Depends on US4 + Phase 2. Requires Edge Function deployment
- **US3 (Admin Config)**: Depends on US4 + Phase 2. Largest story — can be parallelized internally
- **US6 (Announcements)**: Depends on US3 (admin creates announcements) + US1 (employee sees popup)

### Within Each User Story

- Hooks (Phase 2D) before page components
- Shared components (Phase 2C) before pages that use them
- Core implementation before integration/wiring

### Parallel Opportunities

- **Phase 1**: All T001-T006 can run in parallel
- **Phase 2C**: All shared components (T023-T030) can run in parallel
- **Phase 2D**: All hooks (T031-T037) can run in parallel
- **Phase 2E**: All utils (T038-T039) can run in parallel
- **Phase 4-6**: After Phase 3 completes, Phases 4, 5, 6 can start in parallel (if team capacity allows)
- **Phase 6A-6C**: Admin tabs can be developed in parallel (different files, no dependencies between tabs)

---

## Implementation Strategy

### MVP First (Phase 1 → 2 → 3 → 4)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: Auth (US4) → **Can demo login + role routing**
4. Complete Phase 4: Employee Missions (US1) → **Can demo full employee onboarding flow**
5. **STOP and VALIDATE**: Employee can login, view dashboard, start/submit missions

### Incremental Delivery

1. Setup + Foundational + Auth → **Auth MVP**
2. + Employee Missions → **Employee MVP** (demo-ready)
3. + Manager Review → **Manager MVP** (feedback loop works)
4. + Admin Tabs → **Full System MVP**
5. + Announcements + Polish → **Production Ready**

### Single Developer Strategy (Recommended)

1. Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8 → Phase 9
2. Follow priority order: P1 stories first, then P2, then P3
3. Commit after each task or logical group

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 85 |
| Phase 1 (Setup) | 6 tasks |
| Phase 2 (Foundational) | 33 tasks |
| Phase 3 (Auth P1) | 6 tasks |
| Phase 4 (Employee P1) | 6 tasks |
| Phase 5 (Manager P2) | 7 tasks |
| Phase 6 (Admin P2/P3) | 13 tasks |
| Phase 7 (Announcements P3) | 3 tasks |
| Phase 8 (Storage) | 3 tasks |
| Phase 9 (Polish) | 8 tasks |
| MVP Scope | Phase 1-4 (51 tasks) |
| Parallel Opportunities | ~40% of tasks can run in parallel |
| Edge Functions | 2 (create-user, export-data) |
| Supabase Tables | 12 |
| Frontend Pages | 15 tabs across 3 dashboards + login |
