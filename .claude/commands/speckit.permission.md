---
description: CulturePassport Permission Matrix — role-based access, CRUD, UI actions, data scope, mission flow, Supabase RLS policies.
---

# CulturePassport — Permission Matrix

**Version**: 1.0.0
**Created**: 2026-02-09
**Source**: Figma Make — Culture Passport BPI (DwBadLp2GuZPoIcaFYrLmx)

> เอกสารนี้อธิบาย สิทธิ์การเข้าถึงและการกระทำ ของแต่ละ Role ในระบบ CulturePassport
> ใช้เป็นเอกสาร reference สำหรับทีมพัฒนาในการ implement Route Guards, Supabase RLS, และ UI Visibility
> **Single source of truth** — ทุก spec และ implementation MUST follow เอกสารนี้

---

## 1. Roles ในระบบ

| Role | คำอธิบาย | จำนวน Tabs | Header Color |
|------|---------|-----------|--------------|
| **Admin** | ผู้ดูแลระบบ — จัดการทุกอย่าง | 10 tabs | Red Gradient |
| **Manager** | หัวหน้าทีม — ดูแลและ review พนักงานในทีม | 2 tabs | Blue Gradient |
| **Employee** | พนักงานใหม่ — ทำ missions, ดู roadmap | 3 tabs | Green Gradient |

---

## 2. Route Access Matrix

| Route | ไม่ได้ Login | Employee | Manager | Admin |
|-------|-------------|----------|---------|-------|
| `/login` | ✅ เข้าได้ | ↩️ redirect → `/employee` | ↩️ redirect → `/manager` | ↩️ redirect → `/admin` |
| `/employee` | ↩️ redirect → `/login` | ✅ เข้าได้ | ↩️ redirect → `/manager` | ✅ เข้าได้ |
| `/manager` | ↩️ redirect → `/login` | ↩️ redirect → `/employee` | ✅ เข้าได้ | ✅ เข้าได้ |
| `/admin` | ↩️ redirect → `/login` | ↩️ redirect → `/employee` | ↩️ redirect → `/manager` | ✅ เข้าได้ |

> **หมายเหตุ**: Admin สามารถเข้าถึงทุก route ได้ (view-only สำหรับ route ของ role อื่น)

---

## 3. Feature Access Matrix — ภาพรวมแต่ละ Tab

### 3.1 Admin Dashboard (10 Tabs)

| Tab | Feature | Admin | Manager | Employee |
|-----|---------|-------|---------|----------|
| **Overview** | ดู stats cards (จำนวนพนักงาน, missions, completion rate, pending) | ✅ | ❌ | ❌ |
| **Users** | ดูรายชื่อผู้ใช้ทั้งระบบ | ✅ | ❌ | ❌ |
| **Missions** | จัดการ Mission templates | ✅ | ❌ | ❌ |
| **Assign** | มอบหมาย Mission ให้พนักงาน | ✅ | ❌ | ❌ |
| **Exams** | จัดการข้อสอบ | ✅ | ❌ | ❌ |
| **Master Data** | จัดการข้อมูลหลัก (บริษัท, แผนก, ตำแหน่ง, หมวดหมู่) | ✅ | ❌ | ❌ |
| **Create Account** | สร้างบัญชีผู้ใช้ใหม่ | ✅ | ❌ | ❌ |
| **Roadmap** | จัดการ Roadmap Milestones | ✅ | ❌ | ❌ |
| **Announcements** | จัดการประกาศ | ✅ | ❌ | ❌ |
| **Export** | ส่งออกข้อมูล CSV/JSON | ✅ | ❌ | ❌ |

### 3.2 Manager Dashboard (2 Tabs)

| Tab | Feature | Admin | Manager | Employee |
|-----|---------|-------|---------|----------|
| **Team Overview** | ดูภาพรวมสมาชิกในทีม (cards + progress) | ✅ (view) | ✅ | ❌ |
| **Pending Reviews** | Review missions ที่ถูก submit | ✅ (view) | ✅ | ❌ |

### 3.3 Employee Dashboard (3 Tabs)

| Tab | Feature | Admin | Manager | Employee |
|-----|---------|-------|---------|----------|
| **Overview** | ดู progress ส่วนตัว + probation countdown | ✅ (view) | ❌ | ✅ |
| **Missions** | ดูและทำ missions ที่ถูก assign | ✅ (view) | ❌ | ✅ |
| **Roadmap** | ดู roadmap timeline | ✅ (view) | ❌ | ✅ |

---

## 4. CRUD Permission Matrix — แต่ละ Entity

> **C** = Create | **R** = Read | **U** = Update | **D** = Delete (soft) | **—** = ไม่มีสิทธิ์

### 4.1 Profile (User)

| Action | Admin | Manager | Employee |
|--------|-------|---------|----------|
| Create user account | ✅ C | — | — |
| Read all users | ✅ R (ทั้งระบบ) | ✅ R (เฉพาะทีมตัวเอง) | ✅ R (เฉพาะตัวเอง) |
| Update user info/role/status | ✅ U | — | — |
| Delete (deactivate) user | ✅ D | — | — |
| View user progress | ✅ R (ทุกคน) | ✅ R (เฉพาะทีม) | ✅ R (เฉพาะตัวเอง) |

### 4.2 Mission (Template)

| Action | Admin | Manager | Employee |
|--------|-------|---------|----------|
| Create mission | ✅ C | — | — |
| Read missions | ✅ R (ทั้งหมด) | ✅ R (view ที่ assign ให้ทีม) | ✅ R (เฉพาะที่ถูก assign) |
| Update mission | ✅ U | — | — |
| Delete mission | ✅ D | — | — |

### 4.3 UserMission (Assignment)

| Action | Admin | Manager | Employee |
|--------|-------|---------|----------|
| Assign mission → employee | ✅ C | — | — |
| Read assignments | ✅ R (ทั้งหมด) | ✅ R (เฉพาะทีม) | ✅ R (เฉพาะตัวเอง) |
| Start mission (status → in_progress) | — | — | ✅ U (ตัวเอง) |
| Submit mission (status → submitted) | — | — | ✅ U (ตัวเอง) |
| Review/Feedback (status → approved/rejected) | — | ✅ U (เฉพาะทีม) | — |
| Cancel assignment | ✅ D | — | — |

### 4.4 ExamTemplate

| Action | Admin | Manager | Employee |
|--------|-------|---------|----------|
| Create exam | ✅ C | — | — |
| Read exams | ✅ R | — | — |
| Update exam | ✅ U | — | — |
| Delete exam | ✅ D | — | — |
| View exam scores (ของทีม) | ✅ R (ทุกคน) | ✅ R (เฉพาะทีม) | ✅ R (เฉพาะตัวเอง) |

### 4.5 Company / Department / Position (Master Data)

| Action | Admin | Manager | Employee |
|--------|-------|---------|----------|
| Create | ✅ C | — | — |
| Read | ✅ R | ✅ R (via filters) | ✅ R (เฉพาะของตัวเอง) |
| Update | ✅ U | — | — |
| Delete | ✅ D | — | — |

### 4.6 Category

| Action | Admin | Manager | Employee |
|--------|-------|---------|----------|
| Create | ✅ C | — | — |
| Read | ✅ R | ✅ R (via mission display) | ✅ R (via mission display) |
| Update | ✅ U | — | — |
| Delete | ✅ D | — | — |

### 4.7 RoadmapMilestone

| Action | Admin | Manager | Employee |
|--------|-------|---------|----------|
| Create | ✅ C | — | — |
| Read | ✅ R | — | ✅ R (view timeline) |
| Update | ✅ U | — | — |
| Delete | ✅ D | — | — |

### 4.8 Announcement

| Action | Admin | Manager | Employee |
|--------|-------|---------|----------|
| Create | ✅ C | — | — |
| Read | ✅ R (ทั้งหมด) | ✅ R (active only, popup) | ✅ R (active only, popup) |
| Update | ✅ U | — | — |
| Delete | ✅ D | — | — |
| Dismiss popup | — | ✅ (ตัวเอง) | ✅ (ตัวเอง) |

---

## 5. Action Permission Matrix — UI Actions แต่ละ Role

### 5.1 Admin Actions (14 actions)

| Action | UI Element | Tab | คำอธิบาย |
|--------|-----------|-----|---------|
| View system stats | Stats Cards (4 ใบ) | Overview | ดูจำนวนพนักงาน, missions, completion rate, pending |
| Filter users | Cascading Filters (บริษัท → แผนก → ตำแหน่ง) + Search | Users | กรองรายชื่อผู้ใช้ |
| Edit user | ปุ่ม "แก้ไข" ในตาราง → Modal | Users | แก้ไข role, status, ข้อมูลส่วนตัว |
| Delete user | ปุ่ม "ลบ" ในตาราง → Confirm Dialog | Users | Soft delete (status → inactive) |
| Create mission | ปุ่ม "สร้าง Mission ใหม่" → Modal | Missions | กรอก title, description, category, duration |
| Edit mission | ปุ่ม "แก้ไข" → Modal | Missions | แก้ไขข้อมูล mission |
| Delete mission | ปุ่ม "ลบ" → Confirm Dialog | Missions | Soft delete + cancel related UserMissions |
| Assign missions | Checkboxes + ปุ่ม "มอบหมาย" | Assign | เลือก mission + employees → สร้าง UserMission |
| Create exam | ปุ่ม "สร้างข้อสอบใหม่" → Modal | Exams | สร้าง exam + เพิ่มคำถาม 3 ประเภท |
| Manage master data | ปุ่ม "เพิ่ม" ใน 4 sections | Master Data | CRUD Company, Department, Position, Category |
| Create account | Form → ปุ่ม "สร้างบัญชี" | Create Account | สร้าง user ใหม่ + role + org assignment |
| Manage milestones | ปุ่ม "เพิ่ม Milestone" → Modal | Roadmap | CRUD milestones |
| Manage announcements | ปุ่ม "สร้างประกาศ" → Modal | Announcements | CRUD + active/inactive toggle |
| Export data | ปุ่ม "Export CSV" / "Export JSON" | Export | Download filtered data |

### 5.2 Manager Actions (7 actions)

| Action | UI Element | Tab | คำอธิบาย |
|--------|-----------|-----|---------|
| View team stats | Stats Cards (3 ใบ) | Team Overview | ดูจำนวนสมาชิก, รอ review, completion rate |
| Filter team members | Cascading Filters (บริษัท → แผนก → ตำแหน่ง) | Team Overview | กรองสมาชิกในทีม |
| View member progress | Member Cards (progress bar + probation badge) | Team Overview | ดูความคืบหน้าแต่ละคน |
| Review mission | ปุ่ม "Review" → Feedback Modal | Pending Reviews | ให้คะแนน (slider 1-10) + comment |
| Submit feedback | ปุ่ม "ส่ง Feedback" ใน Modal | Pending Reviews | อัปเดต status → approved/rejected |
| View exam scores | ปุ่ม "ดูคะแนนสอบ" → Exam Score Modal | Team Overview | ดูชื่อสอบ, คะแนน, ผ่าน/ไม่ผ่าน |
| Dismiss announcement | ปุ่ม "ปิด" ใน Popup | All | ปิด popup ประกาศ |

### 5.3 Employee Actions (8 actions)

| Action | UI Element | Tab | คำอธิบาย |
|--------|-----------|-----|---------|
| View progress overview | Progress Bar + Stats Cards | Overview | ดู completion %, probation countdown, สถิติ |
| View probation countdown | Countdown Display | Overview | ดูจำนวนวันเหลือของช่วงทดลองงาน |
| Start mission | ปุ่ม "เริ่มทำ" บน Mission Card | Missions | เปลี่ยน status → in_progress + เปิด detail modal |
| Submit mission | ปุ่ม "ส่งงาน" ใน Mission Modal | Missions | แนบไฟล์ + เปลี่ยน status → submitted |
| Attach file | File Upload ใน Mission Modal | Missions | Upload deliverable via Supabase Storage |
| View mission detail | กดที่ Mission Card → Modal | Missions | ดูรายละเอียด, สถานะ, feedback |
| View roadmap | Timeline Display | Roadmap | ดู vertical timeline ของ milestones |
| Dismiss announcement | ปุ่ม "ปิด" ใน Popup | All | ปิด popup ประกาศ |

---

## 6. Data Scope Matrix — ขอบเขตข้อมูลที่แต่ละ Role เห็น

| Data | Admin | Manager | Employee |
|------|-------|---------|----------|
| **User profiles** | ทุกคนในระบบ | เฉพาะสมาชิกในแผนกตัวเอง | เฉพาะตัวเอง |
| **Mission templates** | ทั้งหมด (รวม deleted) | เฉพาะที่ assign ให้ทีม | เฉพาะที่ถูก assign ให้ตัวเอง |
| **UserMission records** | ทั้งหมด | เฉพาะของสมาชิกในทีม | เฉพาะของตัวเอง |
| **Exam templates** | ทั้งหมด | — | — |
| **Exam scores** | ของทุกคน | ของสมาชิกในทีม | ของตัวเอง |
| **Master data** | ทั้งหมด (CRUD) | ทั้งหมด (Read via filters) | เฉพาะของตัวเอง (Read) |
| **Roadmap milestones** | ทั้งหมด (CRUD) | — | ทั้งหมด (Read) |
| **Announcements** | ทั้งหมด (CRUD) | Active only (Read) | Active only (Read) |
| **Export data** | ทั้งหมด (with filters) | — | — |

---

## 7. Cascading Filter Usage ตาม Role

| Filter Component | Admin (Users tab) | Admin (Assign tab) | Admin (Export tab) | Manager (Team tab) |
|-----------------|-------------------|--------------------|--------------------|-------------------|
| บริษัท (Company) | ✅ | ✅ | ✅ | ✅ |
| แผนก (Department) | ✅ (filtered by company) | ✅ (filtered by company) | ✅ (filtered by company) | ✅ (filtered by company) |
| ตำแหน่ง (Position) | ✅ (filtered by dept) | ✅ (filtered by dept) | ✅ (filtered by dept) | ✅ (filtered by dept) |
| Search text | ✅ | ✅ | — | — |

> Employee ไม่มี cascading filters เพราะเห็นแค่ข้อมูลตัวเอง

---

## 8. Mission Status Flow & Role Permissions

```
┌──────────────┐     Employee กด      ┌──────────────┐     Employee กด      ┌──────────────┐
│  not_started │ ──── "เริ่มทำ" ────→ │  in_progress │ ──── "ส่งงาน" ────→ │  submitted   │
└──────────────┘                       └──────────────┘                       └──────┬───────┘
                                                                                     │
                                                                          Manager กด "Review"
                                                                                     │
                                                                        ┌────────────┴────────────┐
                                                                        ▼                         ▼
                                                                ┌──────────────┐          ┌──────────────┐
                                                                │   approved   │          │   rejected   │
                                                                └──────────────┘          └──────┬───────┘
                                                                                                 │
                                                                                      Employee แก้ไข + ส่งใหม่
                                                                                                 │
                                                                                                 ▼
                                                                                         ┌──────────────┐
                                                                                         │  submitted   │
                                                                                         └──────────────┘

    Admin กด "ลบ Mission" (ขณะมี assignments) → UserMission status → cancelled
```

| Status Transition | ใครทำได้ | Action |
|-------------------|---------|--------|
| → not_started | Admin (via assign) | มอบหมาย mission |
| not_started → in_progress | Employee | กด "เริ่มทำ" |
| in_progress → submitted | Employee | กด "ส่งงาน" + แนบไฟล์ |
| submitted → approved | Manager | กด "อนุมัติ" + ให้ feedback |
| submitted → rejected | Manager | กด "ส่งกลับแก้ไข" + ให้ feedback |
| rejected → submitted | Employee | แก้ไข + ส่งใหม่ |
| any → cancelled | Admin | ลบ mission ที่มี assignments |

---

## 9. Shared Components — ใช้ร่วมทุก Role

| Component | Admin | Manager | Employee | คำอธิบาย |
|-----------|-------|---------|----------|---------|
| **Navbar** | ✅ | ✅ | ✅ | ชื่อ + role badge + avatar + logout (Supabase Auth signOut) |
| **Announcement Popup** | ❌ (จัดการใน tab) | ✅ (view + dismiss) | ✅ (view + dismiss) | Popup แสดงประกาศล่าสุด |
| **Footer** | ✅ | ✅ | ✅ | Copyright + version |
| **Cascading Filters** | ✅ (หลาย tabs) | ✅ (team tab) | ❌ | Filter บริษัท → แผนก → ตำแหน่ง |

---

## 10. Supabase RLS Policies

> Backend ใช้ **Supabase** — ไม่มี custom API server
> Authorization ทำผ่าน **RLS policies** บน PostgreSQL โดยตรง
> Auth ใช้ **Supabase Auth** (email/password)
> File uploads ใช้ **Supabase Storage**
> Deploy frontend บน **Railway**

### 10.1 Auth (Supabase Auth)

| Action | Access |
|--------|--------|
| Sign up | Admin only (via `supabase.auth.admin.createUser()` — Edge Function) |
| Sign in (email/password) | Public |
| Sign out | Authenticated |
| Get session | Authenticated |

### 10.2 RLS Policy Matrix ต่อ Table

> `auth.uid()` = current user ID from Supabase Auth session
> `get_my_role()` = helper function ดึง role จาก profiles table

**profiles**
| Operation | Policy | คำอธิบาย |
|-----------|--------|---------|
| SELECT | `get_my_role() = 'admin'` → ทุก row | Admin เห็นทุกคน |
| SELECT | `get_my_role() = 'manager'` → เฉพาะ department เดียวกัน | Manager เห็นแค่ทีม |
| SELECT | `auth.uid() = id` | Employee เห็นแค่ตัวเอง |
| INSERT | `get_my_role() = 'admin'` | Admin สร้าง user |
| UPDATE | `get_my_role() = 'admin'` | Admin แก้ไข user |
| DELETE | `get_my_role() = 'admin'` | Admin ลบ (soft delete) |

**missions**
| Operation | Policy |
|-----------|--------|
| SELECT | `get_my_role() = 'admin'` → ทุก row |
| SELECT | `get_my_role() = 'employee'` → เฉพาะที่ถูก assign (via user_missions join) |
| INSERT | `get_my_role() = 'admin'` |
| UPDATE | `get_my_role() = 'admin'` |
| DELETE | `get_my_role() = 'admin'` |

**user_missions**
| Operation | Policy |
|-----------|--------|
| SELECT | `get_my_role() = 'admin'` → ทุก row |
| SELECT | `get_my_role() = 'manager'` → เฉพาะ user ใน department เดียวกัน |
| SELECT | `auth.uid() = user_id` → Employee เห็นของตัวเอง |
| INSERT | `get_my_role() = 'admin'` (assign) |
| UPDATE | `auth.uid() = user_id` AND status transition valid (employee: start/submit) |
| UPDATE | `get_my_role() = 'manager'` AND user ใน department เดียวกัน (review/feedback) |

**exam_templates**
| Operation | Policy |
|-----------|--------|
| SELECT | `get_my_role() = 'admin'` |
| INSERT | `get_my_role() = 'admin'` |
| UPDATE | `get_my_role() = 'admin'` |
| DELETE | `get_my_role() = 'admin'` |

**exam_scores**
| Operation | Policy |
|-----------|--------|
| SELECT | `get_my_role() = 'admin'` → ทุก row |
| SELECT | `get_my_role() = 'manager'` → เฉพาะ department เดียวกัน |
| SELECT | `auth.uid() = user_id` |

**companies / departments / positions**
| Operation | Policy |
|-----------|--------|
| SELECT | Authenticated (ทุก role, for cascading filters) |
| INSERT | `get_my_role() = 'admin'` |
| UPDATE | `get_my_role() = 'admin'` |
| DELETE | `get_my_role() = 'admin'` |

**categories**
| Operation | Policy |
|-----------|--------|
| SELECT | Authenticated (ทุก role) |
| INSERT | `get_my_role() = 'admin'` |
| UPDATE | `get_my_role() = 'admin'` |
| DELETE | `get_my_role() = 'admin'` |

**roadmap_milestones**
| Operation | Policy |
|-----------|--------|
| SELECT | `get_my_role() = 'admin'` OR `get_my_role() = 'employee'` |
| INSERT | `get_my_role() = 'admin'` |
| UPDATE | `get_my_role() = 'admin'` |
| DELETE | `get_my_role() = 'admin'` |

**announcements**
| Operation | Policy |
|-----------|--------|
| SELECT | `get_my_role() = 'admin'` → ทุก row |
| SELECT | `get_my_role() IN ('manager','employee')` → เฉพาะ is_active = true |
| INSERT | `get_my_role() = 'admin'` |
| UPDATE | `get_my_role() = 'admin'` |
| DELETE | `get_my_role() = 'admin'` |

**announcement_dismissals**
| Operation | Policy |
|-----------|--------|
| SELECT | `auth.uid() = user_id` |
| INSERT | `auth.uid() = user_id` (dismiss) |

### 10.3 Supabase Storage Buckets

| Bucket | Access | คำอธิบาย |
|--------|--------|---------|
| `mission-deliverables` | Employee: upload ของตัวเอง, Manager: read ของทีม, Admin: read ทั้งหมด | ไฟล์ส่งงาน |
| `avatars` | Owner: upload/update, Authenticated: read | รูป profile |

### 10.4 Supabase Edge Functions

| Function | Trigger | คำอธิบาย |
|----------|---------|---------|
| `create-user` | Admin เรียกผ่าน UI | ใช้ `supabase.auth.admin.createUser()` (ต้อง service_role key) |
| `export-data` | Admin กด Export | Generate CSV/JSON ฝั่ง server (หลีกเลี่ยง browser memory limit) |
