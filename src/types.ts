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

export interface CourseUnit {
  id: string;
  unitNumber: number;
  title: string;
  duration: string;
  summary: string;
  topics: string[];
  readingNotes: string;
  practicalChecklist?: string[];
  caseStudy?: {
    title: string;
    scenario: string;
    ruling: string;
  };
  assessment?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface StatutoryReference {
  actName: string;
  sectionOrRule: string;
  relevance: string;
}

export interface ExtractedMediaItem {
  id: string;
  name: string;
  mimeType: string;
  contentType: string;
  duration?: string | number;
  artifactUrl?: string;
  downloadUrl?: string;
  streamingUrl?: string;
  description?: string;
  appIcon?: string;
  posterImage?: string;
}

export interface ExtractedCompetency {
  competencyArea?: string;
  competencyAreaId?: number;
  competencyAreaDescription?: string;
  competencyTheme?: string;
  competencyThemeId?: number;
  competecnyThemeDescription?: string;
  competencyThemeType?: string;
  competencySubTheme?: string;
  competencySubThemeId?: number;
  competecnySubThemeDescription?: string;
}

export interface RawExtractedCourse {
  id: string;
  name: string;
  description: string;
  creator?: string;
  source?: string;
  organisation?: string[] | string;
  duration?: number;
  posterImage?: string;
  appIcon?: string;
  mimeType?: string;
  contentType?: string;
  keywords?: string[];
  competencies_v5?: ExtractedCompetency[];
  language?: string[];
  createdOn?: string;
  lastUpdatedOn?: string;
  childNodesCount?: number;
  leafNodesCount?: number;
  childNodes?: string[];
  leafNodes?: string[];
  subItems?: ExtractedMediaItem[];
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
  externalUrl?: string;
  durationDisplay?: string;
  thumbnailTheme?: 'posh' | 'fire-safety' | 'ndrf' | 'swachhata' | 'default';
  enrolledCount?: string;
  officialCircularRef?: string;
  language?: string;
  targetAudience?: string;
  curriculum?: CourseUnit[];
  statutoryReferences?: StatutoryReference[];
  faqs?: { question: string; answer: string }[];
  // Extracted official data fields
  rawExtracted?: RawExtractedCourse;
  extractedVideos?: ExtractedMediaItem[];
  extractedResources?: ExtractedMediaItem[];
  posterImage?: string;
  appIcon?: string;
  keywords?: string[];
  competencies?: ExtractedCompetency[];
  createdOn?: string;
  lastUpdatedOn?: string;
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
  cognitiveLevel?: 'Recall' | 'Application';
  competencyTag?: string;
  difficulty?: 'Foundation' | 'Intermediate' | 'Advanced';
}

export interface UserProfile {
  name: string;
  designation: string;
  department: string;
  avatarInitials: string;
  cadreLevel: string;
  karmayogiId: string;
  karmaPoints: number;
  competencyReadiness: number;
  readinessDelta: string;
  activePath: string;
  activePathProgress: number;
  insightScore: 'High' | 'Very High' | 'Moderate';
  quizProficiency: string;
}
