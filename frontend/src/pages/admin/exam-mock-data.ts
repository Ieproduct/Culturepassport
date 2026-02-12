// Mock data for exam-related components (ExamsTab, ExamDetailView)
// Will be replaced by real Supabase data when connected.

import type { Question } from './exam-shared'

/* ─── Mock questions for exam-1 (Figma 52:81339) ─── */
export const MOCK_QUESTIONS: Record<string, Question[]> = {
  'exam-1': [
    {
      type: 'multiple_choice',
      text: 'อะไรคือสิ่งสำคัญที่สุดในการรักษาความปลอดภัยของข้อมูล?',
      options: [
        'ใช้รหัสผ่านที่แข็งแกร่งและไม่แชร์ให้ผู้อื่น',
        'ใช้รหัสผ่านเดียวกันทุกระบบเพื่อความสะดวก',
        'เขียนรหัสผ่านไว้บน Post-it',
        'แชร์รหัสผ่านกับเพื่อนร่วมงานที่ใกล้ชิด',
      ],
      correctAnswer: 0,
    },
    {
      type: 'multiple_choice',
      text: 'ถ้าคุณได้รับอีเมลที่ดูน่าสงสัยจากคนที่ไม่รู้จัก คุณควรทำอย่างไร?',
      options: [
        'เปิดดูและคลิกลิงก์เพื่อดูว่าเป็นอะไร',
        'ลบทิ้งและรายงานให้ IT ทราบ',
        'ส่งต่อให้เพื่อนร่วมงาน',
        'ตอบกลับเพื่อถามว่าเป็นใคร',
      ],
      correctAnswer: 1,
    },
    {
      type: 'essay',
      text: 'การทำงานในพื้นที่สาธารณะ (เช่น ร้านกาแฟ) ควรระวังอะไรมากที่สุด?',
      options: ['', '', '', ''],
      correctAnswer: null,
    },
    {
      type: 'essay',
      text: 'ระยะเวลาในการเปลี่ยนรหัสผ่านที่แนะนำคือทุกๆ กี่เดือน?',
      options: ['', '', '', ''],
      correctAnswer: null,
    },
    {
      type: 'essay',
      text: 'USB ที่เจอตามพื้นในออฟฟิศ ควรทำอย่างไร?',
      options: ['', '', '', ''],
      correctAnswer: null,
    },
    {
      type: 'essay',
      text: 'Two-Factor Authentication (2FA) คืออะไร?',
      options: ['', '', '', ''],
      correctAnswer: null,
    },
    {
      type: 'essay',
      text: 'Phishing คืออะไร?',
      options: ['', '', '', ''],
      correctAnswer: null,
    },
    {
      type: 'essay',
      text: 'การสำรองข้อมูล (Backup) ควรทำบ่อยแค่ไหน?',
      options: ['', '', '', ''],
      correctAnswer: null,
    },
    {
      type: 'essay',
      text: 'Wi-Fi สาธารณะที่ไม่มีรหัสผ่าน มีความเสี่ยงอย่างไร?',
      options: ['', '', '', ''],
      correctAnswer: null,
    },
    {
      type: 'essay',
      text: 'ถ้าคุณสงสัยว่าบัญชีของคุณถูกแฮก ควรทำอย่างไรเป็นอันดับแรก?',
      options: ['', '', '', ''],
      correctAnswer: null,
    },
  ],
}

/* ─── Mock data matching Figma 46:14678 exactly ─── */
export const MOCK_EXAMS = [
  {
    id: 'exam-1',
    title: 'แบบทดสอบความปลอดภัยทางไซเบอร์',
    description: 'ทดสอบความรู้เกี่ยวกับการรักษาความปลอดภัยข้อมูลและระบบสารสนเทศ',
    category: 'ความปลอดภัยและนโยบาย',
    questionCount: 10,
    duration: 15,
    passingScore: 70,
    isActive: true,
  },
  {
    id: 'exam-2',
    title: 'แบบทดสอบวัฒนธรรมองค์กร',
    description: 'ทดสอบความเข้าใจเกี่ยวกับวัฒนธรรม ค่านิยม และสิทธิประโยชน์ของบริษัท',
    category: 'วัฒนธรรมองค์กร',
    questionCount: 10,
    duration: 10,
    passingScore: 70,
    isActive: true,
  },
  {
    id: 'exam-3',
    title: 'แบบทดสอบ Git และ DevOps',
    description: 'ทดสอบความรู้เกี่ยวกับการใช้งาน Git, Version Control และเครื่องมือ DevOps',
    category: 'เทคนิคการทำงาน',
    questionCount: 10,
    duration: 12,
    passingScore: 70,
    isActive: true,
  },
  {
    id: 'exam-4',
    title: 'แบบประเมินทัศนคติและค่านิยม (มีข้อเขียน)',
    description: 'ประเมินทัศนคติ ค่านิยม และความเข้าใจในวัฒนธรรมองค์กร ผ่านคำถามปรนัยและข้อเขียน',
    category: 'วัฒนธรรมองค์กร',
    questionCount: 12,
    duration: 20,
    passingScore: 70,
    isActive: true,
  },
  {
    id: 'exam-5',
    title: 'ข้อสอบอบรมข้อเขียน',
    description: 'แบบทดสอบข้อเขียนเพื่อประเมินความเข้าใจและการประยุกต์ใช้ความรู้ในการทำงาน',
    category: 'วัฒนธรรมองค์กร',
    questionCount: 5,
    duration: 30,
    passingScore: 60,
    isActive: true,
  },
  {
    id: 'exam-6',
    title: 'แบบทดสอบปลายภาค (ข้อกาและข้อเขียนผสม)',
    description: 'แบบทดสอบครอบคลุมความรู้ทั้งหมด ประกอบด้วยข้อกาและข้อเขียน',
    category: 'วัฒนธรรมองค์กร',
    questionCount: 12,
    duration: 45,
    passingScore: 70,
    isActive: true,
  },
]
