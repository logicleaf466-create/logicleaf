import React, { useState, useRef } from 'react';
import { LearningModule, ScreenId } from '../../types';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  Bookmark,
  ShieldCheck,
  Video,
  BookOpen,
  Database,
  Sparkles,
} from 'lucide-react';
import { CourseCardThumbnail } from '../CourseCardThumbnail';
import { MinistryLogo } from '../MinistryLogo';

interface LibraryScreenProps {
  modules: LearningModule[];
  onNavigate: (screen: ScreenId) => void;
  onOpenModule: (module: LearningModule) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  modules,
  onNavigate,
  onOpenModule,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [savedModules, setSavedModules] = useState<{ [id: string]: boolean }>({});
  const carouselRef = useRef<HTMLDivElement>(null);

  const domains = [
    'All',
    'Workplace Ethics & Law',
    'Emergency Preparedness & Health',
    'Disaster Management & National Security',
    'Citizen Centricity & Sanitation',
  ];

  const filteredModules = modules.filter((mod) => {
    const matchesSearch =
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.competencyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === 'All' || mod.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  const getMinistryType = (theme?: string): 'istm' | 'mohfw' | 'ndrf' | 'mohua' | 'default' => {
    if (theme === 'posh') return 'istm';
    if (theme === 'fire-safety') return 'mohfw';
    if (theme === 'ndrf') return 'ndrf';
    if (theme === 'swachhata') return 'mohua';
    return 'default';
  };

  return (
    <section id="library-screen" class="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* 1. Header Banner: Official DoPT Learn Hub Repository */}
      <div class="bg-[#EDF1F7] p-6 rounded-2xl border border-[#C7D9FB] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[10px] font-bold tracking-wider uppercase bg-[#1B4CA1] text-white px-2 py-0.5 rounded">
              Learn Hub
            </span>
            <span class="text-xs text-[#1B4CA1] font-bold flex items-center gap-1">
              <ShieldCheck class="w-3.5 h-3.5 text-[#EF951E]" /> DoPT Accredited National Catalog
            </span>
          </div>
          <h2 class="text-2xl font-extrabold text-[#1B4CA1] tracking-tight">
            iGOT Karmayogi Bharat Learning Catalog
          </h2>
          <p class="text-xs text-[#374151] mt-1 max-w-2xl leading-relaxed">
            Statutory modules provided by ISTM, MoHFW, NDRF, and MoHUA under Mission Karmayogi National Competency Framework.
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('gap-analysis')}
            class="px-4 py-2 bg-[#EF951E] hover:bg-[#F08811] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Bridge Your Gaps First
          </button>
        </div>
      </div>

      {/* 2. Search & Filter Bar (Shifted above Showcased Courses) */}
      <div class="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4">
        <div class="flex flex-col sm:flex-row items-center gap-3">
          <div class="relative flex-1 w-full">
            <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, statutory law, ministry provider (ISTM, NDRF, MoHFW), or code..."
              class="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#C7D9FB] bg-[#FEFAF4] text-[#1B2133] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4CA1]"
            />
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              class="text-xs text-red-600 hover:underline font-bold px-2 py-1 cursor-pointer shrink-0"
            >
              Reset Search
            </button>
          )}
        </div>

        {/* Quick Statutory Search Suggestions from Official Courses */}
        <div class="flex items-center gap-1.5 flex-wrap text-[11px] pt-2 border-t border-slate-100">
          <span class="text-slate-400 font-semibold mr-1">Official Topics:</span>
          {[
            { label: 'PoSH Act 2013', query: 'Sexual Harassment' },
            { label: 'Fire Safety & NBC', query: 'Fire Safety' },
            { label: 'NDRF Civil Defence', query: 'Civil Defence' },
            { label: 'Swachhata Hi Seva 2024', query: 'स्वच्छता' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setSearchQuery(item.query)}
              class="px-2.5 py-1 rounded-full bg-[#EDF1F7] hover:bg-[#FFE9CD] text-[#1B4CA1] hover:text-[#C37024] border border-[#C7D9FB] hover:border-[#FFD2A1] transition-colors cursor-pointer text-[10px] font-semibold"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Domain Filter Pills */}
        <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span class="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider shrink-0 mr-1">
            Domains:
          </span>
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              class={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all cursor-pointer ${
                selectedDomain === dom
                  ? 'bg-[#1B4CA1] text-white shadow-xs font-bold'
                  : 'bg-[#EDF1F7] text-[#374151] hover:bg-[#E6EEFF] border border-[#C7D9FB]'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Showcased Courses (Replica of exact iGOT Karmayogi Showcased Courses Section from Photo) */}
      <div id="showcased-courses-section" class="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-7 shadow-xs">
        {/* Section Header */}
        <div class="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <h3 class="text-xl sm:text-2xl font-black text-[#1B2133] tracking-tight">
              Showcased Courses
            </h3>
            <span class="hidden sm:inline-block text-[11px] font-bold bg-[#FFE9CD] text-[#C37024] border border-[#FFD2A1] px-2.5 py-0.5 rounded-full">
              {filteredModules.length} {filteredModules.length === 1 ? 'Course' : 'Courses'}
            </span>
          </div>

          <div class="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedDomain('All');
                setSearchQuery('');
              }}
              class="text-xs sm:text-sm font-bold text-[#1B4CA1] hover:text-[#EF951E] flex items-center gap-1 transition-colors group cursor-pointer"
            >
              <span>Show all</span>
              <ChevronRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Navigation Carousel Buttons */}
            <div class="flex items-center gap-1.5 ml-2">
              <button
                onClick={scrollLeft}
                aria-label="Scroll courses left"
                class="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-700 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <ChevronLeft class="w-4 h-4" />
              </button>
              <button
                onClick={scrollRight}
                aria-label="Scroll courses right"
                class="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-700 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <ChevronRight class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Extracted iGOT Courses Status Banner */}
        <div class="p-3.5 bg-gradient-to-r from-[#EDF1F7] to-amber-50 rounded-xl border border-[#C7D9FB] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2 text-[#1B4CA1]">
            <Database class="w-4 h-4 text-[#EF951E] shrink-0" />
            <span>
              <strong>All 4 iGOT Courses Extracted:</strong> 21+ video lectures and complete statutory curriculum loaded directly into backend (<code>/api/courses</code>). No external redirects.
            </span>
          </div>
          <span class="text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 class="w-3 h-3 text-emerald-600" /> Backend Synchronized
          </span>
        </div>

        {/* Course Cards Carousel / Row */}
        {filteredModules.length === 0 ? (
          <div class="text-center py-12 px-4 bg-[#FEFAF4] rounded-xl border border-dashed border-[#FFD2A1]">
            <p class="text-sm font-bold text-[#1B2133]">No showcased courses found</p>
            <p class="text-xs text-[#4B5563] mt-1">
              No modules match &quot;{searchQuery}&quot; in domain &quot;{selectedDomain}&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDomain('All');
              }}
              class="mt-3 px-3.5 py-1.5 bg-[#1B4CA1] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-[#1146A2] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            ref={carouselRef}
            class="flex items-stretch gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
          >
            {filteredModules.map((mod) => {
              const isSaved = !!savedModules[mod.id];
              const ministryType = getMinistryType(mod.thumbnailTheme);

              return (
                <div
                  key={mod.id}
                  class="w-[285px] sm:w-[310px] shrink-0 snap-start bg-white rounded-xl border border-[#E2E8F0] hover:border-[#1B4CA1] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Visual Course Thumbnail */}
                    <div class="relative cursor-pointer" onClick={() => onOpenModule(mod)}>
                      <CourseCardThumbnail
                        theme={mod.thumbnailTheme}
                        durationDisplay={mod.durationDisplay || `${mod.durationMinutes}m`}
                        title={mod.title}
                      />

                      {/* Bookmark overlay */}
                      <button
                        onClick={(e) => toggleBookmark(mod.id, e)}
                        class="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors cursor-pointer z-10"
                        aria-label="Bookmark course"
                      >
                        <Bookmark class={`w-3.5 h-3.5 ${isSaved ? 'fill-[#EF951E] text-[#EF951E]' : ''}`} />
                      </button>
                    </div>

                    {/* Course Info */}
                    <div class="p-4 space-y-2.5">
                      {/* Course Badge Tag (Orange Pill matching the screenshot) */}
                      <div class="flex items-center justify-between">
                        <span class="inline-flex items-center gap-1 bg-[#FFF4E5] border border-[#FFD2A1] text-[#E07D10] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                          <Video class="w-3 h-3 text-[#E07D10] fill-current" />
                          <span>Course</span>
                        </span>

                        <span class="text-[10px] font-mono font-bold text-[#1B4CA1] bg-[#EDF1F7] px-2 py-0.5 rounded border border-[#C7D9FB]">
                          {mod.competencyCode}
                        </span>
                      </div>

                      {/* Course Title */}
                      <h4
                        onClick={() => onOpenModule(mod)}
                        class="text-sm font-extrabold text-[#1B2133] group-hover:text-[#1B4CA1] transition-colors line-clamp-2 min-h-[40px] leading-snug cursor-pointer"
                      >
                        {mod.title}
                      </h4>

                      {/* Media badge: Video count or SCORM package */}
                      <div class="flex items-center gap-1.5 flex-wrap">
                        {mod.extractedVideos && mod.extractedVideos.length > 0 ? (
                          <span class="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                            <Video class="w-3 h-3 text-emerald-600" />
                            <span>{mod.extractedVideos.length} Video Lectures</span>
                          </span>
                        ) : (
                          <span class="text-[10px] text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-flex items-center gap-1">
                            <BookOpen class="w-3 h-3 text-blue-600" />
                            <span>Interactive SCORM</span>
                          </span>
                        )}
                        <span class="text-[10px] text-slate-500 font-semibold">
                          {mod.curriculum ? `${mod.curriculum.length} Units` : 'Full Curriculum'}
                        </span>
                      </div>

                      {/* Ministry / Provider line with Logo */}
                      <div class="flex items-center gap-2 pt-1 border-t border-slate-100">
                        <MinistryLogo type={ministryType} className="w-5 h-5" />
                        <p class="text-[11px] text-[#4B5563] font-medium line-clamp-1">
                          By {mod.provider}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div class="p-4 pt-0">
                    <button
                      id={`btn-open-course-${mod.id}`}
                      onClick={() => onOpenModule(mod)}
                      class="w-full py-2.5 px-3 rounded-lg text-xs font-bold bg-[#EF951E] hover:bg-[#F08811] text-white flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                    >
                      {mod.status === 'completed' ? (
                        <>
                          <CheckCircle2 class="w-3.5 h-3.5" />
                          <span>Open & Review ({mod.durationDisplay || `${mod.durationMinutes}m`})</span>
                        </>
                      ) : mod.status === 'in-progress' ? (
                        <>
                          <Play class="w-3.5 h-3.5 fill-current" />
                          <span>Open Course ({mod.progressPercent}%)</span>
                        </>
                      ) : (
                        <>
                          <Play class="w-3.5 h-3.5 fill-current" />
                          <span>Open Course ({mod.durationDisplay || `${mod.durationMinutes}m`})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
