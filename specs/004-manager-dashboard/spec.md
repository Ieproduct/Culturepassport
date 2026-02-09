# Feature Specification: Manager Dashboard

**Feature Branch**: `004-manager-dashboard`
**Created**: 2026-02-09
**Status**: Draft
**Backend**: Supabase (RLS + Edge Functions) — ไม่มี custom server

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Team Overview (Priority: P1)

Manager login เห็น blue gradient header + 3 stats cards: จำนวนสมาชิกทีม, รอ review, อัตราสำเร็จ (%) พร้อม member cards แสดง progress + probation status ของแต่ละคน

**Why this priority**: P1 — หน้าหลักของ manager ใช้ทุกวัน

**Independent Test**: Login manager ที่มี 5 team members → verify stats + member cards แสดงถูก

**Acceptance Scenarios**:

1. **Given** manager login สำเร็จ, **When** เข้า dashboard, **Then** blue gradient header + "แดชบอร์ดหัวหน้าทีม"
2. **Given** manager มี 5 สมาชิก (3 active, 2 pending review), **When** เปิด overview, **Then** stats: 5 สมาชิก, 2 รอ review, completion rate %
3. **Given** team overview แสดง member cards, **When** ดู card แต่ละคน, **Then** เห็น: ชื่อ, ตำแหน่ง, progress bar (%), probation badge (ผ่าน/อยู่ระหว่าง/ไม่ผ่าน), ปุ่ม actions
4. **Given** ใช้ cascading filters (บริษัท → แผนก → ตำแหน่ง), **When** เลือก filter, **Then** member cards filter ตาม
5. **Given** manager มี 0 สมาชิก, **When** เปิด overview, **Then** empty state "ไม่มีสมาชิกในทีม"

> **Supabase RLS**: Manager SELECT profiles WHERE department_id = manager's department_id

---

### User Story 2 — Review Submitted Missions (Priority: P1)

Manager เห็น tab "รอ Review" แสดง missions ที่ employee submit แล้ว กด Review → เปิด feedback modal ให้คะแนน (slider 1-10) + comment → submit → status เปลี่ยนเป็น approved/rejected

**Why this priority**: P1 — feedback loop หลัก ถ้า manager ไม่ review, missions ค้างที่ submitted ตลอด

**Independent Test**: Employee submit mission → login manager → review + feedback → verify status เปลี่ยน

**Acceptance Scenarios**:

1. **Given** tab "รอ Review", **When** โหลด, **Then** แสดงรายการ submitted missions: ชื่อ mission, ชื่อ employee, วันที่ submit, ปุ่ม "Review"
2. **Given** กด "Review" ของ mission, **When** feedback modal เปิด, **Then** แสดง: รายละเอียด mission, ไฟล์ที่ส่ง (ถ้ามี), score slider (1-10), comment textarea, ปุ่ม "อนุมัติ" + "ส่งกลับแก้ไข"
3. **Given** ตั้ง score = 8 + comment + กด "อนุมัติ", **When** Supabase update user_missions, **Then** status → approved + feedback_score = 8 + feedback_text = comment
4. **Given** ตั้ง score = 3 + comment + กด "ส่งกลับแก้ไข", **When** update, **Then** status → rejected + employee เห็น feedback
5. **Given** ไม่กรอก score กด submit, **When** validate, **Then** error "กรุณาให้คะแนน"
6. **Given** ไม่มี missions รอ review, **When** เปิด tab, **Then** empty state "ไม่มี Mission รอ Review"

> **Supabase RLS**: Manager UPDATE user_missions WHERE user_id IN (profiles with same department)

---

### User Story 3 — View Exam Scores (Priority: P2)

Manager กดดูคะแนนสอบของสมาชิกในทีม → exam score modal แสดงชื่อสอบ, คะแนน, เต็ม, ผ่าน/ไม่ผ่าน

**Why this priority**: P2 — เสริมการประเมิน ไม่ block core review flow

**Independent Test**: Employee ทำสอบ → login manager → กดดูคะแนน → verify แสดงถูก

**Acceptance Scenarios**:

1. **Given** member card ของ employee ที่ทำสอบแล้ว, **When** กด "ดูคะแนนสอบ", **Then** modal แสดง: ชื่อสอบ, คะแนนที่ได้, คะแนนเต็ม, %, สถานะ ผ่าน/ไม่ผ่าน
2. **Given** employee ยังไม่ทำสอบ, **When** กด "ดูคะแนนสอบ", **Then** message "ยังไม่มีผลสอบ"
3. **Given** employee ทำสอบหลายตัว, **When** modal เปิด, **Then** แสดงรายการทุกสอบ เรียงตามวันที่

> **Supabase RLS**: Manager SELECT exam_scores WHERE user_id IN (profiles with same department)

---

### Edge Cases

- Manager ย้ายแผนก → เห็นสมาชิกแผนกใหม่ทันที (RLS ใช้ current department_id)
- Employee ถูก deactivate ขณะมี mission submitted → ยังแสดงใน pending reviews
- Manager review mission ที่ employee submit ซ้ำ (rejected → resubmitted) → แสดง history ของ feedback ก่อนหน้า
- Score ต้องเป็นจำนวนเต็ม 1-10 → client + RLS check constraint validation
- Probation badge logic: ผ่าน (all missions approved + probation end > today), อยู่ระหว่าง (probation end > today), ไม่ผ่าน (probation end < today + incomplete missions)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Manager Dashboard MUST มี 2 tabs: Team Overview, Pending Reviews
- **FR-002**: Header MUST blue gradient ตาม IE Design System (`colors.blue`)
- **FR-003**: Stats cards MUST แสดง 3 metrics (สมาชิก, รอ review, completion rate) — query จาก Supabase
- **FR-004**: Member cards MUST แสดง progress bar + probation badge + action buttons
- **FR-005**: Cascading filters MUST ทำงาน (บริษัท → แผนก → ตำแหน่ง)
- **FR-006**: Feedback modal MUST มี score slider (1-10) + comment textarea + 2 action buttons
- **FR-007**: Review action MUST update `user_missions` table (status + feedback_score + feedback_text + reviewed_at)
- **FR-008**: Manager MUST เห็นเฉพาะสมาชิกใน department เดียวกัน (enforced by Supabase RLS)
- **FR-009**: Exam score modal MUST แสดงรายการสอบ + คะแนน + สถานะ
- **FR-010**: Submitted file (ถ้ามี) MUST แสดง preview/download link จาก Supabase Storage

### Key Entities (Supabase queries)

- **profiles** (SELECT WHERE department_id = manager's department_id): ข้อมูลสมาชิกทีม
- **user_missions** (SELECT WHERE user_id IN team + status = 'submitted'): missions รอ review
- **user_missions** (UPDATE SET status, feedback_score, feedback_text, reviewed_at): review action
- **exam_scores** (SELECT WHERE user_id IN team): คะแนนสอบของทีม

## Success Criteria *(mandatory)*

- **SC-001**: Manager เห็นเฉพาะทีมตัวเอง 100% (RLS enforced — 0 data leak)
- **SC-002**: Review + feedback ใช้เวลาไม่เกิน 2 นาที/mission
- **SC-003**: Stats cards คำนวณถูกต้อง 100% ตรงกับข้อมูลจริง
- **SC-004**: Probation badge แสดงสถานะถูกต้องตาม logic
- **SC-005**: Cascading filters ทำงานถูกต้อง ไม่มี stale data
