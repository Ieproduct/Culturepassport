# Feature Specification: Employee Dashboard

**Feature Branch**: `005-employee-dashboard`
**Created**: 2026-02-09
**Status**: Draft
**Backend**: Supabase (RLS + Edge Functions) — ไม่มี custom server

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Progress Overview (Priority: P1)

Employee login เห็น green gradient header + ชื่อ + ตำแหน่ง + probation countdown แสดง progress bar รวม + stats cards: สำเร็จ, อยู่ระหว่าง, ทั้งหมด

**Why this priority**: P1 — หน้าแรกที่ employee เห็น ให้ภาพรวม onboarding ของตัวเอง

**Independent Test**: Login employee ที่มี 5 missions (2 approved, 1 in-progress, 2 not-started) → verify progress 40% + stats ถูก

**Acceptance Scenarios**:

1. **Given** employee login สำเร็จ, **When** เข้า dashboard, **Then** green gradient header + ชื่อ + ตำแหน่ง + "แดชบอร์ดพนักงาน"
2. **Given** employee มี probation 120 วัน เหลือ 85 วัน, **When** เปิด overview, **Then** countdown แสดง "เหลือ 85 วัน"
3. **Given** 5 missions (2 approved, 1 in-progress, 2 not-started), **When** เปิด overview, **Then** progress bar 40% + stats: 2 สำเร็จ, 1 กำลังทำ, 5 ทั้งหมด
4. **Given** ทุก mission approved, **When** เปิด overview, **Then** progress bar 100% + แสดงข้อความ "ยินดีด้วย! คุณทำ Mission ครบทุกรายการแล้ว"
5. **Given** probation หมดแล้ว + missions ยังไม่ครบ, **When** เปิด overview, **Then** warning badge "หมดเวลาทดลองงาน" + จำนวน missions ที่ยังไม่เสร็จ

> **Supabase RLS**: Employee SELECT user_missions WHERE user_id = auth.uid()

---

### User Story 2 — View & Complete Missions (Priority: P1)

Employee เห็นรายการ missions ที่ถูก assign เป็น cards พร้อม status badge สามารถ "เริ่มทำ" (start), ดูรายละเอียด, แนบไฟล์, และ "ส่งงาน" (submit)

**Why this priority**: P1 — core flow ของระบบทั้งหมด

**Independent Test**: เห็น missions list → กด เริ่มทำ → แนบไฟล์ → กด ส่งงาน → verify status เปลี่ยน

**Acceptance Scenarios**:

1. **Given** tab "Missions", **When** โหลด, **Then** แสดง mission cards เรียงตาม status (in_progress ก่อน → not_started → submitted → approved)
2. **Given** mission card status = not_started, **When** กด "เริ่มทำ", **Then** status → in_progress + mission detail modal เปิด + Supabase update started_at
3. **Given** mission card status = in_progress, **When** กดที่ card, **Then** modal แสดง: title, description, category, estimated duration, file upload, textarea, ปุ่ม "ส่งงาน"
4. **Given** อยู่ใน modal + แนบไฟล์ (.pdf, .doc, .jpg ≤ 10MB), **When** upload, **Then** ไฟล์ upload ไป Supabase Storage bucket `mission-deliverables` + แสดง filename
5. **Given** กรอก content + แนบไฟล์ + กด "ส่งงาน", **When** Supabase update, **Then** status → submitted + submitted_at + submitted_content + submitted_file_url
6. **Given** mission status = submitted, **When** ดู card, **Then** badge "รอ Review" + ไม่มีปุ่ม submit (read-only)
7. **Given** mission status = approved + มี feedback, **When** กดที่ card, **Then** modal แสดง feedback score + comment จาก manager
8. **Given** mission status = rejected + มี feedback, **When** กดที่ card, **Then** modal แสดง feedback + ปุ่ม "แก้ไขและส่งใหม่"
9. **Given** กด "แก้ไขและส่งใหม่", **When** แก้ content + กด "ส่งงาน", **Then** status → submitted อีกครั้ง
10. **Given** employee มี 0 missions, **When** เปิด tab, **Then** empty state "ยังไม่มี Mission ที่ได้รับมอบหมาย"

> **Supabase RLS**: Employee UPDATE user_missions WHERE user_id = auth.uid() AND valid status transition
> **Supabase Storage**: Employee upload to `mission-deliverables/{user_id}/{mission_id}/`

---

### User Story 3 — Roadmap Timeline (Priority: P2)

Employee เห็น vertical timeline แสดง milestones ตามลำดับเวลา (target day relative to probation start) — milestones ที่ผ่านแล้วแสดงเป็น completed

**Why this priority**: P2 — ช่วยให้ employee เห็นภาพรวม onboarding journey แต่ไม่ block core mission flow

**Independent Test**: สร้าง 5 milestones → login employee → verify timeline แสดง 5 items ตามลำดับ

**Acceptance Scenarios**:

1. **Given** tab "Roadmap", **When** โหลด, **Then** vertical timeline แสดง milestones เรียงตาม target_day
2. **Given** milestone target_day = 7 + employee เริ่มงานมา 10 วัน, **When** ดู timeline, **Then** milestone นี้แสดงเป็น "ผ่านแล้ว" (completed style)
3. **Given** milestone target_day = 30 + employee เริ่มงานมา 10 วัน, **When** ดู timeline, **Then** milestone นี้แสดงเป็น "กำลังจะถึง" (upcoming style)
4. **Given** ไม่มี milestones, **When** เปิด tab, **Then** empty state "ยังไม่มี Roadmap"

> **Supabase RLS**: Employee SELECT roadmap_milestones (all rows, read-only)

---

### User Story 4 — Announcement Popup (Priority: P3)

Employee เห็น popup ประกาศล่าสุดเมื่อ login — กด dismiss → ไม่แสดงอีก (เก็บ dismissal ใน Supabase)

**Why this priority**: P3 — เสริม communication ไม่กระทบ core flow

**Independent Test**: Admin สร้าง announcement → employee login → verify popup → dismiss → refresh → verify ไม่แสดงอีก

**Acceptance Scenarios**:

1. **Given** มี active announcement ที่ employee ยังไม่ dismiss, **When** login, **Then** popup แสดง title + content
2. **Given** popup แสดง, **When** กด "ปิด", **Then** insert row ใน `announcement_dismissals` + popup หายไป
3. **Given** dismiss แล้ว, **When** refresh หน้า, **Then** popup ไม่แสดงอีก
4. **Given** admin สร้าง announcement ใหม่หลัง dismiss ตัวเก่า, **When** login, **Then** popup แสดงตัวใหม่
5. **Given** ไม่มี active announcements, **When** login, **Then** ไม่มี popup

> **Supabase RLS**: Employee SELECT announcements WHERE is_active = true
> Employee INSERT announcement_dismissals WHERE user_id = auth.uid()

---

### Edge Cases

- Employee upload ไฟล์เกิน 10MB → error "ไฟล์ต้องไม่เกิน 10MB"
- Employee upload ไฟล์ประเภทไม่รองรับ → error "รองรับเฉพาะ .pdf, .doc, .docx, .jpg, .png"
- Upload fail กลางคัน → error toast + retain form state สำหรับ retry
- Probation countdown ติดลบ (หมดเวลาแล้ว) → แสดง "เลยกำหนด X วัน" เป็นสีแดง
- Employee พยายาม submit mission ที่ status ไม่ใช่ in_progress → RLS block + client-side disable ปุ่ม
- Employee พยายาม start mission ที่ status ไม่ใช่ not_started → RLS block + client-side disable ปุ่ม
- Mission ถูก admin ลบขณะ employee กำลังทำ → แสดง "Mission นี้ถูกยกเลิก" + status badge cancelled
- Multiple announcements active → แสดงเฉพาะล่าสุด (ORDER BY published_at DESC LIMIT 1)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Employee Dashboard MUST มี 3 tabs: Overview, Missions, Roadmap
- **FR-002**: Header MUST green gradient ตาม IE Design System (`colors.green`)
- **FR-003**: Overview MUST แสดง probation countdown + progress bar + 3 stats cards
- **FR-004**: Progress bar MUST คำนวณจาก (approved missions / total missions * 100)
- **FR-005**: Missions tab MUST แสดง mission cards เรียงตาม status priority
- **FR-006**: Mission card MUST มี status badge (not_started, in_progress, submitted, approved, rejected, cancelled)
- **FR-007**: Employee MUST สามารถ start mission (not_started → in_progress) ผ่าน Supabase update
- **FR-008**: Employee MUST สามารถ submit mission พร้อมแนบไฟล์ผ่าน Supabase Storage
- **FR-009**: Employee MUST เห็น manager feedback (score + comment) เมื่อ mission ถูก review
- **FR-010**: Employee MUST สามารถแก้ไข + ส่งใหม่เมื่อ mission ถูก rejected
- **FR-011**: Roadmap MUST แสดง vertical timeline จาก `roadmap_milestones` table
- **FR-012**: Announcement popup MUST แสดงเมื่อมี active announcement ที่ยังไม่ dismiss
- **FR-013**: Dismiss MUST บันทึกใน `announcement_dismissals` table (ไม่แสดงซ้ำ)
- **FR-014**: File upload MUST จำกัด 10MB + whitelist extensions (.pdf, .doc, .docx, .jpg, .png)
- **FR-015**: ทุก data MUST เข้าถึงเฉพาะของตัวเอง (enforced by Supabase RLS auth.uid() = user_id)

### Key Entities (Supabase queries)

- **profiles** (SELECT WHERE id = auth.uid()): ข้อมูลส่วนตัว + probation dates
- **user_missions** (SELECT WHERE user_id = auth.uid()): missions ของตัวเอง
- **user_missions** (UPDATE WHERE user_id = auth.uid()): start / submit
- **missions** (SELECT via user_missions join): mission details
- **roadmap_milestones** (SELECT all, ORDER BY target_day): timeline
- **announcements** (SELECT WHERE is_active = true): ประกาศ active
- **announcement_dismissals** (SELECT/INSERT WHERE user_id = auth.uid()): dismiss tracking
- **Supabase Storage** `mission-deliverables`: upload/download files

## Success Criteria *(mandatory)*

- **SC-001**: Employee ทำ start → submit ได้ภายใน 3 clicks จาก login
- **SC-002**: Progress bar + stats คำนวณถูกต้อง 100%
- **SC-003**: Probation countdown ถูกต้องตามวัน (±0 วัน)
- **SC-004**: File upload สำเร็จ 100% สำหรับไฟล์ที่ตรง spec (≤ 10MB, valid type)
- **SC-005**: Employee เห็นเฉพาะข้อมูลตัวเอง 100% (RLS enforced — 0 data leak)
- **SC-006**: Announcement dismiss ทำงานถูกต้อง — ไม่แสดงซ้ำหลัง dismiss
- **SC-007**: Roadmap timeline เรียงตาม target_day ถูกต้อง 100%
- **SC-008**: Rejected mission → resubmit flow ทำงานครบ loop
