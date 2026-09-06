export type ScreenId = 'dashboard' | 'gap-analysis' | 'roadmap' | 'quiz-studio' | 'library' | 'progress';

export interface CompetencyItem {
  id: string;
  code: string;
  title: string;
  domain: 'Digital Governance' | 'Financial Management' | 'Citizen Centricity' | 'Public Policy' | 'Administrative Ethics';
  currentLevel: number; // e.g. 1 to 5
  targetLevel: number;
  gapPercent: number; // negative means gap, positive means exceeded
  priority: 'Critical' | 'High' | 'Med' | 'Target Met';
  description: string;
  aiDiagnosis: string;
  recommendedModuleId: string;
  recommendedModuleName: string;
  ruleReference: string;
}

export interface LearningModule {
  id: string;
  title: string;
  domain: string;
  durationMinutes: number;
  progressPercent: number;
  status: 'completed' | 'in-progress' | 'not-started';
  competencyCode: string;
  rating: number;
  provider: string;
  level: 'Executive' | 'Senior Admin' | 'Foundation';
  type: 'Video Lecture' | 'Interactive Masterclass' | 'Policy Brief' | 'Case Study';
  description: string;
  keyTakeaways: string[];
}

export interface QuizQuestion {
  id: string;
  competencyCode: string;
  topic: string;
  scenario: string;
  question: string;
  options: string[];
  correctIndex: number;
  officialRationale: string;
  regulationCitation: string;
}

export interface UserProfile {
  name: string;
  designation: string;
  department: string;
  avatarInitials: string;
  competencyReadiness: number;
  readinessDelta: string;
  activePath: string;
  activePathProgress: number;
  insightScore: 'High' | 'Very High' | 'Moderate';
  quizProficiency: string;
}
