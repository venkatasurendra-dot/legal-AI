import React, { useState } from 'react';
import { 
  FileSearch, 
  Search, 
  Sparkles, 
  BookOpen, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  CheckCircle2, 
  Clock,
  Scale
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { searchLegalKnowledgeBase, RetrievedDocument } from '../services/ragEngine';

export const LegalResearchView: React.FC<{ onAskChat: (q: string) => void }> = ({ onAskChat }) => {
  const [researchTopic, setResearchTopic] = useState('Admissibility of electronic records and WhatsApp chats under BSA 2023');
  const [isLoading, setIsLoading] = useState(false);
  const [retrievedSources, setRetrievedSources] = useState<RetrievedDocument[]>([]);
  const [memoContent, setMemoContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleResearchTopics = [
    'Admissibility of electronic records and WhatsApp chats under BSA 2023',
    'Scope of Anticipatory Bail under Section 482 BNSS 2023 and judicial discretion',
    'Basic Structure Doctrine and the limits of Parliament power to amend the Constitution',
    'Dishonour of cheques under Section 138 NI Act: Statutory notice timelines and strict liability',
    'Right to Privacy under Article 21 and the Digital Personal Data Protection Act 2023',
  ];

  const handleConductResearch = async (topicToResearch: string) => {
    const q = topicToResearch.trim();
    if (!q) return;

    setIsLoading(true);
    // 1. Run local RAG retrieval
    const rag = searchLegalKnowledgeBase(q, { limit: 6 });
    setRetrievedSources(rag);

    // 2. Query server chat in research mode
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `LEGAL RESEARCH MEMORANDUM REQUEST: "${q}". Provide an exhaustive legal research memorandum detailing:
1. STATEMENT OF ISSUE & RESEARCH PROPOSITION
2. CONSTITUTIONAL FOUNDATION & SCHEME
3. STATUTORY ENACTMENTS & ACTIVE PROVISIONS (Compare BNS/BNSS/BSA with old codes if applicable)
4. RATIO DECIDENDI OF BINDING SUPREME COURT PRECEDENTS
5. EXCEPTIONS, LIMITATION PERIODS, AND EVIDENTIARY STANDARDS
6. JURISPRUDENTIAL SYNTHESIS & STATUTORY AUTHORITIES`,
          history: [],
          language: 'en',
          mode: 'research',
        }),
      });

      const data = await res.json();
      setMemoContent(data.reply);
    } catch (e) {
      console.error(e);
      alert('Error formulating research memorandum.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportMemo = () => {
    if (!memoContent) return;
    const fullDoc = `LEGAL RESEARCH MEMORANDUM\nTOPIC: ${researchTopic}\nDATE: ${new Date().toLocaleDateString()}\nSYSTEM: LegalAI India\n\n${memoContent}\n\n---\nAUTHORITATIVE SOURCES RETRIEVED:\n${retrievedSources.map(s => `- ${s.title} (${s.sourceUrl})`).join('\n')}`;
    const blob = new Blob([fullDoc], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Legal-Research-Memo-${researchTopic.slice(0, 25).replace(/\s+/g, '-')}.md`;
    a.click();
  };

  const handleCopy = () => {
    if (!memoContent) return;
    navigator.clipboard.writeText(memoContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f141c] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <FileSearch className="w-3.5 h-3.5" />
            <span>Deep Judicial & Statutory Research Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight">
            Legal Research Studio & Memorandum Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Formulate comprehensive legal research memorandums. Synthesize statutory provisions from the Constitution, Central Acts, New Criminal Codes (BNS/BNSS/BSA), and binding Supreme Court case law into structured research briefs.
          </p>
        </div>

        {/* Research Input Bar */}
        <div className="bg-[#131924] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={researchTopic}
                onChange={(e) => setResearchTopic(e.target.value)}
                placeholder="Enter legal research proposition, doctrine, or statutory question..."
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              onClick={() => handleConductResearch(researchTopic)}
              disabled={isLoading || !researchTopic.trim()}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Synthesizing...' : 'Compile Research Memo'}</span>
            </button>
          </div>

          {/* Sample Topic Pills */}
          <div className="flex items-center space-x-2 text-xs text-slate-400 overflow-x-auto pb-1">
            <span className="text-[11px] shrink-0 text-amber-300 font-semibold">Research Propositions:</span>
            {sampleResearchTopics.map((top, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setResearchTopic(top);
                  handleConductResearch(top);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] shrink-0 transition-colors"
              >
                {top.slice(0, 45)}...
              </button>
            ))}
          </div>
        </div>

        {/* Research Results Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Retrieved Statutory Sources Matrix */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-[#131924] border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-serif font-bold text-sm text-amber-200 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Statutory Matrix ({retrievedSources.length})</span>
                </h3>
                <span className="text-[10px] text-slate-400">RAG Index</span>
              </div>

              {retrievedSources.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                  <p>Run a research proposition to inspect authoritative statutory provisions.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {retrievedSources.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300 truncate max-w-[180px]">
                          {doc.title}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          doc.status === 'REPEALED' ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'
                        }`}>
                          {doc.status || 'ACTIVE'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        {doc.summary}
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                        <span>{doc.type}</span>
                        <a
                          href={doc.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:underline flex items-center space-x-0.5"
                        >
                          <span>Gazette / SCI</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Research Memorandum */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#131924] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="font-serif text-lg font-bold text-slate-100">
                    Compiled Research Memorandum
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Proposition: "{researchTopic}"
                  </p>
                </div>

                {memoContent && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center space-x-1.5 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={handleExportMemo}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center space-x-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export (.md)</span>
                    </button>
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="py-16 text-center space-y-3">
                  <Scale className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                  <p className="text-xs text-amber-300 font-semibold">
                    Compiling Research Memorandum across Statutory Codes & Supreme Court Precedents...
                  </p>
                  <p className="text-[11px] text-slate-400">Cross-referencing Constitution, BNS 2023, and landmark precedents...</p>
                </div>
              ) : memoContent ? (
                <div className="prose prose-invert prose-xs max-w-none text-slate-200 space-y-3 leading-relaxed">
                  <ReactMarkdown
                    components={{
                      h3: ({ node, ...props }) => <h3 className="font-serif font-bold text-amber-300 text-base mt-4 mb-1 border-b border-slate-800 pb-1" {...props} />,
                      p: ({ node, ...props }) => <p className="mb-2 leading-relaxed text-slate-300" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                    }}
                  >
                    {memoContent}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                  <FileSearch className="w-8 h-8 text-slate-600 mx-auto opacity-50" />
                  <p>No memorandum compiled yet. Enter a topic and click "Compile Research Memo".</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
