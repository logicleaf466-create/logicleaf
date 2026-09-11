import React, { useState, useRef, useEffect } from 'react';
import { LearningModule, CourseUnit, ExtractedMediaItem, QuizQuestion } from '../types';
import { EXTRACTED_COURSES_DATA } from '../data/courseData';
import { quizQuestions as defaultQuizQuestions } from '../data/mockData';
import {
  X,
  Play,
  Pause,
  Clock,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  BookOpen,
  FileText,
  HelpCircle,
  Award,
  ChevronRight,
  RotateCcw,
  Users,
  Check,
  Video,
  Download,
  ExternalLink,
  Database,
  Server,
  Layers,
  Code,
  ListVideo,
  Tag,
  CheckCircle,
  Copy,
  ArrowRight,
  Zap,
  GraduationCap,
  RefreshCw,
  Eye,
  AlertTriangle,
  Flag,
  Loader2,
} from 'lucide-react';

interface ModuleModalProps {
  module: LearningModule | null;
  onClose: () => void;
  onUpdateProgress: (moduleId: string, newProgress: number) => void;
  onNavigateToQuizStudio?: (questions: QuizQuestion[], quizTitle: string, mode?: 'practice' | 'test') => void;
  onQuizComplete?: (score: number, total: number, mode: 'practice' | 'test') => void;
}

export const ModuleModal: React.FC<ModuleModalProps> = ({
  module,
  onClose,
  onUpdateProgress,
  onNavigateToQuizStudio,
  onQuizComplete,
}) => {
  if (!module) return null;

  // Retrieve enriched details from extracted database if available
  const extracted = EXTRACTED_COURSES_DATA[module.id];
  const curriculum: CourseUnit[] = module.curriculum || extracted?.curriculum || [];
  const statutoryRefs = module.statutoryReferences || extracted?.statutoryReferences || [];
  const faqs = module.faqs || extracted?.faqs || [];
  const enrolledCount = module.enrolledCount || extracted?.enrolledCount || '100,000+ Officers';
  const circularRef = module.officialCircularRef || extracted?.officialCircularRef || 'DoPT National Capacity Framework Directives';
  const targetAudience = module.targetAudience || extracted?.targetAudience || 'All Central & State Civil Servants';

  // Extracted media items (videos & interactive items)
  const extractedVideos: ExtractedMediaItem[] =
    module.extractedVideos || extracted?.videos || [];
  const allSubItems: ExtractedMediaItem[] =
    module.extractedResources || extracted?.subItems || [];
  const rawData = module.rawExtracted || extracted?.raw;

  const [activeTab, setActiveTab] = useState<
    'player' | 'curriculum' | 'quiz' | 'overview' | 'statutory' | 'extracted'
  >(extractedVideos.length > 0 ? 'player' : 'curriculum');

  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const activeVideo: ExtractedMediaItem | undefined =
    extractedVideos[selectedVideoIndex] || extractedVideos[0];

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Curriculum state
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number>(0);
  const [overallProgress, setOverallProgress] = useState<number>(() => {
    try {
      const savedProgress = localStorage.getItem(`igot_overall_progress_${module.id}`);
      if (savedProgress !== null) return parseInt(savedProgress, 10);
    } catch {}
    return module.progressPercent;
  });

  // Per-video watch percentage map: { [videoId: string]: percentage (0..100) }
  const [videoWatchMap, setVideoWatchMap] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(`igot_video_progress_${module.id}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    const initial: Record<string, number> = {};
    if (extractedVideos.length > 0 && module.progressPercent > 0) {
      let rem = (module.progressPercent / 100) * extractedVideos.length;
      extractedVideos.forEach((v) => {
        const p = Math.min(1, Math.max(0, rem));
        initial[v.id] = Math.round(p * 100);
        rem -= p;
      });
    }
    return initial;
  });

  // Live video playback stats
  const [videoPlaybackStats, setVideoPlaybackStats] = useState<{
    currentTime: number;
    duration: number;
    percent: number;
  }>({ currentTime: 0, duration: 0, percent: 0 });

  const [completedUnits, setCompletedUnits] = useState<Record<number, boolean>>({
    0: overallProgress >= 20,
    1: overallProgress >= 40,
    2: overallProgress >= 60,
    3: overallProgress >= 80,
    4: overallProgress >= 100,
  });

  // Quiz state for the selected unit
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // YouTube-style End Screen on Video Completion
  const [showEndScreen, setShowEndScreen] = useState<boolean>(false);

  // AI Quiz Generation & Active Quiz State (Module-Level or Course-Level)
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [generationScope, setGenerationScope] = useState<'module' | 'course'>('course');
  const [generationStep, setGenerationStep] = useState<string>('');
  const [activeGeneratedQuiz, setActiveGeneratedQuiz] = useState<{
    title: string;
    scope: 'module' | 'course';
    questions: QuizQuestion[];
  } | null>(null);
  const [isQuizViewOpen, setIsQuizViewOpen] = useState<boolean>(false);
  const [quizMode, setQuizMode] = useState<'practice' | 'test'>('practice');

  // Interactive In-Modal Quiz State
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, number>>({});
  const [practiceShowRationale, setPracticeShowRationale] = useState<Record<number, boolean>>({});
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({});
  const [testSubmitted, setTestSubmitted] = useState<boolean>(false);
  const [testTimeRemaining, setTestTimeRemaining] = useState<number>(300);
  const [karmaAwardedInQuiz, setKarmaAwardedInQuiz] = useState<number>(0);

  // Backend API test state
  const [backendApiData, setBackendApiData] = useState<any>(null);
  const [backendLoading, setBackendLoading] = useState<boolean>(false);

  const selectedUnit = curriculum[selectedUnitIndex] || curriculum[0];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, activeVideo]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleFetchBackendApi = async (endpoint: string) => {
    setBackendLoading(true);
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setBackendApiData(data);
    } catch (err: any) {
      setBackendApiData({ error: err.message });
    } finally {
      setBackendLoading(false);
    }
  };

  const handleSelectUnit = (idx: number) => {
    setSelectedUnitIndex(idx);
    setQuizSelectedOption(null);
    setQuizSubmitted(false);
  };

  // Ref tracking progress to avoid redundant calls to parent
  const lastReportedTotalRef = useRef<number>(overallProgress);

  // Video timeupdate: dynamically calculates overall progress from user's actual watch time
  const handleVideoTimeUpdate = (videoId: string, currentTime: number, duration: number) => {
    if (!duration || duration <= 0) return;
    const currentVideoPct = Math.min(100, Math.round((currentTime / duration) * 100));
    setVideoPlaybackStats({ currentTime, duration, percent: currentVideoPct });

    // ONLY advance if user actually watched further than previous recorded progress
    const prevPct = videoWatchMap[videoId] || 0;
    if (currentVideoPct > prevPct) {
      const updated = { ...videoWatchMap, [videoId]: currentVideoPct };
      setVideoWatchMap(updated);
      try {
        localStorage.setItem(`igot_video_progress_${module.id}`, JSON.stringify(updated));
      } catch {}

      if (extractedVideos.length > 0) {
        const sum = extractedVideos.reduce((acc, v) => acc + (updated[v.id] || 0), 0);
        const computedTotal = Math.min(100, Math.round(sum / extractedVideos.length));
        if (computedTotal !== lastReportedTotalRef.current) {
          lastReportedTotalRef.current = computedTotal;
          setOverallProgress(computedTotal);
          try {
            localStorage.setItem(`igot_overall_progress_${module.id}`, computedTotal.toString());
          } catch {}
          setTimeout(() => {
            onUpdateProgress(module.id, computedTotal);
          }, 0);
        }
      }
    }
  };

  // Reset end screen whenever selected video changes
  useEffect(() => {
    setShowEndScreen(false);
  }, [selectedVideoIndex]);

  // Timer effect for interactive Test Mode
  useEffect(() => {
    let timer: any;
    if (isQuizViewOpen && quizMode === 'test' && !testSubmitted && testTimeRemaining > 0) {
      timer = setInterval(() => {
        setTestTimeRemaining((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isQuizViewOpen, quizMode, testSubmitted, testTimeRemaining]);

  // When timer reaches 0, trigger submit outside the setter
  useEffect(() => {
    if (isQuizViewOpen && quizMode === 'test' && !testSubmitted && testTimeRemaining === 0) {
      handleTestSubmit();
    }
  }, [testTimeRemaining, isQuizViewOpen, quizMode, testSubmitted]);

  // Video ended handler: sets video to 100% and displays YouTube-style black screen overlay with options
  const handleVideoEnded = (videoId: string) => {
    const updated = { ...videoWatchMap, [videoId]: 100 };
    setVideoWatchMap(updated);
    try {
      localStorage.setItem(`igot_video_progress_${module.id}`, JSON.stringify(updated));
    } catch {}

    if (extractedVideos.length > 0) {
      const sum = extractedVideos.reduce((acc, v) => acc + (updated[v.id] || 0), 0);
      const computedTotal = Math.min(100, Math.round(sum / extractedVideos.length));
      lastReportedTotalRef.current = computedTotal;
      setOverallProgress(computedTotal);
      try {
        localStorage.setItem(`igot_overall_progress_${module.id}`, computedTotal.toString());
      } catch {}
      setTimeout(() => {
        onUpdateProgress(module.id, computedTotal);
      }, 0);
    }

    // YouTube-style end screen overlay appears over the video!
    setShowEndScreen(true);
  };

  // YouTube End Screen Option 1: 1) Next Module / Lecture
  const handleEndScreenNextModule = () => {
    setShowEndScreen(false);
    if (selectedVideoIndex < extractedVideos.length - 1) {
      setSelectedVideoIndex(selectedVideoIndex + 1);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
      }, 200);
    } else if (selectedUnitIndex < curriculum.length - 1) {
      setSelectedUnitIndex(selectedUnitIndex + 1);
      setActiveTab('curriculum');
    } else {
      setOverallProgress(100);
      setTimeout(() => {
        onUpdateProgress(module.id, 100);
      }, 0);
    }
  };

  // YouTube End Screen Replay Action
  const handleEndScreenReplay = () => {
    setShowEndScreen(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  // Comprehensive AI Quiz Generator for either Module-Level or Whole Course
  const generateQuizForScope = async (scope: 'module' | 'course') => {
    setIsGeneratingQuiz(true);
    setGenerationScope(scope);
    setShowEndScreen(false);
    setActiveTab('quiz');
    setIsQuizViewOpen(true);
    setGenerationStep('Analyzing curriculum & regulatory guidelines...');

    try {
      let topic = '';
      let contextText = '';

      if (scope === 'module') {
        const videoName = activeVideo?.name || `Module Lecture ${selectedVideoIndex + 1}`;
        topic = `${module.title}: ${videoName}`;
        contextText = `Course Title: ${module.title}
Completed Video Lecture: ${videoName}
Category: ${module.category}
Competency Code: ${module.competencyCode}
Provider: ${module.provider}
Statutory Guidelines: ${statutoryRefs.map((s) => `${s.actName} (${s.sectionOrRule})`).join('; ')}
Task: Formulate 5 cadre-level decision dilemmas specifically based on this completed lecture.`;
      } else {
        topic = `${module.title} (Whole Course Assessment)`;
        const curriculumSummary = curriculum
          .map((c, i) => `Unit ${i + 1}: ${c.title}\n${c.summary || ''}`)
          .join('\n\n');
        contextText = `Course Title: ${module.title}
Provider: ${module.provider}
Target Audience: ${targetAudience}
Level: ${module.level}
Circular Reference: ${circularRef}
Curriculum Units (${curriculum.length} Units):
${curriculumSummary}
Statutory Reference Frameworks:
${statutoryRefs.map((s) => `${s.actName} (${s.sectionOrRule}): ${s.relevance}`).join('\n')}
Task: Generate an authoritative comprehensive 5-question examination testing all units of this course.`;
      }

      setGenerationStep('Synthesizing civil service decision scenarios via AI...');

      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          numQuestions: 5,
          cadreLevel: module.level || 'Senior Admin (Level 11-13)',
          cognitiveBalance: 'mixed',
          fileText: contextText,
        }),
      });

      if (!response.ok) {
        throw new Error(`Generation server returned status ${response.status}`);
      }

      const result = await response.json();
      let generatedQuestions: QuizQuestion[] = [];

      if (result.success && Array.isArray(result.questions) && result.questions.length > 0) {
        generatedQuestions = result.questions;
      } else {
        generatedQuestions = defaultQuizQuestions.slice(0, 5);
      }

      const quizData = {
        title:
          scope === 'module'
            ? `Module Quiz: ${activeVideo?.name || 'Lecture ' + (selectedVideoIndex + 1)}`
            : `Full Course Quiz: ${module.title}`,
        scope,
        questions: generatedQuestions,
      };

      setActiveGeneratedQuiz(quizData);
      setCurrentQuizIdx(0);
      setPracticeAnswers({});
      setPracticeShowRationale({});
      setTestAnswers({});
      setTestSubmitted(false);
      setTestTimeRemaining(generatedQuestions.length * 90);
      setQuizMode('practice');
      setIsQuizViewOpen(true);
    } catch (err: any) {
      console.warn('AI Quiz generation note, using civil service knowledge base:', err);
      const fallbackQuestions = defaultQuizQuestions.slice(0, 5);
      const quizData = {
        title:
          scope === 'module'
            ? `Module Quiz: ${activeVideo?.name || 'Lecture ' + (selectedVideoIndex + 1)}`
            : `Full Course Quiz: ${module.title}`,
        scope,
        questions: fallbackQuestions,
      };
      setActiveGeneratedQuiz(quizData);
      setCurrentQuizIdx(0);
      setPracticeAnswers({});
      setPracticeShowRationale({});
      setTestAnswers({});
      setTestSubmitted(false);
      setTestTimeRemaining(450);
      setQuizMode('practice');
      setIsQuizViewOpen(true);
    } finally {
      setIsGeneratingQuiz(false);
      setGenerationStep('');
    }
  };

  const handleTriggerModuleQuiz = () => {
    generateQuizForScope('module');
  };

  const handleTriggerCourseQuiz = () => {
    generateQuizForScope('course');
  };

  const handleTestSubmit = () => {
    setTestSubmitted(true);
    if (!activeGeneratedQuiz) return;
    const questions = activeGeneratedQuiz.questions;
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (testAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });
    const bonus = Math.round((correctCount / questions.length) * 100) + 30;
    setKarmaAwardedInQuiz(bonus);
    if (onQuizComplete) {
      setTimeout(() => {
        onQuizComplete(correctCount, questions.length, 'test');
      }, 0);
    }
  };

  // Reset Progress option: resets video watch, units, and overall progress back to 0%
  const handleResetProgress = () => {
    const zeroMap: Record<string, number> = {};
    extractedVideos.forEach((v) => {
      zeroMap[v.id] = 0;
    });
    setVideoWatchMap(zeroMap);
    try {
      localStorage.removeItem(`igot_video_progress_${module.id}`);
      localStorage.removeItem(`igot_overall_progress_${module.id}`);
    } catch {}

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
    setVideoPlaybackStats({ currentTime: 0, duration: videoRef.current?.duration || 0, percent: 0 });

    setCompletedUnits({ 0: false, 1: false, 2: false, 3: false, 4: false });
    setQuizSelectedOption(null);
    setQuizSubmitted(false);

    lastReportedTotalRef.current = 0;
    setOverallProgress(0);
    setTimeout(() => {
      onUpdateProgress(module.id, 0);
    }, 0);
  };

  const handleMarkUnitComplete = (idx: number) => {
    const nextCompleted = { ...completedUnits, [idx]: true };
    setCompletedUnits(nextCompleted);
    const totalDone = Object.values(nextCompleted).filter(Boolean).length;
    const unitPercent = Math.min(100, Math.round((totalDone / Math.max(1, curriculum.length)) * 100));
    const newPercent = Math.max(overallProgress, unitPercent);
    lastReportedTotalRef.current = newPercent;
    setOverallProgress(newPercent);
    try {
      localStorage.setItem(`igot_overall_progress_${module.id}`, newPercent.toString());
    } catch {}
    setTimeout(() => {
      onUpdateProgress(module.id, newPercent);
    }, 0);
  };

  const handleSimulateStudy = () => {
    const nextVal = Math.min(100, overallProgress + 20);
    lastReportedTotalRef.current = nextVal;
    setOverallProgress(nextVal);
    if (extractedVideos.length > 0) {
      let rem = (nextVal / 100) * extractedVideos.length;
      const updatedMap: Record<string, number> = {};
      extractedVideos.forEach((v) => {
        const p = Math.min(1, Math.max(0, rem));
        updatedMap[v.id] = Math.round(p * 100);
        rem -= p;
      });
      setVideoWatchMap(updatedMap);
      try {
        localStorage.setItem(`igot_video_progress_${module.id}`, JSON.stringify(updatedMap));
      } catch {}
    }
    try {
      localStorage.setItem(`igot_overall_progress_${module.id}`, nextVal.toString());
    } catch {}
    setTimeout(() => {
      onUpdateProgress(module.id, nextVal);
    }, 0);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      id="module-modal-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="module-modal-content"
        className="bg-white border border-[#E5E7EB] w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] text-[#1B2133]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header: iGOT Royal Navy (#1B4CA1) */}
        <div className="p-4 sm:p-5 bg-[#1B4CA1] text-white flex items-start justify-between border-b border-[#002B6C] relative">
          <div className="pr-6">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#EF951E] text-white shadow-2xs">
                {module.competencyCode}
              </span>
              <span className="text-xs text-blue-100 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                {module.provider}
              </span>
              <span className="text-xs text-blue-300">•</span>
              <span className="text-xs text-blue-200">{module.level}</span>
              <span className="text-xs text-blue-300">•</span>
              <span className="text-xs text-amber-200 font-semibold">
                {module.durationDisplay || `${module.durationMinutes}m`}
              </span>
              <span className="text-xs text-blue-300">•</span>
              <span className="text-[10px] font-mono bg-white/10 text-blue-200 px-2 py-0.5 rounded border border-white/15">
                ID: {module.id}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
              {module.title}
            </h2>
            {extracted?.hindiTitle && (
              <p className="text-xs text-blue-100 font-medium mt-0.5 opacity-90">
                {extracted.hindiTitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-generate-course-quiz-header"
              onClick={handleTriggerCourseQuiz}
              disabled={isGeneratingQuiz}
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 bg-[#EF951E] hover:bg-[#F08811] text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
              title="Generate AI Quiz for the whole course"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-200 shrink-0" />
              <span className="hidden sm:inline">Generate Whole Course Quiz</span>
              <span className="sm:hidden">Course Quiz</span>
            </button>
            <button
              id="btn-close-modal"
              onClick={onClose}
              className="p-2 text-blue-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher - Responsive 6-Column Grid with AI Quiz Tab */}
        <div
          id="course-modal-tab-bar"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 p-2 sm:p-2.5 bg-[#EDF1F7] border-b border-[#C7D9FB]"
        >
          {/* Tab 1: Video Lectures */}
          <button
            id="tab-player"
            onClick={() => setActiveTab('player')}
            className={`py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
              activeTab === 'player'
                ? 'bg-[#1B4CA1] text-white shadow-md ring-2 ring-[#EF951E]/60'
                : 'bg-white hover:bg-slate-50 text-[#1B2133] hover:text-[#1B4CA1] border border-slate-200 shadow-2xs'
            }`}
          >
            <ListVideo className={`w-4 h-4 shrink-0 ${activeTab === 'player' ? 'text-amber-300' : 'text-[#EF951E]'}`} />
            <span className="truncate">Video Lectures</span>
            {extractedVideos.length > 0 && (
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                  activeTab === 'player'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#FFF4E5] text-[#E07D10] border border-[#FFD2A1]'
                }`}
              >
                {extractedVideos.length}
              </span>
            )}
          </button>

          {/* Tab 2: Curriculum */}
          <button
            id="tab-curriculum"
            onClick={() => setActiveTab('curriculum')}
            className={`py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
              activeTab === 'curriculum'
                ? 'bg-[#1B4CA1] text-white shadow-md ring-2 ring-[#EF951E]/60'
                : 'bg-white hover:bg-slate-50 text-[#1B2133] hover:text-[#1B4CA1] border border-slate-200 shadow-2xs'
            }`}
          >
            <BookOpen className={`w-4 h-4 shrink-0 ${activeTab === 'curriculum' ? 'text-amber-300' : 'text-[#1B4CA1]'}`} />
            <span className="truncate">Curriculum</span>
            {curriculum.length > 0 && (
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                  activeTab === 'curriculum'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#EDF1F7] text-[#1B4CA1] border border-[#C7D9FB]'
                }`}
              >
                {curriculum.length}
              </span>
            )}
          </button>

          {/* Tab 3: AI Quiz */}
          <button
            id="tab-quiz"
            onClick={() => {
              setActiveTab('quiz');
              setIsQuizViewOpen(true);
            }}
            className={`py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
              activeTab === 'quiz'
                ? 'bg-[#EF951E] text-white shadow-md ring-2 ring-[#1B4CA1]/60'
                : 'bg-white hover:bg-slate-50 text-[#1B2133] hover:text-[#EF951E] border border-slate-200 shadow-2xs'
            }`}
          >
            <Sparkles className={`w-4 h-4 shrink-0 ${activeTab === 'quiz' ? 'text-white' : 'text-[#EF951E]'}`} />
            <span className="truncate">AI Quiz</span>
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                activeTab === 'quiz'
                  ? 'bg-white/20 text-white'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {activeGeneratedQuiz ? activeGeneratedQuiz.questions.length : 'AI'}
            </span>
          </button>

          {/* Tab 3: iGOT Raw Data */}
          <button
            id="tab-extracted"
            onClick={() => setActiveTab('extracted')}
            className={`py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
              activeTab === 'extracted'
                ? 'bg-[#1B4CA1] text-white shadow-md ring-2 ring-[#EF951E]/60'
                : 'bg-white hover:bg-slate-50 text-[#1B2133] hover:text-[#1B4CA1] border border-slate-200 shadow-2xs'
            }`}
          >
            <Database className={`w-4 h-4 shrink-0 ${activeTab === 'extracted' ? 'text-amber-300' : 'text-purple-600'}`} />
            <span className="truncate">iGOT Raw Data</span>
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                activeTab === 'extracted'
                  ? 'bg-white/20 text-white'
                  : 'bg-purple-50 text-purple-700 border border-purple-200'
              }`}
            >
              API
            </span>
          </button>

          {/* Tab 4: Acts & FAQs */}
          <button
            id="tab-statutory"
            onClick={() => setActiveTab('statutory')}
            className={`py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
              activeTab === 'statutory'
                ? 'bg-[#1B4CA1] text-white shadow-md ring-2 ring-[#EF951E]/60'
                : 'bg-white hover:bg-slate-50 text-[#1B2133] hover:text-[#1B4CA1] border border-slate-200 shadow-2xs'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 shrink-0 ${activeTab === 'statutory' ? 'text-amber-300' : 'text-emerald-600'}`} />
            <span className="truncate">Acts & FAQs</span>
            {(statutoryRefs.length > 0 || faqs.length > 0) && (
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                  activeTab === 'statutory'
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {statutoryRefs.length + faqs.length}
              </span>
            )}
          </button>

          {/* Tab 5: Overview */}
          <button
            id="tab-overview"
            onClick={() => setActiveTab('overview')}
            className={`py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center col-span-2 sm:col-span-1 ${
              activeTab === 'overview'
                ? 'bg-[#1B4CA1] text-white shadow-md ring-2 ring-[#EF951E]/60'
                : 'bg-white hover:bg-slate-50 text-[#1B2133] hover:text-[#1B4CA1] border border-slate-200 shadow-2xs'
            }`}
          >
            <FileText className={`w-4 h-4 shrink-0 ${activeTab === 'overview' ? 'text-amber-300' : 'text-[#1B4CA1]'}`} />
            <span className="truncate">Overview</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
          {/* TAB 1: REAL MP4 VIDEO LECTURE PLAYER WITH PLAYLIST */}
          {activeTab === 'player' && (
            <div className="space-y-6">
              {extractedVideos.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Video Stage Column */}
                  <div className="lg:col-span-8 space-y-3">
                    <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 aspect-video flex items-center justify-center">
                      {activeVideo?.artifactUrl ? (
                        <video
                          ref={videoRef}
                          key={activeVideo.artifactUrl}
                          src={activeVideo.artifactUrl}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-contain"
                          onTimeUpdate={(e) => {
                            const el = e.currentTarget;
                            if (el.duration && el.duration > 0 && activeVideo) {
                              handleVideoTimeUpdate(activeVideo.id, el.currentTime, el.duration);
                            }
                          }}
                          onEnded={() => {
                            if (activeVideo) {
                              handleVideoEnded(activeVideo.id);
                            }
                          }}
                        >
                          Your browser does not support HTML5 video playback.
                        </video>
                      ) : (
                        <div className="p-8 text-center text-white space-y-2">
                          <Video className="w-12 h-12 text-[#EF951E] mx-auto opacity-70" />
                          <p className="text-sm font-bold">Interactive Module Preview</p>
                          <p className="text-xs text-slate-400">
                            This module is structured as an interactive HTML/SCORM package.
                          </p>
                        </div>
                      )}

                      {/* YouTube-style End Screen Overlay on Module Completion */}
                      {showEndScreen && (
                        <div
                          id="youtube-video-end-screen"
                          className="absolute inset-0 z-30 bg-black/92 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-6 text-white animate-in fade-in duration-200"
                        >
                          {/* Top Bar of End Screen */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                                Video Lecture Complete (100% Watched)
                              </span>
                            </div>
                            <button
                              id="btn-dismiss-end-screen"
                              onClick={() => setShowEndScreen(false)}
                              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                            >
                              Dismiss Overlay
                            </button>
                          </div>

                          {/* Center Cards - YouTube Style: Option 1) Next Module, Option 2) Generate AI Quiz */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-auto max-w-2xl mx-auto w-full">
                            {/* Option 1: Next Module / Lecture */}
                            <button
                              id="end-screen-option-next-module"
                              onClick={handleEndScreenNextModule}
                              className="group text-left relative bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-amber-400 rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] shadow-xl flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1B4CA1] text-white px-2 py-0.5 rounded shadow-2xs">
                                    1) Next Module / Lecture
                                  </span>
                                  <Play className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
                                </div>
                                <h4 className="text-sm font-bold text-white line-clamp-2 group-hover:text-amber-200 transition-colors">
                                  {selectedVideoIndex < extractedVideos.length - 1
                                    ? extractedVideos[selectedVideoIndex + 1].name
                                    : selectedUnitIndex < curriculum.length - 1
                                    ? curriculum[selectedUnitIndex + 1].title
                                    : 'All Lectures Completed — Review Units'}
                                </h4>
                                <p className="text-[11px] text-slate-300 mt-1">
                                  {selectedVideoIndex < extractedVideos.length - 1
                                    ? `Continue immediately to lecture #${selectedVideoIndex + 2}`
                                    : 'Advance to the next curriculum unit'}
                                </p>
                              </div>
                              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-300">
                                <span>Advance to Next</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </button>

                            {/* Option 2: Generate AI Quiz */}
                            <button
                              id="end-screen-option-generate-quiz"
                              onClick={handleTriggerModuleQuiz}
                              className="group text-left relative bg-gradient-to-br from-[#1B4CA1]/90 to-[#EF951E]/90 hover:from-[#1B4CA1] hover:to-[#EF951E] border-2 border-amber-400/50 hover:border-amber-300 rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] shadow-xl flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EF951E] text-white px-2 py-0.5 rounded shadow-xs">
                                    2) Generate AI Quiz
                                  </span>
                                  <Sparkles className="w-5 h-5 text-yellow-200 group-hover:rotate-12 transition-transform" />
                                </div>
                                <h4 className="text-sm font-bold text-white line-clamp-2">
                                  Assess: {activeVideo?.name || 'Current Lecture'}
                                </h4>
                                <p className="text-[11px] text-amber-100 mt-1">
                                  Generate 5 civil service scenario dilemmas based on this lecture
                                </p>
                              </div>
                              <div className="mt-3 pt-2 border-t border-white/15 flex items-center justify-between text-xs font-bold text-white">
                                <span>Generate AI Assessment</span>
                                <Zap className="w-4 h-4 text-yellow-300 group-hover:scale-110 transition-transform" />
                              </div>
                            </button>
                          </div>

                          {/* Bottom Actions Toolbar */}
                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
                            <button
                              id="btn-end-screen-replay"
                              onClick={handleEndScreenReplay}
                              className="flex items-center gap-1.5 text-slate-300 hover:text-white px-2.5 py-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Replay Video</span>
                            </button>

                            <button
                              id="btn-end-screen-course-quiz"
                              onClick={handleTriggerCourseQuiz}
                              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 px-2.5 py-1 rounded hover:bg-white/10 transition-colors cursor-pointer font-bold"
                            >
                              <GraduationCap className="w-4 h-4" />
                              <span>Generate Whole Course Quiz</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Assessment Action Bar */}
                    <div className="p-3 bg-[#EDF1F7] rounded-xl border border-[#C7D9FB] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#EF951E]" />
                        <span className="text-xs font-extrabold text-[#1B4CA1]">
                          Interactive AI Assessments:
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          id="btn-trigger-module-quiz-bar"
                          onClick={handleTriggerModuleQuiz}
                          disabled={isGeneratingQuiz}
                          className="px-3 py-1.5 bg-[#EF951E] hover:bg-[#F08811] text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                          <span>Generate Quiz (This Lecture)</span>
                        </button>
                        <button
                          id="btn-trigger-course-quiz-bar"
                          onClick={handleTriggerCourseQuiz}
                          disabled={isGeneratingQuiz}
                          className="px-3 py-1.5 bg-[#1B4CA1] hover:bg-[#002B6C] text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                        >
                          <GraduationCap className="w-3.5 h-3.5 text-blue-200" />
                          <span>Generate Whole Course Quiz</span>
                        </button>
                        <button
                          id="btn-preview-end-screen"
                          onClick={() => setShowEndScreen(true)}
                          title="Preview YouTube-style completion screen"
                          className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>Preview End Screen</span>
                        </button>
                      </div>
                    </div>

                    {/* Active Video Title & Actions */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold bg-[#EF951E] text-white px-2 py-0.5 rounded uppercase tracking-wider">
                              Video {selectedVideoIndex + 1} of {extractedVideos.length}
                            </span>
                            <span className="text-xs font-mono text-slate-500">
                              ID: {activeVideo?.id}
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base font-extrabold text-[#1B2133]">
                            {activeVideo?.name || 'Course Lecture Video'}
                          </h3>
                        </div>

                        {/* Speed selector & Download actions */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5 text-xs">
                            {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                              <button
                                key={spd}
                                onClick={() => setPlaybackSpeed(spd)}
                                className={`px-2 py-1 rounded font-bold cursor-pointer transition-colors ${
                                  playbackSpeed === spd
                                    ? 'bg-[#1B4CA1] text-white'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                {spd}x
                              </button>
                            ))}
                          </div>

                          {activeVideo?.artifactUrl && (
                            <a
                              href={activeVideo.artifactUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className="px-3 py-1.5 bg-[#EDF1F7] hover:bg-[#1B4CA1] hover:text-white text-[#1B4CA1] border border-[#C7D9FB] rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download MP4</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Real-time Video Watch Bar */}
                      <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#1B4CA1]">Lecture Watched:</span>
                          <div className="w-32 sm:w-48 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-200 ${
                                (videoWatchMap[activeVideo?.id || ''] || 0) >= 95
                                  ? 'bg-emerald-500'
                                  : 'bg-[#EF951E]'
                              }`}
                              style={{ width: `${videoWatchMap[activeVideo?.id || ''] || 0}%` }}
                            ></div>
                          </div>
                          <span className="font-mono font-bold text-slate-800">
                            {videoWatchMap[activeVideo?.id || ''] || 0}%
                          </span>
                        </div>
                        {videoPlaybackStats.duration > 0 && (
                          <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>
                              {formatTime(videoPlaybackStats.currentTime)} / {formatTime(videoPlaybackStats.duration)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Source Verification Badge */}
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          <strong>Verified Public Source:</strong> Streamed directly from official DoPT iGOT Karmayogi content store.
                        </span>
                      </div>
                      {activeVideo?.artifactUrl && (
                        <button
                          onClick={() => handleCopy(activeVideo.artifactUrl!)}
                          className="text-[11px] font-mono text-emerald-700 hover:text-emerald-900 flex items-center gap-1 underline cursor-pointer shrink-0"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedUrl === activeVideo.artifactUrl ? 'Copied!' : 'Copy Direct URL'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Playlist Column */}
                  <div className="lg:col-span-4 space-y-2.5">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                      <h4 className="text-xs font-extrabold text-[#1B4CA1] uppercase tracking-wider flex items-center gap-1.5">
                        <ListVideo className="w-4 h-4 text-[#EF951E]" />
                        <span>Video Lecture Playlist</span>
                      </h4>
                      <span className="text-[11px] font-bold text-slate-500">
                        {extractedVideos.length} lectures
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                      {extractedVideos.map((vid, idx) => {
                        const isSelected = idx === selectedVideoIndex;
                        const durationSec = typeof vid.duration === 'string' ? parseInt(vid.duration, 10) : vid.duration;
                        const durationFormatted = durationSec
                          ? `${Math.floor(durationSec / 60)}m ${durationSec % 60}s`
                          : 'Lecture Video';
                        const vidProgress = videoWatchMap[vid.id] || 0;

                        return (
                          <div
                            key={vid.id}
                            onClick={() => setSelectedVideoIndex(idx)}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#EDF1F7] border-[#1B4CA1] ring-1 ring-[#1B4CA1]/30 shadow-xs'
                                : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                                #{idx + 1} • {durationFormatted}
                              </span>
                              <div className="flex items-center gap-1">
                                {vidProgress >= 95 ? (
                                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Watched
                                  </span>
                                ) : vidProgress > 0 ? (
                                  <span className="text-[10px] font-bold text-[#1B4CA1] bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">
                                    {vidProgress}%
                                  </span>
                                ) : null}

                                {isSelected ? (
                                  <span className="text-[10px] font-bold text-[#EF951E] bg-[#FFF4E5] border border-[#FFD2A1] px-1.5 py-0.2 rounded flex items-center gap-1">
                                    <Play className="w-2.5 h-2.5 fill-current" /> Playing
                                  </span>
                                ) : vidProgress === 0 ? (
                                  <span className="text-[10px] text-slate-400 font-medium">Play</span>
                                ) : null}
                              </div>
                            </div>
                            <h5
                              className={`text-xs font-bold line-clamp-2 ${
                                isSelected ? 'text-[#1B4CA1]' : 'text-slate-800'
                              }`}
                            >
                              {vid.name}
                            </h5>

                            {/* Mini Progress Bar per Video */}
                            {vidProgress > 0 && (
                              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-2">
                                <div
                                  className={`h-full transition-all duration-200 ${
                                    vidProgress >= 95 ? 'bg-emerald-500' : 'bg-[#EF951E]'
                                  }`}
                                  style={{ width: `${vidProgress}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* All Extracted Resources Info */}
                    {allSubItems.length > extractedVideos.length && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
                        <p className="font-bold text-slate-800">Additional Extracted Sub-Items:</p>
                        <p className="text-[11px]">
                          {allSubItems.length - extractedVideos.length} interactive exercises and assessments are loaded in the{' '}
                          <span
                            onClick={() => setActiveTab('extracted')}
                            className="text-[#1B4CA1] font-bold underline cursor-pointer"
                          >
                            Extracted Data tab
                          </span>.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* For modules without MP4 video (interactive SCORM package like Swachhata Hi Seva) */
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-[#FEFAF4] border border-[#FFD2A1] space-y-3">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-[#C37024]">
                      <Sparkles className="w-5 h-5 text-[#EF951E]" />
                      <span>Interactive e-Learning SCORM Package Extracted</span>
                    </div>
                    <p className="text-xs text-[#1B2133] leading-relaxed">
                      This course is published on iGOT Karmayogi as an interactive HTML / SCORM learning module rather than a standalone MP4 video. The full curriculum, interactive lessons, cleanliness target units (CTUs), Safai Mitra security guidelines, and self-assessment questions are fully integrated below.
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => setActiveTab('curriculum')}
                        className="px-4 py-2 bg-[#1B4CA1] hover:bg-[#002B6C] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Launch Interactive Curriculum</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('extracted')}
                        className="px-4 py-2 bg-white hover:bg-slate-50 text-[#1B4CA1] border border-[#C7D9FB] rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Database className="w-4 h-4" />
                        <span>View Raw Extracted iGOT Data</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTERACTIVE CURRICULUM WITH UNIT READER */}
          {activeTab === 'curriculum' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: List of Units */}
              <div className="lg:col-span-4 space-y-2.5">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="text-xs font-extrabold text-[#1B4CA1] uppercase tracking-wider">
                    Syllabus Modules
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {Object.values(completedUnits).filter(Boolean).length} of {curriculum.length} done
                  </span>
                </div>

                <div className="space-y-2">
                  {curriculum.map((unit, idx) => {
                    const isSelected = idx === selectedUnitIndex;
                    const isDone = completedUnits[idx];
                    return (
                      <div
                        key={unit.id}
                        onClick={() => handleSelectUnit(idx)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#EDF1F7] border-[#1B4CA1] ring-1 ring-[#1B4CA1]/30 shadow-xs'
                            : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Unit {unit.unitNumber} • {unit.duration}
                          </span>
                          {isDone ? (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5 stroke-[3]" /> Done
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-500">
                              Pending
                            </span>
                          )}
                        </div>
                        <h4
                          className={`text-xs font-bold line-clamp-2 ${
                            isSelected ? 'text-[#1B4CA1]' : 'text-slate-800'
                          }`}
                        >
                          {unit.title}
                        </h4>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1 text-[#B45309]">
                    <Award className="w-3.5 h-3.5" /> DoPT Digital Accreditation
                  </p>
                  <p className="text-amber-800/90 text-[10px] leading-relaxed">
                    Completing all units automatically verifies your FRAC competency record for cadre promotion audits.
                  </p>
                </div>
              </div>

              {/* Right Column: Detailed Unit Content Reader */}
              <div className="lg:col-span-8 space-y-5">
                {selectedUnit ? (
                  <div className="space-y-5">
                    {/* Unit Header Card */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-[#1B4CA1] bg-[#EDF1F7] px-2 py-0.5 rounded border border-[#C7D9FB]">
                          Unit {selectedUnit.unitNumber} of {curriculum.length}
                        </span>
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#EF951E]" />
                          {selectedUnit.duration}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-[#1B2133]">
                        {selectedUnit.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {selectedUnit.summary}
                      </p>
                    </div>

                    {/* Key Core Topics Pill Row */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Core Administrative Topics
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedUnit.topics.map((topic, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-[#EDF1F7] text-[#1B4CA1] font-semibold px-2.5 py-1 rounded-md border border-[#C7D9FB]"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* In-depth Statutory Reading Notes */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-[#1B4CA1] uppercase tracking-wider block">
                        Statutory Directive & Reading Notes
                      </span>
                      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                        <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-serif">
                          {selectedUnit.readingNotes}
                        </p>
                      </div>
                    </div>

                    {/* Practical Executive Checklist */}
                    {selectedUnit.practicalChecklist && selectedUnit.practicalChecklist.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                          Executive Action Checklist for Officers
                        </span>
                        <div className="space-y-1.5">
                          {selectedUnit.practicalChecklist.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="leading-relaxed font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Real-World Case Study with Tribunal Ruling */}
                    {selectedUnit.caseStudy && (
                      <div className="p-4 rounded-xl bg-[#FEFAF4] border border-[#FFD2A1] space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#C37024] uppercase tracking-wider">
                          <ShieldCheck className="w-4 h-4 text-[#EF951E]" />
                          <span>Administrative Case Study & Landmark Ruling</span>
                        </div>
                        <h4 className="text-xs font-extrabold text-[#1B2133]">
                          {selectedUnit.caseStudy.title}
                        </h4>
                        <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-[#FFD2A1]/60 leading-relaxed">
                          <strong>Scenario:</strong> {selectedUnit.caseStudy.scenario}
                        </div>
                        <div className="text-xs text-emerald-900 bg-emerald-50 p-3 rounded-lg border border-emerald-200 leading-relaxed font-medium">
                          <strong>Authoritative Ruling:</strong> {selectedUnit.caseStudy.ruling}
                        </div>
                      </div>
                    )}

                    {/* Unit Knowledge Assessment */}
                    {selectedUnit.assessment && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <HelpCircle className="w-4 h-4 text-[#EF951E]" />
                            <span>Unit Knowledge Verification</span>
                          </span>
                          {quizSubmitted && (
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                quizSelectedOption === selectedUnit.assessment.correctIndex
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {quizSelectedOption === selectedUnit.assessment.correctIndex
                                ? '✓ Correct Answer'
                                : '✗ Review Required'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                          {selectedUnit.assessment.question}
                        </p>
                        <div className="space-y-1.5">
                          {selectedUnit.assessment.options.map((opt, optIdx) => {
                            const isSelected = quizSelectedOption === optIdx;
                            const isCorrect = optIdx === selectedUnit.assessment?.correctIndex;
                            let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-[#1B4CA1]';
                            if (quizSubmitted) {
                              if (isCorrect) {
                                btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                              } else if (isSelected) {
                                btnStyle = 'bg-rose-50 border-rose-500 text-rose-900';
                              }
                            } else if (isSelected) {
                              btnStyle = 'bg-[#EDF1F7] border-[#1B4CA1] text-[#1B4CA1] font-bold';
                            }
                            return (
                              <button
                                key={optIdx}
                                disabled={quizSubmitted}
                                onClick={() => setQuizSelectedOption(optIdx)}
                                className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {!quizSubmitted ? (
                          <button
                            disabled={quizSelectedOption === null}
                            onClick={() => setQuizSubmitted(true)}
                            className="px-4 py-2 bg-[#1B4CA1] hover:bg-[#002B6C] disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Submit Answer
                          </button>
                        ) : (
                          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1">
                            <span className="font-bold">Official Statutory Explanation:</span>
                            <p className="leading-relaxed">{selectedUnit.assessment.explanation}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Unit Mark Complete Button */}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <button
                        onClick={() => handleMarkUnitComplete(selectedUnitIndex)}
                        className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                          completedUnits[selectedUnitIndex]
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-[#EF951E] hover:bg-[#F08811] text-white shadow-xs'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {completedUnits[selectedUnitIndex]
                            ? 'Unit Completed ✓'
                            : 'Mark Unit as Studied'}
                        </span>
                      </button>

                      {selectedUnitIndex < curriculum.length - 1 && (
                        <button
                          onClick={() => handleSelectUnit(selectedUnitIndex + 1)}
                          className="text-xs font-bold text-[#1B4CA1] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Next: Unit {selectedUnitIndex + 2}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Select a unit from the left syllabus menu.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: EXTRACTED iGOT RAW DATA & HIERARCHY */}
          {activeTab === 'extracted' && (
            <div className="space-y-6">
              {/* Extraction Header Card */}
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-purple-700" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-purple-900">
                      Extracted iGOT Portal API Metadata
                    </h4>
                    <span className="text-[10px] font-bold bg-purple-200 text-purple-800 px-2 py-0.5 rounded">
                      Live Backend Synced
                    </span>
                  </div>
                  <p className="text-xs text-purple-950">
                    Direct data payload extracted from <code>portal.igotkarmayogi.gov.in/api/content/v1/read/{module.id}</code> and persisted in backend database.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFetchBackendApi(`/api/courses/${module.id}`)}
                    disabled={backendLoading}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Server className="w-3.5 h-3.5" />
                    <span>{backendLoading ? 'Querying...' : 'Query /api/courses/' + module.id}</span>
                  </button>
                </div>
              </div>

              {/* Raw Properties Key-Value Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Identifier (ID)</span>
                  <span className="text-xs font-mono font-bold text-[#1B4CA1] break-all">{rawData?.id || module.id}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Creator / Source</span>
                  <span className="text-xs font-bold text-slate-800">{rawData?.creator || module.provider}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Exact Total Duration</span>
                  <span className="text-xs font-mono font-bold text-amber-700">
                    {rawData?.duration ? `${rawData.duration} seconds (${Math.round(rawData.duration / 60)} mins)` : module.durationDisplay}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Content Type / MimeType</span>
                  <span className="text-xs font-mono text-slate-700">
                    {rawData?.contentType || 'Course'} / {rawData?.mimeType || 'application/vnd.ekstep.content-collection'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Created / Last Updated</span>
                  <span className="text-xs text-slate-700">
                    {rawData?.createdOn ? new Date(rawData.createdOn).toLocaleDateString() : 'N/A'} • {rawData?.lastUpdatedOn ? new Date(rawData.lastUpdatedOn).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Sub-Nodes Extracted</span>
                  <span className="text-xs font-bold text-emerald-700">
                    {allSubItems.length} leaf & child nodes ({extractedVideos.length} MP4 videos)
                  </span>
                </div>
              </div>

              {/* Official Keywords Chips */}
              {rawData?.keywords && rawData.keywords.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#1B4CA1] uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#EF951E]" />
                    <span>Official Keywords ({rawData.keywords.length})</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {rawData.keywords.map((kw: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs bg-slate-100 text-slate-800 font-medium px-2.5 py-1 rounded-md border border-slate-200"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Official FRAC Competencies Taxonomy */}
              {rawData?.competencies_v5 && rawData.competencies_v5.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Official FRAC Competency Mappings ({rawData.competencies_v5.length})</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {rawData.competencies_v5.map((c: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-900">{c.competencyTheme}</span>
                          <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">
                            {c.competencyThemeType || 'Core'}
                          </span>
                        </div>
                        <p className="text-emerald-800 text-[11px]">
                          <strong>Sub-Theme:</strong> {c.competencySubTheme}
                        </p>
                        <p className="text-slate-500 text-[10px]">
                          Area: {c.competencyArea} (ID: {c.competencyAreaId})
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Leaf Nodes / Sub-Items Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#1B4CA1] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#1B4CA1]" />
                  <span>All Extracted Hierarchy Sub-Items & Artifacts ({allSubItems.length})</span>
                </span>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="p-3 font-bold">#</th>
                        <th className="p-3 font-bold">Node Name</th>
                        <th className="p-3 font-bold">Media Type</th>
                        <th className="p-3 font-bold">Duration</th>
                        <th className="p-3 font-bold">Artifact URL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {allSubItems.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                          <td className="p-3 font-bold text-slate-900">
                            <div>{item.name}</div>
                            <span className="text-[10px] font-mono text-slate-400">{item.id}</span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                item.mimeType === 'video/mp4'
                                  ? 'bg-amber-100 text-amber-900'
                                  : item.mimeType?.includes('html')
                                  ? 'bg-blue-100 text-blue-900'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {item.mimeType}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-slate-600">
                            {item.duration ? `${item.duration}s` : '—'}
                          </td>
                          <td className="p-3">
                            {item.artifactUrl ? (
                              <a
                                href={item.artifactUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#1B4CA1] hover:underline font-mono text-[11px] flex items-center gap-1"
                              >
                                <span>Direct Artifact</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Integrated package</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Live Backend JSON Inspector Box */}
              {backendApiData && (
                <div className="space-y-2 p-4 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <Server className="w-4 h-4" /> Live Backend Response:
                    </span>
                    <button
                      onClick={() => setBackendApiData(null)}
                      className="text-slate-400 hover:text-white text-xs cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <pre className="max-h-60 overflow-y-auto text-[11px] text-slate-300">
                    {JSON.stringify(backendApiData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COURSE OVERVIEW & MANDATE */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Executive Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#1B4CA1] uppercase tracking-wider">
                  Accreditation Executive Summary
                </h4>
                <p className="text-xs text-[#374151] leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {extracted?.summary || module.description}
                </p>
              </div>

              {/* Administrative Reference Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Official Statutory Circular
                  </span>
                  <p className="text-xs font-bold text-[#1B4CA1] mt-1 line-clamp-2">
                    {circularRef}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    National Officer Enrollment
                  </span>
                  <p className="text-xs font-bold text-[#EF951E] mt-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {enrolledCount}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Eligible Target Audience
                  </span>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {targetAudience}
                  </p>
                </div>
              </div>

              {/* Statutory Directives */}
              {extracted?.statutoryDirectives && (
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-bold text-[#1B4CA1] uppercase tracking-wider">
                    Binding Government Directives
                  </h4>
                  <ul className="space-y-2">
                    {extracted.statutoryDirectives.map((dir, idx) => (
                      <li
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#EDF1F7]/70 border border-[#C7D9FB] text-xs text-[#1B2133] flex items-start gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#1B4CA1] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{dir}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Takeaways */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Official Competency Learning Outcomes
                </h4>
                <ul className="space-y-2">
                  {(extracted?.learningObjectives || module.keyTakeaways).map((out, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[#374151]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: STATUTORY ACTS & FAQS */}
          {activeTab === 'statutory' && (
            <div className="space-y-6">
              {/* Statutory Acts Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#1B4CA1] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1B4CA1]" />
                  <span>Statutory Acts, Codes & Legal Authorities</span>
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="p-3 font-bold">Act / Manual</th>
                        <th className="p-3 font-bold">Section / Rule</th>
                        <th className="p-3 font-bold">Administrative Mandate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {statutoryRefs.map((ref, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-[#1B4CA1] whitespace-nowrap">
                            {ref.actName}
                          </td>
                          <td className="p-3 font-mono text-slate-600 whitespace-nowrap">
                            {ref.sectionOrRule}
                          </td>
                          <td className="p-3 text-slate-700">{ref.relevance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FAQs Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#4B5563] uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#EF951E]" />
                  <span>Frequently Asked Administrative Questions</span>
                </h4>
                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                    >
                      <h5 className="text-xs font-extrabold text-slate-900 flex items-start gap-2">
                        <span className="text-[#EF951E] font-bold">Q{idx + 1}:</span>
                        <span>{faq.question}</span>
                      </h5>
                      <p className="text-xs text-slate-700 pl-6 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DEDICATED AI QUIZ & ASSESSMENT STUDIO */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              {/* Generation in Progress State */}
              {isGeneratingQuiz ? (
                <div className="p-8 sm:p-12 text-center rounded-2xl bg-gradient-to-b from-blue-50/50 to-amber-50/50 border border-[#C7D9FB] space-y-4">
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                    <Loader2 className="w-16 h-16 text-[#EF951E] animate-spin opacity-80" />
                    <Sparkles className="w-7 h-7 text-[#1B4CA1] absolute animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-[#EF951E] text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                      {generationScope === 'module' ? 'Module Lecture Assessment' : 'Whole Course Assessment'}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-[#1B4CA1] mt-2">
                      Generating Civil Service AI Dilemmas
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                      {generationStep || 'Analyzing curriculum competencies and DoPT circular guidelines...'}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Synthesizing decision scenarios with official rationales</span>
                  </div>
                </div>
              ) : activeGeneratedQuiz ? (
                /* Active Generated Quiz View */
                <div className="space-y-5">
                  {/* Quiz Header Bar */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1B4CA1] to-[#002B6C] text-white flex flex-wrap items-center justify-between gap-3 shadow-md">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EF951E] text-white px-2 py-0.5 rounded shadow-2xs">
                          {activeGeneratedQuiz.scope === 'module' ? 'Module Quiz' : 'Whole Course Assessment'}
                        </span>
                        <span className="text-xs text-blue-200">
                          {activeGeneratedQuiz.questions.length} Scenario Questions
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white">
                        {activeGeneratedQuiz.title}
                      </h3>
                    </div>

                    {/* Mode Selector & Quiz Studio Action */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Mode Toggle */}
                      <div className="bg-white/15 p-1 rounded-xl flex items-center gap-1 border border-white/20 text-xs">
                        <button
                          id="btn-mode-practice"
                          onClick={() => setQuizMode('practice')}
                          className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            quizMode === 'practice'
                              ? 'bg-white text-[#1B4CA1] shadow-xs'
                              : 'text-blue-100 hover:text-white'
                          }`}
                        >
                          Practice Mode
                        </button>
                        <button
                          id="btn-mode-test"
                          onClick={() => setQuizMode('test')}
                          className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            quizMode === 'test'
                              ? 'bg-[#EF951E] text-white shadow-xs'
                              : 'text-blue-100 hover:text-white'
                          }`}
                        >
                          Test Mode (Timed)
                        </button>
                      </div>

                      {/* Open in full Quiz Studio */}
                      {onNavigateToQuizStudio && (
                        <button
                          id="btn-open-in-quiz-studio"
                          onClick={() => {
                            onNavigateToQuizStudio(
                              activeGeneratedQuiz.questions,
                              activeGeneratedQuiz.title,
                              quizMode
                            );
                          }}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                          title="Open full-screen Quiz Studio for this assessment"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                          <span>Full Quiz Studio</span>
                        </button>
                      )}

                      {/* Regenerate Quiz */}
                      <button
                        id="btn-regenerate-active-quiz"
                        onClick={() => generateQuizForScope(activeGeneratedQuiz.scope)}
                        className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs transition-all cursor-pointer"
                        title="Regenerate questions"
                      >
                        <RefreshCw className="w-4 h-4 text-blue-200" />
                      </button>
                    </div>
                  </div>

                  {/* MODE 1: PRACTICE MODE (Instant Feedback & Rationale) */}
                  {quizMode === 'practice' && (
                    <div className="space-y-4">
                      {/* Stepper Navigation */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-[#1B4CA1]">
                            Question {currentQuizIdx + 1} of {activeGeneratedQuiz.questions.length}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-semibold text-slate-500">
                            {activeGeneratedQuiz.questions[currentQuizIdx]?.competencyTag || module.competencyCode}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {activeGeneratedQuiz.questions.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentQuizIdx(idx)}
                              className={`w-6 h-6 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                                currentQuizIdx === idx
                                  ? 'bg-[#1B4CA1] text-white ring-2 ring-[#EF951E]'
                                  : practiceAnswers[idx] !== undefined
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {idx + 1}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Question Card */}
                      {activeGeneratedQuiz.questions[currentQuizIdx] && (() => {
                        const q = activeGeneratedQuiz.questions[currentQuizIdx];
                        const selectedAns = practiceAnswers[currentQuizIdx];
                        const hasAnswered = selectedAns !== undefined;
                        const isCorrect = selectedAns === q.correctIndex;

                        return (
                          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                            {/* Scenario Context */}
                            {q.scenario && (
                              <div className="p-3.5 bg-[#EDF1F7]/70 rounded-xl border border-[#C7D9FB] space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B4CA1] flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5 text-[#1B4CA1]" />
                                  Administrative Scenario Dilemma
                                </span>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                  {q.scenario}
                                </p>
                              </div>
                            )}

                            {/* Question Prompt */}
                            <h4 className="text-sm sm:text-base font-extrabold text-[#1B2133] leading-snug">
                              {q.question}
                            </h4>

                            {/* Options List */}
                            <div className="space-y-2.5 pt-1">
                              {q.options.map((opt, optIdx) => {
                                const isOptionSelected = selectedAns === optIdx;
                                const isOptionCorrect = optIdx === q.correctIndex;

                                let optClasses = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
                                if (hasAnswered) {
                                  if (isOptionCorrect) {
                                    optClasses = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-1 ring-emerald-400 font-bold';
                                  } else if (isOptionSelected) {
                                    optClasses = 'bg-rose-50 border-rose-300 text-rose-950 font-bold';
                                  } else {
                                    optClasses = 'bg-slate-50/50 border-slate-200 text-slate-400';
                                  }
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => {
                                      setPracticeAnswers({ ...practiceAnswers, [currentQuizIdx]: optIdx });
                                      setPracticeShowRationale({ ...practiceShowRationale, [currentQuizIdx]: true });
                                    }}
                                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 text-xs sm:text-sm ${optClasses}`}
                                  >
                                    <span
                                      className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                                        hasAnswered && isOptionCorrect
                                          ? 'bg-emerald-600 text-white'
                                          : hasAnswered && isOptionSelected
                                          ? 'bg-rose-600 text-white'
                                          : 'bg-slate-100 text-slate-700'
                                      }`}
                                    >
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span className="flex-1 leading-relaxed">{opt}</span>
                                    {hasAnswered && isOptionCorrect && (
                                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Official DoPT Rationale Box */}
                            {hasAnswered && (
                              <div
                                className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 animate-in fade-in duration-200 ${
                                  isCorrect
                                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                                    : 'bg-amber-50/70 border-amber-200 text-amber-950'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 font-bold">
                                  {isCorrect ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                                  )}
                                  <span>{isCorrect ? 'Correct Decision Rationale:' : 'Administrative Guidance & Rule Basis:'}</span>
                                </div>
                                <p className="pl-5 text-slate-700">
                                  {q.rationale}
                                </p>
                              </div>
                            )}

                            {/* Practice Nav Buttons */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                              <button
                                id="btn-practice-prev"
                                onClick={() => setCurrentQuizIdx(Math.max(0, currentQuizIdx - 1))}
                                disabled={currentQuizIdx === 0}
                                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                              >
                                Previous Question
                              </button>
                              <button
                                id="btn-practice-next"
                                onClick={() =>
                                  setCurrentQuizIdx(
                                    Math.min(activeGeneratedQuiz.questions.length - 1, currentQuizIdx + 1)
                                  )
                                }
                                disabled={currentQuizIdx === activeGeneratedQuiz.questions.length - 1}
                                className="px-4 py-1.5 bg-[#1B4CA1] hover:bg-[#002B6C] disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <span>Next Question</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* MODE 2: TIMED TEST MODE */}
                  {quizMode === 'test' && (
                    <div className="space-y-5">
                      {/* Test Toolbar: Timer & Submission Status */}
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${testTimeRemaining < 60 ? 'text-rose-600 animate-pulse' : 'text-[#1B4CA1]'}`} />
                          <span className="text-xs font-bold text-slate-700">Exam Timer:</span>
                          <span
                            className={`text-xs font-mono font-black px-2 py-0.5 rounded ${
                              testTimeRemaining < 60
                                ? 'bg-rose-100 text-rose-700 border border-rose-300'
                                : 'bg-[#EDF1F7] text-[#1B4CA1] border border-[#C7D9FB]'
                            }`}
                          >
                            {Math.floor(testTimeRemaining / 60)}:
                            {String(testTimeRemaining % 60).padStart(2, '0')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 font-medium">
                            Answered: {Object.keys(testAnswers).length} / {activeGeneratedQuiz.questions.length}
                          </span>
                          {!testSubmitted && (
                            <button
                              id="btn-submit-cadre-test"
                              onClick={handleTestSubmit}
                              className="px-4 py-1.5 bg-[#EF951E] hover:bg-[#F08811] text-white rounded-lg text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Submit Assessment</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Submitted Test Results Card */}
                      {testSubmitted ? (
                        (() => {
                          const total = activeGeneratedQuiz.questions.length;
                          let correct = 0;
                          activeGeneratedQuiz.questions.forEach((q, idx) => {
                            if (testAnswers[idx] === q.correctIndex) correct += 1;
                          });
                          const pct = Math.round((correct / total) * 100);
                          const passed = pct >= 60;

                          return (
                            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md space-y-5 text-center">
                              <div
                                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                                  passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                }`}
                              >
                                {passed ? <Award className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                              </div>
                              <div className="space-y-1">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                  Assessment Results
                                </span>
                                <h3 className="text-xl font-black text-[#1B2133]">
                                  {passed ? 'Merit Standard Achieved!' : 'Competency Re-examination Recommended'}
                                </h3>
                                <p className="text-2xl font-mono font-black text-[#1B4CA1] pt-1">
                                  {correct} / {total} ({pct}%)
                                </p>
                              </div>

                              {/* Karma Points Awarded */}
                              <div className="p-3 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-300 rounded-xl inline-flex items-center gap-2 text-xs font-bold text-amber-900 mx-auto">
                                <Sparkles className="w-4 h-4 text-[#EF951E]" />
                                <span>+{karmaAwardedInQuiz} Karmayogi Officer Competency Karma Awarded</span>
                              </div>

                              {/* Retake or Practice Buttons */}
                              <div className="flex items-center justify-center gap-3 pt-2">
                                <button
                                  id="btn-retake-test"
                                  onClick={() => {
                                    setTestAnswers({});
                                    setTestSubmitted(false);
                                    setTestTimeRemaining(activeGeneratedQuiz.questions.length * 90);
                                  }}
                                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Retake Exam</span>
                                </button>
                                <button
                                  id="btn-switch-to-practice-review"
                                  onClick={() => setQuizMode('practice')}
                                  className="px-4 py-2 bg-[#1B4CA1] hover:bg-[#002B6C] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                                >
                                  <BookOpen className="w-3.5 h-3.5" />
                                  <span>Review Rationales in Practice Mode</span>
                                </button>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        /* Test Questions List */
                        <div className="space-y-4">
                          {activeGeneratedQuiz.questions.map((q, qIdx) => (
                            <div
                              key={qIdx}
                              className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-extrabold text-[#1B4CA1]">
                                  Question {qIdx + 1} of {activeGeneratedQuiz.questions.length}
                                </span>
                                <span className="text-slate-400 font-medium">
                                  {q.competencyTag || module.competencyCode}
                                </span>
                              </div>

                              <h5 className="text-xs sm:text-sm font-bold text-[#1B2133] leading-snug">
                                {q.question}
                              </h5>

                              <div className="space-y-2 pt-1">
                                {q.options.map((opt, optIdx) => {
                                  const isChecked = testAnswers[qIdx] === optIdx;
                                  return (
                                    <label
                                      key={optIdx}
                                      className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                                        isChecked
                                          ? 'bg-blue-50 border-[#1B4CA1] font-bold text-[#1B4CA1]'
                                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name={`test_q_${qIdx}`}
                                        checked={isChecked}
                                        onChange={() => setTestAnswers({ ...testAnswers, [qIdx]: optIdx })}
                                        className="mt-0.5 accent-[#1B4CA1]"
                                      />
                                      <span className="leading-relaxed">{opt}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          ))}

                          <div className="text-center pt-2">
                            <button
                              id="btn-bottom-submit-test"
                              onClick={handleTestSubmit}
                              className="px-6 py-2.5 bg-[#EF951E] hover:bg-[#F08811] text-white rounded-xl text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
                            >
                              <Check className="w-4 h-4" />
                              <span>Submit & Grade Assessment</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quick Switcher at Bottom of Quiz */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-slate-600">
                      Want to test a different scope?
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        id="btn-quiz-tab-gen-module"
                        onClick={handleTriggerModuleQuiz}
                        disabled={isGeneratingQuiz}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-[#1B4CA1] border border-slate-200 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#EF951E]" />
                        <span>Generate Current Module Quiz</span>
                      </button>
                      <button
                        id="btn-quiz-tab-gen-course"
                        onClick={handleTriggerCourseQuiz}
                        disabled={isGeneratingQuiz}
                        className="px-3 py-1.5 bg-[#1B4CA1] hover:bg-[#002B6C] text-white rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-blue-200" />
                        <span>Generate Whole Course Quiz</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Clean Welcome Card when no quiz is generated yet */
                <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 text-center">
                  <div className="w-14 h-14 bg-[#EDF1F7] text-[#1B4CA1] rounded-2xl mx-auto flex items-center justify-center border border-[#C7D9FB] shadow-2xs">
                    <Sparkles className="w-7 h-7 text-[#EF951E]" />
                  </div>
                  <div className="space-y-1 max-w-lg mx-auto">
                    <h3 className="text-base sm:text-lg font-black text-[#1B2133]">
                      AI Civil Service Cadre Assessment Studio
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Generate official situational dilemma questions derived from {module.title}, including statutory frameworks, GFR rules, and administrative precedents.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
                    {/* Option 1: Whole Course Quiz */}
                    <div
                      onClick={handleTriggerCourseQuiz}
                      className="p-4 rounded-xl bg-gradient-to-br from-[#1B4CA1]/5 to-[#EF951E]/10 hover:from-[#1B4CA1]/10 hover:to-[#EF951E]/20 border-2 border-[#1B4CA1]/20 hover:border-[#1B4CA1] transition-all cursor-pointer shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1B4CA1] text-white px-2 py-0.5 rounded shadow-2xs">
                            Recommended
                          </span>
                          <GraduationCap className="w-4 h-4 text-[#1B4CA1]" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-[#1B4CA1]">
                          Generate Whole Course Quiz
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          Authoritative 5-question exam testing all {curriculum.length} curriculum units, statutory circulars, and executive competencies.
                        </p>
                      </div>
                      <button
                        id="btn-welcome-gen-course"
                        className="mt-4 w-full py-2 bg-[#1B4CA1] text-white rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                        <span>Generate Course Quiz</span>
                      </button>
                    </div>

                    {/* Option 2: Current Module Lecture Quiz */}
                    <div
                      onClick={handleTriggerModuleQuiz}
                      className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-[#EF951E] transition-all cursor-pointer shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EF951E] text-white px-2 py-0.5 rounded shadow-2xs">
                            Module Specific
                          </span>
                          <Play className="w-4 h-4 text-[#EF951E]" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                          Generate Current Module Quiz
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          Focuses specifically on video lecture: {activeVideo?.name || 'Current Lecture'}.
                        </p>
                      </div>
                      <button
                        id="btn-welcome-gen-module"
                        className="mt-4 w-full py-2 bg-[#EF951E] hover:bg-[#F08811] text-white rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                        <span>Generate Module Quiz</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Live Watch Progress, Reset Option & Controls */}
        <div className="p-4 bg-[#EDF1F7] border-t border-[#C7D9FB] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-extrabold text-[#1B4CA1]">
                Overall Progress:
              </span>
              <div className="w-32 sm:w-48 bg-white h-3 rounded-full overflow-hidden border border-[#C7D9FB] shadow-inner p-0.5">
                <div
                  className="bg-gradient-to-r from-[#EF951E] to-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
              <span className="text-xs sm:text-sm font-mono font-extrabold text-[#1B4CA1]">
                {overallProgress}%
              </span>
            </div>

            {overallProgress === 100 ? (
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Completed
              </span>
            ) : overallProgress > 0 ? (
              <span className="text-[11px] font-bold text-blue-800 bg-blue-100 border border-blue-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-600" /> Live Synced
              </span>
            ) : (
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded-full">
                0%
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Reset Progress Option */}
            <button
              id="btn-reset-course-progress"
              onClick={handleResetProgress}
              title="Reset course progress and video watch history to 0%"
              className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-rose-200 hover:border-rose-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>Reset Progress</span>
            </button>

            {/* Study (+20%) simulation button */}
            <button
              id="btn-simulate-study"
              onClick={handleSimulateStudy}
              disabled={overallProgress >= 100}
              className="px-3.5 py-2 bg-[#EF951E] hover:bg-[#F08811] disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{overallProgress >= 100 ? 'Course Complete' : 'Study (+20%)'}</span>
            </button>

            {/* Close Button */}
            <button
              id="btn-close-course-view"
              onClick={onClose}
              className="px-4 sm:px-5 py-2 bg-[#1B4CA1] hover:bg-[#002B6C] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              Close Course View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
