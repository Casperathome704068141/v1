export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}

export interface LearningModule {
  id: string;
  title: string;
  content: string;
  quiz: QuizQuestion[];
}

export const learningModules: LearningModule[] = [
  {
    id: 'study-permit-basics',
    title: 'Study Permit Basics',
    content: `Learn the core requirements for obtaining a Canadian study permit, including financial proof, acceptance letters, and biometrics.`,
    quiz: [
      { question: 'Which document proves your admission?', options: ['Work Permit', 'Letter of Acceptance', 'Passport'], answer: 1 },
    ],
  },
  {
    id: 'application-steps',
    title: 'Application Steps',
    content: `Understand each stage of the study permit application, from gathering documents to submitting online.`,
    quiz: [
      { question: 'What comes after uploading your documents?', options: ['Submit application', 'Book flights', 'Apply for jobs'], answer: 0 },
    ],
  },
  {
    id: 'student-life',
    title: 'Life in Canada',
    content: `Tips on housing, part-time work rules, and adjusting to Canadian culture.`,
    quiz: [
      { question: 'How many hours per week can you work on a study permit?', options: ['10', '20', '40'], answer: 1 },
    ],
  },
  {
    id: 'healthcare-insurance',
    title: 'Health Insurance for Students',
    content: `Discover the healthcare coverage options available for international students in Canada, including provincial plans and private insurance.`,
    quiz: [
      { question: 'What document typically grants access to provincial health coverage?', options: ['Study Permit', 'Driver License', 'Work Contract'], answer: 0 },
    ],
  },
  {
    id: 'permanent-residency',
    title: 'Pathways to Permanent Residency',
    content: `Learn about programs like the Post-Graduation Work Permit and Express Entry that can lead to staying in Canada permanently.`,
    quiz: [
      { question: 'Which program lets you work after you finish studies?', options: ['Working Holiday', 'Post-Graduation Work Permit', 'Visitor Visa'], answer: 1 },
    ],
  },
];
