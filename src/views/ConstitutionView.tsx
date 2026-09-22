import React, { useState } from 'react';
import { 
  Landmark, 
  Search, 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  History,
  Info,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { CONSTITUTIONAL_ARTICLES } from '../data/legalDatabase';
import { ConstitutionalArticle } from '../types';

interface ConstitutionViewProps {
  onAskArticle: (articleQuery: string) => void;
}

export const ConstitutionView: React.FC<ConstitutionViewProps> = ({ onAskArticle }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
  const [showPreambleDetail, setShowPreambleDetail] = useState(false);

  const categories = [
    { id: 'ALL', label: 'All Articles' },
    { id: 'Fundamental Rights', label: 'Fundamental Rights (Part III)' },
    { id: 'Directive Principles', label: 'Directive Principles (Part IV)' },
    { id: 'Fundamental Duties', label: 'Fundamental Duties (Part IVA)' },
    { id: 'Constitutional Remedies', label: 'Writs & Remedies (Art 32 & 226)' },
    { id: 'Amendment & Doctrines', label: 'Basic Structure & Amendments' },
  ];

  const filteredArticles = CONSTITUTIONAL_ARTICLES.filter((art) => {
    const matchesCategory = selectedCategory === 'ALL' || art.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      art.articleNumber.toLowerCase().includes(q) ||
      art.title.toLowerCase().includes(q) ||
      art.currentTextSummary.toLowerCase().includes(q) ||
      art.tags.some(t => t.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0f141c] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <Landmark className="w-3.5 h-3.5" />
            <span>Supreme Law of the Republic of India</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight">
            The Constitution of India
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Adopted on 26 November 1949 and in effect since 26 January 1950. Explore core provisions, original 1950 text vs subsequent amendments, landmark constitutional bench judgments, and the Basic Structure Doctrine.
          </p>
        </div>

        {/* Preamble Showcase Card */}
        <div className="bg-[#141a26] border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif text-xl font-bold text-amber-200">The Preamble to the Constitution of India</h2>
                <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-medium">
                  Soul of the Constitution
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Declared an integral part of the Constitution in Kesavananda Bharati (1973)
              </p>
            </div>
            <button
              id="btn-toggle-preamble-history"
              onClick={() => setShowPreambleDetail(!showPreambleDetail)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium border border-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              <span>{showPreambleDetail ? 'Hide Historical Amendments' : 'View 42nd Amendment Changes'}</span>
            </button>
          </div>

          <div className="font-serif italic text-sm sm:text-base leading-relaxed text-slate-200 bg-slate-900/60 p-5 rounded-xl border border-slate-800 text-center max-w-4xl mx-auto shadow-inner">
            "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a{' '}
            <strong className="text-amber-300 not-italic font-bold">
              SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC
            </strong>{' '}
            and to secure to all its citizens: <br className="hidden sm:inline" />
            <span className="text-amber-100 font-semibold">JUSTICE</span>, social, economic and political; <br className="hidden sm:inline" />
            <span className="text-amber-100 font-semibold">LIBERTY</span> of thought, expression, belief, faith and worship; <br className="hidden sm:inline" />
            <span className="text-amber-100 font-semibold">EQUALITY</span> of status and of opportunity; <br className="hidden sm:inline" />
            and to promote among them all <br className="hidden sm:inline" />
            <span className="text-amber-100 font-semibold">FRATERNITY</span> assuring the dignity of the individual and the{' '}
            <strong className="text-amber-300 not-italic font-bold">unity and integrity of the Nation</strong>; <br />
            IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION."
          </div>

          {showPreambleDetail && (
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-300 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/40 p-4 rounded-xl">
              <div>
                <strong className="text-amber-300 block mb-1">Original 1950 Text vs 42nd Amendment (1976):</strong>
                <p className="leading-relaxed text-slate-400">
                  The words <span className="text-amber-200 font-semibold">"SOCIALIST SECULAR"</span> were inserted between "SOVEREIGN" and "DEMOCRATIC", and <span className="text-amber-200 font-semibold">"unity and integrity of the Nation"</span> replaced "unity of the Nation" by the 42nd Constitutional Amendment Act, 1976.
                </p>
              </div>
              <div>
                <strong className="text-amber-300 block mb-1">Judicial Landmark Precedents:</strong>
                <ul className="list-disc pl-4 space-y-1 text-slate-400">
                  <li><strong>Berubari Union Case (1960):</strong> Supreme Court held the Preamble was NOT a part of the Constitution.</li>
                  <li><strong>Kesavananda Bharati (1973):</strong> Overruled Berubari, holding the Preamble is an integral part of the Constitution and can be amended without destroying the Basic Structure.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Search & Category Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by article number (e.g. Article 21), title, keyword, or doctrine..."
                className="w-full bg-[#131924] border border-slate-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing {filteredArticles.length} constitutional articles</span>
            <span>Grounded in official Gazette of India & Legislative Dept</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredArticles.map((art) => {
              const isExpanded = expandedArticleId === art.id;
              return (
                <div
                  key={art.id}
                  className="bg-[#131924] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-serif font-bold text-base text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                        {art.articleNumber}
                      </span>
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base text-slate-100">
                          {art.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{art.part}</span>
                          <span>•</span>
                          <span className="text-amber-400/80 font-medium">{art.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onAskArticle(`Explain ${art.articleNumber}: ${art.title} under Indian law and cite its landmark Supreme Court rulings.`)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30 flex items-center space-x-1 transition-colors"
                        title="Query AI Assistant about this Article"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Ask AI</span>
                      </button>

                      <button
                        onClick={() => setExpandedArticleId(isExpanded ? null : art.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                    {art.currentTextSummary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {art.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Expandable Deep Breakdown */}
                  {isExpanded && (
                    <div className="pt-4 mt-3 border-t border-slate-800 space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                          <strong className="text-amber-300 block mb-1">Original 1950 Constitutional Scope:</strong>
                          <p className="text-slate-300 leading-relaxed">{art.originalTextSummary}</p>
                        </div>
                        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                          <strong className="text-amber-300 block mb-1">Key Amendments & Evolution:</strong>
                          <ul className="list-disc pl-4 space-y-1 text-slate-300">
                            {art.keyAmendments && art.keyAmendments.length > 0 ? (
                              art.keyAmendments.map((am, aIdx) => <li key={aIdx}>{am}</li>)
                            ) : (
                              <li>No major text amendments; substantive expansion occurred via judicial interpretation.</li>
                            )}
                          </ul>
                        </div>
                      </div>

                      {art.landmarkJudgments && art.landmarkJudgments.length > 0 && (
                        <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800">
                          <strong className="text-amber-300 block mb-1.5">Authoritative Supreme Court Landmark Precedents:</strong>
                          <div className="flex flex-wrap gap-2">
                            {art.landmarkJudgments.map((lj, lIdx) => (
                              <button
                                key={lIdx}
                                onClick={() => onAskArticle(`Explain the ratio decidendi of ${lj} in relation to ${art.articleNumber}.`)}
                                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-200 border border-slate-700 flex items-center space-x-1"
                              >
                                <span>{lj}</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Effective: {art.effectiveDate}</span>
                        <a
                          href={art.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:underline flex items-center space-x-1"
                        >
                          <span>Official Gazette Text (Legislative Dept)</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
