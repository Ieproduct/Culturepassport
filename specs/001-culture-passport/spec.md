# Feature Specification: CulturePassport — Employee Onboarding Tracking System

**Feature Branch**: `001-culture-passport`
**Created**: 2026-02-09
**Status**: Draft
**Input**: User description: "CulturePassport — ระบบติดตามการเข้าปรับตัวพนักงานใหม่ (Employee Onboarding Tracking System) with role-based dashboards, mission management, exam system, roadmap tracking, and announcement management using MUI + IE Design System + Supabase + Railway"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Employee Completes Onboarding Missions (Priority: P1)

A new employee logs in and sees their personal dashboard with probation countdown, overall progress, and assigned missions. They can browse missions, start a mission, upload deliverables (files/text), and submit for review. They can also view their roadmap timeline showing milestones throughout the probation period.

**Why this priority**: This is the core value proposition — without employees being able to view and complete missions, the entire system has no purpose. Every other role's functionality depends on employees generating progress data.

**Independent Test**: Can be fully tested by creating a mock employee account, assigning 3 missions, and verifying the employee can view dashboard stats, start missions, submit deliverables, and see status changes. Delivers immediate value as a standalone onboarding task tracker.

**Acceptance Scenarios**:

1. **Given** an employee with 5 assigned missions (2 completed, 1 in-progress, 2 not-started), **When** they log in, **Then** the overview tab shows progress bar at 40%, probation countdown (days remaining), and stats cards (2 completed, 1 in-progress, 5 total).
2. **Given** an employee viewing the missions tab, **When** they click "เริ่มทำ" (Start) on a not-started mission, **Then** the mission status changes to in-progress and a mission detail modal opens.
3. **Given** an employee with an in-progress mission, **When** they attach a file and click "ส่งงาน" (Submit), **Then** the mission status changes to submitted and the manager is notified.
4. **Given** an employee viewing the roadmap tab, **When** the page loads, **Then** a vertical timeline displays all milestones in chronological order with completed milestones visually distinguished.
5. **Given** an employee on any tab, **When** a new announcement exists, **Then** an announcement popup appears with the latest announcement content.

---

### User Story 2 — Manager Reviews Team Progress (Priority: P2)

A manager logs in and sees their team overview dashboard showing all team members' onboarding progress. They can filter by company, department, and position. They can review submitted missions by providing feedback scores and comments. They can also review exam scores.

**Why this priority**: Manager review is the feedback loop that makes employee onboarding effective. Without manager approval, missions stay in "submitted" state forever. This is the second most critical flow after employee task completion.

**Independent Test**: Can be tested by creating a manager account with 5 team members, each with varying mission statuses. Verify the manager can see team cards, filter members, open feedback modal, submit scores, and approve/reject missions.

**Acceptance Scenarios**:

1. **Given** a manager with 5 team members, **When** they view the team overview tab, **Then** they see member cards with name, position, progress bar, probation status badge, and action buttons.
2. **Given** a manager viewing team overview, **When** they select cascading filters (company → department → position), **Then** the member list filters accordingly.
3. **Given** a manager viewing pending reviews tab, **When** they click "Review" on a submitted mission, **Then** a feedback modal opens with score slider (1-10) and comment text area.
4. **Given** a manager in the feedback modal, **When** they set score to 8 and add a comment and click "ส่ง Feedback", **Then** the mission status updates to completed and the employee sees the feedback.
5. **Given** a manager viewing a team member's exam results, **When** they click "ดูคะแนนสอบ", **Then** an exam score modal displays the exam name, score, total, and pass/fail status.

---

### User Story 3 — Admin Manages System Configuration (Priority: P3)

An admin logs in and sees the full admin dashboard with 10 functional areas. They can manage users, create/edit missions, assign missions to employees, create exams, manage master data (companies, departments, positions, categories), create new user accounts, configure roadmap milestones, publish announcements, and export data.

**Why this priority**: Admin setup is essential for the system to function (creating users, missions, master data) but is a one-time or infrequent activity compared to the daily employee/manager interactions. The system can be bootstrapped with seed data for P1/P2 testing.

**Independent Test**: Can be tested by logging in as admin and performing CRUD operations on each entity type. Verify data tables render, forms validate, and changes persist.

**Acceptance Scenarios**:

1. **Given** an admin on the overview tab, **When** the page loads, **Then** stats cards show total employees, total missions, completion rate percentage, and pending items count.
2. **Given** an admin on the users tab, **When** they apply cascading filters and search, **Then** the user table filters correctly and shows name, email, role, department, and status.
3. **Given** an admin on the missions tab, **When** they click "สร้าง Mission ใหม่" and fill the form (title, description, category, due date), **Then** the mission is created and appears in the missions table.
4. **Given** an admin on the assign tab, **When** they select employees and a mission and click "Assign", **Then** UserMission records are created linking the selected employees to the mission.
5. **Given** an admin on the exams tab, **When** they create an exam with multiple question types (multiple-choice, true-false, short-answer), **Then** the exam template is saved with all questions and answer options.
6. **Given** an admin on the master data tab, **When** they add a new department under a company, **Then** the department appears in the hierarchy and becomes available in all cascading filters.
7. **Given** an admin on the export tab, **When** they select filters and click "Export CSV", **Then** a CSV file downloads containing the filtered data.

---

### User Story 4 — Authentication & Role-Based Access (Priority: P1)

Users can log in with email and password. The system redirects them to their role-specific dashboard (admin → AdminDashboard, manager → ManagerDashboard, employee → EmployeeDashboard). Unauthorized access to other role dashboards is blocked by route guards.

**Why this priority**: P1 because without authentication and role routing, no other story can function. This is the entry point for all users.

**Independent Test**: Can be tested by creating accounts for each role, verifying login redirects to correct dashboard, and attempting cross-role URL access to confirm route guards work.

**Acceptance Scenarios**:

1. **Given** a user on the login page, **When** they enter valid admin credentials, **Then** they are redirected to `/admin` dashboard.
2. **Given** a user on the login page, **When** they enter valid manager credentials, **Then** they are redirected to `/manager` dashboard.
3. **Given** a user on the login page, **When** they enter valid employee credentials, **Then** they are redirected to `/employee` dashboard.
4. **Given** a logged-in employee, **When** they manually navigate to `/admin`, **Then** they are redirected back to `/employee` or shown an unauthorized page.
5. **Given** an unauthenticated user, **When** they navigate to any protected route, **Then** they are redirected to the login page.

---

### User Story 5 — Admin Creates User Accounts (Priority: P2)

An admin can create new user accounts by specifying name, email, password, role (admin/manager/employee), company, department, position, and probation period (for employees). The system validates input and creates the account.

**Why this priority**: P2 because user account creation is needed to onboard new employees, but can be done via database seeding during initial development.

**Independent Test**: Can be tested by navigating to the create account tab, filling in all fields, submitting, and verifying the new user appears in the users table and can log in.

**Acceptance Scenarios**:

1. **Given** an admin on the create account tab, **When** they fill all required fields and click "สร้างบัญชี", **Then** the account is created and a success message displays.
2. **Given** an admin creating an employee account, **When** they set probation period to 120 days, **Then** the employee's probation end date is calculated from the start date.
3. **Given** an admin creating an account, **When** they enter a duplicate email, **Then** a validation error displays "อีเมลนี้ถูกใช้แล้ว" (Email already in use).

---

### User Story 6 — Announcement Management (Priority: P3)

An admin can create, edit, and delete announcements with title, content, and optional scheduling. Employees see the latest announcement as a popup on their dashboard. Managers can also view announcements.

**Why this priority**: P3 because announcements are supplementary to the core mission tracking workflow but add important communication capability.

**Independent Test**: Can be tested by admin creating an announcement, then logging in as employee to verify the popup appears.

**Acceptance Scenarios**:

1. **Given** an admin on the announcements tab, **When** they create a new announcement with title and content, **Then** the announcement is saved and appears in the list.
2. **Given** a new announcement exists, **When** an employee logs in, **Then** a popup displays the announcement title and content.
3. **Given** an employee has seen an announcement, **When** they dismiss it, **Then** it does not reappear on subsequent page loads.

---

### Edge Cases

- What happens when an employee has zero assigned missions? → Show empty state with message "ยังไม่มี Mission ที่ได้รับมอบหมาย"
- What happens when a manager has no team members? → Show empty state with message "ไม่มีสมาชิกในทีม"
- What happens when probation period expires while missions are incomplete? → Show warning badge "หมดเวลาทดลองงาน" with incomplete count
- How does the system handle concurrent mission submissions? → Use optimistic locking; last-write-wins with conflict notification
- What happens when cascading filter data is empty (e.g., company has no departments)? → Show disabled dropdown with "ไม่มีข้อมูล" placeholder
- What happens when file upload fails during mission submission? → Show error toast and retain form state for retry
- What happens when an admin deletes a mission that employees have in-progress? → Soft delete; in-progress UserMissions are marked as cancelled with notification to affected employees

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate users via Supabase Auth (email/password) — no custom JWT
- **FR-002**: System MUST enforce role-based access control for 3 roles: admin, manager, employee (super_admin deferred to future iteration)
- **FR-003**: System MUST route authenticated users to their role-specific dashboard automatically
- **FR-004**: Admin MUST be able to perform CRUD operations on: Users, Missions, Categories, Companies, Departments, Positions, ExamTemplates, RoadmapMilestones, Announcements
- **FR-005**: Admin MUST be able to assign missions to one or more employees, creating UserMission records
- **FR-006**: Admin MUST be able to create exams with 3 question types: multiple_choice, true_false, short_answer
- **FR-007**: Admin MUST be able to export filtered data as CSV or JSON
- **FR-008**: Manager MUST see only team members within their department
- **FR-009**: Manager MUST be able to review submitted missions with score (1-10) and text feedback
- **FR-010**: Manager MUST be able to view employee exam scores
- **FR-011**: Employee MUST see their personal progress overview (completion %, probation countdown, stats)
- **FR-012**: Employee MUST be able to start, work on, and submit missions with file attachments
- **FR-013**: Employee MUST see a roadmap timeline of milestones in chronological order
- **FR-014**: Employee MUST receive announcement popups for new announcements
- **FR-015**: All data tables MUST support cascading filters: company → department → position
- **FR-016**: All interactive elements MUST meet 44x44px minimum touch target (Constitution Principle IV)
- **FR-017**: All spacing MUST use theme.spacing() on the 8px grid (Constitution Principle II)
- **FR-018**: System MUST use IE Design System color tokens for all color values
- **FR-019**: System MUST use Inter font with Noto Sans Thai fallback for all text

### Key Entities

- **Profile (User)**: Employee/manager/admin account. Attributes: name, email, role, company, department, position, avatar, probation start/end dates, status (active/inactive).
- **Mission**: An onboarding task template. Attributes: title, description, category, estimated duration, attachments, created by admin.
- **UserMission**: Assignment of a mission to an employee. Attributes: mission reference, employee reference, status (not_started/in_progress/submitted/approved/rejected), submitted content, feedback score, feedback text, timestamps.
- **Category**: Grouping for missions. Attributes: name, description, color code.
- **ExamTemplate**: An assessment with questions. Attributes: title, description, passing score, questions array.
- **Question**: Part of an ExamTemplate. Attributes: text, type (multiple_choice/true_false/short_answer), options array, correct answer.
- **RoadmapMilestone**: A milestone in the onboarding timeline. Attributes: title, description, target day (relative to start date), order.
- **Announcement**: System-wide notice. Attributes: title, content, published date, active flag.
- **Company**: Organization entity. Attributes: name, code.
- **Department**: Sub-unit of a company. Attributes: name, company reference.
- **Position**: Job role within a department. Attributes: name, department reference, level.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An employee can view their dashboard and complete a mission submission flow (start → submit) in under 3 clicks from login
- **SC-002**: A manager can review and approve a submitted mission with feedback in under 2 minutes
- **SC-003**: An admin can create a new employee account and assign 3 missions in under 5 minutes
- **SC-004**: All pages render correctly at 3 breakpoints: mobile (<600px), tablet (600-1199px), desktop (1200px+)
- **SC-005**: All API endpoints respond in under 500ms for typical payloads (< 100 records)
- **SC-006**: The system correctly enforces role-based access — 0 unauthorized routes accessible across all 3 roles
- **SC-007**: Cascading filters (company → department → position) correctly narrow results at each level with no stale data
- **SC-008**: CSV/JSON export produces valid files that accurately reflect the filtered dataset
