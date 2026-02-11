-- CulturePassport — Seed data for DEV/UAT
-- Admin account: admin@culturepassport.com / password1234
-- bcrypt hash for 'password1234' (10 rounds)

-- Company
INSERT INTO public.companies (id, name, code) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'CulturePassport Co.', 'CP001');

-- Department
INSERT INTO public.departments (id, name, company_id) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'HR', 'a0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000002', 'Engineering', 'a0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000003', 'Marketing', 'a0000000-0000-0000-0000-000000000001');

-- Positions
INSERT INTO public.positions (id, name, department_id, level) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'HR Manager', 'b0000000-0000-0000-0000-000000000001', 3),
  ('c0000000-0000-0000-0000-000000000002', 'Software Engineer', 'b0000000-0000-0000-0000-000000000002', 2),
  ('c0000000-0000-0000-0000-000000000003', 'Marketing Specialist', 'b0000000-0000-0000-0000-000000000003', 2);

-- Admin profile
INSERT INTO public.profiles (id, full_name, email, role, company_id, department_id, position_id, status) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'System Admin', 'admin@culturepassport.com', 'admin',
   'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'active');

-- Admin credentials (password: password1234)
-- Hash generated with bcrypt, 10 rounds
INSERT INTO public.auth_credentials (profile_id, password_hash) VALUES
  ('d0000000-0000-0000-0000-000000000001', '$2a$10$rQEY2FKt5nXt5eB5S7lQ3eD8VKjPm4P3c0VR1TpZbFbJxNq6JHWW.');

-- Manager profile
INSERT INTO public.profiles (id, full_name, email, role, company_id, department_id, position_id, status) VALUES
  ('d0000000-0000-0000-0000-000000000002', 'Manager Demo', 'manager@culturepassport.com', 'manager',
   'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'active');

INSERT INTO public.auth_credentials (profile_id, password_hash) VALUES
  ('d0000000-0000-0000-0000-000000000002', '$2a$10$rQEY2FKt5nXt5eB5S7lQ3eD8VKjPm4P3c0VR1TpZbFbJxNq6JHWW.');

-- Employee profiles
INSERT INTO public.profiles (id, full_name, email, role, company_id, department_id, position_id, status, probation_start, probation_end) VALUES
  ('d0000000-0000-0000-0000-000000000003', 'Employee One', 'employee1@culturepassport.com', 'employee',
   'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'active',
   '2024-01-15', '2024-04-15'),
  ('d0000000-0000-0000-0000-000000000004', 'Employee Two', 'employee2@culturepassport.com', 'employee',
   'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'active',
   '2024-02-01', '2024-05-01');

INSERT INTO public.auth_credentials (profile_id, password_hash) VALUES
  ('d0000000-0000-0000-0000-000000000003', '$2a$10$rQEY2FKt5nXt5eB5S7lQ3eD8VKjPm4P3c0VR1TpZbFbJxNq6JHWW.'),
  ('d0000000-0000-0000-0000-000000000004', '$2a$10$rQEY2FKt5nXt5eB5S7lQ3eD8VKjPm4P3c0VR1TpZbFbJxNq6JHWW.');

-- Categories
INSERT INTO public.categories (id, name, description, color_code) VALUES
  ('e0000000-0000-0000-0000-000000000001', 'วัฒนธรรมองค์กร', 'เรียนรู้วัฒนธรรมและค่านิยมองค์กร', '#1447E6'),
  ('e0000000-0000-0000-0000-000000000002', 'ความปลอดภัยและนโยบาย', 'ศึกษานโยบายความปลอดภัยและกฎระเบียบ', '#C10007'),
  ('e0000000-0000-0000-0000-000000000003', 'เทคนิคการทำงาน', 'พัฒนาทักษะและเทคนิคการทำงาน', '#008236'),
  ('e0000000-0000-0000-0000-000000000004', 'ทีมและการสื่อสาร', 'สร้างทักษะการทำงานเป็นทีมและการสื่อสาร', '#8200DB');

-- Sample missions
INSERT INTO public.missions (id, title, description, category_id, estimated_duration) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'ศึกษาค่านิยมองค์กร', 'อ่านเอกสารค่านิยมหลักขององค์กรและเขียนสรุป', 'e0000000-0000-0000-0000-000000000001', '2 days'),
  ('f0000000-0000-0000-0000-000000000002', 'อบรมความปลอดภัย', 'เข้าร่วมอบรมความปลอดภัยในสถานที่ทำงาน', 'e0000000-0000-0000-0000-000000000002', '1 day'),
  ('f0000000-0000-0000-0000-000000000003', 'แนะนำตัวกับทีม', 'แนะนำตัวเองกับสมาชิกในทีมทุกคน', 'e0000000-0000-0000-0000-000000000004', '3 days');

-- Sample user missions
INSERT INTO public.user_missions (mission_id, user_id, status, started_at) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000003', 'in_progress', now()),
  ('f0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000003', 'not_started', NULL),
  ('f0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000004', 'not_started', NULL);

-- Roadmap milestones
INSERT INTO public.roadmap_milestones (title, description, target_day, sort_order) VALUES
  ('วันแรก', 'ปฐมนิเทศและรู้จักทีม', 1, 1),
  ('สัปดาห์แรก', 'เรียนรู้ระบบและเครื่องมือ', 7, 2),
  ('เดือนแรก', 'เริ่มทำงานจริงและรับ feedback', 30, 3),
  ('สิ้นสุดทดลองงาน', 'ประเมินผลและยืนยันตำแหน่ง', 90, 4);

-- Announcements
INSERT INTO public.announcements (title, content, is_active) VALUES
  ('ยินดีต้อนรับพนักงานใหม่!', 'ขอต้อนรับเข้าสู่ครอบครัว CulturePassport ด้วยความยินดี', true),
  ('อัปเดตนโยบายการทำงาน', 'กรุณาอ่านนโยบายการทำงานฉบับปรับปรุงใหม่', true);

-- Exam template
INSERT INTO public.exam_templates (id, title, description, passing_score, questions) VALUES
  ('g0000000-0000-0000-0000-000000000001', 'แบบทดสอบวัฒนธรรมองค์กร', 'ทดสอบความเข้าใจเกี่ยวกับวัฒนธรรมและค่านิยมองค์กร', 70,
   '[{"question":"ค่านิยมหลักขององค์กรคืออะไร?","options":["ความซื่อสัตย์","ความสามัคคี","นวัตกรรม","ถูกทุกข้อ"],"correct":3},{"question":"เป้าหมายหลักของการ onboarding คืออะไร?","options":["ทำงานได้เร็ว","เข้าใจวัฒนธรรม","ทำตามกฎ","สอบผ่าน"],"correct":1}]');
