import React, { useState } from 'react';
import { QuizQuestion, ScreenId } from '../../types';
import {
  Award,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  FileCheck,
  ShieldAlert
} from 'lucide-react';

interface QuizStudioScreenProps {
  questions: QuizQuestion[];
  onNavigate: (screen: ScreenId) => void;
}

export const QuizStudioScreen: React.FC<QuizStudioScreenProps> = ({
  questions,
  onNavigate,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'assessment' | 'generator'>('assessment');

  // Generator states
  const [generatorTopic, setGeneratorTopic] = useState<string>('Public Procurement & GFR');
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

  const handleRestartQuiz = () => {
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
      setGeneratedPrompt(`Scenario: A state civil administration receives conflicting directives between Central Environmental Clearance guidelines and local disaster shelter reconstruction requirements under State SDRF funds.

Decision Point: As the supervising Joint Secretary coordinating inter-ministerial relief, determine the protocol for issuing an interim provisional waiver under Section 38 of the Disaster Management Act 2005.

Target Competency: LP-02 (Strategic Negotiation & Crisis Coordination)
Benchmark Standard: National Disaster Management Authority (NDMA) Standard Operating Procedure (2024 Revision).`);
    }, 1200);
  };

  return (
    <section id="quiz-studio-screen" class="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
      {/* Screen Title & Mode Switcher */}
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <Award class="w-5 h-5 text-amber-500" />
            <h2 class="text-2xl font-serif text-white font-semibold tracking-wide">
              AI Quiz Studio
            </h2>
          </div>
          <p class="text-xs text-gray-400">
            Scenario-driven decision simulators calibrated to evaluate administrative prudence, Conduct Rules, and GFR 2024.
          </p>
        </div>

        <div class="flex items-center bg-[#16181D] border border-gray-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setActiveTab('assessment')}
            class={`px-4 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'assessment' ? 'bg-amber-500 text-black font-semibold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Live Scenario Assessment
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            class={`px-4 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'generator' ? 'bg-amber-500 text-black font-semibold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles class="w-3 h-3 text-amber-500" />
            <span>AI Scenario Generator</span>
          </button>
        </div>
      </div>

      {activeTab === 'assessment' && (
        <div class="max-w-4xl mx-auto space-y-6">
          {!isQuizCompleted ? (
            <div class="bg-[#16181D] border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
              {/* Quiz Header Bar */}
              <div class="flex items-center justify-between border-b border-gray-800 pb-4">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    Question {currentIdx + 1} of {questions.length}
                  </span>
                  <span class="text-xs text-gray-400 font-medium">Competency: {currentQ.competencyCode}</span>
                </div>
                <div class="flex items-center gap-4 text-xs">
                  <span class="text-gray-400 font-mono">
                    Score: <strong class="text-amber-400">{score}</strong> / {currentIdx + (isAnswerSubmitted ? 1 : 0)}
                  </span>
                  <span class="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded font-mono">
                    Level 14 Cadre Benchmark
                  </span>
                </div>
              </div>

              {/* Administrative Scenario Container */}
              <div class="p-4 md:p-5 rounded-xl bg-black/40 border border-gray-800/80 space-y-2">
                <div class="flex items-center gap-2">
                  <ShieldAlert class="w-4 h-4 text-amber-500 shrink-0" />
                  <span class="text-[10px] uppercase tracking-wider font-bold text-amber-500">
                    Administrative Scenario Context • {currentQ.topic}
                  </span>
                </div>
                <p class="text-xs md:text-sm text-gray-300 leading-relaxed italic">
                  "{currentQ.scenario}"
                </p>
              </div>

              {/* Question Statement */}
              <div>
                <h3 class="text-sm md:text-base font-serif text-white font-medium leading-normal">
                  {currentQ.question}
                </h3>
              </div>

              {/* Multiple Choice Options */}
              <div class="space-y-3">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = isAnswerSubmitted && idx === currentQ.correctIndex;
                  const isWrong = isAnswerSubmitted && isSelected && idx !== currentQ.correctIndex;

                  return (
                    <button
                      key={idx}
                      id={`quiz-option-${idx}`}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      class={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                        isCorrect
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-100 shadow-md shadow-emerald-500/10'
                          : isWrong
                          ? 'bg-red-500/15 border-red-500 text-red-100'
                          : isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-white'
                          : 'bg-[#0F1115] border-gray-800 hover:border-gray-700 text-gray-300'
                      }`}
                    >
                      <div
                        class={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs shrink-0 font-bold ${
                          isCorrect
                            ? 'bg-emerald-500 text-black'
                            : isWrong
                            ? 'bg-red-500 text-white'
                            : isSelected
                            ? 'bg-amber-500 text-black'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span class="text-xs md:text-sm leading-relaxed">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Official AI Rationale & Citation box after submitting */}
              {isAnswerSubmitted && (
                <div
                  class={`p-5 rounded-xl border space-y-2.5 transition-all ${
                    selectedAnswer === currentQ.correctIndex
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                      : 'bg-red-950/20 border-red-500/30 text-red-200'
                  }`}
                >
                  <div class="flex items-center gap-2">
                    {selectedAnswer === currentQ.correctIndex ? (
                      <CheckCircle2 class="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle class="w-4 h-4 text-red-400" />
                    )}
                    <span class="text-xs font-bold uppercase tracking-wider">
                      {selectedAnswer === currentQ.correctIndex ? 'Correct Administrative Judgment' : 'Regulatory Misalignment'}
                    </span>
                  </div>
                  <p class="text-xs leading-relaxed text-gray-300">
                    {currentQ.officialRationale}
                  </p>
                  <div class="pt-2 border-t border-gray-800/80 text-[10px] text-gray-400 flex items-center gap-2">
                    <FileCheck class="w-3 h-3 text-amber-500" />
                    <span>Statutory Citation: <strong class="text-gray-300">{currentQ.regulationCitation}</strong></span>
                  </div>
                </div>
              )}

              {/* Bottom Buttons */}
              <div class="flex items-center justify-between pt-4 border-t border-gray-800">
                <span class="text-[11px] text-gray-500 italic">
                  Assessment results directly calibrate your Competency Gap Score.
                </span>

                {!isAnswerSubmitted ? (
                  <button
                    id="btn-submit-answer"
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    class="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    Submit Decision
                  </button>
                ) : (
                  <button
                    id="btn-next-question"
                    onClick={handleNextQuestion}
                    class="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>{currentIdx + 1 < questions.length ? 'Next Governance Scenario' : 'View Assessment Report'}</span>
                    <ArrowRight class="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Completion Screen */
            <div class="bg-[#16181D] border border-gray-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
              <div class="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
                <Award class="w-8 h-8" />
              </div>
              <div>
                <h3 class="text-2xl font-serif text-white font-semibold">
                  Strategic Assessment Complete
                </h3>
                <p class="text-xs text-gray-400 mt-1">
                  Your civil services decision profile has been synthesized and recorded.
                </p>
              </div>

              <div class="grid grid-cols-3 gap-4 max-w-lg mx-auto p-4 rounded-xl bg-black/40 border border-gray-800">
                <div>
                  <p class="text-[10px] text-gray-500 uppercase">Score</p>
                  <p class="text-2xl font-serif font-bold text-white mt-1">{score} / {questions.length}</p>
                </div>
                <div>
                  <p class="text-[10px] text-gray-500 uppercase">Accuracy</p>
                  <p class="text-2xl font-serif font-bold text-amber-400 mt-1">
                    {Math.round((score / questions.length) * 100)}%
                  </p>
                </div>
                <div>
                  <p class="text-[10px] text-gray-500 uppercase">Proficiency</p>
                  <p class="text-2xl font-serif font-bold text-emerald-400 mt-1">
                    {score >= 3 ? 'Excellent' : 'Proficient'}
                  </p>
                </div>
              </div>

              <div class="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={handleRestartQuiz}
                  class="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw class="w-3.5 h-3.5" />
                  <span>Retake Assessment</span>
                </button>
                <button
                  onClick={() => onNavigate('gap-analysis')}
                  class="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen class="w-3.5 h-3.5" />
                  <span>Update Gap Analysis</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Generator Mode */}
      {activeTab === 'generator' && (
        <div class="max-w-4xl mx-auto bg-[#16181D] border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
          <div>
            <h3 class="text-lg font-serif text-white font-semibold">
              On-Demand Governance Scenario Generator
            </h3>
            <p class="text-xs text-gray-400 mt-0.5">
              Generate dynamic situational simulations based on specific Ministry challenges and Conduct Rules.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs text-gray-400 block mb-1.5 font-medium">Domain Focus</label>
              <select
                value={generatorTopic}
                onChange={(e) => setGeneratorTopic(e.target.value)}
                class="w-full bg-[#0F1115] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="Public Procurement & GFR">Public Procurement & GFR 2024</option>
                <option value="e-Office Protocols & Cybersecurity">e-Office Protocols & Cybersecurity</option>
                <option value="Disaster Relief Financial Powers">Disaster Relief Financial Powers</option>
                <option value="Civil Services Conduct & Vigilance">Civil Services Conduct & Vigilance Rules</option>
                <option value="Algorithmic Welfare Allocation">Algorithmic Welfare Allocation & Ethics</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-gray-400 block mb-1.5 font-medium">Target Officer Level</label>
              <div class="bg-[#0F1115] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-gray-300">
                Joint Secretary (Level 14) • Apex Leadership
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateScenario}
            disabled={isGenerating}
            class="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles class={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing Governance Scenario...' : 'Synthesize Scenario with AI'}</span>
          </button>

          {generatedPrompt && (
            <div class="p-5 rounded-xl bg-black/40 border border-amber-500/30 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-[10px] uppercase tracking-wider text-amber-400 font-mono font-bold">
                  Synthesized Simulation Docket
                </span>
                <span class="text-[10px] text-gray-400">Generated Just Now</span>
              </div>
              <pre class="text-xs text-gray-200 font-sans whitespace-pre-line leading-relaxed">
                {generatedPrompt}
              </pre>
              <div class="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setActiveTab('assessment');
                  }}
                  class="text-xs text-amber-400 hover:text-amber-300 font-medium underline cursor-pointer"
                >
                  Load into Assessment Queue →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
