import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion, ScreenId } from '../../types';
import {
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  FileCheck,
  ShieldCheck,
  BookOpenCheck,
  Timer,
  UploadCloud,
  FileText,
  Flag,
  HelpCircle,
  Clock,
  AlertTriangle,
  Trash2,
  Check,
  ExternalLink,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface QuizStudioScreenProps {
  questions: QuizQuestion[];
  onNavigate: (screen: ScreenId) => void;
  onOpenCopilot?: () => void;
  onQuizComplete?: (score: number, total: number, mode: 'practice' | 'test') => void;
  initialTitle?: string;
  initialMode?: QuizMode;
}

type QuizMode = 'practice' | 'test' | 'generator';

// Sample Government Policy Documents for instant 1-click test generation
const SAMPLE_DOCS = [
  {
    name: 'GFR_2024_Public_Procurement_Manual.pdf',
    topic: 'Public Procurement & GFR 2024 (Emergency Contracting & GeM Rules)',
    size: '1.8 MB',
    pages: '24 pages',
    description: 'Statutory procedures under Rule 149 and Rule 166 for single tender enquiry and urgent procurement thresholds.',
  },
  {
    name: 'DoPT_PoSH_Act_2013_Compliance_Circular.pdf',
    topic: 'PoSH Act 2013 & Workplace Ethics (ICC Timelines & Inquiry Rules)',
    size: '940 KB',
    pages: '14 pages',
    description: 'Mandatory constitution of Internal Complaints Committees (ICC), 90-day inquiry disposal, and conciliation limits.',
  },
  {
    name: 'Digital_Personal_Data_Protection_Act_2023.pdf',
    topic: 'Digital Governance & DPDP Act 2023 (Fiduciary Obligations & Security)',
    size: '1.2 MB',
    pages: '18 pages',
    description: 'Data fiduciary safeguards, consent manager protocols, Section 8 exemptions for government welfare schemes.',
  },
  {
    name: 'CPGRAMS_7_0_Sevottam_Citizen_Charter.pdf',
    topic: 'CPGRAMS 7.0 & Sevottam Citizen Grievance Redressal Standards',
    size: '820 KB',
    pages: '12 pages',
    description: '30-day appeal disposal mandate, reasoned speaking orders, root cause analysis, and officer accountability.',
  },
];

export const QuizStudioScreen: React.FC<QuizStudioScreenProps> = ({
  questions: initialQuestions,
  onNavigate,
  onOpenCopilot,
  onQuizComplete,
  initialTitle,
  initialMode,
}) => {
  // Active questions dataset (either default questions or AI generated from file/topic)
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>(initialQuestions);
  const [activeQuizTitle, setActiveQuizTitle] = useState<string>(
    initialTitle || 'DoPT Governance Assessment (GFR 2024, CSMOP & Ethics)'
  );

  // Studio Mode: Practice Mode vs Test Mode vs Generator/Upload Mode
  const [activeMode, setActiveMode] = useState<QuizMode>(initialMode || 'practice');

  // Sync with incoming props if changed from external navigation (e.g. from ModuleModal)
  useEffect(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      setActiveQuestions(initialQuestions);
      setPracticeIdx(0);
      setPracticeAnswers({});
      setPracticeShowRationale({});
      setPracticeIsCompleted(false);
      setTestIdx(0);
      setTestAnswers({});
      setIsTestSubmitted(false);
      setTimeLeftSec(initialQuestions.length * 120);
    }
    if (initialTitle) {
      setActiveQuizTitle(initialTitle);
    }
    if (initialMode) {
      setActiveMode(initialMode);
      if (initialMode === 'test') {
        setIsTimerActive(true);
      }
    }
  }, [initialQuestions, initialTitle, initialMode]);

  // ==========================================
  // PRACTICE MODE STATE
  // ==========================================
  const [practiceIdx, setPracticeIdx] = useState<number>(0);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, number>>({});
  const [practiceShowRationale, setPracticeShowRationale] = useState<Record<number, boolean>>({});
  const [practiceIsCompleted, setPracticeIsCompleted] = useState<boolean>(false);
  const [showPracticeHint, setShowPracticeHint] = useState<boolean>(false);

  // ==========================================
  // TEST MODE STATE (Timed & Formal Examination)
  // ==========================================
  const [testIdx, setTestIdx] = useState<number>(0);
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeLeftSec, setTimeLeftSec] = useState<number>(600); // 10 minutes default
  const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState<boolean>(false);
  const [testReviewFilter, setTestReviewFilter] = useState<'all' | 'correct' | 'incorrect' | 'flagged'>('all');
  const [karmaAwarded, setKarmaAwarded] = useState<number>(0);

  // ==========================================
  // FILE UPLOAD & GENERATOR STATE
  // ==========================================
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileTextPreview, setFileTextPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSizeFormatted, setFileSizeFormatted] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [fileInputRef] = useState<React.RefObject<HTMLInputElement | null>>({ current: null });
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const [generatorTopic, setGeneratorTopic] = useState<string>('Public Procurement & GFR 2024');
  const [targetCadreLevel, setTargetCadreLevel] = useState<string>('Senior Admin (Level 11-13)');
  const [numQuestionsToGenerate, setNumQuestionsToGenerate] = useState<number>(5);
  const [cognitiveBalance, setCognitiveBalance] = useState<'mixed' | 'recall' | 'application'>('mixed');
  const [customInstructions, setCustomInstructions] = useState<string>('');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generationSuccessNotice, setGenerationSuccessNotice] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Timer effect for Test Mode
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (activeMode === 'test' && !isTestSubmitted && isTimerActive && timeLeftSec > 0) {
      timer = setInterval(() => {
        setTimeLeftSec((prev) => {
          if (prev <= 1) {
            handleFinalSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeMode, isTestSubmitted, isTimerActive, timeLeftSec]);

  // Format MM:SS for test timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ==========================================
  // PRACTICE MODE HANDLERS
  // ==========================================
  const currentPracticeQ = activeQuestions[practiceIdx] || activeQuestions[0];
  const isPracticeAnswered = practiceAnswers[practiceIdx] !== undefined;

  const handleSelectPracticeOption = (optIdx: number) => {
    if (isPracticeAnswered) return;
    setPracticeAnswers((prev) => ({ ...prev, [practiceIdx]: optIdx }));
    setPracticeShowRationale((prev) => ({ ...prev, [practiceIdx]: true }));
  };

  const handleNextPracticeQuestion = () => {
    setShowPracticeHint(false);
    if (practiceIdx + 1 < activeQuestions.length) {
      setPracticeIdx((prev) => prev + 1);
    } else {
      setPracticeIsCompleted(true);
      // Award practice karma points
      const correctCount = activeQuestions.filter(
        (q, idx) => practiceAnswers[idx] === q.correctIndex
      ).length;
      if (onQuizComplete) {
        onQuizComplete(correctCount, activeQuestions.length, 'practice');
      }
    }
  };

  const handleRestartPractice = () => {
    setPracticeIdx(0);
    setPracticeAnswers({});
    setPracticeShowRationale({});
    setPracticeIsCompleted(false);
    setShowPracticeHint(false);
  };

  // ==========================================
  // TEST MODE HANDLERS
  // ==========================================
  const currentTestQ = activeQuestions[testIdx] || activeQuestions[0];

  const handleStartTest = () => {
    setActiveMode('test');
    setTestIdx(0);
    setTestAnswers({});
    setFlaggedQuestions(new Set());
    setTimeLeftSec(activeQuestions.length * 120); // 2 minutes per question
    setIsTestSubmitted(false);
    setIsTimerActive(true);
  };

  const handleSelectTestOption = (optIdx: number) => {
    if (isTestSubmitted) return;
    setTestAnswers((prev) => ({ ...prev, [testIdx]: optIdx }));
  };

  const handleClearTestOption = () => {
    if (isTestSubmitted) return;
    setTestAnswers((prev) => {
      const copy = { ...prev };
      delete copy[testIdx];
      return copy;
    });
  };

  const handleToggleFlag = (idx: number) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const handleFinalSubmitTest = () => {
    setIsTestSubmitted(true);
    setIsTimerActive(false);
    setShowSubmitConfirmModal(false);

    // Calculate score
    const correctCount = activeQuestions.filter(
      (q, idx) => testAnswers[idx] === q.correctIndex
    ).length;
    const pointsAwarded = Math.round((correctCount / activeQuestions.length) * 100) + 25;
    setKarmaAwarded(pointsAwarded);

    if (onQuizComplete) {
      onQuizComplete(correctCount, activeQuestions.length, 'test');
    }
  };

  const handleRestartTest = () => {
    setTestIdx(0);
    setTestAnswers({});
    setFlaggedQuestions(new Set());
    setTimeLeftSec(activeQuestions.length * 120);
    setIsTestSubmitted(false);
    setIsTimerActive(true);
  };

  // ==========================================
  // FILE UPLOAD & GEMINI GENERATION HANDLERS
  // ==========================================
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processFile = (file: File) => {
    setUploadedFile(file);
    setFileName(file.name);
    setFileSizeFormatted(formatFileSize(file.size));
    setGenerationError(null);
    setGenerationSuccessNotice(null);

    // If text/json/csv/md, read as text preview
    if (
      file.type.startsWith('text/') ||
      file.name.endsWith('.txt') ||
      file.name.endsWith('.json') ||
      file.name.endsWith('.csv') ||
      file.name.endsWith('.md')
    ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setFileTextPreview(text || '');
      };
      reader.readAsText(file);
    } else {
      setFileTextPreview(null);
    }

    // Read base64 data URL for upload to Gemini
    const readerBase64 = new FileReader();
    readerBase64.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        const base64Data = dataUrl.split(',')[1] || dataUrl;
        setFileBase64(base64Data);
      }
    };
    readerBase64.readAsDataURL(file);

    // Pre-populate topic suggestion from file name
    const cleanedName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    setGeneratorTopic(cleanedName);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleSelectSampleDoc = (sample: (typeof SAMPLE_DOCS)[0]) => {
    setUploadedFile(null);
    setFileBase64(null);
    setFileTextPreview(sample.description);
    setFileName(sample.name);
    setFileSizeFormatted(`${sample.size} • ${sample.pages}`);
    setGeneratorTopic(sample.topic);
    setGenerationError(null);
    setGenerationSuccessNotice(null);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFileBase64(null);
    setFileTextPreview(null);
    setFileName(null);
    setFileSizeFormatted(null);
  };

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationSuccessNotice(null);
    setGenerationStep('Reading and parsing regulatory structures...');

    try {
      setTimeout(() => {
        setGenerationStep('Calibrating Cadre Level dilemmas and FRAC competencies...');
      }, 1200);

      setTimeout(() => {
        setGenerationStep('Verifying official citations against GFR, CSMOP & Act statutes...');
      }, 2400);

      const payload = {
        fileBase64: fileBase64 || undefined,
        fileMimeType: uploadedFile?.type || 'application/pdf',
        fileName: fileName || undefined,
        fileText: fileTextPreview
          ? `${fileTextPreview}\n${customInstructions}`
          : customInstructions || undefined,
        topic: generatorTopic,
        numQuestions: numQuestionsToGenerate,
        cadreLevel: targetCadreLevel,
        cognitiveBalance: cognitiveBalance,
      };

      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        setActiveQuestions(data.questions);
        setActiveQuizTitle(
          fileName
            ? `Generated from: ${fileName}`
            : `AI Synthesized: ${generatorTopic}`
        );
        setGenerationSuccessNotice(
          `Successfully generated ${data.questions.length} official scenarios (${data.source === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash Engine' : 'Regulatory Knowledge Engine'}). Choose Practice Mode or Test Mode below to begin!`
        );

        // Reset modes
        handleRestartPractice();
      } else {
        throw new Error(data.error || 'Failed to generate questions. Please try again.');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setGenerationError(
        `Quiz synthesis notice: ${err.message || 'Unable to connect to AI engine'}. Using localized civil service scenarios.`
      );
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Calculations for Test Mode
  const answeredTestCount = Object.keys(testAnswers).length;
  const flaggedCount = flaggedQuestions.size;
  const totalQuestions = activeQuestions.length;
  const unansweredCount = totalQuestions - answeredTestCount;

  // Test Mode Post-Test Stats
  const correctTestCount = activeQuestions.filter(
    (q, idx) => testAnswers[idx] === q.correctIndex
  ).length;
  const testAccuracyPercent = Math.round((correctTestCount / totalQuestions) * 100);

  // Recall vs Application split
  const recallQuestions = activeQuestions.filter((q) => q.cognitiveLevel === 'Recall');
  const applicationQuestions = activeQuestions.filter(
    (q) => q.cognitiveLevel === 'Application' || !q.cognitiveLevel
  );

  const recallCorrect = recallQuestions.filter(
    (q) => testAnswers[activeQuestions.indexOf(q)] === q.correctIndex
  ).length;
  const applicationCorrect = applicationQuestions.filter(
    (q) => testAnswers[activeQuestions.indexOf(q)] === q.correctIndex
  ).length;

  const recallPercent = recallQuestions.length > 0
    ? Math.round((recallCorrect / recallQuestions.length) * 100)
    : 100;
  const applicationPercent = applicationQuestions.length > 0
    ? Math.round((applicationCorrect / applicationQuestions.length) * 100)
    : 100;

  return (
    <section id="quiz-studio-screen" className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Top Banner: Light Blue Box (#EDF1F7) */}
      <div className="bg-[#EDF1F7] p-6 rounded-2xl border border-[#C7D9FB] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-bold tracking-wider uppercase bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] px-2 py-0.5 rounded flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#DBA501]" />
              DoPT & MoSPI Assessment Engine
            </span>
            <span className="text-xs text-[#1B4CA1] font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#EF951E]" />
              Mission Karmayogi FRAC Calibrated
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#1B4CA1] tracking-tight">
            Ira AI Quiz Studio
          </h2>
          <p className="text-xs text-[#374151] mt-1 max-w-2xl leading-relaxed">
            Practice civil service decision-making, take evaluated official exams, or upload government manuals (PDF/Docs) to synthesize dynamic, cadre-level scenario assessments.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-[#C7D9FB] text-xs shrink-0 shadow-2xs flex-wrap gap-1">
          {/* Practice Mode Tab */}
          <button
            id="tab-practice-mode"
            onClick={() => setActiveMode('practice')}
            className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'practice'
                ? 'bg-[#1B4CA1] text-white shadow-xs'
                : 'text-[#374151] hover:text-[#1B4CA1] hover:bg-[#EDF1F7]'
            }`}
          >
            <BookOpenCheck className="w-4 h-4" />
            <span>Practice Mode</span>
          </button>

          {/* Test Mode Tab */}
          <button
            id="tab-test-mode"
            onClick={() => setActiveMode('test')}
            className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'test'
                ? 'bg-[#1B4CA1] text-white shadow-xs'
                : 'text-[#374151] hover:text-[#1B4CA1] hover:bg-[#EDF1F7]'
            }`}
          >
            <Timer className="w-4 h-4 text-[#EF951E]" />
            <span>Test Mode (Exam)</span>
            {!isTestSubmitted && isTimerActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </button>

          {/* AI Generator & Upload Tab */}
          <button
            id="tab-generator-mode"
            onClick={() => setActiveMode('generator')}
            className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'generator'
                ? 'bg-[#1B4CA1] text-white shadow-xs'
                : 'text-[#374151] hover:text-[#1B4CA1] hover:bg-[#EDF1F7]'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-[#EF951E]" />
            <span>Upload & Generate</span>
          </button>
        </div>
      </div>

      {/* Active Quiz Metadata Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border border-[#C7D9FB] rounded-xl text-xs shadow-2xs flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-[#1B4CA1] flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-[#EF951E]" /> Active Assessment:
          </span>
          <span className="font-semibold text-slate-700 max-w-md truncate">
            {activeQuizTitle}
          </span>
          <span className="bg-[#EDF1F7] text-[#1B4CA1] font-mono font-bold px-2 py-0.5 rounded text-[11px]">
            {activeQuestions.length} Questions
          </span>
        </div>

        <div className="flex items-center gap-2">
          {activeMode === 'practice' && (
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Immediate Feedback Mode
            </span>
          )}
          {activeMode === 'test' && !isTestSubmitted && (
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600" /> Formal Timed Exam
            </span>
          )}
          <button
            onClick={() => setActiveMode('generator')}
            className="text-xs font-bold text-[#EF951E] hover:text-[#C37024] cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" /> Upload New Document
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. PRACTICE MODE VIEW */}
      {/* ========================================================================= */}
      {activeMode === 'practice' && (
        <div>
          {!practiceIsCompleted ? (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-2xs space-y-6">
              {/* Practice Header with Progress Bar */}
              <div className="space-y-3 pb-4 border-b border-[#E5E7EB]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-white bg-[#1B4CA1] px-2.5 py-1 rounded-md">
                      Practice Question {practiceIdx + 1} of {activeQuestions.length}
                    </span>
                    <span className="text-xs font-bold text-[#1B4CA1] bg-[#EDF1F7] px-2.5 py-1 rounded-md border border-[#C7D9FB]">
                      {currentPracticeQ.topic}
                    </span>
                    {currentPracticeQ.cognitiveLevel && (
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          currentPracticeQ.cognitiveLevel === 'Recall'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {currentPracticeQ.cognitiveLevel === 'Recall' ? 'Recall • Rule Check' : 'Application • Dilemma'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPracticeHint(!showPracticeHint)}
                      className="text-xs font-bold text-[#EF951E] hover:text-[#C37024] bg-[#FFE9CD]/60 border border-[#FFD2A1] px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{showPracticeHint ? 'Hide Statute Hint' : 'Statute Hint'}</span>
                    </button>
                    <button
                      onClick={handleRestartPractice}
                      className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 flex items-center gap-1 cursor-pointer"
                      title="Reset Practice Session"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="bg-[#1B4CA1] h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${((practiceIdx + (isPracticeAnswered ? 1 : 0)) / activeQuestions.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Expandable Hint Box */}
              {showPracticeHint && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 animate-in fade-in">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Statutory Reference Guideline:</span>
                    <p className="mt-0.5 text-[11px] leading-relaxed">
                      This question is governed under <strong className="font-mono">{currentPracticeQ.regulationCitation}</strong>. Review delegations of financial powers and standard operating procedures before submitting.
                    </p>
                  </div>
                </div>
              )}

              {/* Scenario Box: Skin Box (#FFE9CD) */}
              <div className="p-5 rounded-xl bg-[#FFE9CD] border border-[#FFD2A1]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-[#C37024] uppercase tracking-wider">
                    Administrative Scenario & Context
                  </span>
                  {currentPracticeQ.competencyTag && (
                    <span className="text-[10px] font-bold text-[#1B4CA1] bg-white px-2 py-0.5 rounded border border-[#C7D9FB]">
                      Competency: {currentPracticeQ.competencyTag}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#1B2133] leading-relaxed font-medium">
                  {currentPracticeQ.scenario}
                </p>
              </div>

              {/* Specific Question */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#1B4CA1] mb-4">
                  {currentPracticeQ.question}
                </h3>

                {/* 4 Interactive Practice Options with Instant Feedback */}
                <div className="space-y-3">
                  {currentPracticeQ.options.map((option, idx) => {
                    const isSelected = practiceAnswers[practiceIdx] === idx;
                    const isCorrect = isPracticeAnswered && idx === currentPracticeQ.correctIndex;
                    const isWrong = isPracticeAnswered && isSelected && idx !== currentPracticeQ.correctIndex;

                    return (
                      <button
                        key={idx}
                        id={`practice-opt-${idx}`}
                        onClick={() => handleSelectPracticeOption(idx)}
                        disabled={isPracticeAnswered}
                        className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start justify-between gap-3 cursor-pointer ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-2 ring-emerald-500/20'
                            : isWrong
                            ? 'bg-red-50 border-red-500 text-red-950 font-semibold'
                            : isSelected
                            ? 'bg-[#EDF1F7] border-[#1B4CA1] ring-2 ring-[#1B4CA1]/30 text-[#1B4CA1] font-bold'
                            : isPracticeAnswered
                            ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-default'
                            : 'bg-white border-[#E5E7EB] hover:bg-[#FEFAF4] hover:border-[#FFD2A1] text-[#374151]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                              isCorrect
                                ? 'bg-emerald-600 text-white'
                                : isWrong
                                ? 'bg-red-600 text-white'
                                : isSelected
                                ? 'bg-[#1B4CA1] text-white'
                                : 'bg-[#EDF1F7] text-[#1B4CA1]'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="leading-relaxed">{option}</span>
                        </div>

                        {isCorrect && (
                          <span className="flex items-center gap-1 text-emerald-700 font-bold text-xs shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span className="hidden sm:inline">Correct Decision</span>
                          </span>
                        )}
                        {isWrong && (
                          <span className="flex items-center gap-1 text-red-700 font-bold text-xs shrink-0">
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="hidden sm:inline">Incorrect</span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Immediate Official Civil Service Rationale Box: Light Blue Box (#EDF1F7) */}
              {isPracticeAnswered && (
                <div className="p-5 rounded-xl bg-[#EDF1F7] border border-[#C7D9FB] space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1B4CA1]">
                      <FileCheck className="w-4 h-4 text-[#1B4CA1]" />
                      <span>Official Civil Service Rationale & Statute</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#1B4CA1] bg-white border border-[#C7D9FB] px-2 py-0.5 rounded">
                      Citation Verified
                    </span>
                  </div>

                  <p className="text-xs text-[#1B2133] leading-relaxed">
                    {currentPracticeQ.officialRationale}
                  </p>

                  <div className="pt-1 flex items-center justify-between border-t border-[#C7D9FB]/60 text-[11px] text-[#1B4CA1] font-mono font-bold">
                    <span>Statutory Citation: {currentPracticeQ.regulationCitation}</span>
                    <button
                      onClick={onOpenCopilot}
                      className="text-[11px] text-[#EF951E] hover:underline flex items-center gap-1 cursor-pointer font-sans"
                    >
                      <Sparkles className="w-3 h-3" /> Ask Ira Copilot
                    </button>
                  </div>
                </div>
              )}

              {/* Practice Footer Actions */}
              <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between flex-wrap gap-3">
                <div className="text-xs text-slate-500">
                  {isPracticeAnswered ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Decision evaluated. Advance when ready.
                    </span>
                  ) : (
                    <span>Select an option to evaluate your decision immediately.</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {practiceIdx > 0 && (
                    <button
                      onClick={() => {
                        setPracticeIdx((prev) => prev - 1);
                        setShowPracticeHint(false);
                      }}
                      className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>
                  )}

                  {isPracticeAnswered && (
                    <button
                      id="btn-next-practice"
                      onClick={handleNextPracticeQuestion}
                      className="px-5 py-2.5 bg-[#1B4CA1] hover:bg-[#002B6C] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <span>
                        {practiceIdx + 1 === activeQuestions.length
                          ? 'Complete Practice Session'
                          : 'Next Practice Scenario'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Practice Completed Card */
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-2xs text-center max-w-xl mx-auto space-y-6 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                  Practice Session Completed
                </span>
                <h3 className="text-2xl font-extrabold text-[#1B4CA1] mt-3">
                  Governance Practice Summary
                </h3>
                <p className="text-xs text-[#4B5563] mt-1">
                  You have reviewed all official scenarios with statutory rationales and regulatory citations.
                </p>
              </div>

              {/* Score breakdown */}
              {(() => {
                const correctCount = activeQuestions.filter(
                  (q, idx) => practiceAnswers[idx] === q.correctIndex
                ).length;
                const pct = Math.round((correctCount / activeQuestions.length) * 100);

                return (
                  <div className="p-4 rounded-xl bg-[#FEFAF4] border border-[#FFD2A1] flex items-center justify-around">
                    <div>
                      <p className="text-xs text-[#4B5563]">Practice Score</p>
                      <p className="text-2xl font-extrabold text-[#1B4CA1] mt-0.5">
                        {correctCount} / {activeQuestions.length}
                      </p>
                    </div>
                    <div className="h-8 w-px bg-[#FFD2A1]"></div>
                    <div>
                      <p className="text-xs text-[#4B5563]">Proficiency</p>
                      <p className="text-2xl font-extrabold text-[#B45309] mt-0.5">
                        {pct >= 80 ? 'Exemplary' : pct >= 60 ? 'Proficient' : 'Developing'}
                      </p>
                    </div>
                    <div className="h-8 w-px bg-[#FFD2A1]"></div>
                    <div>
                      <p className="text-xs text-[#4B5563]">Accuracy</p>
                      <p className="text-2xl font-extrabold text-emerald-700 mt-0.5">
                        {pct}%
                      </p>
                    </div>
                  </div>
                );
              })()}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  id="btn-retake-practice"
                  onClick={handleRestartPractice}
                  className="px-4 py-2.5 bg-[#EDF1F7] hover:bg-[#C7D9FB] text-[#1B4CA1] font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Practice Again</span>
                </button>

                <button
                  id="btn-switch-to-test"
                  onClick={handleStartTest}
                  className="px-5 py-2.5 bg-[#EF951E] hover:bg-[#F08811] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Timer className="w-4 h-4" />
                  <span>Take Official Exam (Test Mode)</span>
                </button>

                <button
                  onClick={() => onNavigate('gap-analysis')}
                  className="px-4 py-2.5 bg-[#1B4CA1] hover:bg-[#002B6C] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Inspect Competency Gap
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TEST MODE VIEW (Timed & Evaluated Exam) */}
      {/* ========================================================================= */}
      {activeMode === 'test' && (
        <div>
          {!isTestSubmitted ? (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-2xs space-y-6">
              {/* Test Mode Exam Top Bar: Timer, Countdowns & Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-rose-600" /> Official Examination Mode
                    </span>
                    <span className="text-xs text-[#1B4CA1] font-mono font-bold">
                      Cadre Level Assessment
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#1B4CA1] mt-1">
                    {activeQuizTitle}
                  </h3>
                </div>

                {/* Live Countdown Timer & Submit Exam Button */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-extrabold text-sm ${
                      timeLeftSec < 120
                        ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                        : 'bg-[#EDF1F7] text-[#1B4CA1] border-[#C7D9FB]'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-[#EF951E]" />
                    <span>Time Remaining: {formatTime(timeLeftSec)}</span>
                  </div>

                  <button
                    id="btn-submit-exam"
                    onClick={() => setShowSubmitConfirmModal(true)}
                    className="px-4 py-2 bg-[#EF951E] hover:bg-[#F08811] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    Submit Test
                  </button>
                </div>
              </div>

              {/* Interactive Question Palette / Navigator Bar */}
              <div className="p-3.5 bg-[#EDF1F7] rounded-xl border border-[#C7D9FB] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1B4CA1] flex items-center gap-1.5">
                    <span>Question Palette:</span>
                    <span className="text-slate-600 font-normal">
                      {answeredTestCount} of {totalQuestions} answered
                    </span>
                  </span>
                  <div className="flex items-center gap-3 text-[11px] text-slate-600">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1B4CA1]"></span> Answered
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Flagged
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-400"></span> Unanswered
                    </span>
                  </div>
                </div>

                {/* Number Buttons Grid */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {activeQuestions.map((_, idx) => {
                    const isAnswered = testAnswers[idx] !== undefined;
                    const isFlagged = flaggedQuestions.has(idx);
                    const isCurrent = testIdx === idx;

                    return (
                      <button
                        key={idx}
                        id={`test-pal-btn-${idx}`}
                        onClick={() => setTestIdx(idx)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center relative transition-all cursor-pointer ${
                          isCurrent
                            ? 'ring-2 ring-[#EF951E] ring-offset-1 font-extrabold'
                            : ''
                        } ${
                          isAnswered
                            ? 'bg-[#1B4CA1] text-white'
                            : 'bg-white text-slate-700 border border-slate-300 hover:border-[#1B4CA1]'
                        }`}
                      >
                        <span>{idx + 1}</span>
                        {isFlagged && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center ring-1 ring-white">
                            <Flag className="w-2 h-2 text-white" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Test Question Workspace */}
              <div className="space-y-4">
                {/* Meta row */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white bg-[#1B4CA1] px-2.5 py-1 rounded">
                      Question {testIdx + 1}
                    </span>
                    <span className="text-xs font-bold text-[#1B4CA1]">
                      {currentTestQ.topic}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleFlag(testIdx)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      flaggedQuestions.has(testIdx)
                        ? 'bg-amber-100 border-amber-300 text-amber-900'
                        : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Flag className={`w-3.5 h-3.5 ${flaggedQuestions.has(testIdx) ? 'text-amber-600 fill-current' : ''}`} />
                    <span>{flaggedQuestions.has(testIdx) ? 'Flagged for Review' : 'Flag for Review'}</span>
                  </button>
                </div>

                {/* Scenario */}
                <div className="p-5 rounded-xl bg-[#FFE9CD] border border-[#FFD2A1]">
                  <span className="text-[10px] font-bold text-[#C37024] uppercase tracking-wider block mb-1">
                    Administrative Scenario & Dilemma
                  </span>
                  <p className="text-xs sm:text-sm text-[#1B2133] leading-relaxed font-medium">
                    {currentTestQ.scenario}
                  </p>
                </div>

                {/* Question */}
                <h3 className="text-sm sm:text-base font-bold text-[#1B4CA1]">
                  {currentTestQ.question}
                </h3>

                {/* Options in Test Mode: NO ANSWERS REVEALED */}
                <div className="space-y-3">
                  {currentTestQ.options.map((option, idx) => {
                    const isSelected = testAnswers[testIdx] === idx;

                    return (
                      <button
                        key={idx}
                        id={`test-opt-${idx}`}
                        onClick={() => handleSelectTestOption(idx)}
                        className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-[#EDF1F7] border-[#1B4CA1] ring-2 ring-[#1B4CA1]/30 text-[#1B4CA1] font-bold shadow-xs'
                            : 'bg-white border-[#E5E7EB] hover:bg-[#FEFAF4] hover:border-[#FFD2A1] text-[#374151]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-[#1B4CA1] text-white'
                                : 'bg-[#EDF1F7] text-[#1B4CA1]'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="leading-relaxed">{option}</span>
                        </div>

                        {isSelected && (
                          <span className="text-xs font-bold text-[#1B4CA1] shrink-0">
                            Selected
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation controls */}
              <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  {testAnswers[testIdx] !== undefined && (
                    <button
                      onClick={handleClearTestOption}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Clear Selection
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTestIdx((prev) => Math.max(0, prev - 1))}
                    disabled={testIdx === 0}
                    className="px-4 py-2 border border-slate-300 disabled:opacity-40 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  {testIdx + 1 < activeQuestions.length ? (
                    <button
                      onClick={() => setTestIdx((prev) => prev + 1)}
                      className="px-5 py-2.5 bg-[#1B4CA1] hover:bg-[#002B6C] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSubmitConfirmModal(true)}
                      className="px-5 py-2.5 bg-[#EF951E] hover:bg-[#F08811] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <span>Review & Submit</span>
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Post-Test Comprehensive Diagnostic Report (SIH 2026 Technical Approach Standard) */
            <div className="space-y-6 animate-in fade-in">
              {/* Scorecard Hero Banner */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-2xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E5E7EB]">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold ${
                        testAccuracyPercent >= 75
                          ? 'bg-emerald-100 text-emerald-800'
                          : testAccuracyPercent >= 50
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {testAccuracyPercent}%
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded">
                          Official Evaluation Complete
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          FRAC Record Updated
                        </span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-[#1B4CA1] mt-1">
                        Cadre Diagnostic Report
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Performance authenticated under DoPT Civil Services Competency Framework.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center min-w-28">
                      <span className="text-[10px] uppercase font-bold text-amber-800 block">Karmayogi Points</span>
                      <span className="text-xl font-extrabold text-[#EF951E]">+{karmaAwarded}</span>
                    </div>
                    <button
                      onClick={handleRestartTest}
                      className="px-4 py-2.5 bg-[#EDF1F7] hover:bg-[#C7D9FB] text-[#1B4CA1] font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Exam</span>
                    </button>
                    <button
                      onClick={() => setActiveMode('practice')}
                      className="px-4 py-2.5 bg-[#1B4CA1] hover:bg-[#002B6C] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <BookOpenCheck className="w-3.5 h-3.5" />
                      <span>Switch to Practice</span>
                    </button>
                  </div>
                </div>

                {/* Psychometric Cognitive Breakdown: Recall vs Application */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {/* Recall Breakdown */}
                  <div className="p-4 rounded-xl bg-[#EDF1F7] border border-[#C7D9FB] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1B4CA1] flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5 text-[#1B4CA1]" />
                        <span>Procedural Recall Competency</span>
                      </span>
                      <span className="text-xs font-mono font-extrabold text-[#1B4CA1]">
                        {recallCorrect}/{recallQuestions.length} ({recallPercent}%)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Statutory rule retention (GFR thresholds, CSMOP procedures, RTI exemptions).
                    </p>
                    <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#C7D9FB]">
                      <div
                        className="bg-[#1B4CA1] h-full rounded-full transition-all duration-500"
                        style={{ width: `${recallPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Application Breakdown */}
                  <div className="p-4 rounded-xl bg-[#FFE9CD] border border-[#FFD2A1] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#C37024] flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-[#EF951E]" />
                        <span>Administrative Application Competency</span>
                      </span>
                      <span className="text-xs font-mono font-extrabold text-[#C37024]">
                        {applicationCorrect}/{applicationQuestions.length} ({applicationPercent}%)
                      </span>
                    </div>
                    <p className="text-[11px] text-[#1B2133] leading-relaxed">
                      Decision-making under ambiguity, conflict resolution, ethics, and emergency delegations.
                    </p>
                    <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#FFD2A1]">
                      <div
                        className="bg-[#EF951E] h-full rounded-full transition-all duration-500"
                        style={{ width: `${applicationPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question-by-Question Review with Filter Tabs */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-2xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
                  <div>
                    <h4 className="text-base font-extrabold text-[#1B4CA1]">
                      Comprehensive Exam Answer Key & Statutory Citations
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Review all question rationales, legal statutes, and comparison against your selected decisions.
                    </p>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex items-center bg-[#EDF1F7] p-1 rounded-xl text-xs font-bold text-slate-600 gap-1">
                    <button
                      onClick={() => setTestReviewFilter('all')}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        testReviewFilter === 'all' ? 'bg-[#1B4CA1] text-white shadow-2xs' : 'hover:text-[#1B4CA1]'
                      }`}
                    >
                      All ({totalQuestions})
                    </button>
                    <button
                      onClick={() => setTestReviewFilter('correct')}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        testReviewFilter === 'correct' ? 'bg-emerald-600 text-white shadow-2xs' : 'hover:text-emerald-700'
                      }`}
                    >
                      Correct ({correctTestCount})
                    </button>
                    <button
                      onClick={() => setTestReviewFilter('incorrect')}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        testReviewFilter === 'incorrect' ? 'bg-rose-600 text-white shadow-2xs' : 'hover:text-rose-700'
                      }`}
                    >
                      Incorrect ({totalQuestions - correctTestCount})
                    </button>
                    <button
                      onClick={() => setTestReviewFilter('flagged')}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        testReviewFilter === 'flagged' ? 'bg-amber-600 text-white shadow-2xs' : 'hover:text-amber-700'
                      }`}
                    >
                      Flagged ({flaggedCount})
                    </button>
                  </div>
                </div>

                {/* Filtered Question Review Cards */}
                <div className="space-y-6">
                  {activeQuestions
                    .map((q, idx) => ({ q, idx }))
                    .filter(({ q, idx }) => {
                      const isCorrect = testAnswers[idx] === q.correctIndex;
                      if (testReviewFilter === 'correct') return isCorrect;
                      if (testReviewFilter === 'incorrect') return !isCorrect;
                      if (testReviewFilter === 'flagged') return flaggedQuestions.has(idx);
                      return true;
                    })
                    .map(({ q, idx }) => {
                      const selectedIdx = testAnswers[idx];
                      const isCorrect = selectedIdx === q.correctIndex;
                      const isFlagged = flaggedQuestions.has(idx);

                      return (
                        <div
                          key={q.id || idx}
                          className={`p-5 rounded-2xl border transition-all space-y-4 ${
                            isCorrect
                              ? 'bg-emerald-50/40 border-emerald-200'
                              : 'bg-rose-50/40 border-rose-200'
                          }`}
                        >
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold px-2 py-0.5 rounded ${
                                  isCorrect
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-rose-600 text-white'
                                }`}
                              >
                                #{idx + 1} • {isCorrect ? 'Correct Decision' : 'Deficit Identified'}
                              </span>
                              <span className="text-xs font-bold text-[#1B4CA1]">{q.topic}</span>
                            </div>

                            <div className="flex items-center gap-2 text-xs">
                              {isFlagged && (
                                <span className="text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                                  <Flag className="w-3 h-3 text-amber-600" /> Flagged during exam
                                </span>
                              )}
                              <span className="text-slate-500 font-mono">
                                Type: {q.cognitiveLevel || 'Application'}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm font-semibold text-[#1B2133] leading-relaxed">
                            {q.scenario}
                          </p>

                          <h5 className="text-xs sm:text-sm font-bold text-[#1B4CA1]">
                            {q.question}
                          </h5>

                          {/* Options comparison */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {q.options.map((opt, optIdx) => {
                              const isThisCorrect = optIdx === q.correctIndex;
                              const isThisSelected = optIdx === selectedIdx;

                              return (
                                <div
                                  key={optIdx}
                                  className={`p-3 rounded-xl border flex items-start gap-2 ${
                                    isThisCorrect
                                      ? 'bg-emerald-100/70 border-emerald-400 text-emerald-950 font-bold'
                                      : isThisSelected
                                      ? 'bg-rose-100/70 border-rose-400 text-rose-950 font-medium'
                                      : 'bg-white border-slate-200 text-slate-500 opacity-80'
                                  }`}
                                >
                                  <span className="font-mono font-bold">
                                    {String.fromCharCode(65 + optIdx)}.
                                  </span>
                                  <span className="flex-1">{opt}</span>
                                  {isThisCorrect && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                                  )}
                                  {isThisSelected && !isThisCorrect && (
                                    <XCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Official Civil Service Rationale */}
                          <div className="p-4 rounded-xl bg-white border border-[#C7D9FB] space-y-1.5 text-xs text-[#1B2133]">
                            <div className="flex items-center gap-1.5 font-bold text-[#1B4CA1]">
                              <FileCheck className="w-4 h-4 text-[#1B4CA1]" />
                              <span>Official Civil Service Rationale & Statute:</span>
                            </div>
                            <p className="leading-relaxed">{q.officialRationale}</p>
                            <p className="text-[11px] font-mono font-bold text-[#1B4CA1] pt-1">
                              Citation: {q.regulationCitation}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. AI GENERATOR & DOCUMENT UPLOAD VIEW */}
      {/* ========================================================================= */}
      {activeMode === 'generator' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Main Upload & Config Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-2xs space-y-6">
            <div className="pb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-[#FFE9CD] text-[#92400E] border border-[#FFD2A1] px-2 py-0.5 rounded flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#EF951E]" /> Multimodal Quiz Synthesizer
                </span>
                <span className="text-xs text-[#1B4CA1] font-bold">Powered by Gemini 3.8 Flash</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#1B4CA1]">
                Upload Manual / Policy Document & Generate Assessment
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Upload any official administrative circular, manual, or policy guideline (PDF, DOCX, TXT, JSON) to synthesize contextual governance scenarios with civil service rationales calibrated to your cadre level.
              </p>
            </div>

            {/* Drag & Drop File Upload Zone (Supports PDF or any file extension) */}
            <div>
              <label className="block text-xs font-bold text-[#1B2133] mb-2">
                Upload Document (PDF, DOCX, TXT, JSON, MD, etc.)
              </label>

              {/* Hidden file input */}
              <input
                ref={hiddenInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.json,.csv,.md,application/pdf,text/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {!fileName ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  onClick={() => hiddenInputRef.current?.click()}
                  className={`p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-3 ${
                    isDragging
                      ? 'border-[#1B4CA1] bg-[#EDF1F7]/80'
                      : 'border-[#C7D9FB] bg-[#EDF1F7]/30 hover:bg-[#EDF1F7]/60 hover:border-[#1B4CA1]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-[#1B4CA1]/10 text-[#1B4CA1] flex items-center justify-center mx-auto">
                    <UploadCloud className="w-6 h-6 text-[#1B4CA1]" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#1B4CA1] block">
                      Click to choose file or drag and drop here
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      PDF, DOCX, TXT, JSON, CSV, or Markdown (up to 25MB)
                    </span>
                  </div>
                </div>
              ) : (
                /* Selected File Card */
                <div className="p-4 rounded-xl bg-[#EDF1F7] border border-[#C7D9FB] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#C7D9FB] flex items-center justify-center text-[#1B4CA1]">
                      <FileText className="w-5 h-5 text-[#1B4CA1]" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-[#1B4CA1] max-w-sm truncate">
                        {fileName}
                      </h5>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-500 font-mono">
                          {fileSizeFormatted}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded">
                          Ready for Synthesis
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => hiddenInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 text-[#1B4CA1] border border-[#C7D9FB] rounded-lg text-xs font-bold cursor-pointer transition-colors"
                    >
                      Change File
                    </button>
                    <button
                      onClick={handleRemoveFile}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick-Load Sample Government Documents */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#1B2133] block">
                Or select an official benchmark government manual:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SAMPLE_DOCS.map((doc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSampleDoc(doc)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                      fileName === doc.name
                        ? 'bg-[#FFE9CD] border-[#FFD2A1] ring-2 ring-[#EF951E]/30'
                        : 'bg-white border-[#E5E7EB] hover:border-[#C7D9FB] hover:bg-[#EDF1F7]/30'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-[#EF951E] shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-[#1B4CA1] block truncate">
                        {doc.name}
                      </span>
                      <span className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                        {doc.description}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                        {doc.size} • {doc.pages}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Customization Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Question Count */}
              <div>
                <label className="block text-xs font-bold text-[#1B2133] mb-1.5">
                  Number of Scenarios
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[3, 5, 8, 10].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setNumQuestionsToGenerate(count)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                        numQuestionsToGenerate === count
                          ? 'bg-[#1B4CA1] text-white border-[#1B4CA1]'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cognitive Balance */}
              <div>
                <label className="block text-xs font-bold text-[#1B2133] mb-1.5">
                  Cognitive Assessment Balance
                </label>
                <select
                  value={cognitiveBalance}
                  onChange={(e) => setCognitiveBalance(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#C7D9FB] bg-[#EDF1F7] text-[#1B2133] font-medium focus:outline-none focus:ring-2 focus:ring-[#1B4CA1]"
                >
                  <option value="mixed">Balanced (50% Recall + 50% Application)</option>
                  <option value="application">Application Focus (Dilemmas & Decisions)</option>
                  <option value="recall">Recall Focus (Statutory Rules & Procedures)</option>
                </select>
              </div>

              {/* Cadre Level */}
              <div>
                <label className="block text-xs font-bold text-[#1B2133] mb-1.5">
                  Target Cadre Level
                </label>
                <select
                  value={targetCadreLevel}
                  onChange={(e) => setTargetCadreLevel(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#C7D9FB] bg-[#EDF1F7] text-[#1B2133] font-medium focus:outline-none focus:ring-2 focus:ring-[#1B4CA1]"
                >
                  <option value="Foundation (Level 8-10: Section Officer / ASO)">
                    Foundation (Level 8-10: Section Officer / ASO)
                  </option>
                  <option value="Senior Admin (Level 11-13: Under Secy / Deputy Secy)">
                    Senior Admin (Level 11-13: Under / Deputy Secy)
                  </option>
                  <option value="Executive (Level 14+: Director / Joint Secretary)">
                    Executive (Level 14+: Director / Joint Secretary)
                  </option>
                </select>
              </div>
            </div>

            {/* Focus Topic and Specific Directives */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1B2133] mb-1.5">
                  Focus Regulatory Topic
                </label>
                <input
                  type="text"
                  value={generatorTopic}
                  onChange={(e) => setGeneratorTopic(e.target.value)}
                  placeholder="e.g. GFR Emergency Procurement & Single Tender Inquiries"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#C7D9FB] bg-[#EDF1F7] text-[#1B2133] font-medium focus:outline-none focus:ring-2 focus:ring-[#1B4CA1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B2133] mb-1.5">
                  Custom Directives / Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="e.g. Include specific questions on financial limits and vigilance recusals"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#C7D9FB] bg-[#EDF1F7] text-[#1B2133] font-medium focus:outline-none focus:ring-2 focus:ring-[#1B4CA1]"
                />
              </div>
            </div>

            {/* Error or Success Notices */}
            {generationError && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{generationError}</span>
              </div>
            )}

            {generationSuccessNotice && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{generationSuccessNotice}</span>
                </div>

                <div className="flex items-center gap-3 pt-1 flex-wrap">
                  <button
                    id="btn-launch-practice-gen"
                    onClick={() => {
                      setActiveMode('practice');
                      handleRestartPractice();
                    }}
                    className="px-4 py-2 bg-[#1B4CA1] hover:bg-[#002B6C] text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <BookOpenCheck className="w-3.5 h-3.5" />
                    <span>Launch in Practice Mode</span>
                  </button>

                  <button
                    id="btn-launch-test-gen"
                    onClick={handleStartTest}
                    className="px-4 py-2 bg-[#EF951E] hover:bg-[#F08811] text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Timer className="w-3.5 h-3.5" />
                    <span>Launch in Test Mode (Exam)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Primary Action Button: Generate */}
            <div>
              <button
                id="btn-generate-quiz-ai"
                onClick={handleGenerateQuiz}
                disabled={isGenerating}
                className="w-full py-3.5 bg-[#EF951E] hover:bg-[#F08811] disabled:opacity-50 text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{generationStep || 'Synthesizing with Gemini 3.8 Flash...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>
                      Generate {numQuestionsToGenerate} Scenario Questions with Ira AI
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBMIT CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {showSubmitConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#C7D9FB] shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3 text-amber-800">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-[#1B4CA1]">
                  Confirm Test Submission
                </h4>
                <p className="text-xs text-slate-500">
                  Mission Karmayogi Formal Assessment
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#EDF1F7] text-xs space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span>Total Questions:</span>
                <span className="font-bold">{totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span>Questions Answered:</span>
                <span className="font-bold text-[#1B4CA1]">{answeredTestCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Unanswered Questions:</span>
                <span className={`font-bold ${unansweredCount > 0 ? 'text-rose-600' : 'text-slate-600'}`}>
                  {unansweredCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Flagged for Review:</span>
                <span className="font-bold text-amber-600">{flaggedCount}</span>
              </div>
            </div>

            {unansweredCount > 0 && (
              <p className="text-[11px] text-rose-600 font-medium leading-relaxed">
                Notice: You have {unansweredCount} unanswered questions. Unanswered questions will be scored as 0.
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSubmitConfirmModal(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Keep Reviewing
              </button>
              <button
                id="btn-confirm-submit-exam"
                onClick={handleFinalSubmitTest}
                className="px-5 py-2 bg-[#EF951E] hover:bg-[#F08811] text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
              >
                Yes, Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
