import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LegalDisclaimerBanner } from './components/LegalDisclaimerBanner';
import { SearchModal } from './components/SearchModal';
import { FloatingChatbot } from './components/FloatingChatbot';
import { HomeView } from './views/HomeView';
import { ChatView } from './views/ChatView';
import { ConstitutionView } from './views/ConstitutionView';
import { ActsView } from './views/ActsView';
import { CourtGuideView } from './views/CourtGuideView';
import { CourtEtiquetteView } from './views/CourtEtiquetteView';
import { AdvocateGuideView } from './views/AdvocateGuideView';
import { BecomeLawyerView } from './views/BecomeLawyerView';
import { DocumentAnalyzerView } from './views/DocumentAnalyzerView';
import { JudgmentExplainerView } from './views/JudgmentExplainerView';
import { LegalResearchView } from './views/LegalResearchView';
import { SourcesView } from './views/SourcesView';
import { AdminView } from './views/AdminView';
import { LanguageCode } from './types';
import { RetrievedDocument } from './services/ragEngine';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [pendingChatQuery, setPendingChatQuery] = useState<string | undefined>(undefined);

  const handleNavigateWithQuery = (view: string, query?: string) => {
    setCurrentView(view);
    if (query) {
      setPendingChatQuery(query);
    }
  };

  const handleSelectSearchResult = (doc: RetrievedDocument) => {
    if (doc.type === 'Constitutional Article') {
      setCurrentView('constitution');
    } else if (doc.type === 'Legal Section' || doc.type === 'Legal Act') {
      setCurrentView('acts');
    } else if (doc.type === 'Landmark Judgment') {
      setCurrentView('judgment-explainer');
    } else if (doc.type === 'Etiquette') {
      setCurrentView('court-etiquette');
    } else if (doc.type === 'Advocate Guide') {
      setCurrentView('become-lawyer');
    } else {
      handleNavigateWithQuery('chat', `Tell me about ${doc.title} under Indian law.`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f141c] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Top Statutory Educational Notice */}
      <LegalDisclaimerBanner />

      {/* Primary Sticky Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          setPendingChatQuery(undefined);
        }}
        language={language}
        setLanguage={setLanguage}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area based on current view */}
      <main className="flex-1 flex flex-col">
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigateWithQuery}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}

        {currentView === 'chat' && (
          <ChatView
            language={language}
            setLanguage={setLanguage}
            initialQuery={pendingChatQuery}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'constitution' && (
          <ConstitutionView
            onAskArticle={(query) => handleNavigateWithQuery('chat', query)}
          />
        )}

        {currentView === 'acts' && (
          <ActsView
            onAskSection={(query) => handleNavigateWithQuery('chat', query)}
          />
        )}

        {currentView === 'court-guide' && (
          <CourtGuideView
            onAskQuery={(query) => handleNavigateWithQuery('chat', query)}
          />
        )}

        {currentView === 'court-etiquette' && (
          <CourtEtiquetteView
            onAskQuery={(query) => handleNavigateWithQuery('chat', query)}
          />
        )}

        {currentView === 'advocate-guide' && (
          <AdvocateGuideView
            onAskQuery={(query) => handleNavigateWithQuery('chat', query)}
          />
        )}

        {currentView === 'become-lawyer' && (
          <BecomeLawyerView
            onAskQuery={(query) => handleNavigateWithQuery('chat', query)}
          />
        )}

        {currentView === 'document-analyzer' && (
          <DocumentAnalyzerView
            language={language}
            onAskDocQuery={(query) => handleNavigateWithQuery('chat', query)}
          />
        )}

        {currentView === 'judgment-explainer' && (
          <JudgmentExplainerView
            language={language}
            onAskCase={(query) => handleNavigateWithQuery('chat', query)}
          />
        )}

        {currentView === 'legal-research' && (
          <LegalResearchView
            onAskChat={(query) => handleNavigateWithQuery('chat', query)}
          />
        )}

        {currentView === 'sources' && (
          <SourcesView />
        )}

        {currentView === 'admin' && (
          <AdminView />
        )}
      </main>

      {/* Global Footer with Official Portals */}
      <Footer onNavigate={(view) => setCurrentView(view)} />

      {/* Floating AI Legal Chatbot (Available across all views when not on full-page chat) */}
      {currentView !== 'chat' && (
        <FloatingChatbot
          currentLanguage={language}
          onNavigateToFullPage={(query) => handleNavigateWithQuery('chat', query)}
        />
      )}

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />
    </div>
  );
}
