import React, { useState } from 'react';
import { LearningModule, ScreenId } from '../../types';
import {
  BookOpen,
  Search,
  Filter,
  Star,
  Clock,
  Play,
  CheckCircle2,
  Bookmark,
  ExternalLink
} from 'lucide-react';

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
  const [selectedType, setSelectedType] = useState('All');
  const [savedModules, setSavedModules] = useState<{ [id: string]: boolean }>({ 'mod-5': true });

  const domains = ['All', 'Digital Governance', 'Financial Management', 'Citizen Centricity', 'Public Policy', 'Administrative Ethics'];
  const types = ['All', 'Interactive Masterclass', 'Video Lecture', 'Case Study', 'Policy Brief'];

  const filteredModules = modules.filter((mod) => {
    const matchesSearch =
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.competencyCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === 'All' || mod.domain === selectedDomain;
    const matchesType = selectedType === 'All' || mod.type === selectedType;
    return matchesSearch && matchesDomain && matchesType;
  });

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="library-screen" class="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
      {/* Title & Description */}
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <BookOpen class="w-5 h-5 text-amber-500" />
            <h2 class="text-2xl font-serif text-white font-semibold tracking-wide">
              Learning Library
            </h2>
          </div>
          <p class="text-xs text-gray-400">
            Curated repository of accredited civil services leadership modules from LBSNAA, NIC, and iGOT Karmayogi Bharat.
          </p>
        </div>

        {/* Search Bar */}
        <div class="relative w-full md:w-80">
          <Search class="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses, rules, or codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            class="w-full bg-[#16181D] border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div class="flex flex-wrap items-center justify-between gap-3">
        {/* Domain Filter Pills */}
        <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              class={`px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedDomain === dom
                  ? 'bg-amber-500 text-black shadow-sm font-semibold'
                  : 'bg-[#16181D] text-gray-400 border border-gray-800 hover:text-gray-200'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div class="flex items-center gap-2 text-xs">
          <Filter class="w-3.5 h-3.5 text-gray-500" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            class="bg-[#16181D] border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((mod) => {
          const isBookmarked = savedModules[mod.id];

          return (
            <div
              key={mod.id}
              id={`library-item-${mod.id}`}
              onClick={() => onOpenModule(mod)}
              class="bg-[#16181D] border border-gray-800 hover:border-gray-700 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between cursor-pointer group relative overflow-hidden"
            >
              <div>
                {/* Card Top: Code badge + Bookmark */}
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 text-amber-400 border border-gray-800">
                      {mod.competencyCode}
                    </span>
                    <span class="text-[10px] text-gray-500 uppercase tracking-wider">{mod.level}</span>
                  </div>
                  <button
                    onClick={(e) => toggleBookmark(mod.id, e)}
                    class="text-gray-500 hover:text-amber-400 transition-colors p-1"
                    title="Bookmark Module"
                  >
                    <Bookmark class={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                </div>

                {/* Spotlight Visual Mockup from Design HTML */}
                <div class="flex gap-3.5 mb-4">
                  <div class="w-14 h-18 bg-gradient-to-br from-gray-800 to-gray-950 rounded-lg border border-gray-700 shadow-md flex items-center justify-center shrink-0 group-hover:border-amber-500/40 transition-colors">
                    <BookOpen class="w-6 h-6 text-amber-500 group-hover:scale-105 transition-transform" />
                  </div>
                  <div class="flex flex-col justify-center">
                    <span class="text-[10px] text-amber-500 font-medium tracking-wide">{mod.provider}</span>
                    <h3 class="text-xs md:text-sm font-serif text-white font-semibold line-clamp-2 mt-0.5 group-hover:text-amber-300 transition-colors">
                      {mod.title}
                    </h3>
                  </div>
                </div>

                <p class="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                  {mod.description}
                </p>
              </div>

              {/* Card Bottom Meta */}
              <div class="pt-3 border-t border-gray-800/80 space-y-3">
                <div class="flex items-center justify-between text-xs text-gray-400">
                  <span class="flex items-center gap-1.5 text-[11px]">
                    <Clock class="w-3.5 h-3.5 text-gray-500" /> {mod.durationMinutes} mins
                  </span>
                  <span class="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                    <Star class="w-3 h-3 fill-amber-400 text-amber-400" /> {mod.rating}
                  </span>
                </div>

                <div class="flex items-center justify-between pt-1">
                  <span
                    class={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      mod.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : mod.status === 'in-progress'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {mod.status === 'completed'
                      ? '100% Completed'
                      : mod.status === 'in-progress'
                      ? `${mod.progressPercent}% Completed`
                      : 'Enroll Ready'}
                  </span>

                  <span class="text-xs text-amber-500 font-semibold group-hover:underline flex items-center gap-1">
                    {mod.status === 'completed' ? 'Review' : 'Open Module'}
                    <ExternalLink class="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
