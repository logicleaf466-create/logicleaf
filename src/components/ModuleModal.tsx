import React, { useState, useRef, useEffect } from 'react';
import { LearningModule, CourseUnit, ExtractedMediaItem } from '../types';
import { EXTRACTED_COURSES_DATA } from '../data/courseData';
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
} from 'lucide-react';

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

  const [activeTab, setActiveTab] = useState<'player' | 'curriculum' | 'overview' | 'statutory' | 'extracted'>(
    extractedVideos.length > 0 ? 'player' : 'curriculum'
  );

  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const activeVideo: ExtractedMediaItem | undefined =
    extractedVideos[selectedVideoIndex] || extractedVideos[0];

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Curriculum state
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number>(0);
  const [simulatedProgress, setSimulatedProgress] = useState<number>(module.progressPercent);
  const [completedUnits, setCompletedUnits] = useState<Record<number, boolean>>({
    0: module.progressPercent >= 20,
    1: module.progressPercent >= 40,
    2: module.progressPercent >= 60,
    3: module.progressPercent >= 80,
    4: module.progressPercent >= 100,
  });

  // Quiz state for the selected unit
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

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

  const handleMarkUnitComplete = (idx: number) => {
    const nextCompleted = { ...completedUnits, [idx]: true };
    setCompletedUnits(nextCompleted);
    const totalDone = Object.values(nextCompleted).filter(Boolean).length;
    const newPercent = Math.min(100, Math.round((totalDone / Math.max(1, curriculum.length)) * 100));
    setSimulatedProgress(newPercent);
    onUpdateProgress(module.id, newPercent);
  };

  const handleSimulateStudy = () => {
    const nextVal = Math.min(100, simulatedProgress + 20);
    setSimulatedProgress(nextVal);
    onUpdateProgress(module.id, nextVal);
  };

  return (
    <div
      id="module-modal-overlay"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="module-modal-content"
        class="bg-white border border-[#E5E7EB] w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] text-[#1B2133]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header: iGOT Royal Navy (#1B4CA1) */}
        <div class="p-4 sm:p-5 bg-[#1B4CA1] text-white flex items-start justify-between border-b border-[#002B6C] relative">
          <div class="pr-6">
            <div class="flex items-center gap-2 flex-wrap mb-1.5">
              <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#EF951E] text-white shadow-2xs">
                {module.competencyCode}
              </span>
              <span class="text-xs text-blue-100 font-semibold flex items-center gap-1">
                <ShieldCheck class="w-3.5 h-3.5 text-amber-300" />
                {module.provider}
              </span>
              <span class="text-xs text-blue-300">•</span>
              <span class="text-xs text-blue-200">{module.level}</span>
              <span class="text-xs text-blue-300">•</span>
              <span class="text-xs text-amber-200 font-semibold">
                {module.durationDisplay || `${module.durationMinutes}m`}
              </span>
              <span class="text-xs text-blue-300">•</span>
              <span class="text-[10px] font-mono bg-white/10 text-blue-200 px-2 py-0.5 rounded border border-white/15">
                ID: {module.id}
              </span>
            </div>
            <h2 class="text-lg sm:text-xl font-black tracking-tight text-white">
              {module.title}
            </h2>
            {extracted?.hindiTitle && (
              <p class="text-xs text-blue-100 font-medium mt-0.5 opacity-90">
                {extracted.hindiTitle}
              </p>
            )}
          </div>
          <button
            id="btn-close-modal"
            onClick={onClose}
            class="p-2 text-blue-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div class="flex border-b border-[#E5E7EB] bg-[#EDF1F7] px-4 sm:px-6 overflow-x-auto no-scrollbar gap-1">
          <button
            id="tab-player"
            onClick={() => setActiveTab('player')}
            class={`py-3 px-3.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'player'
                ? 'border-[#EF951E] text-[#1B4CA1]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ListVideo class="w-3.5 h-3.5 text-[#EF951E]" />
            <span>Video Lectures ({extractedVideos.length})</span>
          </button>

          <button
            id="tab-curriculum"
            onClick={() => setActiveTab('curriculum')}
            class={`py-3 px-3.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'curriculum'
                ? 'border-[#EF951E] text-[#1B4CA1]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen class="w-3.5 h-3.5 text-[#1B4CA1]" />
            <span>Interactive Curriculum ({curriculum.length} Units)</span>
          </button>

          <button
            id="tab-extracted"
            onClick={() => setActiveTab('extracted')}
            class={`py-3 px-3.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'extracted'
                ? 'border-[#EF951E] text-[#1B4CA1]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database class="w-3.5 h-3.5 text-purple-600" />
            <span>Extracted iGOT Raw Data & Hierarchy</span>
          </button>

          <button
            id="tab-overview"
            onClick={() => setActiveTab('overview')}
            class={`py-3 px-3.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#EF951E] text-[#1B4CA1]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText class="w-3.5 h-3.5 text-[#1B4CA1]" />
            <span>Course Overview & Mandate</span>
          </button>

          <button
            id="tab-statutory"
            onClick={() => setActiveTab('statutory')}
            class={`py-3 px-3.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'statutory'
                ? 'border-[#EF951E] text-[#1B4CA1]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
            <span>Statutory Acts & FAQs</span>
          </button>
        </div>

        {/* Modal Body */}
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
          {/* TAB 1: REAL MP4 VIDEO LECTURE PLAYER WITH PLAYLIST */}
          {activeTab === 'player' && (
            <div class="space-y-6">
              {extractedVideos.length > 0 ? (
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Video Stage Column */}
                  <div class="lg:col-span-8 space-y-3">
                    <div class="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 aspect-video flex items-center justify-center">
                      {activeVideo?.artifactUrl ? (
                        <video
                          ref={videoRef}
                          key={activeVideo.artifactUrl}
                          src={activeVideo.artifactUrl}
                          controls
                          playsInline
                          preload="metadata"
                          class="w-full h-full object-contain"
                          onEnded={() => {
                            if (selectedVideoIndex < extractedVideos.length - 1) {
                              setSelectedVideoIndex(selectedVideoIndex + 1);
                            }
                          }}
                        >
                          Your browser does not support HTML5 video playback.
                        </video>
                      ) : (
                        <div class="p-8 text-center text-white space-y-2">
                          <Video class="w-12 h-12 text-[#EF951E] mx-auto opacity-70" />
                          <p class="text-sm font-bold">Interactive Module Preview</p>
                          <p class="text-xs text-slate-400">
                            This module is structured as an interactive HTML/SCORM package.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Active Video Title & Actions */}
                    <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div class="flex items-center gap-2 mb-1">
                          <span class="text-[10px] font-bold bg-[#EF951E] text-white px-2 py-0.5 rounded uppercase tracking-wider">
                            Video {selectedVideoIndex + 1} of {extractedVideos.length}
                          </span>
                          <span class="text-xs font-mono text-slate-500">
                            ID: {activeVideo?.id}
                          </span>
                        </div>
                        <h3 class="text-sm sm:text-base font-extrabold text-[#1B2133]">
                          {activeVideo?.name || 'Course Lecture Video'}
                        </h3>
                      </div>

                      {/* Speed selector & Download actions */}
                      <div class="flex items-center gap-2">
                        <div class="flex items-center bg-white border border-slate-300 rounded-lg p-0.5 text-xs">
                          {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                            <button
                              key={spd}
                              onClick={() => setPlaybackSpeed(spd)}
                              class={`px-2 py-1 rounded font-bold cursor-pointer transition-colors ${
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
                            class="px-3 py-1.5 bg-[#EDF1F7] hover:bg-[#1B4CA1] hover:text-white text-[#1B4CA1] border border-[#C7D9FB] rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Download class="w-3.5 h-3.5" />
                            <span>Download MP4</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Source Verification Badge */}
                    <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between gap-3">
                      <div class="flex items-center gap-2">
                        <CheckCircle class="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          <strong>Verified Public Source:</strong> Streamed directly from official DoPT iGOT Karmayogi content store.
                        </span>
                      </div>
                      {activeVideo?.artifactUrl && (
                        <button
                          onClick={() => handleCopy(activeVideo.artifactUrl!)}
                          class="text-[11px] font-mono text-emerald-700 hover:text-emerald-900 flex items-center gap-1 underline cursor-pointer shrink-0"
                        >
                          <Copy class="w-3 h-3" />
                          <span>{copiedUrl === activeVideo.artifactUrl ? 'Copied!' : 'Copy Direct URL'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Playlist Column */}
                  <div class="lg:col-span-4 space-y-2.5">
                    <div class="flex items-center justify-between pb-1.5 border-b border-slate-200">
                      <h4 class="text-xs font-extrabold text-[#1B4CA1] uppercase tracking-wider flex items-center gap-1.5">
                        <ListVideo class="w-4 h-4 text-[#EF951E]" />
                        <span>Video Lecture Playlist</span>
                      </h4>
                      <span class="text-[11px] font-bold text-slate-500">
                        {extractedVideos.length} lectures
                      </span>
                    </div>

                    <div class="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                      {extractedVideos.map((vid, idx) => {
                        const isSelected = idx === selectedVideoIndex;
                        const durationSec = typeof vid.duration === 'string' ? parseInt(vid.duration, 10) : vid.duration;
                        const durationFormatted = durationSec
                          ? `${Math.floor(durationSec / 60)}m ${durationSec % 60}s`
                          : 'Lecture Video';

                        return (
                          <div
                            key={vid.id}
                            onClick={() => setSelectedVideoIndex(idx)}
                            class={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#EDF1F7] border-[#1B4CA1] ring-1 ring-[#1B4CA1]/30 shadow-xs'
                                : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200'
                            }`}
                          >
                            <div class="flex items-center justify-between gap-2 mb-1">
                              <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                                #{idx + 1} • {durationFormatted}
                              </span>
                              {isSelected ? (
                                <span class="text-[10px] font-bold text-[#EF951E] bg-[#FFF4E5] border border-[#FFD2A1] px-1.5 py-0.2 rounded flex items-center gap-1">
                                  <Play class="w-2.5 h-2.5 fill-current" /> Playing
                                </span>
                              ) : (
                                <span class="text-[10px] text-slate-400 font-medium">Click to play</span>
                              )}
                            </div>
                            <h5
                              class={`text-xs font-bold line-clamp-2 ${
                                isSelected ? 'text-[#1B4CA1]' : 'text-slate-800'
                              }`}
                            >
                              {vid.name}
                            </h5>
                          </div>
                        );
                      })}
                    </div>

                    {/* All Extracted Resources Info */}
                    {allSubItems.length > extractedVideos.length && (
                      <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
                        <p class="font-bold text-slate-800">Additional Extracted Sub-Items:</p>
                        <p class="text-[11px]">
                          {allSubItems.length - extractedVideos.length} interactive exercises and assessments are loaded in the{' '}
                          <span
                            onClick={() => setActiveTab('extracted')}
                            class="text-[#1B4CA1] font-bold underline cursor-pointer"
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
                <div class="space-y-4">
                  <div class="p-6 rounded-2xl bg-[#FEFAF4] border border-[#FFD2A1] space-y-3">
                    <div class="flex items-center gap-2 text-sm font-extrabold text-[#C37024]">
                      <Sparkles class="w-5 h-5 text-[#EF951E]" />
                      <span>Interactive e-Learning SCORM Package Extracted</span>
                    </div>
                    <p class="text-xs text-[#1B2133] leading-relaxed">
                      This course is published on iGOT Karmayogi as an interactive HTML / SCORM learning module rather than a standalone MP4 video. The full curriculum, interactive lessons, cleanliness target units (CTUs), Safai Mitra security guidelines, and self-assessment questions are fully integrated below.
                    </p>
                    <div class="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => setActiveTab('curriculum')}
                        class="px-4 py-2 bg-[#1B4CA1] hover:bg-[#002B6C] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <BookOpen class="w-4 h-4" />
                        <span>Launch Interactive Curriculum</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('extracted')}
                        class="px-4 py-2 bg-white hover:bg-slate-50 text-[#1B4CA1] border border-[#C7D9FB] rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Database class="w-4 h-4" />
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
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: List of Units */}
              <div class="lg:col-span-4 space-y-2.5">
                <div class="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span class="text-xs font-extrabold text-[#1B4CA1] uppercase tracking-wider">
                    Syllabus Modules
                  </span>
                  <span class="text-[11px] text-slate-500 font-semibold">
                    {Object.values(completedUnits).filter(Boolean).length} of {curriculum.length} done
                  </span>
                </div>

                <div class="space-y-2">
                  {curriculum.map((unit, idx) => {
                    const isSelected = idx === selectedUnitIndex;
                    const isDone = completedUnits[idx];
                    return (
                      <div
                        key={unit.id}
                        onClick={() => handleSelectUnit(idx)}
                        class={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#EDF1F7] border-[#1B4CA1] ring-1 ring-[#1B4CA1]/30 shadow-xs'
                            : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200'
                        }`}
                      >
                        <div class="flex items-center justify-between gap-2 mb-1">
                          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Unit {unit.unitNumber} • {unit.duration}
                          </span>
                          {isDone ? (
                            <span class="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Check class="w-2.5 h-2.5 stroke-[3]" /> Done
                            </span>
                          ) : (
                            <span class="text-[10px] font-medium text-slate-500">
                              Pending
                            </span>
                          )}
                        </div>
                        <h4
                          class={`text-xs font-bold line-clamp-2 ${
                            isSelected ? 'text-[#1B4CA1]' : 'text-slate-800'
                          }`}
                        >
                          {unit.title}
                        </h4>
                      </div>
                    );
                  })}
                </div>

                <div class="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                  <p class="font-bold flex items-center gap-1 text-[#B45309]">
                    <Award class="w-3.5 h-3.5" /> DoPT Digital Accreditation
                  </p>
                  <p class="text-amber-800/90 text-[10px] leading-relaxed">
                    Completing all units automatically verifies your FRAC competency record for cadre promotion audits.
                  </p>
                </div>
              </div>

              {/* Right Column: Detailed Unit Content Reader */}
              <div class="lg:col-span-8 space-y-5">
                {selectedUnit ? (
                  <div class="space-y-5">
                    {/* Unit Header Card */}
                    <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div class="flex items-center justify-between mb-1.5">
                        <span class="text-[10px] font-mono font-bold text-[#1B4CA1] bg-[#EDF1F7] px-2 py-0.5 rounded border border-[#C7D9FB]">
                          Unit {selectedUnit.unitNumber} of {curriculum.length}
                        </span>
                        <span class="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <Clock class="w-3.5 h-3.5 text-[#EF951E]" />
                          {selectedUnit.duration}
                        </span>
                      </div>
                      <h3 class="text-base font-extrabold text-[#1B2133]">
                        {selectedUnit.title}
                      </h3>
                      <p class="text-xs text-slate-600 mt-2 leading-relaxed">
                        {selectedUnit.summary}
                      </p>
                    </div>

                    {/* Key Core Topics Pill Row */}
                    <div class="space-y-1.5">
                      <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Core Administrative Topics
                      </span>
                      <div class="flex flex-wrap gap-1.5">
                        {selectedUnit.topics.map((topic, idx) => (
                          <span
                            key={idx}
                            class="text-xs bg-[#EDF1F7] text-[#1B4CA1] font-semibold px-2.5 py-1 rounded-md border border-[#C7D9FB]"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* In-depth Statutory Reading Notes */}
                    <div class="space-y-2">
                      <span class="text-[11px] font-bold text-[#1B4CA1] uppercase tracking-wider block">
                        Statutory Directive & Reading Notes
                      </span>
                      <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                        <p class="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-serif">
                          {selectedUnit.readingNotes}
                        </p>
                      </div>
                    </div>

                    {/* Practical Executive Checklist */}
                    {selectedUnit.practicalChecklist && selectedUnit.practicalChecklist.length > 0 && (
                      <div class="space-y-2">
                        <span class="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                          Executive Action Checklist for Officers
                        </span>
                        <div class="space-y-1.5">
                          {selectedUnit.practicalChecklist.map((item, idx) => (
                            <div
                              key={idx}
                              class="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2"
                            >
                              <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span class="leading-relaxed font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Real-World Case Study with Tribunal Ruling */}
                    {selectedUnit.caseStudy && (
                      <div class="p-4 rounded-xl bg-[#FEFAF4] border border-[#FFD2A1] space-y-2.5">
                        <div class="flex items-center gap-1.5 text-xs font-bold text-[#C37024] uppercase tracking-wider">
                          <ShieldCheck class="w-4 h-4 text-[#EF951E]" />
                          <span>Administrative Case Study & Landmark Ruling</span>
                        </div>
                        <h4 class="text-xs font-extrabold text-[#1B2133]">
                          {selectedUnit.caseStudy.title}
                        </h4>
                        <div class="text-xs text-slate-700 bg-white p-3 rounded-lg border border-[#FFD2A1]/60 leading-relaxed">
                          <strong>Scenario:</strong> {selectedUnit.caseStudy.scenario}
                        </div>
                        <div class="text-xs text-emerald-900 bg-emerald-50 p-3 rounded-lg border border-emerald-200 leading-relaxed font-medium">
                          <strong>Authoritative Ruling:</strong> {selectedUnit.caseStudy.ruling}
                        </div>
                      </div>
                    )}

                    {/* Unit Knowledge Assessment */}
                    {selectedUnit.assessment && (
                      <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                        <div class="flex items-center justify-between">
                          <span class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <HelpCircle class="w-4 h-4 text-[#EF951E]" />
                            <span>Unit Knowledge Verification</span>
                          </span>
                          {quizSubmitted && (
                            <span
                              class={`text-[11px] font-bold px-2 py-0.5 rounded ${
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
                        <p class="text-xs font-semibold text-slate-900 leading-relaxed">
                          {selectedUnit.assessment.question}
                        </p>
                        <div class="space-y-1.5">
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
                                class={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${btnStyle}`}
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
                            class="px-4 py-2 bg-[#1B4CA1] hover:bg-[#002B6C] disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Submit Answer
                          </button>
                        ) : (
                          <div class="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1">
                            <span class="font-bold">Official Statutory Explanation:</span>
                            <p class="leading-relaxed">{selectedUnit.assessment.explanation}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Unit Mark Complete Button */}
                    <div class="pt-2 flex items-center justify-between border-t border-slate-100">
                      <button
                        onClick={() => handleMarkUnitComplete(selectedUnitIndex)}
                        class={`px-4 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                          completedUnits[selectedUnitIndex]
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-[#EF951E] hover:bg-[#F08811] text-white shadow-xs'
                        }`}
                      >
                        <CheckCircle2 class="w-4 h-4" />
                        <span>
                          {completedUnits[selectedUnitIndex]
                            ? 'Unit Completed ✓'
                            : 'Mark Unit as Studied'}
                        </span>
                      </button>

                      {selectedUnitIndex < curriculum.length - 1 && (
                        <button
                          onClick={() => handleSelectUnit(selectedUnitIndex + 1)}
                          class="text-xs font-bold text-[#1B4CA1] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Next: Unit {selectedUnitIndex + 2}</span>
                          <ChevronRight class="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <p class="text-xs text-slate-500">Select a unit from the left syllabus menu.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: EXTRACTED iGOT RAW DATA & HIERARCHY */}
          {activeTab === 'extracted' && (
            <div class="space-y-6">
              {/* Extraction Header Card */}
              <div class="p-4 rounded-xl bg-purple-50 border border-purple-200 flex flex-wrap items-center justify-between gap-3">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <Database class="w-4 h-4 text-purple-700" />
                    <h4 class="text-xs font-black uppercase tracking-wider text-purple-900">
                      Extracted iGOT Portal API Metadata
                    </h4>
                    <span class="text-[10px] font-bold bg-purple-200 text-purple-800 px-2 py-0.5 rounded">
                      Live Backend Synced
                    </span>
                  </div>
                  <p class="text-xs text-purple-950">
                    Direct data payload extracted from <code>portal.igotkarmayogi.gov.in/api/content/v1/read/{module.id}</code> and persisted in backend database.
                  </p>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    onClick={() => handleFetchBackendApi(`/api/courses/${module.id}`)}
                    disabled={backendLoading}
                    class="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Server class="w-3.5 h-3.5" />
                    <span>{backendLoading ? 'Querying...' : 'Query /api/courses/' + module.id}</span>
                  </button>
                </div>
              </div>

              {/* Raw Properties Key-Value Grid */}
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span class="text-[10px] uppercase font-bold text-slate-500 block">Identifier (ID)</span>
                  <span class="text-xs font-mono font-bold text-[#1B4CA1] break-all">{rawData?.id || module.id}</span>
                </div>

                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span class="text-[10px] uppercase font-bold text-slate-500 block">Creator / Source</span>
                  <span class="text-xs font-bold text-slate-800">{rawData?.creator || module.provider}</span>
                </div>

                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span class="text-[10px] uppercase font-bold text-slate-500 block">Exact Total Duration</span>
                  <span class="text-xs font-mono font-bold text-amber-700">
                    {rawData?.duration ? `${rawData.duration} seconds (${Math.round(rawData.duration / 60)} mins)` : module.durationDisplay}
                  </span>
                </div>

                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span class="text-[10px] uppercase font-bold text-slate-500 block">Content Type / MimeType</span>
                  <span class="text-xs font-mono text-slate-700">
                    {rawData?.contentType || 'Course'} / {rawData?.mimeType || 'application/vnd.ekstep.content-collection'}
                  </span>
                </div>

                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span class="text-[10px] uppercase font-bold text-slate-500 block">Created / Last Updated</span>
                  <span class="text-xs text-slate-700">
                    {rawData?.createdOn ? new Date(rawData.createdOn).toLocaleDateString() : 'N/A'} • {rawData?.lastUpdatedOn ? new Date(rawData.lastUpdatedOn).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span class="text-[10px] uppercase font-bold text-slate-500 block">Total Sub-Nodes Extracted</span>
                  <span class="text-xs font-bold text-emerald-700">
                    {allSubItems.length} leaf & child nodes ({extractedVideos.length} MP4 videos)
                  </span>
                </div>
              </div>

              {/* Official Keywords Chips */}
              {rawData?.keywords && rawData.keywords.length > 0 && (
                <div class="space-y-2">
                  <span class="text-xs font-bold text-[#1B4CA1] uppercase tracking-wider flex items-center gap-1.5">
                    <Tag class="w-3.5 h-3.5 text-[#EF951E]" />
                    <span>Official Keywords ({rawData.keywords.length})</span>
                  </span>
                  <div class="flex flex-wrap gap-1.5">
                    {rawData.keywords.map((kw: string, idx: number) => (
                      <span
                        key={idx}
                        class="text-xs bg-slate-100 text-slate-800 font-medium px-2.5 py-1 rounded-md border border-slate-200"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Official FRAC Competencies Taxonomy */}
              {rawData?.competencies_v5 && rawData.competencies_v5.length > 0 && (
                <div class="space-y-2">
                  <span class="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Award class="w-3.5 h-3.5 text-emerald-600" />
                    <span>Official FRAC Competency Mappings ({rawData.competencies_v5.length})</span>
                  </span>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {rawData.competencies_v5.map((c: any, idx: number) => (
                      <div
                        key={idx}
                        class="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1 text-xs"
                      >
                        <div class="flex items-center justify-between">
                          <span class="font-bold text-emerald-900">{c.competencyTheme}</span>
                          <span class="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">
                            {c.competencyThemeType || 'Core'}
                          </span>
                        </div>
                        <p class="text-emerald-800 text-[11px]">
                          <strong>Sub-Theme:</strong> {c.competencySubTheme}
                        </p>
                        <p class="text-slate-500 text-[10px]">
                          Area: {c.competencyArea} (ID: {c.competencyAreaId})
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Leaf Nodes / Sub-Items Table */}
              <div class="space-y-2">
                <span class="text-xs font-bold text-[#1B4CA1] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers class="w-3.5 h-3.5 text-[#1B4CA1]" />
                  <span>All Extracted Hierarchy Sub-Items & Artifacts ({allSubItems.length})</span>
                </span>
                <div class="overflow-x-auto border border-slate-200 rounded-xl">
                  <table class="w-full text-left text-xs">
                    <thead class="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th class="p-3 font-bold">#</th>
                        <th class="p-3 font-bold">Node Name</th>
                        <th class="p-3 font-bold">Media Type</th>
                        <th class="p-3 font-bold">Duration</th>
                        <th class="p-3 font-bold">Artifact URL</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      {allSubItems.map((item, idx) => (
                        <tr key={item.id} class="hover:bg-slate-50/50">
                          <td class="p-3 font-mono text-slate-400">{idx + 1}</td>
                          <td class="p-3 font-bold text-slate-900">
                            <div>{item.name}</div>
                            <span class="text-[10px] font-mono text-slate-400">{item.id}</span>
                          </td>
                          <td class="p-3">
                            <span
                              class={`text-[10px] font-bold px-2 py-0.5 rounded ${
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
                          <td class="p-3 font-mono text-slate-600">
                            {item.duration ? `${item.duration}s` : '—'}
                          </td>
                          <td class="p-3">
                            {item.artifactUrl ? (
                              <a
                                href={item.artifactUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="text-[#1B4CA1] hover:underline font-mono text-[11px] flex items-center gap-1"
                              >
                                <span>Direct Artifact</span>
                                <ExternalLink class="w-3 h-3" />
                              </a>
                            ) : (
                              <span class="text-slate-400 text-[11px]">Integrated package</span>
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
                <div class="space-y-2 p-4 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 font-mono text-xs">
                  <div class="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span class="text-emerald-400 font-bold flex items-center gap-1.5">
                      <Server class="w-4 h-4" /> Live Backend Response:
                    </span>
                    <button
                      onClick={() => setBackendApiData(null)}
                      class="text-slate-400 hover:text-white text-xs cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <pre class="max-h-60 overflow-y-auto text-[11px] text-slate-300">
                    {JSON.stringify(backendApiData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COURSE OVERVIEW & MANDATE */}
          {activeTab === 'overview' && (
            <div class="space-y-6">
              {/* Executive Summary */}
              <div class="space-y-2">
                <h4 class="text-xs font-bold text-[#1B4CA1] uppercase tracking-wider">
                  Accreditation Executive Summary
                </h4>
                <p class="text-xs text-[#374151] leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {extracted?.summary || module.description}
                </p>
              </div>

              {/* Administrative Reference Badges */}
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Official Statutory Circular
                  </span>
                  <p class="text-xs font-bold text-[#1B4CA1] mt-1 line-clamp-2">
                    {circularRef}
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    National Officer Enrollment
                  </span>
                  <p class="text-xs font-bold text-[#EF951E] mt-1 flex items-center gap-1.5">
                    <Users class="w-3.5 h-3.5" />
                    {enrolledCount}
                  </p>
                </div>

                <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Eligible Target Audience
                  </span>
                  <p class="text-xs font-bold text-slate-800 mt-1">
                    {targetAudience}
                  </p>
                </div>
              </div>

              {/* Statutory Directives */}
              {extracted?.statutoryDirectives && (
                <div class="space-y-2 pt-1">
                  <h4 class="text-xs font-bold text-[#1B4CA1] uppercase tracking-wider">
                    Binding Government Directives
                  </h4>
                  <ul class="space-y-2">
                    {extracted.statutoryDirectives.map((dir, idx) => (
                      <li
                        key={idx}
                        class="p-2.5 rounded-lg bg-[#EDF1F7]/70 border border-[#C7D9FB] text-xs text-[#1B2133] flex items-start gap-2"
                      >
                        <ShieldCheck class="w-4 h-4 text-[#1B4CA1] shrink-0 mt-0.5" />
                        <span class="leading-relaxed">{dir}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Takeaways */}
              <div class="space-y-2 pt-1">
                <h4 class="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Official Competency Learning Outcomes
                </h4>
                <ul class="space-y-2">
                  {(extracted?.learningObjectives || module.keyTakeaways).map((out, idx) => (
                    <li key={idx} class="flex items-start gap-2 text-xs text-[#374151]">
                      <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: STATUTORY ACTS & FAQS */}
          {activeTab === 'statutory' && (
            <div class="space-y-6">
              {/* Statutory Acts Table */}
              <div class="space-y-2">
                <h4 class="text-xs font-bold text-[#1B4CA1] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck class="w-4 h-4 text-[#1B4CA1]" />
                  <span>Statutory Acts, Codes & Legal Authorities</span>
                </h4>
                <div class="overflow-x-auto border border-slate-200 rounded-xl">
                  <table class="w-full text-left text-xs">
                    <thead class="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th class="p-3 font-bold">Act / Manual</th>
                        <th class="p-3 font-bold">Section / Rule</th>
                        <th class="p-3 font-bold">Administrative Mandate</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      {statutoryRefs.map((ref, idx) => (
                        <tr key={idx} class="hover:bg-slate-50/50">
                          <td class="p-3 font-bold text-[#1B4CA1] whitespace-nowrap">
                            {ref.actName}
                          </td>
                          <td class="p-3 font-mono text-slate-600 whitespace-nowrap">
                            {ref.sectionOrRule}
                          </td>
                          <td class="p-3 text-slate-700">{ref.relevance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FAQs Section */}
              <div class="space-y-3">
                <h4 class="text-xs font-bold text-[#4B5563] uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle class="w-4 h-4 text-[#EF951E]" />
                  <span>Frequently Asked Administrative Questions</span>
                </h4>
                <div class="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                    >
                      <h5 class="text-xs font-extrabold text-slate-900 flex items-start gap-2">
                        <span class="text-[#EF951E] font-bold">Q{idx + 1}:</span>
                        <span>{faq.question}</span>
                      </h5>
                      <p class="text-xs text-slate-700 pl-6 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Progress Bar */}
        <div class="p-4 bg-[#EDF1F7] border-t border-[#C7D9FB] flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-[#1B4CA1]">Overall Progress:</span>
            <div class="w-36 bg-white h-2.5 rounded-full overflow-hidden border border-[#C7D9FB]">
              <div
                class="bg-[#EF951E] h-full rounded-full transition-all duration-500"
                style={{ width: `${simulatedProgress}%` }}
              ></div>
            </div>
            <span class="text-xs font-mono font-bold text-[#1B4CA1]">{simulatedProgress}%</span>
            {simulatedProgress === 100 && (
              <span class="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                ✓ Completed
              </span>
            )}
          </div>

          <div class="flex items-center gap-2">
            <button
              onClick={handleSimulateStudy}
              disabled={simulatedProgress >= 100}
              class="px-4 py-2 bg-[#EF951E] hover:bg-[#F08811] disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles class="w-3.5 h-3.5" />
              <span>{simulatedProgress >= 100 ? 'Course Complete' : 'Study (+20%)'}</span>
            </button>

            <button
              onClick={onClose}
              class="px-5 py-2 bg-[#1B4CA1] hover:bg-[#002B6C] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              Close Course View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
