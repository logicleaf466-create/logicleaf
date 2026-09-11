import React from 'react';
import { Phone, Mail, MapPin, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { KarmayogiLogo } from './KarmayogiLogo';

export const GovernmentFooter: React.FC = () => {
  return (
    <footer id="goi-portal-footer" className="w-full bg-[#1B2133] text-slate-300 text-xs border-t-4 border-[#EF951E] mt-auto">
      {/* Top Footer Segment: Important Links & Contact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Karmayogi Bharat & Ira AI Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="bg-white/95 p-2.5 rounded-xl inline-block shadow-sm">
              <KarmayogiLogo size="sm" showMotto={true} />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              National Programme for Civil Services Capacity Building (NPCSCB). Transforming civil servants through competency-driven, role-based governance.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/30 border border-slate-700 text-[11px] text-[#FFA730]">
              <Sparkles className="w-3.5 h-3.5 text-[#FFA730]" />
              <span>Integrated with <strong>Ira AI</strong> Intelligence</span>
            </div>
          </div>

          {/* Col 2: Navigation Hubs */}
          <div>
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-3 border-b border-slate-700 pb-1.5">
              Portal Hubs & Modules
            </h4>
            <ul className="space-y-2 text-slate-300 text-xs">
              <li>
                <a href="#dashboard" className="hover:text-[#FFA730] transition-colors flex items-center gap-1">
                  <span>Executive Control Center</span>
                </a>
              </li>
              <li>
                <a href="#gap-analysis" className="hover:text-[#FFA730] transition-colors flex items-center gap-1">
                  <span>FRAC Competency Framework</span>
                </a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-[#FFA730] transition-colors flex items-center gap-1">
                  <span>Personalized Learning Pathways</span>
                </a>
              </li>
              <li>
                <a href="#quiz-studio" className="hover:text-[#FFA730] transition-colors flex items-center gap-1">
                  <span>Ira AI Scenario Studio</span>
                </a>
              </li>
              <li>
                <a href="#library" className="hover:text-[#FFA730] transition-colors flex items-center gap-1">
                  <span>Accredited Courses (LBSNAA/ISTM)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Portals Network */}
          <div>
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-3 border-b border-slate-700 pb-1.5">
              National Initiatives
            </h4>
            <ul className="space-y-2 text-slate-300 text-xs">
              <li>
                <a href="https://india.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#FFA730] transition-colors flex items-center gap-1">
                  <span>National Portal of India</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://dopt.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#FFA730] transition-colors flex items-center gap-1">
                  <span>Dept of Personnel and Training (DoPT)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://cbc.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#FFA730] transition-colors flex items-center gap-1">
                  <span>Capacity Building Commission (CBC)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://digitalindia.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#FFA730] transition-colors flex items-center gap-1">
                  <span>Digital India</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Helpdesk & Support */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-3 border-b border-slate-700 pb-1.5">
              Support & Helpdesk
            </h4>
            <div className="flex items-start gap-2 text-xs">
              <MapPin className="w-4 h-4 text-[#FFA730] shrink-0 mt-0.5" />
              <span>Karmayogi Bharat, Old JNU Campus, New Delhi - 110067</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Phone className="w-4 h-4 text-[#FFA730] shrink-0" />
              <span>Toll Free: 1800 111 555 (Mon-Fri, 9am-6pm)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Mail className="w-4 h-4 text-[#FFA730] shrink-0" />
              <span>support@karmayogibharat.gov.in</span>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-1 rounded">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>STQC Certified & ISO 27001 Compliant</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-slate-800 bg-[#111625] py-4 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 text-center sm:text-left">
            <span>Website content managed by <strong>Karmayogi Bharat (DoPT)</strong></span>
            <span>•</span>
            <span>Hosted by <strong>National Informatics Centre (NIC)</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#terms" className="hover:text-slate-200 transition-colors">Terms of Use</a>
            <a href="#privacy" className="hover:text-slate-200 transition-colors">Privacy Policy</a>
            <a href="#accessibility" className="hover:text-slate-200 transition-colors">Accessibility</a>
            <a href="#sitemap" className="hover:text-slate-200 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
