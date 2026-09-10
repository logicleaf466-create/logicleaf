import React, { useState } from 'react';
import { QuizQuestion, ScreenId } from '../../types';
import {
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';

interface QuizStudioScreenProps {
  questions: QuizQuestion[];
  onNavigate: (screen: ScreenId) => void;
  onOpenCopilot?: () => void;
}

export const QuizStudioScreen: React.FC<QuizStudioScreenProps> = ({
  questions,
  onNavigate,
  onOpenCopilot,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'assessment' | 'generator'>('assessment');

  // Generator states
  const [generatorTopic, setGeneratorTopic] = useState<string>('Public Procurement & GFR 2024');
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerSubmitted(true);
    if (selectedAnswer === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizCompleted(false);
  };

  const handleGenerateScenario = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedPrompt(
        `[Generated Cadre Level 14 Scenario]\nTopic: ${generatorTopic}\n\nSituation: An emergency cybersecurity notification from CERT-In requires immediate cloud infrastructure hardening across all zonal subordinate offices within 72 hours. The estimated aggregate cost is ₹24.5 Lakhs, exceeding the standard departmental delegated financial threshold.\n\nKey Dilemma: Can the Joint Secretary invoke Emergency Direct Contracting under GFR 2024 Rule 149(v) and Rule 194, or is an ex-post facto Financial Adviser concurrence mandatory prior to release of purchase order?`
      );
    }, 800);
  };

  return (
    <section id="quiz-studio-screen" class="space-y-6 animate-in fade-in duration-200 pb-12">
      {/* Header Banner: Light Blue Box (#EDF1F7) */}
      <div class="bg-[#EDF1F7] p-6 rounded-2xl border border-[#C7D9FB] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[10px] font-bold tracking-wider uppercase bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] px-2 py-0.5 rounded">
              Scenario Simulator
            </span>
            <span class="text-xs text-[#1B4CA1] font-bold">DoPT Evaluated Governance Exercises</span>
          </div>
          <h2 class="text-2xl font-extrabold text-[#1B4CA1] tracking-tight">
            Ira AI Quiz Studio
          </h2>
          <p class="text-xs text-[#374151] mt-1 max-w-2xl leading-relaxed">
            High-fidelity administrative scenarios simulating real-world governance dilemmas under the statutory purview of GFR 2024, CSMOP, and CPGRAMS.
          </p>
        </div>

        {/* Tab switchers */}
        <div class="flex items-center bg-white p-1 rounded-xl border border-[#C7D9FB] text-xs shrink-0">
          <button
            onClick={() => setActiveTab('assessment')}
            class={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'assessment'
                ? 'bg-[#1B4CA1] text-white shadow-xs font-bold'
                : 'text-[#374151] hover:text-[#1B4CA1]'
            }`}
          >
            Weekly Challenge
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            class={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'generator'
                ? 'bg-[#1B4CA1] text-white shadow-xs font-bold'
                : 'text-[#374151] hover:text-[#1B4CA1]'
            }`}
          >
            <Sparkles class="w-3.5 h-3.5 text-[#EF951E]" />
            <span>AI Scenario Lab</span>
          </button>
        </div>
      </div>

      {activeTab === 'assessment' ? (
        !isQuizCompleted ? (
          <div class="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-2xs space-y-6">
            {/* Progress & Meta */}
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-bold text-white bg-[#1B4CA1] px-2 py-0.5 rounded">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span class="text-xs font-bold text-[#1B4CA1]">{currentQ.topic}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-[#92400E] bg-[#FEF3C7] border border-[#FDE68A] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <ShieldCheck class="w-3 h-3 text-[#DBA501]" /> DoPT Assessment
                </span>
              </div>
            </div>

            {/* Scenario Box: Skin Box (#FFE9CD) */}
            <div class="p-5 rounded-xl bg-[#FFE9CD] border border-[#FFD2A1]">
              <span class="text-[10px] font-bold text-[#C37024] uppercase tracking-wider block mb-1">
                Administrative Scenario
              </span>
              <p class="text-xs sm:text-sm text-[#1B2133] leading-relaxed font-medium">
                {currentQ.scenario}
              </p>
            </div>

            {/* Specific Question */}
            <div>
              <h3 class="text-sm sm:text-base font-bold text-[#1B4CA1] mb-4">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div class="space-y-3">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = isAnswerSubmitted && idx === currentQ.correctIndex;
                  const isWrong = isAnswerSubmitted && isSelected && idx !== currentQ.correctIndex;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      class={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start justify-between gap-3 ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold'
                          : isWrong
                          ? 'bg-red-50 border-red-500 text-red-950 font-semibold'
                          : isSelected
                          ? 'bg-[#EDF1F7] border-[#1B4CA1] ring-2 ring-[#1B4CA1]/30 text-[#1B4CA1] font-bold'
                          : 'bg-white border-[#E5E7EB] hover:bg-[#FEFAF4] hover:border-[#FFD2A1] text-[#374151]'
                      }`}
                    >
                      <div class="flex items-start gap-3">
                        <span
                          class={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
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
                        <span class="leading-relaxed">{option}</span>
                      </div>

                      {isCorrect && <CheckCircle2 class="w-5 h-5 text-emerald-600 shrink-0" />}
                      {isWrong && <XCircle class="w-5 h-5 text-red-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Answer Feedback & Rationale: Light Blue Box (#EDF1F7) */}
            {isAnswerSubmitted && (
              <div class="p-4 rounded-xl bg-[#EDF1F7] border border-[#C7D9FB] space-y-2 animate-in fade-in">
                <div class="flex items-center gap-2 text-xs font-bold text-[#1B4CA1]">
                  <FileCheck class="w-4 h-4 text-[#1B4CA1]" />
                  <span>Official Civil Service Rationale & Statute</span>
                </div>
                <p class="text-xs text-[#1B2133] leading-relaxed">
                  {currentQ.officialRationale}
                </p>
                <p class="text-[11px] text-[#1B4CA1] font-mono font-bold pt-1">
                  Citation: {currentQ.regulationCitation}
                </p>
              </div>
            )}

            {/* Bottom Actions */}
            <div class="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
              <span class="text-xs text-[#4B5563]">
                Score: <strong class="text-[#1B4CA1] font-extrabold">{score}</strong> / {questions.length}
              </span>

              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  class="px-5 py-2.5 bg-[#EF951E] hover:bg-[#F08811] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Submit Decision
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  class="px-5 py-2.5 bg-[#1B4CA1] hover:bg-[#002B6C] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <span>{currentIdx + 1 === questions.length ? 'View Final Results' : 'Next Scenario'}</span>
                  <ArrowRight class="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Quiz Completed Screen */
          <div class="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-2xs text-center max-w-xl mx-auto space-y-6">
            <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <Award class="w-8 h-8" />
            </div>

            <div>
              <span class="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                Assessment Complete
              </span>
              <h3 class="text-2xl font-extrabold text-[#1B4CA1] mt-3">
                Strategic Assessment Results
              </h3>
              <p class="text-xs text-[#4B5563] mt-1">
                Your decision performance has been integrated into your official FRAC record.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-[#FEFAF4] border border-[#FFD2A1] flex items-center justify-around">
              <div>
                <p class="text-xs text-[#4B5563]">Total Score</p>
                <p class="text-2xl font-extrabold text-[#1B4CA1] mt-0.5">{score} / {questions.length}</p>
              </div>
              <div class="h-8 w-px bg-[#FFD2A1]"></div>
              <div>
                <p class="text-xs text-[#4B5563]">Proficiency</p>
                <p class="text-2xl font-extrabold text-[#B45309] mt-0.5">
                  {score >= 3 ? 'Exemplary' : 'Proficient'}
                </p>
              </div>
              <div class="h-8 w-px bg-[#FFD2A1]"></div>
              <div>
                <p class="text-xs text-[#4B5563]">Accuracy</p>
                <p class="text-2xl font-extrabold text-emerald-700 mt-0.5">
                  {Math.round((score / questions.length) * 100)}%
                </p>
              </div>
            </div>

            <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                class="px-4 py-2 bg-[#EDF1F7] hover:bg-[#C7D9FB] text-[#1B4CA1] font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw class="w-3.5 h-3.5" />
                <span>Retake Assessment</span>
              </button>
              <button
                onClick={() => onNavigate('gap-analysis')}
                class="px-4 py-2 bg-[#1B4CA1] hover:bg-[#002B6C] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Inspect Competency Impact
              </button>
            </div>
          </div>
        )
      ) : (
        /* AI Scenario Lab Generator */
        <div class="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-2xs space-y-6">
          <div class="pb-4 border-b border-[#E5E7EB]">
            <h3 class="text-lg font-bold text-[#1B4CA1]">
              On-Demand Regulatory Scenario Synthesizer
            </h3>
            <p class="text-xs text-[#4B5563] mt-0.5">
              Generate dynamic, unscripted civil service scenarios tailored to your department and ministry domain.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#1B2133] mb-1.5">Focus Regulatory Domain</label>
              <select
                value={generatorTopic}
                onChange={(e) => setGeneratorTopic(e.target.value)}
                class="w-full text-xs p-2.5 rounded-lg border border-[#C7D9FB] bg-[#EDF1F7] text-[#1B2133] focus:outline-none focus:ring-2 focus:ring-[#1B4CA1]"
              >
                <option value="Public Procurement & GFR 2024">Public Procurement & GFR 2024</option>
                <option value="Digital Governance & DPDP Act 2023">Digital Governance & DPDP Act 2023</option>
                <option value="CPGRAMS Sevottam Citizen Redressal">CPGRAMS Sevottam Citizen Redressal</option>
                <option value="CCS Conduct Rules 1964 & Vigilance">CCS Conduct Rules 1964 & Vigilance</option>
                <option value="Cabinet Note Preparation & CSMOP">Cabinet Note Preparation & CSMOP</option>
              </select>
            </div>

            <div class="flex items-end">
              <button
                onClick={handleGenerateScenario}
                disabled={isGenerating}
                class="w-full py-2.5 bg-[#EF951E] hover:bg-[#F08811] disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <Sparkles class="w-4 h-4 text-[#FEF3C7]" />
                <span>{isGenerating ? 'Synthesizing with Ira AI...' : 'Generate Custom Scenario'}</span>
              </button>
            </div>
          </div>

          {generatedPrompt && (
            <div class="p-5 rounded-xl bg-[#FEFAF4] border border-[#FFD2A1] space-y-3 animate-in fade-in">
              <div class="flex items-center justify-between text-xs font-bold text-[#1B4CA1]">
                <span>Ira AI Scenario Prompt</span>
                <span class="text-[10px] text-[#C37024] bg-[#FFE9CD] border border-[#FFD2A1] px-2 py-0.5 rounded font-mono font-bold">
                  Cadre Level 14 Calibrated
                </span>
              </div>
              <pre class="text-xs text-[#1B2133] whitespace-pre-wrap font-sans leading-relaxed">
                {generatedPrompt}
              </pre>
              <div class="pt-2 flex justify-end">
                <button
                  onClick={onOpenCopilot}
                  class="text-xs font-bold text-[#EF951E] hover:text-[#C37024] flex items-center gap-1 cursor-pointer"
                >
                  <span>Analyze with Ira AI Copilot</span>
                  <ArrowRight class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
