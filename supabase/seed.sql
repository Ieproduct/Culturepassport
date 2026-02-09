-- CulturePassport — Dev Seed Data
-- ⚠️ DEV ONLY — ห้ามรันกับ UAT/PROD

-- ============================================================
-- Master Data: Companies, Departments, Positions, Categories
-- ============================================================
INSERT INTO public.companies (id, name, code) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'IE Corporation', 'IE'),
  ('a0000000-0000-0000-0000-000000000002', 'Tech Solutions Co.', 'TSC');

INSERT INTO public.departments (id, name, company_id) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Engineering', 'a0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000002', 'Human Resources', 'a0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000003', 'Marketing', 'a0000000-0000-0000-0000-000000000002');

INSERT INTO public.positions (id, name, department_id, level) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Software Engineer', 'b0000000-0000-0000-0000-000000000001', 1),
  ('c0000000-0000-0000-0000-000000000002', 'Senior Engineer', 'b0000000-0000-0000-0000-000000000001', 2),
  ('c0000000-0000-0000-0000-000000000003', 'HR Specialist', 'b0000000-0000-0000-0000-000000000002', 1),
  ('c0000000-0000-0000-0000-000000000004', 'Marketing Coordinator', 'b0000000-0000-0000-0000-000000000003', 1);

INSERT INTO public.categories (id, name, description, color_code) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'Orientation', 'ปฐมนิเทศ', '#2563EB'),
  ('d0000000-0000-0000-0000-000000000002', 'Technical Training', 'การอบรมเทคนิค', '#16A34A'),
  ('d0000000-0000-0000-0000-000000000003', 'Company Culture', 'วัฒนธรรมองค์กร', '#DC2626'),
  ('d0000000-0000-0000-0000-000000000004', 'Compliance', 'กฎระเบียบ', '#F59E0B');

-- ============================================================
-- Missions
-- ============================================================
INSERT INTO public.missions (id, title, description, category_id, estimated_duration) VALUES
  ('e0000000-0000-0000-0000-000000000001', 'ทำความรู้จักบริษัท', 'อ่านเอกสารแนะนำบริษัทและทำแบบทดสอบ', 'd0000000-0000-0000-0000-000000000001', '1 วัน'),
  ('e0000000-0000-0000-0000-000000000002', 'ตั้งค่า Development Environment', 'ตั้งค่าเครื่องมือ dev ทั้งหมดให้พร้อมใช้งาน', 'd0000000-0000-0000-0000-000000000002', '2 วัน'),
  ('e0000000-0000-0000-0000-000000000003', 'เรียนรู้ Code Standards', 'อ่าน coding guidelines และทำ PR แรก', 'd0000000-0000-0000-0000-000000000002', '3 วัน'),
  ('e0000000-0000-0000-0000-000000000004', 'อ่านนโยบายบริษัท', 'ศึกษา employee handbook และนโยบายสำคัญ', 'd0000000-0000-0000-0000-000000000004', '1 วัน'),
  ('e0000000-0000-0000-0000-000000000005', 'เข้าร่วม Team Building', 'เข้าร่วมกิจกรรม team building ครั้งแรก', 'd0000000-0000-0000-0000-000000000003', '1 วัน');

-- ============================================================
-- Roadmap Milestones
-- ============================================================
INSERT INTO public.roadmap_milestones (id, title, description, target_day, sort_order) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'วันแรกที่บริษัท', 'ปฐมนิเทศ รับอุปกรณ์ ตั้งค่าบัญชี', 1, 1),
  ('f0000000-0000-0000-0000-000000000002', 'สัปดาห์แรก', 'เรียนรู้ระบบ ทำความรู้จักทีม', 7, 2),
  ('f0000000-0000-0000-0000-000000000003', 'เดือนแรก', 'เริ่มทำงานจริง ส่งงานชิ้นแรก', 30, 3),
  ('f0000000-0000-0000-0000-000000000004', '3 เดือน', 'Review ครึ่งทาง ปรับปรุงตามฟีดแบ็ก', 90, 4),
  ('f0000000-0000-0000-0000-000000000005', 'จบทดลองงาน', 'ประเมินผลรวม ผ่าน/ไม่ผ่านทดลองงาน', 120, 5);

-- ============================================================
-- Announcements
-- ============================================================
INSERT INTO public.announcements (id, title, content, is_active) VALUES
  ('10000000-0000-0000-0000-000000000001', 'ยินดีต้อนรับสู่ CulturePassport!', 'ระบบติดตามการเข้าปรับตัวพนักงานใหม่ กรุณาเริ่มทำ Mission ที่ได้รับมอบหมาย', true),
  ('10000000-0000-0000-0000-000000000002', 'อัปเดตนโยบาย WFH', 'บริษัทอนุญาตให้ WFH ได้ 2 วันต่อสัปดาห์ เริ่มเดือนหน้า', true);

-- ============================================================
-- Exam Templates
-- ============================================================
INSERT INTO public.exam_templates (id, title, description, passing_score, questions) VALUES
  ('20000000-0000-0000-0000-000000000001', 'แบบทดสอบความรู้บริษัท', 'ทดสอบความรู้เบื้องต้นเกี่ยวกับบริษัท', 60, '[
    {"id":"q1","text":"บริษัทก่อตั้งปีใด?","type":"multiple_choice","options":["2020","2021","2022","2023"],"correct_answer":"2022"},
    {"id":"q2","text":"บริษัทมีนโยบาย WFH","type":"true_false","options":["จริง","เท็จ"],"correct_answer":"จริง"},
    {"id":"q3","text":"ค่านิยมหลักของบริษัทคืออะไร?","type":"short_answer","options":[],"correct_answer":"Innovation"}
  ]');

-- ============================================================
-- NOTE: User accounts (auth.users + profiles) are created via Supabase Auth.
-- Use supabase dashboard or Edge Function to create test accounts:
--   admin@culturepassport.dev / password123
--   manager@culturepassport.dev / password123
--   employee@culturepassport.dev / password123
-- The handle_new_user() trigger will auto-create profiles rows.
-- After creating auth users, update profiles with company/dept/position:
-- ============================================================

-- After creating test users via Supabase Auth, run these to link profiles:
-- UPDATE public.profiles SET
--   company_id = 'a0000000-0000-0000-0000-000000000001',
--   department_id = 'b0000000-0000-0000-0000-000000000001',
--   position_id = 'c0000000-0000-0000-0000-000000000001',
--   probation_start = CURRENT_DATE,
--   probation_end = CURRENT_DATE + INTERVAL '120 days'
-- WHERE email = 'employee@culturepassport.dev';
--
-- UPDATE public.profiles SET
--   company_id = 'a0000000-0000-0000-0000-000000000001',
--   department_id = 'b0000000-0000-0000-0000-000000000001'
-- WHERE email = 'manager@culturepassport.dev';
