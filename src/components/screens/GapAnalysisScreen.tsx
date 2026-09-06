import React, { useState } from 'react';
import { CompetencyItem, LearningModule, ScreenId } from '../../types';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  TrendingUp,
  FileText
} from 'lucide-react';

interface GapAnalysisScreenProps {
  competencies: CompetencyItem[];
  modules: LearningModule[];
  onNavigate: (screen: ScreenId) => void;
  onOpenModule: (module: LearningModule) => void;
}

export const GapAnalysisScreen: React.FC<GapAnalysisScreenProps> = ({
  competencies,
  modules,
  onNavigate,
  onOpenModule,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [activeCompetencyId, setActiveCompetencyId] = useState<string>(competencies[0]?.id || 'fr-01');
  const [simulatedGain, setSimulatedGain] = useState<{ [id: string]: boolean }>({});

  const domains = ['All', 'Digital Governance', 'Financial Management', 'Citizen Centricity', 'Public Policy', 'Administrative Ethics'];

  const filteredCompetencies = selectedDomain === 'All'
    ? competencies
    : competencies.filter(c => c.domain === selectedDomain);

  const activeItem = competencies.find(c => c.id === activeCompetencyId) || competencies[0];

  const handleTogglePlan = (id: string) => {
    setSimulatedGain(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="gap-analysis-screen" class="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
      {/* Top Banner / Breadcrumb Action */}
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h2 class="text-2xl font-serif text-white font-semibold tracking-wide">
            Competency Gap Analysis <span class="text-amber-500 font-sans text-sm font-normal ml-2">Deep Dive Audit</span>
          </h2>
          <p class="text-xs text-gray-400 mt-1">
            Benchmarked against the official National Civil Service Competency Framework (FRAC) & Cadre Level 14 Mandate.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            onClick={() => onNavigate('roadmap')}
            class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Sync with Roadmap</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Domain Filter Pills */}
      <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {domains.map((dom) => (
          <button
            key={dom}
            onClick={() => setSelectedDomain(dom)}
            class={`px-3.5 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap cursor-pointer ${
              selectedDomain === dom
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-[#16181D] text-gray-400 border border-gray-800 hover:text-gray-200 hover:border-gray-700'
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* 2-Column Split: Competency Cards List (Left) & Active AI Deep Dive Diagnosis (Right) */}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Competency List (5 cols) */}
        <div class="lg:col-span-5 space-y-3.5">
          <div class="flex items-center justify-between px-1">
            <span class="text-xs text-gray-400 uppercase font-semibold tracking-wider">Identified Competencies ({filteredCompetencies.length})</span>
            <span class="text-[10px] text-gray-500">Sorted by Priority</span>
          </div>

          {filteredCompetencies.map((item) => {
            const isSelected = item.id === activeCompetencyId;
            const isAdded = simulatedGain[item.id];

            return (
              <div
                key={item.id}
                id={`competency-item-${item.id}`}
                onClick={() => setActiveCompetencyId(item.id)}
                class={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#1a1e26] border-amber-500/70 shadow-lg'
                    : 'bg-[#16181D] border-gray-800 hover:border-gray-700 opacity-90'
                }`}
              >
                {/* Glow pill indicator */}
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <span
                      class={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        item.priority === 'Critical' || item.gapPercent <= -20
                          ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]'
                          : item.priority === 'High' || item.gapPercent < 0
                          ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]'
                          : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]'
                      }`}
                    ></span>
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-amber-400 border border-gray-800">
                          {item.code}
                        </span>
                        <h4 class="text-xs font-semibold text-white tracking-wide">{item.title}</h4>
                      </div>
                      <p class="text-[10px] text-gray-400 mt-1 line-clamp-1">{item.domain}</p>
                    </div>
                  </div>

                  <div class="text-right shrink-0">
                    <p
                      class={`text-xs font-mono font-bold ${
                        item.gapPercent < 0 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {item.gapPercent > 0 ? `+${item.gapPercent}%` : `${item.gapPercent}%`}
                    </p>
                    <span
                      class={`text-[9px] uppercase font-medium px-1.5 py-0.5 rounded ${
                        item.priority === 'Critical'
                          ? 'bg-red-500/10 text-red-400'
                          : item.priority === 'High'
                          ? 'bg-amber-500/10 text-amber-400'
                          : item.priority === 'Target Met'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                </div>

                {/* Micro Level Meter */}
                <div class="mt-3 pt-2.5 border-t border-gray-800/60 flex items-center justify-between text-[10px] text-gray-400">
                  <span>Current: L{item.currentLevel.toFixed(1)} / L{item.targetLevel.toFixed(1)}</span>
                  {isAdded ? (
                    <span class="text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 class="w-3 h-3" /> In Remedial Plan
                    </span>
                  ) : (
                    <span class="text-gray-500">Click to view diagnosis</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Dive AI Diagnostic Card (7 cols) */}
        {activeItem && (
          <div class="lg:col-span-7 bg-[#16181D] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
            <div class="space-y-6">
              {/* Header */}
              <div class="flex items-start justify-between border-b border-gray-800 pb-4">
                <div>
                  <div class="flex items-center gap-2 mb-1.5">
                    <span class="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {activeItem.code}
                    </span>
                    <span class="text-xs text-gray-400">{activeItem.domain}</span>
                  </div>
                  <h3 class="text-xl font-serif text-white font-semibold tracking-wide">
                    {activeItem.title}
                  </h3>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-serif font-bold text-amber-400 font-mono">
                    {activeItem.gapPercent > 0 ? `+${activeItem.gapPercent}%` : `${activeItem.gapPercent}%`}
                  </div>
                  <p class="text-[10px] text-gray-500 uppercase tracking-wider">Gap to Level 5 Target</p>
                </div>
              </div>

              {/* Proficiency Level Comparison Visualizer */}
              <div class="p-4 rounded-xl bg-black/40 border border-gray-800 space-y-3">
                <div class="flex justify-between items-center text-xs">
                  <span class="text-gray-400">Proficiency Calibration</span>
                  <span class="text-amber-400 font-mono">
                    Current: Level {activeItem.currentLevel.toFixed(1)} → Target: Level {activeItem.targetLevel.toFixed(1)}
                  </span>
                </div>
                <div class="relative h-3 bg-gray-800 rounded-full overflow-hidden">
                  {/* Current progress */}
                  <div
                    class="absolute top-0 left-0 h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${(activeItem.currentLevel / 5) * 100}%` }}
                  ></div>
                  {/* Target benchmark pin */}
                  <div
                    class="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_6px_#fff]"
                    style={{ left: `${(activeItem.targetLevel / 5) * 100}%` }}
                    title="Required Benchmark (Level 4.5)"
                  ></div>
                </div>
                <div class="flex justify-between text-[10px] text-gray-500">
                  <span>Foundation (L1)</span>
                  <span>Operational (L2)</span>
                  <span>Advanced (L3)</span>
                  <span>Proficient (L4)</span>
                  <span>Expert / Cadre Benchmark (L5)</span>
                </div>
              </div>

              {/* AI Diagnostic Breakdown */}
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <Sparkles class="w-4 h-4 text-amber-500" />
                  <h4 class="text-xs uppercase font-bold tracking-wider text-amber-500">
                    AI Behavioral & Regulatory Diagnosis
                  </h4>
                </div>
                <div class="p-4 rounded-xl bg-gradient-to-br from-[#0F1115] to-[#12141a] border border-gray-800/80 space-y-2">
                  <p class="text-xs text-gray-200 leading-relaxed">
                    {activeItem.aiDiagnosis}
                  </p>
                  <p class="text-xs text-gray-400 leading-relaxed">
                    {activeItem.description}
                  </p>
                </div>
              </div>

              {/* Statutory / Regulation Citation */}
              <div class="p-3.5 rounded-xl bg-black/20 border border-gray-800/60 flex items-start gap-3">
                <FileText class="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Governing Regulatory Framework</p>
                  <p class="text-xs text-gray-300 mt-0.5">{activeItem.ruleReference}</p>
                </div>
              </div>

              {/* Recommended Action & Targeted Course */}
              <div class="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] uppercase tracking-wider font-bold text-amber-500">Recommended Remedial Action</span>
                  <span class="text-[10px] text-emerald-400 flex items-center gap-1">
                    <TrendingUp class="w-3 h-3" /> Closes +18% of gap
                  </span>
                </div>
                <p class="text-xs font-medium text-white">{activeItem.recommendedModuleName}</p>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div class="pt-4 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3">
              <button
                id="btn-toggle-remedial-plan"
                onClick={() => handleTogglePlan(activeItem.id)}
                class={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  simulatedGain[activeItem.id]
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
                }`}
              >
                <CheckCircle2 class="w-3.5 h-3.5" />
                {simulatedGain[activeItem.id] ? 'Saved to Learning Plan' : 'Add to Learning Plan'}
              </button>

              <div class="flex items-center gap-2">
                <button
                  id="btn-test-in-quiz-studio"
                  onClick={() => onNavigate('quiz-studio')}
                  class="px-4 py-2 bg-[#0F1115] hover:bg-gray-800 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle class="w-3.5 h-3.5 text-amber-500" />
                  <span>Test in Quiz Studio</span>
                </button>
                <button
                  id="btn-launch-module-direct"
                  onClick={() => {
                    const mod = modules.find(m => m.competencyCode === activeItem.code) || modules[0];
                    onOpenModule(mod);
                  }}
                  class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen class="w-3.5 h-3.5" />
                  <span>Launch Course</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
