# Data Model: CulturePassport

**Phase**: 1 — Design & Contracts
**Date**: 2026-02-09
**Database**: Supabase PostgreSQL + RLS

---

## Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  companies   │──1:N──│ departments  │──1:N──│  positions   │
└──────────────┘       └──────┬───────┘       └──────────────┘
                              │ 1
                              │
                              │ N
                       ┌──────┴───────┐
                       │   profiles   │ ←── auth.users (FK: id)
                       └──┬───┬───┬───┘
                          │   │   │
              ┌───────────┘   │   └───────────┐
              │ N             │ 1              │ N
    ┌─────────┴──────┐       │     ┌──────────┴────────┐
    │ user_missions  │       │     │ announcement_     │
    └────────┬───────┘       │     │ dismissals        │
             │ N             │     └───────────────────┘
             │               │              │ N
    ┌────────┴───────┐       │     ┌────────┴──────────┐
    │   missions     │       │     │  announcements    │
    └────────┬───────┘       │     └───────────────────┘
             │ N             │
    ┌────────┴───────┐       │     ┌───────────────────┐
    │  categories    │       │     │ roadmap_milestones│
    └────────────────┘       │     └───────────────────┘
                             │
                    ┌────────┴───────┐
                    │ exam_templates │
                    └────────┬───────┘
                             │ 1
                    ┌────────┴───────┐
                    │  exam_scores   │
                    └────────────────┘
```

---

## Tables

### 1. profiles

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, FK → auth.users.id | Supabase Auth user ID |
| full_name | text | NOT NULL | ชื่อ-นามสกุล |
| email | text | NOT NULL, UNIQUE | อีเมล (synced from auth.users) |
| role | text | NOT NULL, CHECK (role IN ('admin','manager','employee')) | Role ในระบบ |
| company_id | uuid | FK → companies.id, NULL | บริษัท |
| department_id | uuid | FK → departments.id, NULL | แผนก |
| position_id | uuid | FK → positions.id, NULL | ตำแหน่ง |
| avatar_url | text | NULL | URL รูป avatar (Supabase Storage) |
| probation_start | date | NULL | วันเริ่มทดลองงาน (employee only) |
| probation_end | date | NULL | วันสิ้นสุดทดลองงาน (employee only) |
| status | text | NOT NULL DEFAULT 'active', CHECK (status IN ('active','inactive')) | สถานะ |
| created_at | timestamptz | NOT NULL DEFAULT now() | |
| updated_at | timestamptz | NOT NULL DEFAULT now() | |

**Trigger**: `on_auth_user_created` → auto-insert profiles row with id = auth.users.id

### 2. companies

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK DEFAULT gen_random_uuid() | |
| name | text | NOT NULL | ชื่อบริษัท |
| code | text | NOT NULL, UNIQUE | รหัสบริษัท |
| created_at | timestamptz | NOT NULL DEFAULT now() | |

### 3. departments

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK DEFAULT gen_random_uuid() | |
| name | text | NOT NULL | ชื่อแผนก |
| company_id | uuid | NOT NULL, FK → companies.id ON DELETE RESTRICT | บริษัทที่สังกัด |
| created_at | timestamptz | NOT NULL DEFAULT now() | |

### 4. positions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK DEFAULT gen_random_uuid() | |
| name | text | NOT NULL | ชื่อตำแหน่ง |
| department_id | uuid | NOT NULL, FK → departments.id ON DELETE RESTRICT | แผนกที่สังกัด |
| level | int | NULL | ระดับตำแหน่ง |
| created_at | timestamptz | NOT NULL DEFAULT now() | |

### 5. categories

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK DEFAULT gen_random_uuid() | |
| name | text | NOT NULL | ชื่อหมวดหมู่ |
| description | text | NULL | คำอธิบาย |
| color_code | text | NULL | สี hex สำหรับ UI (#FF0000) |
| created_at | timestamptz | NOT NULL DEFAULT now() | |

### 6. missions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK DEFAULT gen_random_uuid() | |
| title | text | NOT NULL | ชื่อ Mission |
| description | text | NOT NULL | คำอธิบาย |
| category_id | uuid | FK → categories.id ON DELETE SET NULL | หมวดหมู่ |
| estimated_duration | text | NULL | ระยะเวลาโดยประมาณ ("2 วัน", "1 สัปดาห์") |
| is_deleted | boolean | NOT NULL DEFAULT false | Soft delete flag |
| created_at | timestamptz | NOT NULL DEFAULT now() | |
| updated_at | timestamptz | NOT NULL DEFAULT now() | |

### 7. user_missions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK DEFAULT gen_random_uuid() | |
| mission_id | uuid | NOT NULL, FK → missions.id | Mission ที่ถูก assign |
| user_id | uuid | NOT NULL, FK → profiles.id | Employee ที่ได้รับมอบหมาย |
| status | text | NOT NULL DEFAULT 'not_started', CHECK (status IN ('not_started','in_progress','submitted','approved','rejected','cancelled')) | สถานะ |
| submitted_content | text | NULL | เนื้อหาที่ employee ส่ง |
| submitted_file_url | text | NULL | URL ไฟล์ที่ส่ง (Supabase Storage) |
| feedback_score | int | NULL, CHECK (feedback_score BETWEEN 1 AND 10) | คะแนนจาก manager |
| feedback_text | text | NULL | ความเห็นจาก manager |
| started_at | timestamptz | NULL | เวลาที่เริ่มทำ |
| submitted_at | timestamptz | NULL | เวลาที่ส่งงาน |
| reviewed_at | timestamptz | NULL | เวลาที่ review |
| created_at | timestamptz | NOT NULL DEFAULT now() | เวลาที่ assign |

**Unique**: (mission_id, user_id) — ป้องกัน duplicate assignment

### 8. exam_templates

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK DEFAULT gen_random_uuid() | |
| title | text | NOT NULL | ชื่อข้อสอบ |
| description | text | NULL | คำอธิบาย |
| passing_score | int | NOT NULL, CHECK (passing_score BETWEEN 0 AND 100) | คะแนนผ่าน (%) |
| questions | jsonb | NOT NULL DEFAULT '[]' | Array ของ Question objects |
| created_at | timestamptz | NOT NULL DEFAULT now() | |

**Questions JSONB structure**:
```json
[
  {
    "id": "q1",
    "text": "คำถาม",
    "type": "multiple_choice",
    "options": ["ตัวเลือก A", "ตัวเลือก B", "ตัวเลือก C", "ตัวเลือก D"],
    "correct_answer": "ตัวเลือก A"
  },
  {
    "id": "q2",
    "text": "คำถาม จริง/เท็จ",
    "type": "true_false",
    "options": ["จริง", "เท็จ"],
    "correct_answer": "จริง"
  },
  {
    "id": "q3",
    "text": "คำถามอัตนัย",
    "type": "short_answer",
    "options": [],
    "correct_answer": "คำตอบ"
  }
]
```

### 9. exam_scores

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK DEFAULT gen_random_uuid() | |
| exam_template_id | uuid | NOT NULL, FK → exam_templates.id | ข้อสอบ |
| user_id | uuid | NOT NULL, FK → profiles.id | ผู้สอบ |
| score | int | NOT NULL | คะแนนที่ได้ |
| total | int | NOT NULL | คะแนนเต็ม |
| passed | boolean | NOT NULL | ผ่าน/ไม่ผ่าน |
| answers | jsonb | NULL | คำตอบของผู้สอบ |
| taken_at | timestamptz | NOT NULL DEFAULT now() | เวลาที่สอบ |

### 10. roadmap_milestones

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK DEFAULT gen_random_uuid() | |
| title | text | NOT NULL | ชื่อ milestone |
| description | text | NULL | คำอธิบาย |
| target_day | int | NOT NULL | วันเป้าหมาย (นับจากวันเริ่มงาน) |
| sort_order | int | NOT NULL DEFAULT 0 | ลำดับการแสดง |
| created_at | timestamptz | NOT NULL DEFAULT now() | |

### 11. announcements

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK DEFAULT gen_random_uuid() | |
| title | text | NOT NULL | หัวข้อ |
| content | text | NOT NULL | เนื้อหา |
| is_active | boolean | NOT NULL DEFAULT true | สถานะ active |
| published_at | timestamptz | NOT NULL DEFAULT now() | วันที่เผยแพร่ |
| created_at | timestamptz | NOT NULL DEFAULT now() | |

### 12. announcement_dismissals

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK DEFAULT gen_random_uuid() | |
| announcement_id | uuid | NOT NULL, FK → announcements.id ON DELETE CASCADE | ประกาศ |
| user_id | uuid | NOT NULL, FK → profiles.id | ผู้ dismiss |
| dismissed_at | timestamptz | NOT NULL DEFAULT now() | เวลา dismiss |

**Unique**: (announcement_id, user_id) — dismiss ได้ 1 ครั้ง/คน/ประกาศ

---

## Indexes

| Table | Index | Columns | Rationale |
|-------|-------|---------|-----------|
| profiles | idx_profiles_role | role | Filter by role (admin queries) |
| profiles | idx_profiles_department | department_id | Manager team filter |
| profiles | idx_profiles_company | company_id | Cascading filter |
| departments | idx_departments_company | company_id | Cascading filter |
| positions | idx_positions_department | department_id | Cascading filter |
| missions | idx_missions_category | category_id | Filter by category |
| missions | idx_missions_not_deleted | is_deleted | WHERE is_deleted = false |
| user_missions | idx_user_missions_user | user_id | Employee's missions |
| user_missions | idx_user_missions_status | status | Filter by status (pending reviews) |
| user_missions | idx_user_missions_mission | mission_id | Join with missions |
| exam_scores | idx_exam_scores_user | user_id | User's scores |
| announcement_dismissals | idx_dismissals_user | user_id | User's dismissals |

---

## State Machines

### UserMission Status

```
not_started ──[Employee: start]──→ in_progress
in_progress ──[Employee: submit]──→ submitted
submitted ──[Manager: approve]──→ approved
submitted ──[Manager: reject]──→ rejected
rejected ──[Employee: resubmit]──→ submitted
* ──[Admin: cancel]──→ cancelled
```

Valid transitions enforced by RLS + client-side validation.

---

## Supabase Storage Buckets

| Bucket | Public | Max Size | Allowed Types |
|--------|--------|----------|---------------|
| `mission-deliverables` | false | 10MB | .pdf, .doc, .docx, .jpg, .png |
| `avatars` | true | 2MB | .jpg, .png, .webp |
