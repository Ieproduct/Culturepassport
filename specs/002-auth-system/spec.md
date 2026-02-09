# Feature Specification: Authentication & Authorization System

**Feature Branch**: `002-auth-system`
**Created**: 2026-02-09
**Status**: Draft
**Input**: ระบบ Authentication ผ่าน Supabase Auth, Login/Logout, Role-Based Access Control (RLS), Route Guards, Session Management, Deploy บน Railway

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Login with Email & Password (Priority: P1)

ผู้ใช้ทุกคนเข้าสู่ระบบด้วย email + password ระบบตรวจสอบ credentials และออก session token (JWT) หากสำเร็จ ระบบ redirect ไปยัง dashboard ตาม role ของผู้ใช้

**Why this priority**: เป็น entry point ของทุก feature — ถ้า login ไม่ได้ ไม่มี feature ไหนใช้งานได้เลย

**Independent Test**: สร้าง account 3 roles (admin, manager, employee), ทดสอบ login แต่ละ role → verify redirect ไปยัง dashboard ที่ถูกต้อง

**Acceptance Scenarios**:

1. **Given** หน้า Login, **When** ผู้ใช้กรอก email + password ที่ถูกต้อง (role = admin), **Then** redirect ไป `/admin` dashboard
2. **Given** หน้า Login, **When** ผู้ใช้กรอก email + password ที่ถูกต้อง (role = manager), **Then** redirect ไป `/manager` dashboard
3. **Given** หน้า Login, **When** ผู้ใช้กรอก email + password ที่ถูกต้อง (role = employee), **Then** redirect ไป `/employee` dashboard
4. **Given** หน้า Login, **When** ผู้ใช้กรอก email ที่ไม่มีในระบบ, **Then** แสดง error "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
5. **Given** หน้า Login, **When** ผู้ใช้กรอก password ผิด, **Then** แสดง error "อีเมลหรือรหัสผ่านไม่ถูกต้อง" (ไม่บอกว่าผิดอันไหน — security best practice)
6. **Given** หน้า Login, **When** ผู้ใช้ไม่กรอก email หรือ password, **Then** ปุ่ม Login disable และแสดง validation "กรุณากรอกข้อมูลให้ครบ"

---

### User Story 2 — Route Guards & Role-Based Redirect (Priority: P1)

ระบบป้องกันไม่ให้ผู้ใช้เข้าถึง route ที่ไม่ตรงกับ role ของตัวเอง ผู้ใช้ที่ไม่ได้ login จะถูก redirect ไปหน้า Login ผู้ใช้ที่ login แล้วแต่พยายามเข้า route ของ role อื่นจะถูก redirect กลับ dashboard ของตัวเอง

**Why this priority**: P1 — เป็น security requirement พื้นฐาน ถ้าไม่มี route guard ข้อมูลจะรั่วไหลข้าม role

**Independent Test**: Login เป็น employee แล้วพิมพ์ URL `/admin` ใน address bar → verify ว่าถูก redirect กลับ `/employee`

**Acceptance Scenarios**:

1. **Given** ผู้ใช้ไม่ได้ login, **When** เข้า `/admin`, **Then** redirect ไป `/login`
2. **Given** ผู้ใช้ไม่ได้ login, **When** เข้า `/manager`, **Then** redirect ไป `/login`
3. **Given** ผู้ใช้ไม่ได้ login, **When** เข้า `/employee`, **Then** redirect ไป `/login`
4. **Given** login เป็น employee, **When** เข้า `/admin`, **Then** redirect ไป `/employee`
5. **Given** login เป็น employee, **When** เข้า `/manager`, **Then** redirect ไป `/employee`
6. **Given** login เป็น manager, **When** เข้า `/admin`, **Then** redirect ไป `/manager`
7. **Given** login เป็น admin, **When** เข้า `/employee`, **Then** ยังคงเข้าได้ (admin สามารถ view ทุก route)

---

### User Story 3 — Logout (Priority: P1)

ผู้ใช้กด Logout → ระบบ clear session/token → redirect ไปหน้า Login

**Why this priority**: P1 — เป็น security requirement พื้นฐาน ผู้ใช้ต้อง logout ได้

**Independent Test**: Login → กด Logout → verify redirect ไป Login → พยายามเข้า dashboard ด้วย URL → verify ถูก redirect ไป Login

**Acceptance Scenarios**:

1. **Given** ผู้ใช้ login อยู่, **When** กดปุ่ม "ออกจากระบบ" ใน Navbar, **Then** session ถูก clear และ redirect ไป `/login`
2. **Given** ผู้ใช้ logout แล้ว, **When** กดปุ่ม Back ใน browser, **Then** ไม่สามารถกลับไปหน้า dashboard ได้ (redirect ไป Login)
3. **Given** ผู้ใช้ logout แล้ว, **When** เข้า protected route ด้วย URL ตรง, **Then** redirect ไป `/login`

---

### User Story 4 — Session Persistence (Priority: P2)

ผู้ใช้ login แล้ว ปิด browser แล้วเปิดใหม่ → ยังคง login อยู่ (ถ้า token ยังไม่หมดอายุ) ถ้า token หมดอายุ → redirect ไป Login

**Why this priority**: P2 — เพิ่ม UX ดีขึ้น ไม่ต้อง login ใหม่ทุกครั้ง แต่ระบบยังใช้งานได้ถ้าไม่มี feature นี้

**Independent Test**: Login → ปิด tab → เปิด tab ใหม่เข้า dashboard → verify ยังอยู่ในหน้า dashboard

**Acceptance Scenarios**:

1. **Given** ผู้ใช้ login แล้วและ token ยังไม่หมดอายุ, **When** refresh หน้า, **Then** ยังคงอยู่ใน dashboard ตาม role
2. **Given** ผู้ใช้ login แล้วและ token หมดอายุ, **When** เข้า protected route, **Then** redirect ไป `/login` พร้อม message "Session หมดอายุ กรุณา Login ใหม่"
3. **Given** ผู้ใช้ login แล้ว, **When** ปิด browser แล้วเปิดใหม่ (token ยังมีอายุ), **Then** เข้า dashboard ได้โดยไม่ต้อง login ใหม่

---

### User Story 5 — Navbar with User Info (Priority: P2)

ทุก role เห็น Navbar ด้านบนแสดงชื่อผู้ใช้, role badge, avatar, และปุ่ม Logout ข้อมูลดึงจาก session ของผู้ใช้ที่ login

**Why this priority**: P2 — เป็น navigation element ที่ทุกหน้าใช้ร่วมกัน

**Independent Test**: Login แต่ละ role → verify Navbar แสดงชื่อ, role, avatar ถูกต้อง

**Acceptance Scenarios**:

1. **Given** login เป็น admin ชื่อ "สมชาย", **When** อยู่ในหน้าใดก็ตาม, **Then** Navbar แสดง "สมชาย" + badge "Admin" + avatar
2. **Given** login เป็น employee, **When** กด avatar ใน Navbar, **Then** dropdown menu แสดง "ข้อมูลส่วนตัว" และ "ออกจากระบบ"
3. **Given** อยู่ในหน้าใดก็ตาม, **When** กด logo/brand ใน Navbar, **Then** redirect ไป dashboard หลักของ role นั้น

---

### Edge Cases

- Token หมดอายุระหว่างใช้งาน (mid-session expiry) → แสดง dialog "Session หมดอายุ" + redirect ไป Login หลังกด OK
- Login พร้อมกัน 2 devices → อนุญาตให้ login ได้หลาย device (ไม่ force logout)
- Brute force login (กรอกผิดมากกว่า 5 ครั้งใน 15 นาที) → Lock account ชั่วคราว 15 นาที พร้อมแสดง "บัญชีถูกล็อค กรุณาลองใหม่ภายหลัง"
- Email case sensitivity → ทำ lowercase ก่อนเปรียบเทียบเสมอ (User@Email.com = user@email.com)
- ผู้ใช้ที่ status = inactive พยายาม login → แสดง "บัญชีถูกระงับ กรุณาติดต่อผู้ดูแลระบบ"

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate users via **Supabase Auth** (email/password) — ใช้ `supabase.auth.signInWithPassword()`
- **FR-002**: System MUST ใช้ Supabase session management (auto refresh token) — ไม่ต้อง implement JWT เอง
- **FR-003**: System MUST เก็บ session ผ่าน Supabase client (localStorage auto-managed by `@supabase/supabase-js`)
- **FR-004**: System MUST enforce role-based route guards สำหรับ 3 roles: admin, manager, employee — role ดึงจาก `profiles` table
- **FR-005**: System MUST redirect unauthenticated users ไปหน้า Login — ใช้ `supabase.auth.onAuthStateChange()` listener
- **FR-006**: System MUST redirect users ที่เข้า route ผิด role กลับไป dashboard ของตัวเอง
- **FR-007**: System MUST provide Logout functionality ใช้ `supabase.auth.signOut()` → clear session → redirect
- **FR-008**: Password hashing จัดการโดย Supabase Auth (bcrypt automatic) — ไม่ต้อง implement เอง
- **FR-009**: Rate limiting จัดการโดย Supabase Auth built-in — ไม่ต้อง implement เอง
- **FR-010**: System MUST display Navbar component ทุกหน้า (ยกเว้นหน้า Login) แสดงชื่อ, role, avatar, ปุ่ม Logout
- **FR-011**: System MUST handle session expiry gracefully — `onAuthStateChange('TOKEN_REFRESHED')` + redirect เมื่อ `SIGNED_OUT`
- **FR-012**: Admin สร้าง user ผ่าน **Supabase Edge Function** ที่ใช้ `supabase.auth.admin.createUser()` (ต้อง service_role key)
- **FR-013**: เมื่อสร้าง user ใน Supabase Auth → trigger สร้าง row ใน `profiles` table ด้วย database function/trigger

### Key Entities

- **Supabase Auth User** (`auth.users`): Managed by Supabase — id (UUID), email, encrypted_password, created_at, last_sign_in_at. ไม่ต้องจัดการเอง.
- **Profile** (`public.profiles`): id (FK → auth.users.id), full_name, email, role (admin/manager/employee), company_id, department_id, position_id, avatar_url, probation_start, probation_end, status (active/inactive), created_at, updated_at. สร้างอัตโนมัติผ่าน database trigger เมื่อ auth.users มี row ใหม่.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Login flow ใช้เวลาไม่เกิน 3 วินาทีจาก submit ถึง dashboard render
- **SC-002**: Route guards block 100% ของ unauthorized access attempts
- **SC-003**: Logout clear session สมบูรณ์ — ไม่สามารถกลับไปหน้าเดิมด้วยปุ่ม Back ได้
- **SC-004**: Session persist ข้าม page refresh ได้สำเร็จ 100%
- **SC-005**: Brute force protection lock account หลัง 5 failed attempts
