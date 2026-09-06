/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenId, LearningModule } from './types';
import { currentUserProfile, initialCompetencies, learningModules, quizQuestions } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { GapAnalysisScreen } from './components/screens/GapAnalysisScreen';
import { RoadmapScreen } from './components/screens/RoadmapScreen';
import { QuizStudioScreen } from './components/screens/QuizStudioScreen';
import { LibraryScreen } from './components/screens/LibraryScreen';
import { ProgressScreen } from './components/screens/ProgressScreen';
import { ModuleModal } from './components/ModuleModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [user, setUser] = useState(currentUserProfile);
  const [competencies, setCompetencies] = useState(initialCompetencies);
  const [modules, setModules] = useState<LearningModule[]>(learningModules);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);

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

    // If active path module or high impact module updated, increment readiness
    setUser((prev) => {
      const delta = Math.min(99.4, +(prev.competencyReadiness + 0.3).toFixed(1));
      return {
        ...prev,
        competencyReadiness: delta,
        activePathProgress: Math.min(100, prev.activePathProgress + 2),
      };
    });
  };

  return (
    <div
      id="ira-ai-app-root"
      class="flex h-screen w-screen bg-[#0A0B0D] text-gray-200 font-sans overflow-hidden select-none"
    >
      {/* Sidebar Navigation */}
      <Sidebar currentScreen={currentScreen} onNavigate={setCurrentScreen} />

      {/* Main Content Area */}
      <main class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#0A0B0D] relative">
        {/* Top Header */}
        <Header currentScreen={currentScreen} user={user} onNavigate={setCurrentScreen} />

        {/* Dynamic Screen View */}
        <div class="flex-1 flex flex-col min-h-0 overflow-y-auto">
          {currentScreen === 'dashboard' && (
            <DashboardScreen
              user={user}
              competencies={competencies}
              modules={modules}
              onNavigate={setCurrentScreen}
              onOpenModule={setSelectedModule}
            />
          )}

          {currentScreen === 'gap-analysis' && (
            <GapAnalysisScreen
              competencies={competencies}
              modules={modules}
              onNavigate={setCurrentScreen}
              onOpenModule={setSelectedModule}
            />
          )}

          {currentScreen === 'roadmap' && (
            <RoadmapScreen
              modules={modules}
              onNavigate={setCurrentScreen}
              onOpenModule={setSelectedModule}
            />
          )}

          {currentScreen === 'quiz-studio' && (
            <QuizStudioScreen
              questions={quizQuestions}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === 'library' && (
            <LibraryScreen
              modules={modules}
              onNavigate={setCurrentScreen}
              onOpenModule={setSelectedModule}
            />
          )}

          {currentScreen === 'progress' && (
            <ProgressScreen
              user={user}
              onNavigate={setCurrentScreen}
            />
          )}
        </div>
      </main>

      {/* Interactive Learning Module Modal */}
      {selectedModule && (
        <ModuleModal
          module={selectedModule}
          onClose={() => setSelectedModule(null)}
          onUpdateProgress={handleUpdateModuleProgress}
        />
      )}
    </div>
  );
}
