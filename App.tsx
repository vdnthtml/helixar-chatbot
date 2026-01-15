import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Message, ChatSession, ModelType } from './types';
import { mockChatHistory } from './data/mockChatHistory';
import { mockDevChat } from './data/mockDevChat';
import { mockDesignChat } from './data/mockDesignChat';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { PricingModal } from './components/PricingModal';
import { SearchOverlay } from './components/SearchOverlay';
import { ShareModal } from './components/ShareModal';
import { SettingsModal, SettingsSection } from './components/SettingsModal';
import { GroupChatModal, GroupLinkModal } from './components/GroupModals';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [tempSession, setTempSession] = useState<ChatSession | null>(null); // Transient session state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.FLASH);
  const [showTopMenu, setShowTopMenu] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<SettingsSection>('appearance');
  const [isTemporaryMode, setIsTemporaryMode] = useState(false);

  // Group Chat State
  const [isGroupInitModalOpen, setIsGroupInitModalOpen] = useState(false);
  const [isGroupLinkModalOpen, setIsGroupLinkModalOpen] = useState(false);

  // Theme and Accent State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [accentColor, setAccentColor] = useState('#b33a72');

  const scrollRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const modelMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('helixar_sessions');
    const savedTheme = localStorage.getItem('helixar_theme') as 'dark' | 'light';
    const savedAccent = localStorage.getItem('helixar_accent');

    if (savedTheme) setTheme(savedTheme);
    if (savedAccent) setAccentColor(savedAccent);

    if (saved) {
      const parsed = JSON.parse(saved);

      // Inject Mock Session if not present
      const mockId = 'mock-validation-sprint';
      const devMockId = 'mock-dev-architect';

      let newSessions: ChatSession[] = [...parsed];
      let needsUpdate = false;

      if (!newSessions.find((s: ChatSession) => s.id === mockId)) {
        const mockSession: ChatSession = {
          id: mockId,
          title: 'Validation Sprint',
          messages: mockChatHistory,
          updatedAt: 1705290045000,
          isGroup: false
        };
        newSessions.unshift(mockSession);
        needsUpdate = true;
      }

      if (!newSessions.find((s: ChatSession) => s.id === devMockId)) {
        const devSession: ChatSession = {
          id: devMockId,
          title: 'Full Stack Arch',
          messages: mockDevChat,
          updatedAt: 1705300090000,
          isGroup: false
        };
        newSessions.unshift(devSession);
        needsUpdate = true;
      }

      const designMockId = 'mock-ui-design';
      if (!newSessions.find((s: ChatSession) => s.id === designMockId)) {
        const designSession: ChatSession = {
          id: designMockId,
          title: 'Neon UI Concept',
          messages: mockDesignChat,
          updatedAt: 1705310090000,
          isGroup: false
        };
        newSessions.unshift(designSession);
        needsUpdate = true;
      }

      setSessions(newSessions);
      if (parsed.length > 0) setCurrentSessionId(parsed[0].id);
      else createNewSession();
    } else {
      // Create with mock sessions
      const mockSession: ChatSession = {
        id: 'mock-validation-sprint',
        title: 'Validation Sprint',
        messages: mockChatHistory,
        updatedAt: 1705290045000,
        isGroup: false
      };

      const devSession: ChatSession = {
        id: 'mock-dev-architect',
        title: 'Full Stack Arch',
        messages: mockDevChat,
        updatedAt: 1705300090000,
        isGroup: false
      };

      const designSession: ChatSession = {
        id: 'mock-ui-design',
        title: 'Neon UI Concept',
        messages: mockDesignChat,
        updatedAt: 1705310090000,
        isGroup: false
      };

      setSessions([designSession, devSession, mockSession]);
      setCurrentSessionId(designSession.id);
    }
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('helixar_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) setShowTopMenu(false);
      if (modelMenuRef.current && !modelMenuRef.current.contains(target)) setShowModelMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.className = theme === 'light' ? 'theme-light' : '';
    localStorage.setItem('helixar_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
    localStorage.setItem('helixar_accent', accentColor);
  }, [accentColor]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sessions, tempSession, isTyping]);

  const currentSession = currentSessionId === tempSession?.id ? tempSession : sessions.find(s => s.id === currentSessionId);

  const createNewSession = () => {
    // Check if we are already in a fresh temp session
    if (currentSessionId === tempSession?.id && tempSession?.messages.length === 0) return;

    // Check if current persistent session is empty (optional optimization)
    // if (currentSession && currentSession.messages.length === 0) return;

    const newSession: ChatSession = {
      id: Math.random().toString(36).substring(7),
      title: 'New chat',
      messages: [],
      updatedAt: Date.now(),
      isGroup: false
    };

    setTempSession(newSession);
    setCurrentSessionId(newSession.id);
  };

  const deleteSession = (id: string) => {
    if (id === tempSession?.id) {
      setTempSession(null);
      setCurrentSessionId(sessions.length > 0 ? sessions[0].id : null);
      if (sessions.length === 0) setTimeout(createNewSession, 0); // Ensure there's always a chat state
      return;
    }

    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (currentSessionId === id) {
        setCurrentSessionId(filtered.length > 0 ? filtered[0].id : null);
        if (filtered.length === 0) setTimeout(createNewSession, 0);
      }
      return filtered;
    });
  };

  const renameSession = (id: string, newTitle: string) => {
    if (id === tempSession?.id) {
      setTempSession(prev => prev ? { ...prev, title: newTitle } : null);
    } else {
      setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
    }
  };

  const openSearch = () => setIsSearchOpen(true);
  const openSettings = (section: SettingsSection) => {
    setSettingsSection(section);
    setIsSettingsOpen(true);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !currentSessionId) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    // If we are sending in the temp session, promote it to persistent sessions
    if (currentSessionId === tempSession?.id) {
      const promotedSession = {
        ...tempSession,
        title: text.substring(0, 30) + (text.length > 30 ? '...' : ''),
        messages: [userMsg],
        updatedAt: Date.now()
      };

      setSessions(prev => [promotedSession, ...prev]);
      setTempSession(null); // Clear temp session as it's now persistent
    } else {
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          const newTitle = s.messages.length === 0 ? text.substring(0, 30) + (text.length > 30 ? '...' : '') : s.title;
          return {
            ...s,
            title: newTitle,
            messages: [...s.messages, userMsg],
            updatedAt: Date.now()
          };
        }
        return s;
      }));
    }

    await triggerModelResponse(text);
  };

  const triggerModelResponse = async (promptText: string) => {
    if (!currentSessionId) return;
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: promptText,
        config: { systemInstruction: "You are Helixar, a professional AI creative workspace. Provide concise, helpful answers." }
      });

      const aiMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: response.text || "I'm sorry, I couldn't generate a response.",
        timestamp: Date.now()
      };

      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, aiMsg] };
        }
        return s;
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRegenerate = useCallback(async (messageId: string) => {
    if (!currentSessionId || isTyping) return;
    const session = sessions.find(s => s.id === currentSessionId);
    if (!session) return;
    const msgIndex = session.messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;
    let lastPrompt = "";
    for (let i = msgIndex; i >= 0; i--) { if (session.messages[i].role === 'user') { lastPrompt = session.messages[i].content; break; } }
    if (!lastPrompt) return;
    setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: s.messages.slice(0, msgIndex) } : s));
    await triggerModelResponse(lastPrompt);
  }, [currentSessionId, sessions, isTyping, selectedModel]);

  const convertToGroupChat = () => {
    if (!currentSessionId) return;
    const newGroupLink = `https://helixar.ai/gg/${Math.random().toString(36).substring(7)}`;
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          isGroup: true,
          groupLink: newGroupLink
        };
      }
      return s;
    }));
    setIsGroupInitModalOpen(false);
    setIsGroupLinkModalOpen(true);
  };

  const getCurrentModelLabel = () => {
    if (selectedModel === ModelType.FLASH) return "Helixar v0.1";
    if (selectedModel === ModelType.PRO) return "Helixar Pro";
    return "Helixar v0.1";
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black text-gray-200 selection:bg-white/20">
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} session={currentSession} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialSection={settingsSection}
        theme={theme}
        setTheme={setTheme}
        accentColor={accentColor}
        setAccentColor={setAccentColor}
      />
      <GroupChatModal isOpen={isGroupInitModalOpen} onClose={() => setIsGroupInitModalOpen(false)} onConfirm={convertToGroupChat} theme={theme} />
      <GroupLinkModal isOpen={isGroupLinkModalOpen} onClose={() => setIsGroupLinkModalOpen(false)} link={currentSession?.groupLink || ""} theme={theme} />

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} sessions={sessions} onSelectChat={(id) => { setCurrentSessionId(id); setIsSearchOpen(false); }} />

      <aside className={`
        relative h-full transition-all duration-300 ease-in-out shrink-0 border-r border-[#1a1a1a]
        ${isSidebarOpen ? 'w-[260px]' : 'w-[68px]'}
      `}>
        <Sidebar
          sessions={sessions}
          currentId={currentSessionId}
          onSelect={setCurrentSessionId}
          onDelete={deleteSession}
          onRename={renameSession}
          onNewChat={createNewSession}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          model={selectedModel}
          setModel={setSelectedModel}
          onUpgrade={() => setIsPricingOpen(true)}
          onOpenSearch={openSearch}
          onOpenSettings={openSettings}
          onOpenGroupLink={() => setIsGroupLinkModalOpen(true)}
          theme={theme}
          isCollapsed={!isSidebarOpen}
        />
      </aside>

      <main className="relative flex flex-1 flex-col overflow-hidden bg-black">
        {/* Grok-style Minimal Header */}
        <header className="absolute top-0 left-0 right-0 z-20 flex h-14 items-center justify-between px-6 bg-transparent pointer-events-none">
          {/* Left spacer if needed, or Model Selector */}
          <div className="flex items-center pointer-events-auto">
            {!isSidebarOpen && <div className="w-4" />}
            <div className="relative" ref={modelMenuRef}>
              <button onClick={() => setShowModelMenu(!showModelMenu)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#1a1a1a] transition-all text-[#8e8e93] hover:text-white font-medium text-[14px] group">
                <span>{getCurrentModelLabel()}</span>
                <svg className={`opacity-50 group-hover:opacity-100 transition-transform ${showModelMenu ? 'rotate-180' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
              </button>
              {showModelMenu && (
                <div className="absolute top-full left-0 mt-2 w-60 bg-[#121212] border border-[#2a2a2a] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-1.5 mb-1 border-b border-[#2a2a2a]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">Model Selection</span>
                  </div>
                  <button onClick={() => { setSelectedModel(ModelType.FLASH); setShowModelMenu(false); }} className="flex items-center justify-between w-full px-4 py-2.5 text-left text-[14px] font-medium text-white hover:bg-[#1a1a1a] transition-colors">
                    Helixar v0.1
                    {selectedModel === ModelType.FLASH && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>}
                  </button>
                  <button onClick={() => { setSelectedModel(ModelType.PRO); setShowModelMenu(false); }} className="flex items-center justify-between w-full px-4 py-2.5 text-left text-[14px] font-medium text-white hover:bg-[#1a1a1a] transition-colors">
                    Helixar Pro
                    {selectedModel === ModelType.PRO && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={createNewSession}
              className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#2A2A2D] text-white border border-[#333] font-medium text-[13px] transition-colors flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              New Chat
            </button>
            <button className="p-2 text-[#555] hover:text-white transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg></button>
            <button className="px-4 py-1.5 rounded-full bg-white text-black font-semibold text-[13px] hover:bg-neutral-200 transition-colors flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
              Share
            </button>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto relative flex flex-col items-center">
          {currentSession?.messages.length === 0 ? (
            <div key={currentSession?.id} className="flex flex-col items-center justify-center h-full px-4 text-center max-w-2xl w-full animate-scale-in pb-20">
              <div className="mb-6">
                <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Helixar</h1>
                <p className="text-gray-500 text-lg">Your creative intelligence engine.</p>
              </div>
              <ChatInput onSend={handleSendMessage} disabled={isTyping} centered />
            </div>
          ) : (
            <div className="w-full max-w-3xl mx-auto px-4 py-8 pb-40">
              {currentSession?.messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} theme={theme} />
              ))}
              {isTyping && (
                <div className="flex items-center gap-3 animate-slide-up-fade text-gray-400 mt-4 mb-14">
                  <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                  <span className="text-sm font-medium animate-pulse">Thinking...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {currentSession && currentSession.messages.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-10 shrink-0">
            <ChatInput onSend={handleSendMessage} disabled={isTyping} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;