# Quickstart: CulturePassport

## Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase CLI (`npm install -g supabase`)
- Supabase account (https://supabase.com)
- Railway account (https://railway.app)

## Environments

| Environment | Branch | Supabase Project | Railway Service | URL |
|-------------|--------|-----------------|-----------------|-----|
| **DEV** | `develop` | `culturepassport-dev` | `culturepassport-dev` | `dev.culturepassport.app` |
| **UAT** | `staging` | `culturepassport-uat` | `culturepassport-uat` | `uat.culturepassport.app` |
| **PROD** | `main` | `culturepassport-prod` | `culturepassport-prod` | `culturepassport.app` |

## 1. Clone & Install

```bash
cd frontend
npm install
```

## 2. Supabase Setup (3 projects)

```bash
# Login to Supabase
supabase login

# --- DEV ---
supabase link --project-ref DEV_PROJECT_REF
supabase db push
supabase functions deploy create-user
supabase functions deploy export-data

# --- UAT (switch project) ---
supabase link --project-ref UAT_PROJECT_REF
supabase db push
supabase functions deploy create-user
supabase functions deploy export-data

# --- PROD (switch project) ---
supabase link --project-ref PROD_PROJECT_REF
supabase db push
supabase functions deploy create-user
supabase functions deploy export-data

# Generate TypeScript types (from any linked project)
supabase gen types typescript --linked > src/types/database.ts
```

## 3. Environment Variables

### Local Development — `frontend/.env.local`

```env
VITE_SUPABASE_URL=https://DEV_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=dev-anon-key-here
VITE_ENVIRONMENT=dev
```

### Railway (set per service)

| Variable | DEV | UAT | PROD |
|----------|-----|-----|------|
| `VITE_SUPABASE_URL` | `https://dev-ref.supabase.co` | `https://uat-ref.supabase.co` | `https://prod-ref.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `dev-anon-key` | `uat-anon-key` | `prod-anon-key` |
| `VITE_ENVIRONMENT` | `dev` | `uat` | `prod` |

## 4. Seed Data (DEV only)

```bash
supabase link --project-ref DEV_PROJECT_REF
supabase db reset  # Runs migrations + seed.sql
```

> seed.sql สร้าง test accounts + sample data — ใช้เฉพาะ DEV เท่านั้น ห้ามรันกับ UAT/PROD

## 5. Run Development Server

```bash
cd frontend
npm run dev
```

Open http://localhost:5173

## 6. Deploy Flow

```
feature/xxx → develop (auto-deploy DEV)
                 ↓
           PR → staging (auto-deploy UAT)
                 ↓
        approval → main (manual deploy PROD)
```

### Railway Setup

```bash
# DEV service: connect to `develop` branch, auto-deploy on push
# UAT service: connect to `staging` branch, auto-deploy on push
# PROD service: connect to `main` branch, manual deploy trigger
```

### Migration Deploy

```bash
# DEV: rapid iteration
supabase link --project-ref DEV_PROJECT_REF
supabase db push

# UAT: after code review
supabase link --project-ref UAT_PROJECT_REF
supabase db push

# PROD: after UAT sign-off
supabase link --project-ref PROD_PROJECT_REF
supabase db push
```

## Default Dev Accounts (DEV seed.sql only)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@culturepassport.dev | password123 |
| Manager | manager@culturepassport.dev | password123 |
| Employee | employee@culturepassport.dev | password123 |

> ⚠️ Accounts เหล่านี้มีเฉพาะ DEV — UAT/PROD ต้องสร้างผ่าน Admin Dashboard
