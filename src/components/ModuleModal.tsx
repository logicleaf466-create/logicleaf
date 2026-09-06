import React, { useState } from 'react';
import { LearningModule } from '../types';
import { X, Play, BookOpen, Clock, Award, CheckCircle2, Star, Sparkles } from 'lucide-react';

interface ModuleModalProps {
  module: LearningModule | null;
  onClose: () => void;
  onUpdateProgress: (moduleId: string, newProgress: number) => void;
}

export const ModuleModal: React.FC<ModuleModalProps> = ({
  module,
  onClose,
  onUpdateProgress,
}) => {
  if (!module) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'syllabus' | 'interactive'>('overview');
  const [simulatedProgress, setSimulatedProgress] = useState(module.progressPercent);
  const [completedSection, setCompletedSection] = useState<boolean>(false);

  const handleSimulateStudy = () => {
    const nextVal = Math.min(100, simulatedProgress + 25);
    setSimulatedProgress(nextVal);
    onUpdateProgress(module.id, nextVal);
    if (nextVal === 100) {
      setCompletedSection(true);
    }
  };

  return (
    <div
      id="module-modal-overlay"
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        id="module-modal-content"
        class="bg-[#16181D] border border-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div class="p-6 border-b border-gray-800 flex items-start justify-between bg-[#0F1115]">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                {module.competencyCode}
              </span>
              <span class="text-xs text-gray-400 font-medium">{module.provider}</span>
              <span class="text-xs text-gray-500">•</span>
              <span class="text-xs text-gray-400">{module.level}</span>
            </div>
            <h2 class="text-xl font-serif text-white font-semibold">{module.title}</h2>
          </div>
          <button
            id="btn-close-modal"
            onClick={onClose}
            class="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/60 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div class="px-6 border-b border-gray-800 flex gap-6 bg-[#16181D]">
          <button
            onClick={() => setActiveTab('overview')}
            class={`py-3 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Overview & Objectives
          </button>
          <button
            onClick={() => setActiveTab('syllabus')}
            class={`py-3 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'syllabus'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Curriculum Units
          </button>
          <button
            onClick={() => setActiveTab('interactive')}
            class={`py-3 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'interactive'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Simulated Executive Lab
          </button>
        </div>

        {/* Modal Body */}
        <div class="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-300">
          {activeTab === 'overview' && (
            <>
              <p class="leading-relaxed text-gray-300">{module.description}</p>

              <div class="grid grid-cols-3 gap-3 p-4 rounded-xl bg-black/40 border border-gray-800/80">
                <div class="flex items-center gap-2.5">
                  <Clock class="w-4 h-4 text-amber-500" />
                  <div>
                    <p class="text-[10px] text-gray-500 uppercase tracking-wider">Duration</p>
                    <p class="text-xs font-semibold text-white">{module.durationMinutes} mins</p>
                  </div>
                </div>
                <div class="flex items-center gap-2.5">
                  <Star class="w-4 h-4 text-amber-500" />
                  <div>
                    <p class="text-[10px] text-gray-500 uppercase tracking-wider">Rating</p>
                    <p class="text-xs font-semibold text-white">{module.rating} / 5.0</p>
                  </div>
                </div>
                <div class="flex items-center gap-2.5">
                  <Award class="w-4 h-4 text-amber-500" />
                  <div>
                    <p class="text-[10px] text-gray-500 uppercase tracking-wider">Format</p>
                    <p class="text-xs font-semibold text-white">{module.type}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-xs uppercase font-bold tracking-wider text-amber-500 mb-3">Key Executive Takeaways</h4>
                <div class="space-y-2">
                  {module.keyTakeaways.map((point, idx) => (
                    <div key={idx} class="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#0F1115] border border-gray-800/60">
                      <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span class="text-xs text-gray-300 leading-normal">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Tracking Bar */}
              <div class="p-4 rounded-xl bg-[#0F1115] border border-gray-800">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs font-medium text-gray-400">Current Progress</span>
                  <span class="text-xs font-mono font-bold text-amber-400">{simulatedProgress}% Complete</span>
                </div>
                <div class="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    class="bg-amber-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${simulatedProgress}%` }}
                  ></div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'syllabus' && (
            <div class="space-y-3">
              {[
                { title: 'Module 1: Statutory Framework & Constitutional Baselines', time: '15 mins', status: 'Completed' },
                { title: 'Module 2: Practical Administrative Case Studies & Vetting Protocols', time: '25 mins', status: simulatedProgress > 50 ? 'Completed' : 'In Progress' },
                { title: 'Module 3: Cross-Ministerial Alignment & Cabinet Compliance', time: '20 mins', status: simulatedProgress === 100 ? 'Completed' : 'Pending' },
                { title: 'Module 4: Practical Capstone Simulation & Assessment', time: '30 mins', status: simulatedProgress === 100 ? 'Completed' : 'Pending' },
              ].map((unit, idx) => (
                <div key={idx} class="p-3.5 rounded-xl bg-[#0F1115] border border-gray-800 flex items-center justify-between">
                  <div>
                    <p class="text-xs font-medium text-white">{unit.title}</p>
                    <p class="text-[10px] text-gray-500 mt-0.5">{unit.time}</p>
                  </div>
                  <span
                    class={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      unit.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : unit.status === 'In Progress'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {unit.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'interactive' && (
            <div class="space-y-4">
              <div class="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center gap-3">
                <Sparkles class="w-5 h-5 text-amber-500 shrink-0" />
                <p class="text-xs text-amber-200/90 leading-relaxed">
                  Interactive simulation actively tests decision workflows against actual iGOT Karmayogi administrative benchmarks.
                </p>
              </div>

              <div class="p-4 rounded-xl bg-[#0F1115] border border-gray-800 space-y-3">
                <h5 class="text-xs font-semibold text-white">Scenario Exercise: Regulatory Compliance Verification</h5>
                <p class="text-xs text-gray-400">
                  Analyze and execute the administrative file clearance based on the learned module principles.
                </p>
                <div class="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSimulateStudy}
                    disabled={simulatedProgress >= 100}
                    class="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold text-xs rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Play class="w-3.5 h-3.5 fill-black" />
                    {simulatedProgress >= 100 ? 'Module Completed' : 'Simulate Study Session (+25%)'}
                  </button>
                  {completedSection && (
                    <span class="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 class="w-3.5 h-3.5" /> 100% Competency Achieved!
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div class="p-4 border-t border-gray-800 bg-[#0F1115] flex items-center justify-between">
          <button
            onClick={onClose}
            class="px-4 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
          <div class="flex items-center gap-3">
            <button
              onClick={handleSimulateStudy}
              class="px-4 py-2 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-400 text-black font-semibold transition-colors flex items-center gap-1.5"
            >
              <BookOpen class="w-3.5 h-3.5" />
              {simulatedProgress === 100 ? 'Review Notes' : 'Resume Module'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
