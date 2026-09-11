import React, { useEffect, useState } from 'react';
import { LearningModule } from '../types';
import { BookOpen, ShieldCheck } from 'lucide-react';

interface CourseLoadingModalProps {
  module: LearningModule | null;
  isOpen: boolean;
}

export const CourseLoadingModal: React.FC<CourseLoadingModalProps> = ({ module, isOpen }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    // Smoothly animate progress bar to 100% across exactly 1000ms
    setProgress(15);
    const t1 = setTimeout(() => setProgress(60), 300);
    const t2 = setTimeout(() => setProgress(90), 700);
    const t3 = setTimeout(() => setProgress(100), 950);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen]);

  if (!isOpen || !module) return null;

  return (
    <div
      id="course-loading-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        id="course-loading-card"
        className="bg-white border border-[#E5E7EB] w-full max-w-md rounded-2xl shadow-2xl p-6 text-center space-y-4 relative overflow-hidden"
      >
        {/* Top Decorative Indian Triranga Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="h-full w-1/3 bg-[#FF9933]"></div>
          <div className="h-full w-1/3 bg-white"></div>
          <div className="h-full w-1/3 bg-[#138808]"></div>
        </div>

        {/* Official Spinner with National Emblem Seal Style */}
        <div className="relative w-16 h-16 mx-auto mt-2 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#1B4CA1] animate-spin"></div>
          <div className="w-10 h-10 rounded-full bg-[#1B4CA1] text-white flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5 text-amber-300" />
          </div>
        </div>

        {/* Text Details */}
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1B4CA1] bg-[#EDF1F7] px-2.5 py-0.5 rounded-full border border-[#C7D9FB] uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1B4CA1]" />
            <span>DoPT Verified Course</span>
          </span>
          <h3 className="text-base font-extrabold text-[#1B2133] line-clamp-1">
            {module.title}
          </h3>
          <p className="text-xs text-[#4B5563] mt-1">
            Opening official curriculum & interactive notes...
          </p>
        </div>

        {/* 1-Second Progress Meter */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[10px] font-bold text-slate-500">
            <span>Accessing course modules</span>
            <span className="font-mono text-[#1B4CA1]">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-[#EF951E] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 font-medium">
          Integrated Digital Classroom • Karmayogi Bharat Platform
        </p>
      </div>
    </div>
  );
};
