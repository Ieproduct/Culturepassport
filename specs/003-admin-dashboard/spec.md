# Feature Specification: Admin Dashboard

**Feature Branch**: `003-admin-dashboard`
**Created**: 2026-02-09
**Status**: Draft
**Backend**: Supabase (RLS + Edge Functions) — ไม่มี custom server

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Admin Overview (Priority: P1)

Admin login เห็นหน้า Overview เป็น landing page — red gradient header + 4 stats cards: จำนวนพนักงาน, จำนวน missions, อัตราสำเร็จ (%), จำนวนรอดำเนินการ

**Why this priority**: P1 — หน้าแรกที่ admin เห็น ให้ภาพรวมสถานะทั้งระบบ

**Independent Test**: Login admin → verify 4 stats cards แสดงตัวเลขถูกต้องจาก Supabase

**Acceptance Scenarios**:

1. **Given** admin login สำเร็จ, **When** เข้า dashboard, **Then** เห็น red gradient header + "แดชบอร์ดผู้ดูแลระบบ"
2. **Given** ระบบมี 50 พนักงาน, 20 missions, 60% completion, 8 pending, **When** เปิด overview, **Then** cards แสดง 50, 20, 60%, 8
3. **Given** admin อยู่ overview, **When** กด tab อื่น, **Then** เปลี่ยน tab โดยไม่ reload หน้า

---

### User Story 2 — User Management (Priority: P1)

Admin ดู/ค้นหา/filter/แก้ไข/ลบ users ในตาราง พร้อม cascading filters (บริษัท → แผนก → ตำแหน่ง)

**Why this priority**: P1 — user data เป็นพื้นฐานของทุก feature

**Independent Test**: เข้า tab Users → filter → verify ตาราง → แก้ไข user → verify เปลี่ยน

**Acceptance Scenarios**:

1. **Given** tab "จัดการผู้ใช้", **When** โหลดเสร็จ, **Then** ตารางแสดง: ชื่อ, อีเมล, Role, แผนก, สถานะ, Actions
2. **Given** เลือก filter "บริษัท A", **When** dropdown แผนก โหลด, **Then** แสดงเฉพาะแผนกใน "บริษัท A"
3. **Given** เลือก "บริษัท A" → "แผนก IT", **When** ตาราง filter, **Then** แสดงเฉพาะ users ใน IT ของบริษัท A
4. **Given** พิมพ์ "สมชาย" ในช่องค้นหา, **When** ตาราง filter, **Then** แสดงเฉพาะ user ที่ match
5. **Given** กด "แก้ไข" → เปลี่ยน role เป็น manager → กด "บันทึก", **When** Supabase update, **Then** role เปลี่ยนในตาราง
6. **Given** กด "ลบ" → confirm dialog, **When** confirm, **Then** user status → inactive (soft delete via Supabase)

---

### User Story 3 — Mission Management (Priority: P1)

Admin สร้าง/ดู/แก้ไข/ลบ mission templates — แต่ละ mission มี title, description, category, estimated duration

**Why this priority**: P1 — Mission เป็น core content ของ onboarding

**Independent Test**: CRUD mission → verify ตาราง → verify employee เห็น mission ที่ถูก assign

**Acceptance Scenarios**:

1. **Given** tab "จัดการ Mission", **When** โหลด, **Then** ตาราง: ชื่อ, หมวดหมู่, ระยะเวลา, จำนวนผู้ได้รับมอบหมาย, Actions
2. **Given** กด "สร้าง Mission ใหม่", **When** modal เปิด, **Then** form: ชื่อ (required), คำอธิบาย (required), หมวดหมู่ (dropdown), ระยะเวลา
3. **Given** กรอกครบ กด "บันทึก", **When** Supabase insert, **Then** mission ปรากฏในตาราง
4. **Given** ชื่อว่าง กด "บันทึก", **When** validate, **Then** error "กรุณากรอกชื่อ Mission"
5. **Given** ลบ mission ที่มี UserMissions, **When** confirm, **Then** soft-delete + related UserMissions → cancelled

---

### User Story 4 — Assign Missions (Priority: P1)

Admin เลือก mission + เลือก employees (multi-select) → กด assign → สร้าง UserMission records ใน Supabase

**Why this priority**: P1 — เป็นตัวเชื่อม mission กับ employee

**Independent Test**: เลือก mission + 3 employees → assign → login employee → verify เห็น mission

**Acceptance Scenarios**:

1. **Given** tab "มอบหมาย Mission", **When** โหลด, **Then** แสดง: เลือก Mission (dropdown) + ตารางพนักงาน (checkboxes)
2. **Given** เลือก mission + 3 พนักงาน กด "มอบหมาย", **When** Supabase insert, **Then** สร้าง 3 UserMission (status = not_started) + success message
3. **Given** assign mission ที่ employee มีอยู่แล้ว, **When** กด "มอบหมาย", **Then** warning "พนักงานนี้ได้รับ Mission นี้แล้ว" + skip duplicate
4. **Given** ใช้ cascading filters, **When** เลือก บริษัท → แผนก, **Then** รายชื่อพนักงาน filter ตาม

---

### User Story 5 — Exam Management (Priority: P2)

Admin สร้าง/จัดการ ExamTemplates — รองรับ 3 ประเภทคำถาม: multiple_choice, true_false, short_answer

**Why this priority**: P2 — Exam เสริมคุณค่า onboarding แต่ระบบทำงานได้ไม่ต้องมี

**Independent Test**: สร้าง exam 3 ข้อ (แต่ละประเภท) → verify บันทึกใน Supabase

**Acceptance Scenarios**:

1. **Given** tab "ข้อสอบ", **When** โหลด, **Then** รายการ exams: ชื่อ, จำนวนข้อ, คะแนนผ่าน, Actions
2. **Given** กด "สร้างข้อสอบใหม่", **When** modal เปิด, **Then** form: ชื่อ, คำอธิบาย, คะแนนผ่าน (%), ปุ่ม "เพิ่มคำถาม"
3. **Given** เพิ่มคำถาม multiple_choice, **When** กรอกคำถาม + 4 ตัวเลือก + เลือกคำตอบถูก, **Then** เพิ่มใน list
4. **Given** เพิ่มคำถาม true_false, **When** กรอกคำถาม + เลือก จริง/เท็จ, **Then** เพิ่มใน list
5. **Given** เพิ่มคำถาม short_answer, **When** กรอกคำถาม + คำตอบถูก, **Then** เพิ่มใน list
6. **Given** กด "บันทึก", **When** Supabase insert, **Then** exam + questions บันทึกสำเร็จ

---

### User Story 6 — Master Data Management (Priority: P2)

Admin CRUD: Company, Department, Position, Category — ข้อมูลหลักที่ใช้ใน cascading filters ทั่วระบบ

**Why this priority**: P2 — ต้องมีก่อนสร้าง user/mission แต่ seed ผ่าน Supabase Dashboard ได้

**Acceptance Scenarios**:

1. **Given** tab "ข้อมูลหลัก", **When** โหลด, **Then** 4 sections: บริษัท, แผนก, ตำแหน่ง, หมวดหมู่
2. **Given** กด "เพิ่มบริษัท" → กรอกชื่อ + code → "บันทึก", **When** insert, **Then** บริษัทปรากฏในรายการ
3. **Given** เลือกบริษัท → กด "เพิ่มแผนก" → กรอกชื่อ, **When** insert, **Then** แผนกผูกกับบริษัท
4. **Given** เลือกแผนก → กด "เพิ่มตำแหน่ง" → กรอกชื่อ + level, **When** insert, **Then** ตำแหน่งผูกกับแผนก
5. **Given** กด "เพิ่มหมวดหมู่" → กรอกชื่อ + คำอธิบาย + สี, **When** insert, **Then** ใช้ได้ใน mission form
6. **Given** ลบบริษัทที่มีแผนก, **When** confirm, **Then** error "ไม่สามารถลบได้ เนื่องจากมีแผนกที่ผูกอยู่"

---

### User Story 7 — Create User Account (Priority: P2)

Admin สร้าง user ใหม่ — ระบบเรียก Supabase Edge Function `create-user` (ใช้ `auth.admin.createUser()`)

**Why this priority**: P2 — จำเป็นสำหรับ onboard พนักงานใหม่

**Acceptance Scenarios**:

1. **Given** tab "สร้างบัญชี", **When** โหลด, **Then** form: ชื่อ, นามสกุล, อีเมล, รหัสผ่าน, Role, บริษัท, แผนก, ตำแหน่ง
2. **Given** เลือก role = employee, **When** role ถูกเลือก, **Then** แสดงเพิ่ม: วันเริ่มงาน, ระยะเวลาทดลองงาน (วัน)
3. **Given** กรอกครบ กด "สร้างบัญชี", **When** Edge Function สร้าง auth user + profiles row, **Then** success + form reset
4. **Given** email ซ้ำ, **When** กด "สร้างบัญชี", **Then** error "อีเมลนี้ถูกใช้แล้ว"
5. **Given** password < 8 ตัวอักษร, **When** validate, **Then** error "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"
6. **Given** เลือกบริษัท, **When** dropdown แผนก โหลด, **Then** แสดงเฉพาะแผนกในบริษัทที่เลือก (cascading)

---

### User Story 8 — Roadmap Management (Priority: P2)

Admin CRUD Roadmap Milestones — แสดงเป็น timeline ให้ employee เห็น

**Why this priority**: P2 — ช่วย employee เห็นภาพรวม onboarding

**Acceptance Scenarios**:

1. **Given** tab "Roadmap", **When** โหลด, **Then** รายการ milestones เรียงตาม target day
2. **Given** กด "เพิ่ม Milestone", **When** modal เปิด, **Then** form: ชื่อ, คำอธิบาย, target day, ลำดับ
3. **Given** กรอก "ปฐมนิเทศ" target day = 1, **When** insert, **Then** milestone ปรากฏตำแหน่งแรก
4. **Given** แก้ target day, **When** update, **Then** ลำดับจัดเรียงใหม่

---

### User Story 9 — Announcement Management (Priority: P3)

Admin CRUD ประกาศ — แสดงเป็น popup ให้ employee + manager

**Why this priority**: P3 — เสริม ไม่กระทบ core flow

**Acceptance Scenarios**:

1. **Given** tab "ประกาศ", **When** โหลด, **Then** รายการ: หัวข้อ, วันที่, สถานะ active/inactive, Actions
2. **Given** สร้างประกาศ active, **When** employee login, **Then** popup แสดง
3. **Given** เปลี่ยนเป็น inactive, **When** employee login, **Then** popup ไม่แสดง

---

### User Story 10 — Data Export (Priority: P3)

Admin export ข้อมูลเป็น CSV/JSON — เรียก Supabase Edge Function `export-data`

**Why this priority**: P3 — reporting tool ไม่กระทบ daily operations

**Acceptance Scenarios**:

1. **Given** tab "ส่งออกข้อมูล", **When** โหลด, **Then** cascading filters + ปุ่ม "Export CSV" / "Export JSON"
2. **Given** filter "บริษัท A" → "แผนก IT" กด "Export CSV", **When** Edge Function generate, **Then** download CSV ตาม filter
3. **Given** ไม่เลือก filter กด "Export JSON", **When** generate, **Then** download JSON ทั้งหมด
4. **Given** filter ได้ 0 records, **When** กด Export, **Then** message "ไม่มีข้อมูลสำหรับส่งออก"

---

### Edge Cases

- ลบ company ที่มี departments → error ป้องกัน orphan data (FK constraint)
- Assign mission ให้พนักงาน inactive → warning
- สร้าง exam ไม่มีคำถาม → validation error
- เปลี่ยน company → department dropdown reset
- Table > 100 records → pagination (25/page)
- 2 admin แก้ mission พร้อมกัน → Supabase optimistic locking
- Export > 10,000 records → Edge Function + loading indicator

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Admin Dashboard MUST มี 10 tabs
- **FR-002**: Overview MUST แสดง 4 stats cards (query จาก Supabase aggregate)
- **FR-003**: Users tab MUST ตาราง + cascading filters + search + CRUD (via Supabase RLS admin policy)
- **FR-004**: Missions tab MUST CRUD mission templates (Supabase `missions` table)
- **FR-005**: Assign tab MUST multi-select employees + mission → insert `user_missions` table
- **FR-006**: Exams tab MUST สร้าง exam ด้วย 3 question types (stored as JSONB in `exam_templates`)
- **FR-007**: Master Data MUST CRUD Company/Department/Position/Category (4 Supabase tables + FK constraints)
- **FR-008**: Create Account MUST เรียก Edge Function `create-user` (ต้อง service_role key)
- **FR-009**: Roadmap MUST CRUD milestones (`roadmap_milestones` table)
- **FR-010**: Announcements MUST CRUD + active/inactive toggle (`announcements` table)
- **FR-011**: Export MUST เรียก Edge Function `export-data` สำหรับ CSV/JSON generation
- **FR-012**: ทุก data table MUST pagination + sorting
- **FR-013**: ทุก form MUST client-side validation ก่อน Supabase call
- **FR-014**: ทุก delete MUST confirmation dialog + soft-delete
- **FR-015**: Admin header MUST red gradient ตาม IE Design System (`colors.red`)

### Key Entities (Supabase Tables)

- **missions**: id, title, description, category_id (FK), estimated_duration, is_deleted, created_at, updated_at
- **user_missions**: id, mission_id (FK), user_id (FK), status (enum), submitted_content, submitted_file_url, feedback_score, feedback_text, started_at, submitted_at, reviewed_at
- **exam_templates**: id, title, description, passing_score, questions (JSONB), created_at
- **categories**: id, name, description, color_code
- **companies**: id, name, code
- **departments**: id, name, company_id (FK)
- **positions**: id, name, department_id (FK), level
- **roadmap_milestones**: id, title, description, target_day, sort_order
- **announcements**: id, title, content, is_active, published_at, created_at

## Success Criteria *(mandatory)*

- **SC-001**: Admin CRUD user ได้ภายใน 30 วินาที/record
- **SC-002**: Cascading filters ทำงานถูกต้อง 100%
- **SC-003**: Mission assignment ไม่มี duplicate
- **SC-004**: Export ได้ไฟล์ valid (CSV/JSON) ตรงกับ filter
- **SC-005**: ทุก form ป้องกัน invalid data → 0 invalid records
- **SC-006**: ทุก tab โหลดภายใน 2 วินาที (< 100 records)
- **SC-007**: Soft delete ทำงานถูกต้อง — deleted ไม่แสดงใน UI
