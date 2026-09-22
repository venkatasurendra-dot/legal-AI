import React, { useState } from 'react';
import { 
  Scale, 
  BookOpen, 
  ShieldAlert, 
  Landmark, 
  FileText, 
  Gavel, 
  Search, 
  Globe, 
  GraduationCap, 
  Briefcase, 
  Settings, 
  Menu, 
  X,
  Compass,
  FileSearch,
  Bot,
  Sparkles
} from 'lucide-react';
import { LanguageCode } from '../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  language,
  setLanguage,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'chat', label: 'AI Chatbot', icon: Bot, highlight: true },
    { id: 'home', label: 'Home', icon: Scale },
    { id: 'constitution', label: 'Constitution', icon: Landmark },
    { id: 'acts', label: 'Acts & Sections', icon: BookOpen },
    { id: 'court-guide', label: 'Court Guide', icon: Gavel },
    { id: 'court-etiquette', label: 'Court Etiquette', icon: ShieldAlert },
    { id: 'advocate-guide', label: 'Advocates', icon: Briefcase },
    { id: 'become-lawyer', label: 'Become a Lawyer', icon: GraduationCap },
    { id: 'document-analyzer', label: 'Doc Analyzer', icon: FileText },
    { id: 'judgment-explainer', label: 'Judgments', icon: Gavel },
    { id: 'legal-research', label: 'Legal Research', icon: FileSearch },
    { id: 'sources', label: 'Sources', icon: Globe },
    { id: 'admin', label: 'Admin', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0f141c]/95 backdrop-blur border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            id="brand-logo"
            onClick={() => { setCurrentView('chat'); setMobileMenuOpen(false); }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-lg tracking-wide text-amber-200">LegalAI India</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                  AI CHATBOT
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Indian Legal Assistant & Multimodal Chatbot</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.slice(0, 8).map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const isChat = item.id === 'chat';
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                    isChat
                      ? isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md ring-1 ring-amber-400'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/25 font-semibold'
                      : isActive 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isChat && !isActive ? 'text-amber-400' : ''}`} />
                  <span>{item.label}</span>
                  {isChat && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Tools: Search, Language, Admin / Secondary */}
          <div className="flex items-center space-x-2">
            <button
              id="btn-global-search"
              onClick={onOpenSearch}
              className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 rounded-lg border border-slate-800 transition-colors flex items-center space-x-1.5 text-xs"
              title="Search Constitution, Acts, Judgments (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline text-slate-400">Search</span>
              <kbd className="hidden md:inline bg-slate-800 px-1 py-0.5 text-[10px] rounded text-slate-400 border border-slate-700">⌘K</kbd>
            </button>

            {/* Language Selector */}
            <div className="relative flex items-center bg-slate-800/90 rounded-lg p-1 border border-slate-700 text-xs">
              <Globe className="w-3.5 h-3.5 text-amber-400 ml-1 mr-1" />
              <button
                id="lang-en"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  language === 'en' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                id="lang-hi"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  language === 'hi' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
                title="हिंदी (Hindi)"
              >
                हिन्दी
              </button>
              <button
                id="lang-te"
                onClick={() => setLanguage('te')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  language === 'te' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
                title="తెలుగు (Telugu)"
              >
                తెలుగు
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#131924] border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          <div className="grid grid-cols-2 gap-1 pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const isChat = item.id === 'chat';
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium ${
                    isChat
                      ? isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm col-span-2'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold col-span-2'
                      : isActive 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isChat && isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span>{item.label}</span>
                  {isChat && !isActive && (
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200">
                      Live
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
