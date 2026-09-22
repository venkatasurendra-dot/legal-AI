import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Database, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Layers, 
  RefreshCw, 
  ShieldCheck, 
  Scale, 
  Clock,
  Sparkles
} from 'lucide-react';
import { searchLegalKnowledgeBase, RetrievedDocument } from '../services/ragEngine';

export const AdminView: React.FC = () => {
  const [stats, setStats] = useState<any>({
    totalArticles: 10,
    totalActs: 10,
    totalSections: 12,
    totalJudgments: 5,
    activeLawsCount: 15,
    repealedCount: 4,
    sourcesCount: 6,
    lastUpdated: new Date().toISOString().split('T')[0],
    currentCriminalFramework: 'BNS, BNSS, BSA (Effective 1 July 2024)'
  });

  const [testQuery, setTestQuery] = useState('BNS Section 103 Murder');
  const [testResults, setTestResults] = useState<RetrievedDocument[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Item State
  const [newItemType, setNewItemType] = useState<'section' | 'article' | 'act'>('section');
  const [newTitle, setNewTitle] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newActName, setNewActName] = useState('Bharatiya Nyaya Sanhita (BNS 2023)');
  const [newSummary, setNewSummary] = useState('');
  const [newPunishment, setNewPunishment] = useState('');

  useEffect(() => {
    fetchStats();
    handleRunTestQuery('BNS Section 103 Murder');
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/knowledge/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunTestQuery = (q: string) => {
    const res = searchLegalKnowledgeBase(q, { limit: 5 });
    setTestResults(res);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const payload = {
        type: newItemType,
        item: {
          title: newTitle,
          sectionNumber: newNumber,
          actName: newActName,
          summary: newSummary,
          fullProvisionOverview: newSummary,
          punishmentOrRemedy: newPunishment,
          status: 'ACTIVE',
          sourceUrl: 'https://www.indiacode.nic.in',
          tags: [newItemType, newActName.split(' ')[0]],
          effectiveDate: new Date().toISOString().split('T')[0],
        },
      };

      const res = await fetch('/api/knowledge/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Item added successfully to active knowledge repository!');
        setShowAddModal(false);
        setNewTitle('');
        setNewNumber('');
        setNewSummary('');
        fetchStats();
      }
    } catch (err) {
      console.error(err);
      alert('Error adding item.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f141c] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-2xl font-bold text-slate-100">Knowledge Base Administration</span>
              <span className="text-xs bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded font-semibold">
                RAG Synced
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Monitor retrieval performance, verify statutory status tags (ACTIVE vs REPEALED), and manage legal items.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Statutory Entry</span>
          </button>
        </div>

        {/* Stats Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#131924] border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Constitutional Articles</span>
            <div className="text-2xl font-mono font-bold text-amber-300">{stats.totalArticles}</div>
            <span className="text-[10px] text-slate-400">Parts III, IV, IVA, XX</span>
          </div>

          <div className="bg-[#131924] border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Central Acts & Codes</span>
            <div className="text-2xl font-mono font-bold text-amber-300">{stats.totalActs}</div>
            <span className="text-[10px] text-emerald-400">{stats.activeLawsCount} Active Acts</span>
          </div>

          <div className="bg-[#131924] border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Key Legal Sections</span>
            <div className="text-2xl font-mono font-bold text-amber-300">{stats.totalSections}</div>
            <span className="text-[10px] text-rose-400">{stats.repealedCount} Repealed / Replaced</span>
          </div>

          <div className="bg-[#131924] border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Precedent Registry</span>
            <div className="text-2xl font-mono font-bold text-amber-300">{stats.totalJudgments}</div>
            <span className="text-[10px] text-slate-400">Supreme Court Benches</span>
          </div>
        </div>

        {/* Active Framework Status Card */}
        <div className="bg-[#131924] border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-xs text-slate-100 font-semibold block">Current Substantive & Procedural Framework:</strong>
              <p className="text-xs text-slate-400">{stats.currentCriminalFramework}</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-amber-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            Updated: {stats.lastUpdated}
          </span>
        </div>

        {/* RAG Retrieval Test Sandbox */}
        <div className="bg-[#131924] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-serif font-bold text-base text-slate-100">
                Hybrid RAG Retrieval Inspector
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulate entity tokenization, TF-IDF weights, and relevance ranking for user queries.
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Vector + Keyword Hybrid
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Test query (e.g. BNS Section 103, Bail, Article 21, Cheque Bounce)..."
              className="flex-1 bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2 text-xs sm:text-sm font-mono text-slate-200 focus:outline-none"
            />
            <button
              onClick={() => handleRunTestQuery(testQuery)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
            >
              Test RAG Retrieval
            </button>
          </div>

          {/* Results preview */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
              Retrieved Documents ({testResults.length}):
            </span>
            <div className="space-y-2">
              {testResults.map((r, idx) => (
                <div key={idx} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-amber-300">{r.title}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                        {r.type}
                      </span>
                      {r.status && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          r.status === 'REPEALED' ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'
                        }`}>
                          {r.status}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{r.summary}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                      Score: {r.relevanceScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal: Add Statutory Entry */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#131924] border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-serif font-bold text-base text-amber-200">
                  Add New Statutory Entry to Knowledge Base
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Entry Type</label>
                  <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200"
                  >
                    <option value="section">Legal Section</option>
                    <option value="article">Constitutional Article</option>
                    <option value="act">Legal Act</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Section / Article Number</label>
                  <input
                    type="text"
                    value={newNumber}
                    onChange={(e) => setNewNumber(e.target.value)}
                    placeholder="e.g. Section 152 or Article 22"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Acts endangering sovereignty, unity and integrity of India"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Act Name</label>
                  <input
                    type="text"
                    value={newActName}
                    onChange={(e) => setNewActName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Summary / Provision Text</label>
                  <textarea
                    rows={3}
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    placeholder="Summary of provision..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Prescribed Punishment / Remedy</label>
                  <input
                    type="text"
                    value={newPunishment}
                    onChange={(e) => setNewPunishment(e.target.value)}
                    placeholder="e.g. Imprisonment for life or up to 7 years with fine"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                  >
                    Save & Index Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
