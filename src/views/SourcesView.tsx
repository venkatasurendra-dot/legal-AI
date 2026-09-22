import React from 'react';
import { 
  Globe, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  Landmark, 
  Gavel, 
  Scale, 
  Award,
  AlertTriangle
} from 'lucide-react';
import { AUTHORITATIVE_SOURCES } from '../data/legalDatabase';

export const SourcesView: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f141c] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5" />
            <span>Official Government & Statutory Repositories</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight">
            Authoritative Legal Source Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            LegalAI India operates under a strict evidentiary hierarchy. Every statutory text, article, amendment, and judgment citation is grounded exclusively in verified official publications of the Union of India, Supreme Court of India, and statutory regulators.
          </p>
        </div>

        {/* Source Hierarchy Principles Card */}
        <div className="bg-[#131924] border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="font-serif text-lg font-bold text-amber-200 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Strict Evidentiary Hierarchy of Indian Legal Knowledge</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-amber-400 font-bold text-[11px] block uppercase tracking-wider">Priority 1:</span>
              <strong className="text-slate-100 block">The Gazette of India & India Code</strong>
              <p className="text-slate-400 leading-relaxed">
                Official statutory enactments, presidential notifications, and central acts published by the Legislative Department, Ministry of Law and Justice.
              </p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-amber-400 font-bold text-[11px] block uppercase tracking-wider">Priority 2:</span>
              <strong className="text-slate-100 block">Supreme Court of India (sci.gov.in)</strong>
              <p className="text-slate-400 leading-relaxed">
                Official digitally signed judgments, constitutional bench orders, and eCourts daily cause lists and certified orders.
              </p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-amber-400 font-bold text-[11px] block uppercase tracking-wider">Priority 3:</span>
              <strong className="text-slate-100 block">Statutory Regulatory Authorities</strong>
              <p className="text-slate-400 leading-relaxed">
                Bar Council of India (BCI Rules), National Legal Services Authority (NALSA), and respective State Bar Councils.
              </p>
            </div>
          </div>
        </div>

        {/* Sources Grid */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-slate-100">
            Official Portals & Digital Registries
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AUTHORITATIVE_SOURCES.map((src) => (
              <div
                key={src.id}
                className="bg-[#131924] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-sm group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                      {src.type}
                    </span>
                    <span className="text-[11px] text-slate-400">Official Portal</span>
                  </div>

                  <h3 className="font-semibold text-sm sm:text-base text-slate-100 group-hover:text-amber-300 transition-colors mb-2">
                    {src.name}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {src.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400 text-[11px] truncate max-w-[220px]">
                    {src.url.replace('https://', '')}
                  </span>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center space-x-1"
                  >
                    <span>Visit Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
