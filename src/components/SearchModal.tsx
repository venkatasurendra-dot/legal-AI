import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Landmark, Gavel, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { searchLegalKnowledgeBase, RetrievedDocument } from '../services/ragEngine';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (doc: RetrievedDocument) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RetrievedDocument[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      if (query.trim().length > 1) {
        setResults(searchLegalKnowledgeBase(query, { limit: 8 }));
      } else {
        // default suggestions
        setResults(searchLegalKnowledgeBase('Article 21 BNS Bail CNR', { limit: 6 }));
      }
    }
  }, [isOpen, query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#131822] border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-900/60">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Constitution, Sections, BNS, IPC, Judgments, CNR..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline bg-slate-800 border border-slate-700 text-slate-400 text-[10px] px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-2 flex-1">
          {results.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No exact legal provisions found for "{query}".</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for "Article 21", "Section 103 BNS", "Bail", "Cheque Bounce", or "CNR number".</p>
            </div>
          ) : (
            results.map((doc) => {
              const isRepealed = doc.status === 'REPEALED';
              const isBNS = doc.title.includes('BNS') || doc.title.includes('Bharatiya');
              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    onSelectResult(doc);
                    onClose();
                  }}
                  className="p-3 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700 cursor-pointer transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-amber-300">
                        {doc.title}
                      </span>
                      {doc.status && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          isRepealed 
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40' 
                            : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                        }`}>
                          {doc.status}
                        </span>
                      )}
                      {isBNS && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-amber-950/60 text-amber-300 border border-amber-800/40">
                          New Code
                        </span>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {doc.summary}
                  </p>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-2">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">{doc.type}</span>
                    {doc.effectiveDate && (
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Effective: {doc.effectiveDate}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Footer */}
        <div className="p-3 bg-slate-900/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Search spans Constitution, Central Acts, New Criminal Codes (BNS 2023), and SC Precedents</span>
          <span className="text-amber-400/80">Press ↵ to select</span>
        </div>
      </div>
    </div>
  );
};
