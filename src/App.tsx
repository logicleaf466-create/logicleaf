/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenId, LearningModule, QuizQuestion } from './types';
import { currentUserProfile, initialCompetencies, learningModules, quizQuestions } from './data/mockData';
import { GovernmentMasthead } from './components/GovernmentMasthead';
import { Header } from './components/Header';
import { TickerBar } from './components/TickerBar';
import { GovernmentFooter } from './components/GovernmentFooter';
import { IraCopilotDrawer } from './components/IraCopilotDrawer';
import { SettingsModal } from './components/SettingsModal';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { GapAnalysisScreen } from './components/screens/GapAnalysisScreen';
import { RoadmapScreen } from './components/screens/RoadmapScreen';
import { QuizStudioScreen } from './components/screens/QuizStudioScreen';
import { LibraryScreen } from './components/screens/LibraryScreen';
import { ProgressScreen } from './components/screens/ProgressScreen';
import { ModuleModal } from './components/ModuleModal';
import { CourseLoadingModal } from './components/CourseLoadingModal';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [user, setUser] = useState(currentUserProfile);
  const [competencies, setCompetencies] = useState(initialCompetencies);
  const [modules, setModules] = useState<LearningModule[]>(learningModules);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [loadingModule, setLoadingModule] = useState<LearningModule | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [language, setLanguage] = useState<'English' | 'हिन्दी'>('English');
  const [fontSizeDelta, setFontSizeDelta] = useState<number>(0);
  const [highContrast, setHighContrast] = useState<boolean>(false);

  // Active Quiz Studio State (syncs when generated from video module end-screen or course modal)
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[]>(quizQuestions);
  const [activeQuizTitle, setActiveQuizTitle] = useState<string>(
    'DoPT Governance Assessment (GFR 2024, CSMOP & Ethics)'
  );
  const [activeQuizMode, setActiveQuizMode] = useState<'practice' | 'test'>('practice');

  const handleLaunchQuizStudio = (
    questions: QuizQuestion[],
    title: string,
    mode: 'practice' | 'test' = 'practice'
  ) => {
    setActiveQuizQuestions(questions);
    setActiveQuizTitle(title);
    setActiveQuizMode(mode);
    setSelectedModule(null);
    setCurrentScreen('quiz-studio');
  };

  // Sync courses with live Express backend (/api/courses)
  useEffect(() => {
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setModules((prev) =>
            prev.map((mod) => {
              const backendCourse = data.find((c: any) => c.id === mod.id);
              if (backendCourse) {
                return {
                  ...mod,
                  title: backendCourse.name || mod.title,
                  rawExtracted: backendCourse,
                  extractedVideos: (backendCourse.subItems || []).filter(
                    (s: any) => s.mimeType === 'video/mp4' || s.artifactUrl?.endsWith('.mp4')
                  ),
                  extractedResources: backendCourse.subItems || [],
                  keywords: backendCourse.keywords || [],
                  competencies: backendCourse.competencies_v5 || [],
                  posterImage: backendCourse.posterImage,
                  appIcon: backendCourse.appIcon,
                };
              }
              return mod;
            })
          );
        }
      })
      .catch((err) => {
        console.warn('Backend courses API fetch notice:', err);
      });
  }, []);

  const handleOpenModule = (moduleToOpen: LearningModule) => {
    // 1-second high-precision loading transition before displaying the course
    setLoadingModule(moduleToOpen);
    setTimeout(() => {
      setLoadingModule(null);
      setSelectedModule(moduleToOpen);
    }, 1000);
  };

  const handleUpdateModuleProgress = (moduleId: string, newProgress: number) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id === moduleId) {
          const updatedStatus = newProgress === 100 ? 'completed' : newProgress > 0 ? 'in-progress' : 'not-started';
          return { ...mod, progressPercent: newProgress, status: updatedStatus };
        }
        return mod;
      })
    );

    setSelectedModule((prev) =>
      prev && prev.id === moduleId
        ? {
            ...prev,
            progressPercent: newProgress,
            status: newProgress === 100 ? 'completed' : newProgress > 0 ? 'in-progress' : 'not-started',
          }
        : prev
    );

    // Only increment user points/readiness if advancing, not on reset
    if (newProgress > 0) {
      setUser((prev) => {
        const delta = Math.min(99.4, +(prev.competencyReadiness + 0.1).toFixed(1));
        const newPoints = newProgress === 100 ? prev.karmaPoints + 50 : prev.karmaPoints;
        return {
          ...prev,
          competencyReadiness: delta,
          karmaPoints: newPoints,
          activePathProgress: Math.min(100, prev.activePathProgress + 1),
        };
      });
    }
  };

  const handleQuizComplete = (score: number, total: number, mode: 'practice' | 'test') => {
    setUser((prev) => {
      const pointBonus = mode === 'test' ? Math.round((score / total) * 100) + 25 : 30;
      const readinessBoost = +(prev.competencyReadiness + (mode === 'test' ? 0.3 : 0.1)).toFixed(1);
      return {
        ...prev,
        karmaPoints: prev.karmaPoints + pointBonus,
        competencyReadiness: Math.min(99.8, readinessBoost),
        quizProficiency: `${score}/${total} (${Math.round((score / total) * 100)}%)`,
      };
    });
  };

  const handleSkipToContent = () => {
    const mainEl = document.getElementById('main-content');
    if (mainEl) {
      mainEl.scrollIntoView({ behavior: 'smooth' });
      mainEl.focus();
    }
  };

  // Font sizing scale multiplier style
  const fontStyle = fontSizeDelta === -1
    ? { fontSize: '0.92rem' }
    : fontSizeDelta === 1
    ? { fontSize: '1.08rem' }
    : fontSizeDelta === 2
    ? { fontSize: '1.18rem' }
    : {};

  return (
    <div
      id="igot-portal-root"
      style={fontStyle}
      className={`min-h-screen flex flex-col font-sans antialiased transition-colors ${
        highContrast
          ? 'bg-slate-900 text-slate-100 selection:bg-[#EF951E] selection:text-black'
          : 'bg-[#FEFAF4] text-[#1B2133] selection:bg-[#EF951E] selection:text-white'
      }`}
    >
      {/* 1. Official Government of India Top Masthead */}
      <GovernmentMasthead
        onOpenSettings={() => setIsSettingsOpen(true)}
        language={language}
      />

      {/* 2. Primary iGOT Karmayogi Bharat Header & Hub Navigation */}
      <Header
        currentScreen={currentScreen}
        user={user}
        onNavigate={setCurrentScreen}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 3. National Capacity Building Notice Ticker */}
      <TickerBar onActionClick={() => setCurrentScreen('gap-analysis')} />

      {/* 4. Main Portal Content Canvas */}
      <main id="main-content" tabIndex={-1} className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 outline-none">
        {currentScreen === 'dashboard' && (
          <DashboardScreen
            user={user}
            competencies={competencies}
            modules={modules}
            onNavigate={setCurrentScreen}
            onOpenModule={handleOpenModule}
            onOpenCopilot={() => setIsCopilotOpen(true)}
          />
        )}

        {currentScreen === 'gap-analysis' && (
          <GapAnalysisScreen
            competencies={competencies}
            modules={modules}
            onNavigate={setCurrentScreen}
            onOpenModule={handleOpenModule}
            onOpenCopilot={() => setIsCopilotOpen(true)}
          />
        )}

        {currentScreen === 'roadmap' && (
          <RoadmapScreen
            modules={modules}
            onNavigate={setCurrentScreen}
            onOpenModule={handleOpenModule}
            onOpenCopilot={() => setIsCopilotOpen(true)}
          />
        )}

        {currentScreen === 'quiz-studio' && (
          <QuizStudioScreen
            questions={activeQuizQuestions}
            initialTitle={activeQuizTitle}
            initialMode={activeQuizMode}
            onNavigate={setCurrentScreen}
            onOpenCopilot={() => setIsCopilotOpen(true)}
            onQuizComplete={handleQuizComplete}
          />
        )}

        {currentScreen === 'library' && (
          <LibraryScreen
            modules={modules}
            onNavigate={setCurrentScreen}
            onOpenModule={handleOpenModule}
          />
        )}

        {currentScreen === 'progress' && (
          <ProgressScreen
            user={user}
            onNavigate={setCurrentScreen}
            onOpenCopilot={() => setIsCopilotOpen(true)}
          />
        )}
      </main>

      {/* 5. Floating "Ask Ira AI" trigger button */}
      <button
        id="floating-ask-ira-btn"
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#EF951E] hover:bg-[#F08811] text-white font-bold text-xs px-4 py-3 rounded-full shadow-lg hover:shadow-xl flex items-center gap-2 transition-all cursor-pointer group transform hover:-translate-y-0.5"
        aria-label="Ask Ira AI Copilot"
      >
        <Sparkles className="w-4 h-4 text-yellow-200 group-hover:rotate-12 transition-transform" />
        <span className="tracking-wide">Ask Ira AI</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white"></span>
      </button>

      {/* 6. Comprehensive Government Portal Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        onLanguageChange={setLanguage}
        fontSizeDelta={fontSizeDelta}
        onFontSizeChange={setFontSizeDelta}
        highContrast={highContrast}
        onHighContrastToggle={() => setHighContrast((prev) => !prev)}
        onSkipToContent={handleSkipToContent}
      />

      {/* 7. High-Precision 1-Second Course Loading Screen */}
      <CourseLoadingModal
        module={loadingModule}
        isOpen={Boolean(loadingModule)}
      />

      {/* 8. Interactive In-Website Learning Module Modal */}
      {selectedModule && (
        <ModuleModal
          module={selectedModule}
          onClose={() => setSelectedModule(null)}
          onUpdateProgress={handleUpdateModuleProgress}
          onNavigateToQuizStudio={handleLaunchQuizStudio}
          onQuizComplete={handleQuizComplete}
        />
      )}

      {/* 8. Ira AI Copilot Drawer */}
      <IraCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        user={user}
        onNavigateToScreen={setCurrentScreen}
      />

      {/* 9. Official Government Portal Footer */}
      <GovernmentFooter />
    </div>
  );
}
