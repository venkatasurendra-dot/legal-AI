import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Mic, 
  MicOff, 
  Paperclip, 
  Sparkles, 
  BookOpen, 
  Scale, 
  ShieldAlert, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  RotateCcw,
  Compass,
  AlertTriangle,
  Info,
  Clock,
  HelpCircle,
  FileSearch,
  Camera,
  Image as ImageIcon,
  X,
  Eye,
  Maximize2,
  Volume2,
  Landmark,
  Gavel,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, LanguageCode, LegalStatus } from '../types';
import { CameraCaptureModal } from '../components/CameraCaptureModal';
import { ImagePreviewModal } from '../components/ImagePreviewModal';
import { AudioSpeechControls } from '../components/AudioSpeechControls';

interface ChatViewProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  initialQuery?: string;
  onNavigate: (view: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  language,
  setLanguage,
  initialQuery,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      content: `### Welcome to LegalAI India
I am your AI legal information and research assistant for the Indian legal system.

You can ask questions regarding:
- **Constitution of India** (Articles 14, 19, 21, 32, 226, Preamble, Amendments, Basic Structure)
- **Criminal Laws** (New 2024 codes: BNS, BNSS, BSA vs historical IPC, CrPC, Evidence Act)
- **Commercial & Civil Enactments** (Contract Act, NI Act Section 138, DPDP 2023, Consumer Protection)
- **Court Procedures** (16-digit CNR tracking, Regular & Anticipatory Bail, e-Filing, Free Legal Aid under NALSA)
- **Advocate Guidelines** (BCI ethics, AIBE exam, becoming an advocate in India)
- **Legal vs. Illegal Questions** (Objective statutory assessment without declaring guilt or innocence)

🎙️ **Multimodal Capabilities**:
- **Microphone / Voice Input**: Speak your legal questions in English, Hindi, or Telugu.
- **Audio Output / Speech Reader**: Click "Listen" on any answer to hear clear spoken explanations.
- **Photos & Document Scans**: Upload contracts, notices, summons, or deeds for statutory clause review.
- **Live Camera**: Capture documents or photo evidence directly from your device.

*Select a mode below, type, speak, or snap a photo of a document to begin.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'standard',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<'standard' | 'research' | 'legal-vs-illegal'>('standard');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // File & multimodal states
  const [attachedSnippet, setAttachedSnippet] = useState<string | null>(null);
  const [attachedImage, setAttachedImage] = useState<{
    data: string;
    mimeType: string;
    fileName?: string;
  } | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Modals & controllers
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; name?: string } | null>(null);
  const [activeAudioPlayingId, setActiveAudioPlayingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // If initialQuery is provided on view mount, trigger submission
  useEffect(() => {
    if (initialQuery && initialQuery.trim().length > 0) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingSeconds(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  // Voice Input Speech Recognition
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type your query or attach text/photos.');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        setIsRecording(false);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        transcript = transcript.trim();
        if (transcript) {
          setInputPrompt(transcript);
        }
      };

      recognition.start();
    } catch (e) {
      console.error('Speech recognition initiation error:', e);
      setIsRecording(false);
    }
  };

  // Handle Text/Document File upload (TXT, PDF excerpt)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if image
    if (file.type.startsWith('image/')) {
      processImageFile(file);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setAttachedSnippet(`[Attached Document: ${file.name}]\n${text.slice(0, 3000)}...`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Handle Photo/Image File upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
    e.target.value = '';
  };

  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAttachedImage({
          data: dataUrl,
          mimeType: file.type || 'image/jpeg',
          fileName: file.name,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        processImageFile(file);
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const text = ev.target?.result as string;
          if (text) {
            setAttachedSnippet(`[Attached Document: ${file.name}]\n${text.slice(0, 3000)}...`);
          }
        };
        reader.readAsText(file);
      }
    }
  };

  // Camera capture callback
  const handleCameraCapture = (imageDataUrl: string, fileName: string) => {
    setAttachedImage({
      data: imageDataUrl,
      mimeType: 'image/jpeg',
      fileName: fileName,
    });
  };

  const handleSendMessage = async (queryText?: string) => {
    const query = (queryText || inputPrompt).trim();
    if (!query && !attachedSnippet && !attachedImage) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    let fullMessage = query;
    if (attachedSnippet) {
      fullMessage = fullMessage ? `${fullMessage}\n\n${attachedSnippet}` : attachedSnippet;
    }

    const currentImage = attachedImage;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: fullMessage || (currentImage ? `[Attached Photo / Document: ${currentImage.fileName || 'Legal Document'}]` : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: chatMode,
      attachedImage: currentImage ? { ...currentImage } : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setAttachedSnippet(null);
    setAttachedImage(null);
    setIsLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome-msg')
        .slice(-6)
        .map((m) => ({
          role: m.sender,
          content: m.content,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: fullMessage,
          history: historyPayload,
          language,
          mode: chatMode,
          image: currentImage ? {
            data: currentImage.data,
            mimeType: currentImage.mimeType,
            fileName: currentImage.fileName,
          } : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourcesCited: data.sources || [],
        clarifyingQuestions: data.clarifyingQuestions || [],
        mode: chatMode,
        language,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat send error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        content: `### Service Notice\nUnable to complete retrieval query at this moment. Please check your network connection or verify your query.\n\n*Error details: ${err.message}*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportTranscript = () => {
    const transcript = messages
      .map((m) => `[${m.timestamp}] ${m.sender.toUpperCase()}:\n${m.content}\n\n`)
      .join('---\n\n');
    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LegalAI-Transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
  };

  const starterCards = [
    {
      title: 'Constitutional Rights & Writs',
      badge: 'Supreme Law',
      desc: 'Article 21 Right to Privacy, Article 32 & 226 Writs, and Basic Structure Doctrine under Kesavananda Bharati.',
      icon: Landmark,
      label: 'Article 21 & Privacy Precedents',
      query: 'Explain Article 21 and the landmark Puttaswamy privacy judgment under Indian constitutional law.',
    },
    {
      title: 'New Criminal Laws (BNS 2024)',
      badge: 'BNS 2024 Enacted',
      desc: 'Anticipatory bail under Section 482 BNSS, Zero FIRs, electronic summons, and BNS 2023 transition from IPC.',
      icon: BookOpen,
      label: 'Anticipatory Bail under BNSS',
      query: 'How does anticipatory bail work under Section 482 of Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)?',
    },
    {
      title: 'Cheque Bounce & Commercial Notices',
      badge: 'Section 138 NI Act',
      desc: '15-day statutory demand notice requirements, 30-day filing limits, and evidence under Section 139 presumption.',
      icon: Gavel,
      label: 'Sec 138 Notice Protocol',
      query: 'What are the required legal components and timelines for a Section 138 NI Act cheque bounce notice in India?',
    },
    {
      title: 'Objective Legal vs. Illegal Assessment',
      badge: 'Compliance & Rights',
      desc: 'Statutory assessment of call recording, employee non-compete clauses, tenant eviction, and cyber law without bias.',
      icon: ShieldAlert,
      label: 'Is Recording Calls Legal?',
      query: 'Is this legal in India: recording phone calls without informing or getting consent from the other party?',
    },
  ];

  const quickPrompts = [
    { label: 'Article 21 & Privacy', query: 'Explain Article 21 and the landmark Puttaswamy judgment.' },
    { label: 'Anticipatory Bail BNSS', query: 'How does anticipatory bail work under Section 482 of BNSS 2023?' },
    { label: 'Cheque Bounce Sec 138', query: 'What is the procedure and timeline for Section 138 NI Act cheque bounce?' },
    { label: 'Is Recording Calls Legal?', query: 'Is this legal: recording phone conversations in India without informing the other person?' },
    { label: 'Analyze Legal Notice', query: 'What are the required legal components of a statutory legal notice under Indian law?' },
  ];

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 flex flex-col bg-[#0f141c] text-slate-100 h-[calc(100vh-4rem)] max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 relative ${
        isDraggingOver ? 'ring-2 ring-amber-500/80' : ''
      }`}
    >
      {/* Drag & drop overlay indicator */}
      {isDraggingOver && (
        <div className="absolute inset-4 z-40 bg-amber-500/10 border-2 border-dashed border-amber-400 rounded-2xl flex flex-col items-center justify-center pointer-events-none backdrop-blur-xs">
          <ImageIcon className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
          <p className="text-base font-semibold text-slate-100">Drop Legal Document Photo Here</p>
          <p className="text-xs text-slate-300">Upload agreement, legal notice, summons, or evidence photo</p>
        </div>
      )}

      {/* Header bar: Mode Selectors & Controls */}
      <div className="bg-[#131924] border border-slate-800 rounded-2xl p-3 mb-3 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        {/* Mode Buttons */}
        <div className="flex items-center space-x-1.5 text-xs">
          <span className="text-slate-400 text-[11px] font-medium hidden sm:inline mr-1">Mode:</span>
          <button
            id="mode-standard"
            onClick={() => setChatMode('standard')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
              chatMode === 'standard'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Standard Assistant</span>
          </button>

          <button
            id="mode-research"
            onClick={() => setChatMode('research')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
              chatMode === 'research'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Legal Research</span>
          </button>

          <button
            id="mode-legal-vs-illegal"
            onClick={() => setChatMode('legal-vs-illegal')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
              chatMode === 'legal-vs-illegal'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Legal vs Illegal</span>
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            id="btn-export-chat"
            onClick={handleExportTranscript}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors flex items-center space-x-1 text-[11px]"
            title="Download conversation transcript"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export</span>
          </button>

          <button
            id="btn-clear-chat"
            onClick={() => {
              if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
              setActiveAudioPlayingId(null);
              setMessages([messages[0]]);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-slate-800 transition-colors flex items-center space-x-1 text-[11px]"
            title="Clear current session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Message Thread Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 rounded-2xl p-3 sm:p-4 bg-[#0c1017] border border-slate-800/80">
        {/* If only the initial welcome message exists, render the attractive Concierge Welcome Screen */}
        {messages.length === 1 && messages[0].id === 'welcome-msg' ? (
          <div className="py-4 sm:py-6 px-2 sm:px-4 max-w-4xl mx-auto w-full text-center">
            {/* Top Amber Crest & Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Constitutional & Statutory Legal Intelligence</span>
            </div>

            {/* Main Welcome Heading */}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight mb-2">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">LegalAI India</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6 font-normal">
              Your authoritative, multilingual assistant for Indian jurisprudence, Bharatiya Nyaya Sanhita (BNS 2024), court procedure, and multimodal document verification.
            </p>

            {/* Quick Action Multimodal Shortcuts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto mb-7">
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="flex items-center justify-center space-x-2 p-2.5 rounded-xl bg-[#131924] hover:bg-[#1a2333] border border-slate-800 hover:border-amber-500/50 text-slate-200 hover:text-amber-300 transition-all text-xs font-medium shadow-sm group"
              >
                <Camera className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Live Camera Scan</span>
              </button>

              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="flex items-center justify-center space-x-2 p-2.5 rounded-xl bg-[#131924] hover:bg-[#1a2333] border border-slate-800 hover:border-amber-500/50 text-slate-200 hover:text-amber-300 transition-all text-xs font-medium shadow-sm group"
              >
                <ImageIcon className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Upload Document</span>
              </button>

              <button
                type="button"
                onClick={handleToggleVoice}
                className="flex items-center justify-center space-x-2 p-2.5 rounded-xl bg-[#131924] hover:bg-[#1a2333] border border-slate-800 hover:border-amber-500/50 text-slate-200 hover:text-amber-300 transition-all text-xs font-medium shadow-sm group"
              >
                <Mic className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Voice Query (3 Langs)</span>
              </button>

              <button
                type="button"
                onClick={() => setChatMode('legal-vs-illegal')}
                className="flex items-center justify-center space-x-2 p-2.5 rounded-xl bg-[#131924] hover:bg-[#1a2333] border border-slate-800 hover:border-amber-500/50 text-slate-200 hover:text-amber-300 transition-all text-xs font-medium shadow-sm group"
              >
                <ShieldAlert className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Legal vs Illegal Check</span>
              </button>
            </div>

            {/* 4 Bento Category Starter Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-3xl mx-auto mb-6">
              {starterCards.map((card, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSendMessage(card.query)}
                  className="p-4 rounded-2xl bg-[#131924] hover:bg-[#161f2e] border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/5 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                        <card.icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        {card.badge}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-100 text-sm mb-1 group-hover:text-amber-200 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {card.desc}
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-medium text-amber-400 group-hover:text-amber-300 space-x-1 pt-2 border-t border-slate-800/80">
                    <span>Ask: "{card.label}"</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            {/* Collapsible Full Statutory Scope & Instructions */}
            <details className="text-left max-w-3xl mx-auto rounded-xl bg-[#131924]/60 border border-slate-800 p-3 text-xs text-slate-300 group">
              <summary className="cursor-pointer font-medium text-amber-300/90 hover:text-amber-200 flex items-center justify-between list-none">
                <span className="flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>View Full Statutory Scope & Multimodal Capabilities</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="mt-3 pt-3 border-t border-slate-800/80 prose prose-invert prose-xs max-w-none space-y-2 text-slate-300">
                <ReactMarkdown>{messages[0].content}</ReactMarkdown>
              </div>
            </details>

            {/* Statutory Grounding Trust Badges */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Bharatiya Nyaya Sanhita (BNS 2024) Grounded</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Constitution Articles 1–395 & Landmark Benches</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Objective Educational & Research Verification</span>
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 shadow-sm">
                    <Scale className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-3xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-md ${
                    isUser
                      ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-medium ml-8 sm:ml-12 rounded-tr-xs shadow-amber-500/10'
                      : 'bg-[#131924] text-slate-100 border border-slate-800/90 mr-4 sm:mr-8 rounded-tl-xs'
                  }`}
                >
                  {/* Message Header */}
                  <div className="flex items-center justify-between gap-3 mb-2.5 pb-2 border-b border-white/10 text-[11px]">
                    <div className="flex items-center space-x-2">
                      <span className={`font-semibold ${isUser ? 'text-slate-950 font-bold' : 'text-amber-400 font-serif'}`}>
                        {isUser ? 'You' : 'LegalAI Assistant'}
                      </span>
                      {!isUser && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold tracking-wide">
                          BNS 2024
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={isUser ? 'text-slate-800/80 font-medium' : 'text-slate-400'}>
                        {msg.timestamp}
                      </span>

                      {/* Audio Listen Controller on Assistant answers */}
                      {!isUser && (
                        <AudioSpeechControls
                          textToSpeak={msg.content}
                          messageId={msg.id}
                          language={msg.language || language}
                          activePlayingId={activeAudioPlayingId}
                          setActivePlayingId={setActiveAudioPlayingId}
                        />
                      )}

                      {!isUser && (
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                          title="Copy answer"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Attached Photo Display in User Message */}
                  {msg.attachedImage && (
                    <div className="mb-3 p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-slate-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-medium text-amber-300 flex items-center space-x-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                          <span className="truncate max-w-[200px]">{msg.attachedImage.fileName || 'Attached Legal Document'}</span>
                        </span>
                        <button
                          onClick={() => setPreviewImage({ url: msg.attachedImage!.data, name: msg.attachedImage!.fileName })}
                          className="text-[10px] text-slate-300 hover:text-white flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>Inspect Full Size</span>
                        </button>
                      </div>
                      <div 
                        onClick={() => setPreviewImage({ url: msg.attachedImage!.data, name: msg.attachedImage!.fileName })}
                        className="cursor-pointer group relative rounded-lg overflow-hidden border border-slate-800 max-h-52 flex items-center justify-center bg-black/60"
                      >
                        <img
                          src={msg.attachedImage.data}
                          alt={msg.attachedImage.fileName || 'Attached legal document'}
                          className="max-h-52 w-auto object-contain transition-transform group-hover:scale-102"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-3 py-1.5 rounded-full bg-slate-900/95 text-amber-300 text-xs font-medium flex items-center space-x-1.5 shadow-lg border border-amber-500/30">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Click to Zoom Document</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="prose prose-invert prose-xs max-w-none space-y-2">
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => (
                          <h1 className={`font-serif font-bold text-base sm:text-lg mt-3 mb-1.5 ${isUser ? 'text-slate-950' : 'text-amber-200'}`} {...props} />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 className={`font-serif font-bold text-sm sm:text-base mt-3 mb-1.5 ${isUser ? 'text-slate-950' : 'text-amber-300'}`} {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 className={`font-serif font-bold text-xs sm:text-sm mt-3 mb-1 border-l-2 ${isUser ? 'border-slate-950 text-slate-950 pl-2' : 'border-amber-400 text-amber-300 pl-2'}`} {...props} />
                        ),
                        p: ({ node, ...props }) => <p className="mb-2 leading-relaxed text-xs sm:text-sm" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1 text-xs sm:text-sm" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2 space-y-1 text-xs sm:text-sm" {...props} />,
                        li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                        strong: ({ node, ...props }) => <strong className={`font-semibold ${isUser ? 'text-slate-950 font-bold' : 'text-amber-100'}`} {...props} />,
                        blockquote: ({ node, ...props }) => (
                          <blockquote className={`border-l-2 my-2 py-1 px-3 rounded-r-lg text-xs italic ${isUser ? 'border-slate-900 bg-black/10 text-slate-900' : 'border-amber-500/50 bg-amber-500/5 text-slate-200'}`} {...props} />
                        ),
                        code: ({ node, inline, ...props }: any) => (
                          <code className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${isUser ? 'bg-black/20 text-slate-950' : 'bg-slate-900/90 text-amber-300 border border-slate-800'}`} {...props} />
                        ),
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-2 rounded-lg border border-slate-800">
                            <table className="min-w-full divide-y divide-slate-800 text-left text-xs" {...props} />
                          </div>
                        ),
                        th: ({ node, ...props }) => <th className="bg-slate-900 px-2.5 py-1.5 font-semibold text-amber-300" {...props} />,
                        td: ({ node, ...props }) => <td className="px-2.5 py-1.5 border-t border-slate-800 text-slate-200" {...props} />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>

                  {/* Clarifying Questions if returned */}
                  {msg.clarifyingQuestions && msg.clarifyingQuestions.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-xs">
                      <div className="flex items-center space-x-1.5 text-amber-300 font-semibold mb-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Clarifying Questions for Specific Legal Assessment:</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-slate-300">
                        {msg.clarifyingQuestions.map((cq, idx) => (
                          <li key={idx}>
                            <button
                              onClick={() => {
                                setInputPrompt(cq);
                              }}
                              className="text-left hover:text-amber-200 underline decoration-slate-600 hover:decoration-amber-400 transition-colors"
                            >
                              {cq}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Retrieved Sources Badges */}
                  {msg.sourcesCited && msg.sourcesCited.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/60">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Authoritative Sources Cited:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sourcesCited.map((src, i) => (
                          <a
                            key={i}
                            href={src.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors space-x-1"
                          >
                            <span>{src.title}</span>
                            {src.status && (
                              <span className={`text-[9px] px-1 rounded ${
                                src.status === 'REPEALED' ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'
                              }`}>
                                {src.status}
                              </span>
                            )}
                            <ExternalLink className="w-2.5 h-2.5 ml-1 opacity-70" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Scale className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-[#141a26] border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 space-y-2 rounded-tl-none">
              <div className="flex items-center space-x-2 text-amber-400">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span className="font-semibold text-xs">Querying Knowledge Base & Analyzing Multimodal Input...</span>
              </div>
              <p className="text-[11px] text-slate-400">Cross-referencing Constitution, BNS 2023, BNSS, and Supreme Court precedent...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested quick pills when message count is low */}
      {messages.length <= 2 && (
        <div className="py-2 flex items-center space-x-2 overflow-x-auto text-[11px] text-slate-400">
          <span className="shrink-0 text-amber-400/80 font-medium">Quick Queries:</span>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(qp.query)}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 shrink-0 transition-colors"
            >
              {qp.label}
            </button>
          ))}
        </div>
      )}

      {/* Attached Photo Thumbnail Preview in Input Bar */}
      {attachedImage && (
        <div className="bg-[#161e2d] border border-amber-500/50 rounded-xl p-2 text-xs flex items-center justify-between text-slate-200 my-1.5 shadow-md">
          <div className="flex items-center space-x-2.5 truncate mr-2">
            <div 
              onClick={() => setPreviewImage({ url: attachedImage.data, name: attachedImage.fileName })}
              className="w-10 h-10 rounded-lg overflow-hidden border border-slate-700 cursor-pointer bg-black/60 shrink-0 relative group"
            >
              <img
                src={attachedImage.data}
                alt="Document preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Eye className="w-3.5 h-3.5 text-amber-300" />
              </div>
            </div>
            <div className="truncate">
              <span className="font-medium text-slate-100 truncate block text-xs">
                {attachedImage.fileName || 'Captured Legal Photo'}
              </span>
              <span className="text-[10px] text-amber-400/80">
                Ready for AI statutory & clause analysis
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => setPreviewImage({ url: attachedImage.data, name: attachedImage.fileName })}
              className="text-slate-400 hover:text-amber-300 text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Inspect
            </button>
            <button
              type="button"
              onClick={() => setAttachedImage(null)}
              className="text-rose-400 hover:text-rose-300 text-xs font-medium px-2 py-1 rounded hover:bg-rose-950/40 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Attached text snippet preview if file loaded */}
      {attachedSnippet && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-2 text-xs flex items-center justify-between text-slate-300 my-1">
          <span className="truncate max-w-lg">{attachedSnippet.split('\n')[0]}</span>
          <button
            onClick={() => setAttachedSnippet(null)}
            className="text-rose-400 hover:text-rose-300 text-xs ml-2 font-bold"
          >
            Remove
          </button>
        </div>
      )}

      {/* Live Voice Recording Bar Indicator */}
      {isRecording && (
        <div className="bg-rose-950/80 border border-rose-600/50 rounded-xl px-3 py-2 text-xs flex items-center justify-between text-rose-200 my-1 animate-pulse">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-semibold text-rose-300">Listening to voice query...</span>
            <span className="text-[11px] text-rose-300/80 font-mono">
              ({Math.floor(recordingSeconds / 60)}:{('0' + (recordingSeconds % 60)).slice(-2)})
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Speaking in {language === 'hi' ? 'Hindi (हिंदी)' : language === 'te' ? 'Telugu (తెలుగు)' : 'English'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleToggleVoice}
              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-medium transition-colors"
            >
              Done Speaking
            </button>
          </div>
        </div>
      )}

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-2 bg-[#131924] border border-slate-800 focus-within:border-amber-500 rounded-2xl p-2 flex items-center space-x-2 shadow-lg transition-all"
      >
        {/* Hidden Document File Input (TXT, DOC, PDF) */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".txt,.pdf,.doc,.docx,image/*"
          className="hidden"
        />

        {/* Hidden Photo/Image File Input */}
        <input
          type="file"
          ref={imageInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        {/* 1. Camera Button */}
        <button
          type="button"
          onClick={() => setIsCameraOpen(true)}
          className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-colors shrink-0"
          title="Live Camera: Snap Document or Photo Evidence"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* 2. Photo / Image Upload Button */}
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-colors shrink-0"
          title="Upload Photo / Scan of Legal Document (JPG, PNG, WEBP)"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        {/* 3. Document Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-colors shrink-0"
          title="Attach Text or Legal Document File"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* 4. Microphone Voice Input Button */}
        <button
          type="button"
          onClick={handleToggleVoice}
          className={`p-2 rounded-xl transition-colors shrink-0 ${
            isRecording 
              ? 'bg-rose-500/30 text-rose-400 border border-rose-500/50 animate-pulse' 
              : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
          }`}
          title={isRecording ? 'Click to stop voice recording' : `Voice Input (${language === 'hi' ? 'Hindi' : language === 'te' ? 'Telugu' : 'English'})`}
        >
          {isRecording ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Text Input Prompt */}
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={
            attachedImage
              ? 'Describe your question about this photo/document (or press Send for statutory review)...'
              : chatMode === 'legal-vs-illegal'
              ? 'Describe the situation ("Is it legal if someone does...?")'
              : chatMode === 'research'
              ? 'Enter research topic or legal citation (e.g. Article 21, Section 103 BNS)...'
              : 'Ask an educational question on Indian law, courts, or Constitution...'
          }
          className="flex-1 bg-transparent px-2 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={isLoading || (!inputPrompt.trim() && !attachedSnippet && !attachedImage)}
          className={`p-2.5 rounded-xl font-semibold transition-all shrink-0 ${
            isLoading || (!inputPrompt.trim() && !attachedSnippet && !attachedImage)
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
          }`}
          title="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Prompts Pills Bar */}
      <div className="mt-2 flex items-center gap-1.5 overflow-x-auto py-1 text-[11px]">
        <span className="text-slate-400 font-medium shrink-0 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span className="hidden sm:inline">Quick Inquiries:</span>
        </span>
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSendMessage(qp.query)}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-all font-medium"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Image Inspection / Lightbox Modal */}
      <ImagePreviewModal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage?.url || null}
        fileName={previewImage?.name}
      />
    </div>
  );
};
