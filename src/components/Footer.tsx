import React from 'react';
import { Scale, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { AUTHORITATIVE_SOURCES } from '../data/legalDatabase';

export const Footer: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0b0e14] border-t border-slate-800 text-slate-400 text-xs py-10 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center space-x-2 text-amber-200 font-serif font-bold text-base">
            <Scale className="w-5 h-5 text-amber-400" />
            <span>LegalAI India</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            AI-powered educational and research legal assistant covering the Constitution of India, Central & State Acts, Supreme Court judgments, court procedures, and advocate guidelines.
          </p>
          <div className="pt-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />
              BNS / BNSS / BSA Updated (1 July 2024)
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 text-sm mb-3">Knowledge Modules</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onNavigate('constitution')} className="hover:text-amber-300 transition-colors">
                Constitution of India (Articles 1-395)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('acts')} className="hover:text-amber-300 transition-colors">
                Acts & Sections (BNS, IPC, BNSS, ICA)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('court-guide')} className="hover:text-amber-300 transition-colors">
                Court Guide & 16-Digit CNR Decoder
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('court-etiquette')} className="hover:text-amber-300 transition-colors">
                How to Behave in Court (Etiquette)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('advocate-guide')} className="hover:text-amber-300 transition-colors">
                Advocate Roles & Professional Ethics
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('become-lawyer')} className="hover:text-amber-300 transition-colors">
                How to Become an Advocate (AIBE Guide)
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 text-sm mb-3">AI Legal Tools</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onNavigate('chat')} className="hover:text-amber-300 transition-colors">
                AI Legal Chatbot (RAG Grounded)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('document-analyzer')} className="hover:text-amber-300 transition-colors">
                Legal Document & Contract Analyzer
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('judgment-explainer')} className="hover:text-amber-300 transition-colors">
                Landmark Judgment Explainer
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('legal-research')} className="hover:text-amber-300 transition-colors">
                Deep Legal Research Studio
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('admin')} className="hover:text-amber-300 transition-colors">
                Knowledge Base Management
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 text-sm mb-3">Authoritative Government Sources</h4>
          <ul className="space-y-2">
            {AUTHORITATIVE_SOURCES.slice(0, 5).map((src) => (
              <li key={src.id}>
                <a 
                  href={src.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 hover:text-amber-300 transition-colors"
                >
                  <span className="truncate">{src.name.split('—')[0]}</span>
                  <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-slate-400 gap-4">
        <p>
          © {new Date().getFullYear()} LegalAI India. Educational & Research Platform for the Legal System of India.
        </p>
        <p className="text-amber-400/80 text-[11px] text-center md:text-right">
          Never acts as an advocate or court. Information strictly grounded in official statutory publications.
        </p>
      </div>
    </footer>
  );
};
