import React, { useState, useEffect, useRef } from 'react';
import {
  Scale,
  Sparkles,
  X,
  Minus,
  Maximize2,
  Send,
  Mic,
  MicOff,
  Paperclip,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  BookOpen,
  ExternalLink,
  Shield,
  FileText,
  Search,
  Gavel,
  Landmark,
  GraduationCap,
  Users,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { LanguageCode } from '../types';
import {
  FloatingMessage,
  FloatingAnswer,
  executeFloatingQuery,
  findCuratedAnswer
} from '../services/floatingChatbotService';

interface FloatingChatbotProps {
  currentLanguage?: LanguageCode;
  onNavigateToFullPage?: (initialQuery?: string) => void;
}

export const FloatingChatbot: React.FC<FloatingChatbotProps> = ({
  currentLanguage = 'en',
  onNavigateToFullPage
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>(currentLanguage);
  const [isResearchMode, setIsResearchMode] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{
    fileName: string;
    fileType: string;
    fileSize?: string;
    fileContent?: string;
    summaryPreview?: string;
    data?: string;
  } | null>(null);

  const [messages, setMessages] = useState<FloatingMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Quick categories
  const quickCategories = [
    { label: 'Constitution', icon: '📜', query: 'What are the key Fundamental Rights in the Indian Constitution?' },
    { label: 'Acts & Sections', icon: '⚖️', query: 'Explain how Bharatiya Nyaya Sanhita (BNS 2024) replaced the IPC.' },
    { label: 'Courts', icon: '🏛️', query: 'How is the Indian judicial court hierarchy structured from Subordinate Courts to the Supreme Court?' },
    { label: 'Advocates', icon: '👨‍⚖️', query: 'What is the difference between a lawyer and an advocate under the Advocates Act 1961?' },
    { label: 'Become a Lawyer', icon: '🎓', query: 'How can I become an advocate in India?' },
    { label: 'Documents', icon: '📄', query: 'What are the required legal components for a Section 138 NI Act notice?' },
    { label: 'Legal Research', icon: '🔎', query: 'What is the Basic Structure doctrine under Kesavananda Bharati case?' }
  ];

  // Quick suggestion questions
  const quickQuestions = [
    'What is Article 21?',
    'How can I become an advocate?',
    'What is the difference between a lawyer and an advocate?',
    'What does FIR mean?',
    'How does bail work?',
    'What is a Fundamental Right?'
  ];

  // Load saved history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('legalai_floating_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not load floating chat history:', e);
    }
  }, []);

  // Save history on change
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem('legalai_floating_chat_history', JSON.stringify(messages.slice(-15)));
      }
    } catch (e) {
      console.warn('Could not save floating chat history:', e);
    }
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen, isMinimized]);

  // Handle Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Voice recognition start error:', err);
        setIsListening(false);
      }
    }
  };

  // Text-to-speech audio handling
  const handleToggleSpeech = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (activeSpeechId === msgId) {
      window.speechSynthesis.cancel();
      setActiveSpeechId(null);
    } else {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*#_`]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';
      utterance.rate = 1.0;
      utterance.onend = () => setActiveSpeechId(null);
      utterance.onerror = () => setActiveSpeechId(null);
      window.speechSynthesis.speak(utterance);
      setActiveSpeechId(msgId);
    }
  };

  // File Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const fileType = file.type || file.name.split('.').pop() || 'document';
    const fileSize = `${(file.size / 1024).toFixed(1)} KB`;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedFile({
          fileName,
          fileType,
          fileSize,
          data: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedFile({
          fileName,
          fileType,
          fileSize,
          fileContent: reader.result as string
        });
      };
      reader.readAsText(file);
    } else {
      // For PDF / DOCX, store metadata
      setAttachedFile({
        fileName,
        fileType,
        fileSize,
        summaryPreview: `Document: ${fileName} (${fileSize}). Ready for legal analysis under Indian statutory law.`
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Send message
  const handleSendMessage = async (customQuery?: string) => {
    const query = (customQuery || inputText).trim();
    if (!query && !attachedFile) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: FloatingMessage = {
      id: userMessageId,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      queryText: query,
      documentAttached: attachedFile || undefined
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    const currentDoc = attachedFile;
    setAttachedFile(null);
    setIsLoading(true);

    try {
      // Construct history for contextual continuity
      const history = messages.slice(-4).map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.queryText || m.answer?.shortAnswer.coreText || ''
      }));

      const answer = await executeFloatingQuery({
        query: query || 'Please analyze this uploaded legal document under Indian law.',
        language: language,
        isResearchMode: isResearchMode,
        attachedDocument: currentDoc || undefined,
        history: history
      });

      const assistantMsg: FloatingMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        answer: answer,
        isDetailedExpanded: false, // Default is SHORT answer
        isResearchMode: isResearchMode
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Error generating answer:', error);
      // Friendly fallback
      const fallbackCurated = findCuratedAnswer('what is article 21', language);
      if (fallbackCurated) {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            sender: 'assistant',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            answer: fallbackCurated,
            isDetailedExpanded: false
          }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle detailed explanation for a message
  const toggleDetailedExplanation = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isDetailedExpanded: !msg.isDetailedExpanded } : msg
      )
    );
  };

  // Copy text handler
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Clear chat
  const handleClearChat = () => {
    if (confirm('Clear this conversation history?')) {
      setMessages([]);
      localStorage.removeItem('legalai_floating_chat_history');
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setActiveSpeechId(null);
    }
  };

  return (
    <>
      {/* 1. FLOATING CHAT BUTTON (Bottom-Right Corner) */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 select-none">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="relative group flex items-center"
            >
              {/* Subtle ambient pulse ring */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500/40 via-amber-400/30 to-amber-600/40 blur-md group-hover:blur-lg opacity-75 group-hover:opacity-100 transition-all duration-300 animate-pulse pointer-events-none" />

              {/* Floating speech-bubble preview card (Desktop tooltip) */}
              <div className="hidden md:flex absolute right-full mr-3 items-center bg-[#131924]/95 border border-amber-500/30 text-slate-200 px-3 py-1.5 rounded-xl shadow-xl backdrop-blur-md pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity">
                <div className="text-left">
                  <div className="flex items-center space-x-1 text-[11px] font-bold text-amber-400">
                    <Scale className="w-3.5 h-3.5" />
                    <span>LegalAI Assistant</span>
                  </div>
                  <div className="text-[10px] text-slate-300 font-medium">Ask any Indian law question</div>
                </div>
                <div className="w-2 h-2 bg-[#131924] border-r border-b border-amber-500/30 transform rotate-[-45deg] absolute -right-1" />
              </div>

              {/* Main Button */}
              <button
                id="floating-legalai-trigger"
                onClick={() => {
                  setIsOpen(true);
                  setIsMinimized(false);
                }}
                className="relative flex items-center space-x-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-semibold shadow-2xl hover:shadow-amber-500/30 border border-amber-200/50 hover:scale-105 active:scale-95 transition-all duration-200"
                aria-label="Open LegalAI Chatbot"
              >
                {/* Professional scale & AI sparkles icon with online status indicator */}
                <div className="relative flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-slate-950/10 flex items-center justify-center">
                    <Scale className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600 border border-amber-300" />
                  </span>
                </div>

                <div className="flex flex-col items-start leading-none text-left">
                  <span className="font-bold text-xs sm:text-sm tracking-tight flex items-center gap-1 text-slate-950">
                    <span>LegalAI</span>
                    <Sparkles className="w-3 h-3 text-slate-900 fill-slate-950" />
                  </span>
                  <span className="text-[10px] text-slate-900/80 font-medium hidden sm:inline">Ask anything</span>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. CHAT WINDOW (Opens directly above or full-screen on mobile) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={
              isMinimized
                ? { opacity: 1, y: 0, scale: 1, height: 'auto' }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={{ opacity: 0, y: 40, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className={`fixed z-50 bg-[#0f141c]/98 backdrop-blur-xl border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 transition-all ${
              isMinimized
                ? 'bottom-5 right-5 sm:bottom-6 sm:right-6 w-[340px] sm:w-[380px] p-0'
                : 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full h-[100dvh] sm:h-[630px] sm:max-h-[85vh] sm:w-[420px] md:w-[440px]'
            }`}
            style={{
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px -5px rgba(245, 158, 11, 0.15)'
            }}
          >
            {/* Window Header */}
            <div className="bg-gradient-to-r from-[#141a26] via-[#172030] to-[#141a26] px-4 py-3 border-b border-amber-500/20 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
                  <Scale className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h2 className="font-serif font-bold text-sm text-slate-100 tracking-wide flex items-center space-x-1">
                      <span>LegalAI India</span>
                    </h2>
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Online
                    </span>
                  </div>
                  <p className="text-[10px] text-amber-200/80 font-normal">
                    Indian Legal Information Assistant
                  </p>
                </div>
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center space-x-1">
                {/* Language Toggle */}
                <div className="relative mr-1">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold px-2 py-1 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
                    title="Select Language"
                  >
                    <option value="en">EN</option>
                    <option value="hi">हिन्दी</option>
                    <option value="te">తెలుగు</option>
                  </select>
                </div>

                {/* Clear Chat */}
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Clear conversation"
                  aria-label="Clear conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Expand to Full Page */}
                {onNavigateToFullPage && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onNavigateToFullPage(inputText || undefined);
                    }}
                    className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors hidden sm:inline-flex"
                    title="Open Full Page Chat"
                    aria-label="Open Full Page Chat"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Minimize */}
                <button
                  type="button"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title={isMinimized ? 'Expand' : 'Minimize'}
                  aria-label={isMinimized ? 'Expand window' : 'Minimize window'}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                {/* Close */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Close"
                  aria-label="Close chatbot window"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* If minimized, show compact bar only */}
            {!isMinimized && (
              <>
                {/* Secondary Subheader Bar: Research Mode Toggle & Status */}
                <div className="bg-[#121824] px-3.5 py-1.5 border-b border-slate-800/80 flex items-center justify-between text-[11px] shrink-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-slate-300 font-medium">
                      {isResearchMode ? '🔎 Research Mode' : '⚡ Quick Answer Mode'}
                    </span>
                  </div>

                  {/* Mode Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setIsResearchMode(!isResearchMode)}
                    className={`px-2 py-0.5 rounded-md font-semibold text-[10px] transition-all flex items-center space-x-1 border ${
                      isResearchMode
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
                    }`}
                  >
                    <span>{isResearchMode ? 'Switch to Quick' : 'Enable Deep Research'}</span>
                  </button>
                </div>

                {/* Message & Conversation Thread Area */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-4 bg-gradient-to-b from-[#0c1017] to-[#0f141c]">
                  {/* 3. WELCOME SCREEN (When thread is empty) */}
                  {messages.length === 0 && (
                    <div className="py-2 px-1 text-center select-none">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400 mb-3 shadow-inner">
                        <Scale className="w-6 h-6 stroke-[2]" />
                      </div>

                      <h3 className="font-serif text-lg font-bold text-slate-100 mb-1">
                        👋 Hello! I'm <span className="text-amber-400">LegalAI India</span>.
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto mb-4 font-normal">
                        I can help you understand Indian legal information, laws, constitutional provisions, courts, legal procedures and legal careers.
                      </p>

                      <div className="text-[11px] font-semibold text-amber-300/90 mb-2 uppercase tracking-wider">
                        What would you like to know?
                      </div>

                      {/* 7 Quick Topic Buttons */}
                      <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                        {quickCategories.map((cat, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSendMessage(cat.query)}
                            className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-[#141b27] hover:bg-[#1a2333] border border-slate-800 hover:border-amber-500/50 text-slate-200 hover:text-amber-300 text-xs font-medium transition-all shadow-sm active:scale-95 text-left"
                          >
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* 4. Quick Suggestion Questions */}
                      <div className="text-left bg-[#131924]/80 p-3 rounded-2xl border border-slate-800/90">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2 flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Suggested Questions</span>
                        </div>
                        <div className="space-y-1.5">
                          {quickQuestions.map((q, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSendMessage(q)}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/30 text-xs text-slate-300 hover:text-amber-200 transition-all flex items-center justify-between group"
                            >
                              <span>"{q}"</span>
                              <span className="text-[10px] text-amber-400/80 group-hover:translate-x-0.5 transition-transform">
                                →
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message Thread */}
                  {messages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                      >
                        {/* 9. Message Cards */}
                        <div
                          className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                            isUser
                              ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-medium rounded-tr-xs shadow-md'
                              : 'bg-[#141b27] text-slate-100 border border-slate-800 rounded-tl-xs shadow-lg'
                          }`}
                        >
                          {/* Attached Document in User Message */}
                          {msg.documentAttached && (
                            <div className="mb-2 p-2 bg-slate-900/90 rounded-xl border border-slate-800 text-slate-100 text-xs">
                              <div className="flex items-center space-x-1.5 font-semibold text-amber-300 mb-0.5">
                                <FileText className="w-3.5 h-3.5" />
                                <span className="truncate">{msg.documentAttached.fileName}</span>
                              </div>
                              <span className="text-[10px] text-slate-400">
                                {msg.documentAttached.fileSize || 'Legal File'}
                              </span>
                            </div>
                          )}

                          {/* Message Content */}
                          {isUser ? (
                            <div>{msg.queryText}</div>
                          ) : (
                            <div className="space-y-3">
                              {/* Assistant Top Badge */}
                              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-[11px]">
                                <div className="flex items-center space-x-1.5 text-amber-400 font-semibold">
                                  <Scale className="w-3.5 h-3.5" />
                                  <span>LegalAI India</span>
                                </div>
                                <div className="flex items-center space-x-1 text-slate-400">
                                  {/* Audio Speech Button */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleToggleSpeech(
                                        msg.id,
                                        msg.answer?.shortAnswer.coreText || ''
                                      )
                                    }
                                    className="p-1 hover:text-amber-300 rounded hover:bg-slate-800 transition-colors"
                                    title="Listen to answer"
                                  >
                                    {activeSpeechId === msg.id ? (
                                      <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                    ) : (
                                      <Volume2 className="w-3.5 h-3.5" />
                                    )}
                                  </button>

                                  {/* Copy Button */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCopy(
                                        `${msg.answer?.shortAnswer.coreText}\n\n${msg.answer?.shortAnswer.simpleMeaning}\n\nSource: ${msg.answer?.shortAnswer.source}`,
                                        msg.id
                                      )
                                    }
                                    className="p-1 hover:text-amber-300 rounded hover:bg-slate-800 transition-colors"
                                    title="Copy answer"
                                  >
                                    {copiedId === msg.id ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* 5. SHORT ANSWERS (Default Display) */}
                              {!msg.isDetailedExpanded && msg.answer?.shortAnswer && (
                                <div className="space-y-2.5">
                                  <div className="text-slate-100 font-medium">
                                    <ReactMarkdown
                                      components={{
                                        strong: ({ node, ...props }) => (
                                          <strong className="text-amber-300 font-bold" {...props} />
                                        )
                                      }}
                                    >
                                      {msg.answer.shortAnswer.coreText}
                                    </ReactMarkdown>
                                  </div>

                                  <div className="p-2.5 rounded-xl bg-slate-900/80 border-l-2 border-amber-400 text-slate-300 text-xs">
                                    <span className="font-semibold text-amber-300 block mb-0.5">
                                      Simple meaning:
                                    </span>
                                    <span>{msg.answer.shortAnswer.simpleMeaning}</span>
                                  </div>

                                  {/* 7. SOURCE DISPLAY */}
                                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-start justify-between gap-2">
                                    <div>
                                      <span className="font-semibold text-amber-400/90">📚 Source: </span>
                                      <span>{msg.answer.shortAnswer.source}</span>
                                    </div>
                                    {msg.answer.shortAnswer.sourceUrl && (
                                      <a
                                        href={msg.answer.shortAnswer.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0 text-amber-400 hover:text-amber-300 inline-flex items-center space-x-0.5"
                                      >
                                        <span>View</span>
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    )}
                                  </div>

                                  {/* 5. Show Detailed Explanation Action Button */}
                                  <div className="pt-1">
                                    <button
                                      type="button"
                                      onClick={() => toggleDetailedExplanation(msg.id)}
                                      className="w-full py-1.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-sm active:scale-98"
                                    >
                                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                                      <span>📚 Show Detailed Explanation</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* 6. DETAILED MODE (When expanded) */}
                              {msg.isDetailedExpanded && msg.answer?.detailedAnswer && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="space-y-3 pt-1"
                                >
                                  {/* Relevant Law Highlight */}
                                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                                    <span className="font-semibold text-amber-300 block mb-0.5">
                                      Relevant Statutory Law & Article:
                                    </span>
                                    <span className="text-slate-200">
                                      {msg.answer.detailedAnswer.relevantLaw}
                                    </span>
                                  </div>

                                  {/* Full Explanation */}
                                  <div className="text-xs text-slate-200 leading-relaxed">
                                    <span className="font-semibold text-amber-300 block mb-1">
                                      Full Explanation:
                                    </span>
                                    <div className="prose prose-invert prose-xs max-w-none">
                                      <ReactMarkdown>{msg.answer.detailedAnswer.fullExplanation}</ReactMarkdown>
                                    </div>
                                  </div>

                                  {/* Conditions & Elements */}
                                  {msg.answer.detailedAnswer.conditions?.length > 0 && (
                                    <div className="text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                                      <span className="font-semibold text-amber-300 block mb-1">
                                        Statutory Conditions & Elements:
                                      </span>
                                      <ul className="list-disc pl-4 space-y-1 text-slate-300">
                                        {msg.answer.detailedAnswer.conditions.map((cond, i) => (
                                          <li key={i}>{cond}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Exceptions */}
                                  {msg.answer.detailedAnswer.exceptions?.length > 0 && (
                                    <div className="text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                                      <span className="font-semibold text-rose-300 block mb-1">
                                        Exceptions & Statutory Defenses:
                                      </span>
                                      <ul className="list-disc pl-4 space-y-1 text-slate-300">
                                        {msg.answer.detailedAnswer.exceptions.map((exc, i) => (
                                          <li key={i}>{exc}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Examples */}
                                  {msg.answer.detailedAnswer.examples?.length > 0 && (
                                    <div className="text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                                      <span className="font-semibold text-emerald-300 block mb-1">
                                        Practical Examples / Landmark Precedents:
                                      </span>
                                      <ul className="list-disc pl-4 space-y-1 text-slate-300">
                                        {msg.answer.detailedAnswer.examples.map((ex, i) => (
                                          <li key={i}>{ex}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Sources & Citations Box */}
                                  <div className="pt-2 border-t border-slate-800 text-xs">
                                    <span className="font-semibold text-amber-400 block mb-1.5">
                                      Authoritative Sources & Citations:
                                    </span>
                                    <div className="space-y-1">
                                      {msg.answer.detailedAnswer.sources.map((src, i) => (
                                        <div
                                          key={i}
                                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]"
                                        >
                                          <div>
                                            <span className="text-slate-200 font-medium">{src.name}</span>
                                            <span className="text-slate-400 block text-[10px]">
                                              {src.citation}
                                            </span>
                                          </div>
                                          {src.url && (
                                            <a
                                              href={src.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-amber-400 hover:text-amber-300 px-2 py-0.5 rounded bg-slate-800 text-[10px] flex items-center space-x-1"
                                            >
                                              <span>View Source</span>
                                              <ExternalLink className="w-2.5 h-2.5" />
                                            </a>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                    <div className="mt-1.5 text-[10px] text-slate-500">
                                      Version / Date: {msg.answer.detailedAnswer.dateOrVersion}
                                    </div>
                                  </div>

                                  {/* Back to Short Answer Action Button */}
                                  <div className="pt-1">
                                    <button
                                      type="button"
                                      onClick={() => toggleDetailedExplanation(msg.id)}
                                      className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs transition-colors flex items-center justify-center space-x-1"
                                    >
                                      <span>← Back to Short Answer</span>
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Timestamp */}
                        <span className="text-[10px] text-slate-500 px-1">
                          {msg.timestamp}
                        </span>
                      </div>
                    );
                  })}

                  {/* 8. TYPING ANIMATION */}
                  {isLoading && (
                    <div className="flex items-start space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                        <Scale className="w-4 h-4 animate-spin" />
                      </div>
                      <div className="bg-[#141b27] border border-slate-800 rounded-2xl rounded-tl-xs p-3 text-xs text-slate-300 flex items-center space-x-2 shadow-sm">
                        <span className="text-amber-300 font-medium flex items-center space-x-1.5">
                          <Scale className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span>
                            {isResearchMode
                              ? 'LegalAI is researching statutory records...'
                              : '⚖️ LegalAI is checking legal sources...'}
                          </span>
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* 11. Attached Document Preview Box */}
                {attachedFile && (
                  <div className="mx-3 my-1 p-2.5 rounded-xl bg-slate-900 border border-amber-500/40 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1.5 text-amber-300 font-semibold truncate">
                        <FileText className="w-4 h-4 text-amber-400" />
                        <span className="truncate">{attachedFile.fileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedFile(null)}
                        className="text-slate-400 hover:text-rose-400 p-0.5"
                        title="Remove file"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-300 space-y-0.5 pl-5">
                      <div className="font-medium text-slate-200">LegalAI can:</div>
                      <div className="text-emerald-400">✓ Summarize it</div>
                      <div className="text-emerald-400">✓ Explain legal terminology</div>
                      <div className="text-emerald-400">✓ Identify important clauses</div>
                      <div className="text-emerald-400">✓ Answer questions about the document</div>
                    </div>
                  </div>
                )}

                {/* Input Controls Bar */}
                <div className="p-3 bg-[#121824] border-t border-slate-800 shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center space-x-1.5"
                  >
                    {/* File Upload Button (PDF, DOCX, TXT) */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.doc,.txt,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="floating-file-input"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-xl transition-colors shrink-0"
                      title="Upload PDF, DOCX, TXT or photo"
                      aria-label="Upload document"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    {/* Voice Input Button */}
                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      className={`p-2 rounded-xl transition-colors shrink-0 ${
                        isListening
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 animate-pulse'
                          : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
                      }`}
                      title={isListening ? 'Stop listening' : 'Voice search (EN, HI, TE)'}
                      aria-label="Toggle voice input"
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    {/* Text Input */}
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={
                        isListening
                          ? 'Listening...'
                          : language === 'hi'
                          ? 'कानूनी प्रश्न टाइप करें...'
                          : language === 'te'
                          ? 'చట్టపరమైన ప్రశ్నను టైప్ చేయండి...'
                          : 'Type your legal question...'
                      }
                      className="flex-1 bg-slate-900 border border-slate-800 focus:border-amber-500/60 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
                      disabled={isLoading}
                    />

                    {/* Send Button */}
                    <button
                      type="submit"
                      disabled={isLoading || (!inputText.trim() && !attachedFile)}
                      className="p-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 rounded-xl font-bold transition-all shadow-md active:scale-95 shrink-0"
                      title="Send question"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </form>

                  {/* 18. TRUST AND DISCLAIMER */}
                  <div className="mt-2 text-[9px] text-center text-slate-500 leading-tight">
                    LegalAI provides general legal information, not professional legal advice. For important legal matters, consult a qualified legal professional.
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
