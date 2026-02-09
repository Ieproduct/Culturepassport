<!--
  Sync Impact Report
  ==================
  Version change: 1.1.0 → 1.2.0
  Bump rationale: MINOR — finalized Supabase-only architecture (no custom backend server).

  Modified principles:
    - V. Scalable Data Architecture → confirmed Supabase-only (RLS + Edge Functions)
      Frontend calls Supabase directly via @supabase/supabase-js.
      Authorization via RLS policies. Edge Functions for admin-only operations.

  Modified sections:
    - Technology Stack: Backend → Supabase (no custom server),
      Deployment → Railway (frontend) + Supabase Cloud (backend),
      Edge Functions → Deno/TypeScript for createUser + export

  Removed sections: None

  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ compatible
    - .specify/templates/spec-template.md ✅ compatible
    - .specify/templates/tasks-template.md ✅ compatible

  Follow-up TODOs: None
-->

# Culturepassport Constitution

## Core Principles

### I. Clean Architecture

All code MUST follow clean architecture principles with strict separation of concerns.
Frontend and backend are independent deployable units with clearly defined boundaries.

- **Dependency Rule**: Dependencies MUST point inward — UI depends on services, services depend on domain models, domain models depend on nothing external.
- **Layer Isolation**: Business logic MUST NOT leak into UI components or database queries. Each layer (presentation, application, domain, infrastructure) MUST be independently testable.
- **No Circular Dependencies**: Import cycles between modules are forbidden. Enforce via linting rules.

### II. 8px Grid Design System

All spatial values (margin, padding, gap, sizing) MUST use the MUI `theme.spacing()` function based on an 8px base unit. Hard-coded pixel values for spacing are forbidden.

- **Spacing Function**: Use `theme.spacing(1)` = 8px, `theme.spacing(2)` = 16px, etc. Never write raw `px` values for layout spacing.
- **Consistency**: Every component MUST derive its spatial properties from the theme. This ensures visual consistency across the entire application and makes global adjustments trivial.
- **Typography & Icons**: Font sizes and icon sizes SHOULD align to the 4px sub-grid where practical, but MUST use theme tokens rather than literals.

### III. Component Composability

React components MUST be reusable, composable, and follow the single-responsibility principle.

- **Functional Components Only**: All components MUST be functional components using hooks. Class components are forbidden.
- **Props Over Internal State**: Components MUST accept configuration via props and expose callbacks. Minimize internal state; lift state to the nearest common ancestor or use context/state management.
- **Composition Over Inheritance**: Build complex UIs by composing small, focused components. Avoid prop drilling beyond 2 levels — use React Context or a state management solution instead.
- **MUI-First**: Use Material UI components as the base. Custom components MUST extend or wrap MUI primitives rather than building from scratch.

### IV. Responsive-First Design

The application MUST render correctly on desktop (1200px+), tablet (600–1199px), and mobile (<600px) breakpoints.

- **Breakpoint System**: Use MUI's built-in breakpoint system (`xs`, `sm`, `md`, `lg`, `xl`) via `theme.breakpoints`. Never hard-code media queries.
- **Mobile-First Approach**: Write base styles for mobile, then layer on complexity for larger screens using `theme.breakpoints.up()`.
- **Touch Targets**: Interactive elements MUST meet a minimum 44x44px touch target on mobile viewports.
- **Layout Fluidity**: Use MUI `Grid`, `Stack`, and `Box` with responsive props. Avoid fixed widths that break on smaller screens.

### V. Scalable Data Architecture (Supabase)

All data MUST be managed through Supabase (hosted PostgreSQL + Auth + Storage + Realtime). Frontend เรียก Supabase ตรงผ่าน `@supabase/supabase-js` — ไม่มี custom backend server.

- **Supabase Client**: Frontend ใช้ `@supabase/supabase-js` เรียก database, auth, storage ตรง. ไม่ต้องมี API server.
- **Row Level Security (RLS)**: ทุก table MUST เปิด RLS. Authorization ทำผ่าน SQL policies ตาม Permission Matrix. ห้ามปิด RLS.
- **Supabase Auth**: Authentication ใช้ Supabase Auth (email/password). Frontend ใช้ `supabase.auth.signInWithPassword()` / `signOut()` / `onAuthStateChange()`.
- **Supabase Storage**: File uploads ใช้ Supabase Storage buckets พร้อม access policies.
- **Edge Functions**: ใช้เฉพาะ operations ที่ต้องการ `service_role` key (เช่น admin สร้าง user, export ข้อมูลจำนวนมาก). เขียนเป็น Deno/TypeScript.
- **Migrations**: All schema changes MUST go through Supabase migrations (`supabase db diff` / `supabase migration new`). Manual DDL via Dashboard is forbidden for production.
- **Normalization**: Follow at least 3NF for transactional data. Denormalize deliberately and document the rationale.

### VI. Team Maintainability

Code MUST be written for the next developer, not just the current one. Clarity and convention adherence outweigh cleverness.

- **Consistent Structure**: Follow the project folder structure defined in the implementation plan. Files MUST be placed in their canonical locations — no ad-hoc directories.
- **Naming Conventions**: React components use PascalCase files and exports. Utilities and hooks use camelCase. Database tables and columns use snake_case. No abbreviations unless universally understood (e.g., `id`, `url`).
- **Explicit Over Implicit**: Prefer named exports over default exports. Prefer explicit type definitions over inferred types in public APIs. Configuration MUST be centralized, not scattered.
- **No Dead Code**: Unused imports, variables, functions, and files MUST be removed immediately. Do not comment out code for future reference — use version control.

## Technology Stack

**Frontend**: React 18+ (functional components, hooks), Material UI v5, TypeScript, Vite
**Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions) — ไม่มี custom server
**Database**: Supabase PostgreSQL (managed) + Row Level Security (RLS)
**Auth**: Supabase Auth (email/password) — session managed by `@supabase/supabase-js`
**Storage**: Supabase Storage (file uploads for mission deliverables)
**Edge Functions**: Deno/TypeScript — เฉพาะ admin createUser + data export
**Styling**: MUI `sx` prop and `styled()` API with `theme.spacing()` — no raw CSS pixel values for spacing
**Deployment**: Railway (frontend hosting) + Supabase Cloud (backend) — 3 environments: DEV, UAT, PROD
**Testing**: Vitest + React Testing Library (frontend), Supabase local dev for integration tests
**Build**: Vite

All dependencies MUST be pinned to exact versions in lock files. Upgrades require explicit review.

## Development Workflow

**Branching**: Feature branches off `main`. Branch names follow `###-feature-name` convention.
**Commits**: Atomic commits with conventional commit messages (`feat:`, `fix:`, `chore:`, `docs:`).
**Code Review**: All changes to `main` MUST go through pull request review. At least one approving review required.
**Linting**: ESLint + Prettier MUST pass before commit. Configure as pre-commit hooks.
**Type Safety**: TypeScript strict mode MUST be enabled. `any` type is forbidden except in explicitly justified escape hatches documented inline.

**Environments**:
- **DEV**: สำหรับ development — auto-deploy จาก `develop` branch. Supabase project: `culturepassport-dev`
- **UAT**: สำหรับ testing/QA — deploy จาก `staging` branch (manual trigger or PR merge). Supabase project: `culturepassport-uat`
- **PROD**: สำหรับ production — deploy จาก `main` branch (after UAT approval). Supabase project: `culturepassport-prod`

แต่ละ environment มี Supabase project แยก + Railway service แยก + environment variables แยก. ห้าม share database ข้าม environment.

## Governance

This constitution is the authoritative reference for all architectural and engineering decisions in the Culturepassport project. When a practice conflicts with this document, this document wins.

- **Amendments**: Any change to this constitution MUST be proposed via pull request, reviewed by at least one team member, and documented with a version bump and rationale.
- **Versioning**: Follow semantic versioning (MAJOR.MINOR.PATCH). MAJOR for principle removals or redefinitions, MINOR for new principles or material expansions, PATCH for clarifications and typo fixes.
- **Compliance**: Every pull request MUST be checked against the relevant principles before merge. The `/speckit.plan` Constitution Check gate enforces this.
- **Guidance**: For runtime development guidance, refer to `CLAUDE.md` and the `.specify/` directory.

**Version**: 1.2.0 | **Ratified**: 2026-02-09 | **Last Amended**: 2026-02-09
