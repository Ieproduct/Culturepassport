# Research: CulturePassport

**Phase**: 0 — Outline & Research
**Date**: 2026-02-09

## R1: Supabase Auth + Role Management

**Decision**: ใช้ Supabase Auth (email/password) + `profiles` table เก็บ role ผ่าน database trigger

**Rationale**:
- Supabase Auth จัดการ password hashing, session, token refresh ให้อัตโนมัติ
- Role เก็บใน `profiles.role` (ไม่ใช่ใน JWT claims) เพราะง่ายกว่าและเปลี่ยน role ได้ทันที
- สร้าง `profiles` row อัตโนมัติผ่าน `on_auth_user_created` trigger
- สร้าง helper function `get_my_role()` สำหรับ RLS policies

**Alternatives considered**:
- Supabase custom claims (app_metadata) → rejected: ต้อง Edge Function ทุกครั้งที่เปลี่ยน role, ซับซ้อนกว่า
- Custom JWT server → rejected: ขัด constitution (Supabase-only)

## R2: Row Level Security (RLS) Strategy

**Decision**: ใช้ RLS policies ตาม Permission Matrix พร้อม `get_my_role()` helper function

**Rationale**:
- RLS enforce authorization ที่ database level — ไม่ว่า client จะเรียกยังไง ก็ไม่เห็นข้อมูลที่ไม่มีสิทธิ์
- `get_my_role()` เป็น SQL function ที่ query role จาก profiles table 1 ครั้ง ใช้ใน policy ทุก table
- Manager scope: filter by `department_id` match กับ manager's department
- Employee scope: filter by `auth.uid() = user_id`

**Alternatives considered**:
- Application-level authorization (check role in frontend) → rejected: ไม่ปลอดภัย, client-side bypass ได้
- Supabase RPC functions แทน direct table access → rejected: overkill สำหรับ CRUD app

## R3: File Upload Strategy

**Decision**: ใช้ Supabase Storage bucket `mission-deliverables` + client-side upload ผ่าน `supabase.storage.from().upload()`

**Rationale**:
- Supabase Storage รองรับ policy-based access control คล้าย RLS
- Path convention: `mission-deliverables/{user_id}/{mission_id}/{filename}`
- Client upload ตรง (ไม่ต้องผ่าน server) — ลด latency
- File validation ทำ client-side: max 10MB, whitelist extensions (.pdf, .doc, .docx, .jpg, .png)

**Alternatives considered**:
- Upload ผ่าน Edge Function → rejected: เพิ่ม latency + complexity โดยไม่จำเป็น
- AWS S3 → rejected: ขัด constitution (Supabase-only)

## R4: Admin Create User (Edge Function)

**Decision**: ใช้ Supabase Edge Function `create-user` ที่เรียก `supabase.auth.admin.createUser()` ด้วย service_role key

**Rationale**:
- `auth.admin.createUser()` ต้องใช้ service_role key ซึ่งห้ามอยู่ฝั่ง frontend
- Edge Function เป็นทางเดียวที่ทำได้ใน Supabase-only architecture
- Frontend เรียก Edge Function ผ่าน `supabase.functions.invoke('create-user', { body })`
- Edge Function ตรวจสอบว่า caller เป็น admin ก่อนสร้าง user

**Alternatives considered**:
- ให้ user self-register → rejected: ขัด spec (admin สร้างเท่านั้น)
- Supabase Dashboard manual → rejected: ไม่ scalable

## R5: Data Export Strategy

**Decision**: Client-side export สำหรับ < 1,000 records, Edge Function สำหรับ > 1,000 records

**Rationale**:
- ข้อมูลน้อย: generate CSV/JSON ใน browser → download ทันที (ง่าย, ไม่ต้อง Edge Function)
- ข้อมูลมาก: Edge Function query ด้วย service_role → generate file → return download URL
- แบ่งตาม threshold 1,000 records เพื่อ balance UX กับ performance

**Alternatives considered**:
- Edge Function เสมอ → rejected: overkill สำหรับข้อมูลน้อย
- Client-side เสมอ → rejected: browser อาจ crash กับข้อมูลมาก

## R6: Cascading Filter Implementation

**Decision**: Shared `useCascadingFilter` hook + `CascadingFilter` component ใช้ร่วมทุก tab ที่ต้องการ

**Rationale**:
- Cascading filter (Company → Department → Position) ใช้ซ้ำใน 4+ tabs (Admin Users, Admin Assign, Admin Export, Manager Team)
- แยกเป็น reusable hook + component ตาม Constitution III (Component Composability)
- Hook จัดการ state + query Supabase, Component จัดการ UI (3 MUI Select dropdowns)

**Alternatives considered**:
- Duplicate filter logic แต่ละ tab → rejected: ขัด DRY principle
- Single global filter context → rejected: overkill, แต่ละ tab ต้อง independent state

## R7: State Management

**Decision**: React Context (AuthContext) + custom hooks per domain — ไม่ใช้ Redux/Zustand

**Rationale**:
- App นี้ไม่มี complex shared state ข้าม pages
- Auth state (session, user, role) → AuthContext
- Domain data (missions, users, etc.) → custom hooks ที่ query Supabase ตรง per page/tab
- MUI components จัดการ local UI state เอง (tabs, modals, forms)

**Alternatives considered**:
- Redux Toolkit → rejected: overkill, เพิ่ม boilerplate โดยไม่จำเป็น
- Zustand → rejected: ยังไม่ต้องการ, custom hooks เพียงพอ
- TanStack Query → อาจเพิ่มทีหลัง ถ้าต้องการ caching + optimistic updates

## R8: Deployment Strategy

**Decision**: Vite build → Railway (static site hosting), Supabase Cloud (managed backend)

**Rationale**:
- Railway รองรับ static site deployment จาก Vite build output (`dist/`)
- Supabase Cloud จัดการ database, auth, storage, edge functions
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` set ใน Railway
- No CORS issues — Supabase JS client handles this

**Alternatives considered**:
- Vercel → rejected: user ระบุ Railway
- Netlify → rejected: user ระบุ Railway
