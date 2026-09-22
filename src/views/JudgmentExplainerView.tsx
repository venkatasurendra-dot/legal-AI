import React, { useState } from 'react';
import { 
  Gavel, 
  Search, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  Scale, 
  Clock, 
  CheckCircle2, 
  Layers,
  FileText
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { LANDMARK_JUDGMENTS } from '../data/legalDatabase';
import { LandmarkJudgment, LanguageCode } from '../types';

interface JudgmentExplainerViewProps {
  language: LanguageCode;
  onAskCase: (query: string) => void;
}

export const JudgmentExplainerView: React.FC<JudgmentExplainerViewProps> = ({ language, onAskCase }) => {
  const [selectedCase, setSelectedCase] = useState<LandmarkJudgment>(LANDMARK_JUDGMENTS[0]);
  const [customQuery, setCustomQuery] = useState('');
  const [aiCustomResult, setAiCustomResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchCustomCase = async (caseToSearch: string) => {
    const q = caseToSearch.trim();
    if (!q) return;

    // Check if matches curated list
    const found = LANDMARK_JUDGMENTS.find(
      (j) => j.caseName.toLowerCase().includes(q.toLowerCase()) || j.citation.toLowerCase().includes(q.toLowerCase())
    );
    if (found) {
      setSelectedCase(found);
      setAiCustomResult(null);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/judgment/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, language }),
      });
      const data = await res.json();
      if (data.matchedLandmark) {
        setSelectedCase(data.matchedLandmark);
        setAiCustomResult(null);
      } else {
        setAiCustomResult(data.aiExplanation);
      }
    } catch (e) {
      console.error(e);
      alert('Error explaining judgment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f141c] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <Gavel className="w-3.5 h-3.5" />
            <span>Supreme Court Jurisprudence & Precedent Analysis</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight">
            Landmark Judgment Explainer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Deconstruct complex Supreme Court verdicts into plain-language components: Ratio Decidendi (binding law), Obiter Dicta, constitutional issues, arguments, and enduring legal doctrines.
          </p>
        </div>

        {/* Search Bar for Judgments */}
        <div className="max-w-2xl mx-auto">
          <div className="relative flex items-center bg-[#131924] border border-slate-800 focus-within:border-amber-500 rounded-2xl p-2 shadow-lg">
            <Search className="w-5 h-5 text-amber-400 ml-2.5 shrink-0" />
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="Search landmark judgment (e.g. Kesavananda, Maneka Gandhi, Puttaswamy, Shreya Singhal)..."
              className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={() => handleSearchCustomCase(customQuery)}
              disabled={isLoading || !customQuery.trim()}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0"
            >
              {isLoading ? 'Analyzing...' : 'Explain'}
            </button>
          </div>
        </div>

        {/* Curated Landmark Case Carousel / Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-amber-300">
              Curated Constitutional Benches:
            </span>
            <span>Select a landmark precedent below</span>
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {LANDMARK_JUDGMENTS.map((j) => {
              const isSelected = selectedCase.id === j.id && !aiCustomResult;
              return (
                <button
                  key={j.id}
                  onClick={() => {
                    setSelectedCase(j);
                    setAiCustomResult(null);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'bg-[#131924] text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Gavel className="w-3.5 h-3.5" />
                  <span>{j.caseName.split(' v.')[0]} ({j.year})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Custom Result if triggered for non-curated case */}
        {aiCustomResult && (
          <div className="bg-[#131924] border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-serif text-lg font-bold text-amber-200">
                AI Judicial Analysis: "{customQuery}"
              </h2>
              <button
                onClick={() => onAskCase(`Explain in detail the legal significance of ${customQuery}`)}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask Follow-up in Chat</span>
              </button>
            </div>
            <div className="prose prose-invert prose-xs max-w-none text-slate-300 leading-relaxed space-y-3">
              <ReactMarkdown>{aiCustomResult}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Selected Curated Landmark Card */}
        {!aiCustomResult && selectedCase && (
          <div className="bg-[#131924] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            {/* Title & Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-0.5 rounded">
                  {selectedCase.subject}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-100 mt-1">
                  {selectedCase.caseName}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="font-mono text-amber-300">{selectedCase.citation}</span>
                  <span>•</span>
                  <span>{selectedCase.court}</span>
                  <span>•</span>
                  <span>Bench: {selectedCase.bench}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => onAskCase(`Discuss the ratio decidendi and impact of ${selectedCase.caseName} (${selectedCase.citation}) on Indian constitutional law.`)}
                  className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center space-x-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI Analysis</span>
                </button>
                <a
                  href={selectedCase.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                  title="Official Judgment Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Ratio Decidendi Hero Box */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Scale className="w-4 h-4" />
                <span>Ratio Decidendi (Binding Legal Principle Established)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif italic">
                "{selectedCase.ratioDecidendi}"
              </p>
            </div>

            {/* Factual Matrix & Legal Issues */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <strong className="text-amber-300 uppercase tracking-wider block text-[11px]">
                  Factual Matrix (What Happened):
                </strong>
                <p className="text-slate-300 leading-relaxed">
                  {selectedCase.facts}
                </p>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <strong className="text-amber-300 uppercase tracking-wider block text-[11px]">
                  Core Constitutional Issues before the Court:
                </strong>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  {selectedCase.issues.map((iss, iIdx) => (
                    <li key={iIdx}>{iss}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Judicial Reasoning & Final Decision */}
            <div className="space-y-4 text-xs">
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-2">
                <strong className="text-amber-300 uppercase tracking-wider block text-[11px]">
                  Judicial Reasoning & Arguments:
                </strong>
                <p className="text-slate-300 leading-relaxed">
                  {selectedCase.courtReasoning}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <strong className="text-amber-300 uppercase tracking-wider block text-[11px]">
                    Final Decision / Holding:
                  </strong>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedCase.finalDecision}
                  </p>
                </div>

                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <strong className="text-amber-300 uppercase tracking-wider block text-[11px]">
                    Enduring Doctrine & Long-Term Impact:
                  </strong>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedCase.doctrineOrImpact}
                  </p>
                </div>
              </div>
            </div>

            {/* Official Source link */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
              <span>Supreme Court Official Repository (sci.gov.in)</span>
              <a
                href={selectedCase.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline flex items-center space-x-1"
              >
                <span>Read Full Judgment Text</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
