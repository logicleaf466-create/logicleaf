import React, { useState } from 'react';
import { LearningModule, ScreenId } from '../../types';
import {
  Compass,
  Sparkles,
  Clock,
  CheckCircle2,
  Play,
  Calendar,
  Layers,
  ChevronRight,
  RefreshCw,
  Award
} from 'lucide-react';

interface RoadmapScreenProps {
  modules: LearningModule[];
  onNavigate: (screen: ScreenId) => void;
  onOpenModule: (module: LearningModule) => void;
}

export const RoadmapScreen: React.FC<RoadmapScreenProps> = ({
  modules,
  onNavigate,
  onOpenModule,
}) => {
  const [pacing, setPacing] = useState<'express' | 'balanced' | 'intensive'>('balanced');
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [recalibrationToast, setRecalibrationToast] = useState(false);

  const handleRecalibrate = () => {
    setIsRecalibrating(true);
    setTimeout(() => {
      setIsRecalibrating(false);
      setRecalibrationToast(true);
      setTimeout(() => setRecalibrationToast(false), 3500);
    }, 1200);
  };

  const phases = [
    {
      phaseNumber: 1,
      title: 'Immediate High-Priority Interventions',
      timeframe: 'Weeks 1 - 3',
      objective: 'Close critical statutory compliance gaps in e-Office 7.0 and GFR 2024 emergency procurement thresholds.',
      moduleIds: ['mod-1', 'mod-2'],
      badge: 'Critical Path',
    },
    {
      phaseNumber: 2,
      title: 'Q3 Policy & Governance Strategy',
      timeframe: 'Weeks 4 - 7',
      objective: 'Strengthen inter-ministerial coordination, Cabinet Memorandum structuring, and ethical AI oversight.',
      moduleIds: ['mod-5', 'mod-4'],
      badge: 'Strategic Growth',
    },
    {
      phaseNumber: 3,
      title: 'Citizen-Centricity & Leadership Mastery',
      timeframe: 'Weeks 8 - 12',
      objective: 'Reinforce public grievance resolution and executive administrative governance under DARPG standards.',
      moduleIds: ['mod-3'],
      badge: 'Capstone Level',
    },
  ];

  return (
    <section id="roadmap-screen" class="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
      {/* Header with AI Pacing Controls */}
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <Compass class="w-5 h-5 text-amber-500" />
            <h2 class="text-2xl font-serif text-white font-semibold tracking-wide">
              Personalized Learning Roadmap
            </h2>
          </div>
          <p class="text-xs text-gray-400">
            Tailored progression pathway auto-synthesized from your role-specific competency deficits.
          </p>
        </div>

        {/* Pacing Toggle & Recalibrate */}
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center bg-[#16181D] border border-gray-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setPacing('express')}
              class={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                pacing === 'express' ? 'bg-amber-500 text-black font-semibold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Express (2 hrs/wk)
            </button>
            <button
              onClick={() => setPacing('balanced')}
              class={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                pacing === 'balanced' ? 'bg-amber-500 text-black font-semibold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Balanced (4 hrs/wk)
            </button>
            <button
              onClick={() => setPacing('intensive')}
              class={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                pacing === 'intensive' ? 'bg-amber-500 text-black font-semibold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Intensive (6 hrs/wk)
            </button>
          </div>

          <button
            id="btn-recalibrate-roadmap"
            onClick={handleRecalibrate}
            disabled={isRecalibrating}
            class="px-4 py-2 bg-[#16181D] hover:bg-gray-800 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <RefreshCw class={`w-3.5 h-3.5 ${isRecalibrating ? 'animate-spin text-amber-500' : ''}`} />
            <span>{isRecalibrating ? 'Recalibrating...' : 'AI Recalibrate'}</span>
          </button>
        </div>
      </div>

      {recalibrationToast && (
        <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between transition-all">
          <div class="flex items-center gap-2">
            <Sparkles class="w-4 h-4 text-amber-500" />
            <span>Roadmap successfully optimized: modules prioritized by latest GFR 2024 compliance updates.</span>
          </div>
          <span class="text-[10px] text-gray-400">Pacing: {pacing.toUpperCase()}</span>
        </div>
      )}

      {/* Roadmap Overview Summary Stats */}
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-[#16181D] border border-gray-800 rounded-xl p-4">
          <p class="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Total Estimated Hours</p>
          <h3 class="text-2xl font-serif text-white mt-1">18.5 hrs</h3>
          <p class="text-[10px] text-amber-400 mt-0.5">Estimated completion: 6 weeks</p>
        </div>
        <div class="bg-[#16181D] border border-gray-800 rounded-xl p-4">
          <p class="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Target Competencies</p>
          <h3 class="text-2xl font-serif text-white mt-1">5 Areas</h3>
          <p class="text-[10px] text-emerald-400 mt-0.5">3 in active remediation</p>
        </div>
        <div class="bg-[#16181D] border border-gray-800 rounded-xl p-4">
          <p class="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Overall Pathway Progress</p>
          <h3 class="text-2xl font-serif text-white mt-1">65%</h3>
          <div class="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div class="bg-amber-500 h-full w-[65%]"></div>
          </div>
        </div>
        <div class="bg-[#16181D] border border-gray-800 rounded-xl p-4">
          <p class="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Next Milestone</p>
          <h3 class="text-sm font-semibold text-white mt-1 line-clamp-1">e-Office 7.0 Certification</h3>
          <p class="text-[10px] text-gray-400 mt-0.5">Due in 4 days</p>
        </div>
      </div>

      {/* Timeline Milestone Phases */}
      <div class="space-y-6">
        {phases.map((phase) => {
          const phaseModules = modules.filter(m => phase.moduleIds.includes(m.id));

          return (
            <div
              key={phase.phaseNumber}
              class="bg-[#16181D] border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden"
            >
              {/* Milestone Phase Header */}
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-4 mb-5">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-bold text-sm">
                    {phase.phaseNumber}
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="text-base font-serif text-white font-semibold">{phase.title}</h3>
                      <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {phase.badge}
                      </span>
                    </div>
                    <p class="text-xs text-gray-400 mt-0.5">{phase.objective}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-400 font-mono">
                  <Calendar class="w-3.5 h-3.5 text-amber-500" />
                  <span>{phase.timeframe}</span>
                </div>
              </div>

              {/* Module Cards in Phase */}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {phaseModules.map((mod) => (
                  <div
                    key={mod.id}
                    id={`roadmap-module-${mod.id}`}
                    class="bg-[#0F1115] border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-amber-400 border border-gray-800">
                          {mod.competencyCode}
                        </span>
                        <span
                          class={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            mod.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : mod.status === 'in-progress'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-gray-800 text-gray-400'
                          }`}
                        >
                          {mod.status === 'completed' ? 'Completed' : mod.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                        </span>
                      </div>
                      <h4
                        onClick={() => onOpenModule(mod)}
                        class="text-sm font-semibold text-white group-hover:text-amber-400 cursor-pointer transition-colors"
                      >
                        {mod.title}
                      </h4>
                      <p class="text-xs text-gray-400 mt-1 line-clamp-2">{mod.description}</p>
                    </div>

                    <div class="mt-4 pt-3 border-t border-gray-800/80">
                      <div class="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span class="flex items-center gap-1.5 text-[11px]">
                          <Clock class="w-3 h-3 text-gray-500" /> {mod.durationMinutes} mins
                        </span>
                        <span class="font-mono text-amber-400 text-[11px] font-semibold">{mod.progressPercent}%</span>
                      </div>
                      <div class="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mb-3">
                        <div
                          class="bg-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${mod.progressPercent}%` }}
                        ></div>
                      </div>

                      <button
                        onClick={() => onOpenModule(mod)}
                        class="w-full py-2 bg-[#16181D] hover:bg-amber-500 hover:text-black text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {mod.status === 'completed' ? (
                          <>
                            <CheckCircle2 class="w-3.5 h-3.5 text-emerald-400 group-hover:text-black" />
                            <span>Review Completed Course</span>
                          </>
                        ) : (
                          <>
                            <Play class="w-3.5 h-3.5 fill-current" />
                            <span>{mod.status === 'in-progress' ? 'Continue Learning' : 'Start Module'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
