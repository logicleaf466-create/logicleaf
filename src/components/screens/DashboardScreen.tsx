import React from 'react';
import { ScreenId, UserProfile, CompetencyItem, LearningModule } from '../../types';
import { ArrowUpRight, Sparkles, ChevronRight, BookOpen, AlertCircle } from 'lucide-react';

interface DashboardScreenProps {
  user: UserProfile;
  competencies: CompetencyItem[];
  modules: LearningModule[];
  onNavigate: (screen: ScreenId) => void;
  onOpenModule: (module: LearningModule) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  user,
  competencies,
  modules,
  onNavigate,
  onOpenModule,
}) => {
  const spotlightModule = modules.find((m) => m.id === 'mod-5') || modules[0];

  return (
    <section id="dashboard-screen" class="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
      {/* Top 3 Metric Cards matching Design HTML */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Competency Readiness */}
        <div
          id="card-competency-readiness"
          onClick={() => onNavigate('gap-analysis')}
          class="bg-[#16181D] p-6 rounded-2xl border border-gray-800 relative overflow-hidden group hover:border-gray-700 transition-all cursor-pointer shadow-lg"
        >
          <div class="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-12 -mt-12 group-hover:bg-amber-500/10 transition-colors"></div>
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-400 mb-1 font-medium">Competency Readiness</p>
            <ArrowUpRight class="w-4 h-4 text-gray-600 group-hover:text-amber-400 transition-colors" />
          </div>
          <h2 class="text-3xl font-serif text-white mb-2 tracking-tight">{user.competencyReadiness}%</h2>
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded font-mono font-medium">
              {user.readinessDelta}
            </span>
            <span class="text-[10px] text-gray-500">iGOT Karmayogi benchmark</span>
          </div>
        </div>

        {/* Metric 2: Active Learning Path */}
        <div
          id="card-active-learning-path"
          onClick={() => onNavigate('roadmap')}
          class="bg-[#16181D] p-6 rounded-2xl border border-gray-800 relative overflow-hidden group hover:border-gray-700 transition-all cursor-pointer shadow-lg"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-400 mb-1 font-medium">Active Learning Path</p>
            <ArrowUpRight class="w-4 h-4 text-gray-600 group-hover:text-amber-400 transition-colors" />
          </div>
          <h2 class="text-3xl font-serif text-white mb-2 tracking-tight">{user.activePath}</h2>
          <div class="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              class="bg-amber-500 h-full transition-all duration-700"
              style={{ width: `${user.activePathProgress}%` }}
            ></div>
          </div>
          <p class="text-[10px] mt-2 text-gray-500">
            {user.activePathProgress}% Complete • 3 modules left
          </p>
        </div>

        {/* Metric 3: AI Insight Score */}
        <div
          id="card-ai-insight-score"
          onClick={() => onNavigate('progress')}
          class="bg-[#16181D] p-6 rounded-2xl border border-gray-800 relative overflow-hidden group hover:border-gray-700 transition-all cursor-pointer shadow-lg"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-400 mb-1 font-medium">AI Insight Score</p>
            <Sparkles class="w-4 h-4 text-amber-500/70" />
          </div>
          <h2 class="text-3xl font-serif text-white mb-2 tracking-tight">{user.insightScore}</h2>
          <div class="flex items-center gap-1.5 mt-3">
            <div class="w-5 h-1.5 bg-amber-500 rounded-full"></div>
            <div class="w-5 h-1.5 bg-amber-500 rounded-full"></div>
            <div class="w-5 h-1.5 bg-amber-500 rounded-full"></div>
            <div class="w-5 h-1.5 bg-amber-500 rounded-full"></div>
            <div class="w-5 h-1.5 bg-gray-700 rounded-full"></div>
          </div>
          <p class="text-[10px] mt-2 text-gray-500 italic">Quiz proficiency: {user.quizProficiency}</p>
        </div>
      </div>

      {/* Main 5-Column Grid from Design HTML */}
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left 3 Columns: Competency Gap Analysis Preview */}
        <div
          id="panel-gap-preview"
          class="lg:col-span-3 bg-[#16181D] border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-serif text-white tracking-wide">Competency Gap Analysis</h3>
                <p class="text-xs text-gray-400 mt-0.5">Automated assessment against Joint Secretary (Cadre Level 14) role profile</p>
              </div>
              <button
                id="btn-view-full-report"
                onClick={() => onNavigate('gap-analysis')}
                class="text-xs text-amber-500 border border-amber-500/20 px-3.5 py-1.5 rounded-full hover:bg-amber-500 hover:text-black transition-all cursor-pointer font-medium"
              >
                View Full Report
              </button>
            </div>

            <div class="space-y-4">
              {/* Gap 1: Digital Governance */}
              <div
                onClick={() => onNavigate('gap-analysis')}
                class="flex items-center justify-between p-3.5 rounded-xl bg-black/30 border border-gray-800/50 hover:border-gray-700 transition-all cursor-pointer group"
              >
                <div class="flex items-center gap-4">
                  <div class="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] shrink-0"></div>
                  <div>
                    <div class="flex items-center gap-2">
                      <p class="text-xs font-semibold text-gray-200 group-hover:text-amber-400 transition-colors">
                        Digital Governance (FR-01)
                      </p>
                      <span class="text-[10px] text-red-400 bg-red-400/10 px-1.5 py-0.2 rounded font-mono">
                        Critical
                      </span>
                    </div>
                    <p class="text-[10px] text-gray-500 italic mt-0.5">Critical gap identified in e-Office protocols & encrypted filing</p>
                  </div>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-xs font-mono text-gray-300 font-semibold">Gap: -24%</p>
                  <p class="text-[10px] text-amber-400 font-medium">Priority: High</p>
                </div>
              </div>

              {/* Gap 2: Financial Management */}
              <div
                onClick={() => onNavigate('gap-analysis')}
                class="flex items-center justify-between p-3.5 rounded-xl bg-black/30 border border-gray-800/50 hover:border-gray-700 transition-all cursor-pointer group opacity-90"
              >
                <div class="flex items-center gap-4">
                  <div class="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] shrink-0"></div>
                  <div>
                    <div class="flex items-center gap-2">
                      <p class="text-xs font-semibold text-gray-200 group-hover:text-amber-400 transition-colors">
                        Financial Management (BM-04)
                      </p>
                      <span class="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded font-mono">
                        Moderate
                      </span>
                    </div>
                    <p class="text-[10px] text-gray-500 italic mt-0.5">Moderate gap in GFR 2024 compliance & GeM thresholds</p>
                  </div>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-xs font-mono text-gray-300 font-semibold">Gap: -12%</p>
                  <p class="text-[10px] text-amber-400 font-medium">Priority: Med</p>
                </div>
              </div>

              {/* Gap 3: Citizen Centricity */}
              <div
                onClick={() => onNavigate('gap-analysis')}
                class="flex items-center justify-between p-3.5 rounded-xl bg-black/30 border border-gray-800/50 hover:border-gray-700 transition-all cursor-pointer group opacity-75"
              >
                <div class="flex items-center gap-4">
                  <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] shrink-0"></div>
                  <div>
                    <div class="flex items-center gap-2">
                      <p class="text-xs font-semibold text-gray-200 group-hover:text-emerald-300 transition-colors">
                        Citizen Centricity (CC-01)
                      </p>
                      <span class="text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.2 rounded font-mono">
                        Aligned
                      </span>
                    </div>
                    <p class="text-[10px] text-gray-500 italic mt-0.5">Role-aligned competency reached under CPGRAMS Sevottam</p>
                  </div>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-xs font-mono text-gray-300 font-semibold">Gap: +2%</p>
                  <p class="text-[10px] text-emerald-400 font-medium">Target Met</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
            <span class="flex items-center gap-2">
              <AlertCircle class="w-3.5 h-3.5 text-amber-500" />
              2 high-impact interventions ready for review
            </span>
            <button
              onClick={() => onNavigate('gap-analysis')}
              class="text-amber-500 hover:text-amber-400 flex items-center gap-1 font-medium transition-colors"
            >
              Analyze All 5 Competencies <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 2 Columns: AI Quiz Studio Challenge & Library Spotlight */}
        <div class="lg:col-span-2 flex flex-col gap-6">
          {/* AI Quiz Studio Challenge card matching Design HTML */}
          <div
            id="card-quiz-challenge"
            class="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between"
          >
            <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-black/10 rounded-full pointer-events-none"></div>
            <div>
              <p class="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-2">
                AI Quiz Studio Challenge
              </p>
              <h4 class="text-xl font-serif font-semibold mb-3 tracking-wide">Weekly Strategic Assessment</h4>
              <p class="text-xs opacity-90 leading-relaxed mb-6">
                Test your decision-making in high-stakes governance scenarios based on current Ministry guidelines.
              </p>
            </div>
            <button
              id="btn-start-weekly-assessment"
              onClick={() => onNavigate('quiz-studio')}
              class="w-full py-3 bg-white hover:bg-amber-100 text-amber-900 rounded-xl font-bold text-sm shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Start Assessment
            </button>
          </div>

          {/* Library Spotlight card matching Design HTML */}
          <div
            id="card-library-spotlight"
            class="bg-[#16181D] border border-gray-800 rounded-2xl p-6 shadow-xl relative"
          >
            <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              Library Spotlight
            </h3>
            <div class="flex gap-4">
              <div
                onClick={() => onOpenModule(spotlightModule)}
                class="w-14 h-18 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700/80 shadow-lg shrink-0 flex items-center justify-center cursor-pointer hover:border-amber-500/50 transition-all group"
              >
                <BookOpen class="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
              </div>
              <div class="flex flex-col justify-center">
                <p
                  onClick={() => onOpenModule(spotlightModule)}
                  class="text-xs font-medium text-white mb-1 hover:text-amber-400 cursor-pointer transition-colors"
                >
                  {spotlightModule.title}
                </p>
                <p class="text-[10px] text-gray-500">
                  {spotlightModule.type} • 12 mins left
                </p>
                <button
                  onClick={() => onOpenModule(spotlightModule)}
                  class="text-[10px] text-amber-500 hover:text-amber-400 mt-1.5 underline text-left font-medium transition-colors"
                >
                  Resume Learning
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
