# Design Artifact: Helixar AI

## 1. File Tree
```
/ (Project Root)
├── components/
│   ├── ChatInput.tsx
│   ├── ChatMessage.tsx
│   ├── GroupModals.tsx
│   ├── PricingModal.tsx
│   ├── SearchOverlay.tsx
│   ├── SettingsModal.tsx
│   ├── ShareModal.tsx
│   └── Sidebar.tsx
├── App.tsx
├── index.html
├── index.tsx
├── types.ts
├── package.json
└── vite.config.ts
```

## 2. Global Styles
**Architecture**: Tailwind CSS (via CDN) + CSS Variables in `index.html`.

### Configuration
**Tailwind Config**: None (Using default CDN config).
`<script src="https://cdn.tailwindcss.com"></script>` inside `index.html`.

### Custom CSS (from `index.html`)
```css
:root {
    --bg-primary: #0c0c0e;
    --bg-secondary: #161618;
    --border-primary: #2a2a2d;
    --text-primary: #fafafa;
    --text-secondary: #8e8e93;
    --accent-color: #b33a72;
    --sidebar-width: 260px;
}

.theme-light {
    --bg-primary: #f9f9fb;
    --bg-secondary: #f1f1f4;
    --border-primary: #e2e2e7;
    --text-primary: #1c1c1e;
    --text-secondary: #636366;
}

body {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s ease;
}

.mono {
    font-family: 'JetBrains Mono', monospace;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
    animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes glow {
    0% { filter: drop-shadow(0 0 2px var(--accent-color)); opacity: 0.8; }
    50% { filter: drop-shadow(0 0 10px var(--accent-color)); opacity: 1; }
    100% { filter: drop-shadow(0 0 2px var(--accent-color)); opacity: 0.8; }
}
.glow-active {
    animation: glow 1.5s ease-in-out infinite;
    color: var(--accent-color) !important;
}

.sidebar-item-active {
    background-color: #1a1a1c;
    color: white;
}

.theme-light .sidebar-item-active {
    background-color: white;
    color: #1c1c1e;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

## 3. Core Components

### App.tsx (Main Layout & Logic)
```tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Message, ChatSession, ModelType } from './types';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.FLASH);
  const [showTopMenu, setShowTopMenu] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<SettingsSection>('general');
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
      setSessions(parsed);
      if (parsed.length > 0) setCurrentSessionId(parsed[0].id);
    } else {
      createNewSession();
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
  }, [sessions, isTyping]);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const createNewSession = () => {
    // Check if current session is already empty - if so, don't create a new one
    if (currentSession && currentSession.messages.length === 0) {
      return;
    }

    const newSession: ChatSession = {
      id: Math.random().toString(36).substring(7),
      title: 'New chat',
      messages: [],
      updatedAt: Date.now(),
      isGroup: false
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const deleteSession = (id: string) => {
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
    setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
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
    <div className={`flex h-screen w-full overflow-hidden transition-all duration-300 ${theme === 'dark' ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/20 via-black to-black text-[#e3e3e3]' : 'bg-[#f9f9fb] text-[#1c1c1e]'}`}>
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
        relative h-full transition-all duration-300 ease-in-out border-r shrink-0
        ${isSidebarOpen ? 'w-[260px]' : 'w-[68px]'}
        ${theme === 'dark' ? 'border-white/5 bg-black' : 'border-[#e2e2e7] bg-[#f1f1f4]'}
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

      <main className="relative flex flex-1 flex-col overflow-hidden">
        <header className={`flex h-12 items-center justify-between px-4 border-b shrink-0 transition-colors z-20 ${theme === 'dark' ? 'border-white/5 bg-black' : 'border-[#e2e2e7] bg-white'}`}>
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <div className="w-10"></div>
            )}
            <div className="relative" ref={modelMenuRef}>
              <div onClick={() => setShowModelMenu(!showModelMenu)} className="group cursor-pointer flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-black/5 transition-all active:scale-95">
                <span className={`text-[13px] font-bold ${theme === 'dark' ? 'text-[#8e8e93]' : 'text-[#636366]'}`}>{getCurrentModelLabel()}</span>
                <svg className={`text-[#8e8e93] transition-transform ${showModelMenu ? 'rotate-180' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6" /></svg>
              </div>
              {showModelMenu && (
                <div className={`absolute top-full left-0 mt-2 w-56 border rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200 ${theme === 'dark' ? 'bg-[#1e1e20] border-[#2a2a2d]' : 'bg-white border-[#e2e2e7]'}`}>
                  <div className="px-4 py-1 mb-1 border-b dark:border-white/5 border-black/5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8e8e93]">Models</span>
                  </div>
                  <button onClick={() => { setSelectedModel(ModelType.FLASH); setShowModelMenu(false); }} className={`flex items-center justify-between w-full px-4 py-2 text-left text-[13px] font-bold transition-colors ${theme === 'dark' ? 'text-white hover:bg-white/5' : 'text-[#1c1c1e] hover:bg-black/5'}`}>
                    Helixar v0.1
                    {selectedModel === ModelType.FLASH && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-indigo-500"><polyline points="20 6 9 17 4 12" /></svg>}
                  </button>
                  <button onClick={() => { setSelectedModel(ModelType.PRO); setShowModelMenu(false); }} className={`flex items-center justify-between w-full px-4 py-2 text-left text-[13px] font-bold transition-colors ${theme === 'dark' ? 'text-white hover:bg-white/5' : 'text-[#1c1c1e] hover:bg-black/5'}`}>
                    Helixar Pro
                    {selectedModel === ModelType.PRO && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-indigo-500"><polyline points="20 6 9 17 4 12" /></svg>}
                  </button>
                  <button onClick={() => setShowModelMenu(false)} className={`flex items-center justify-between w-full px-4 py-2 text-left text-[13px] font-bold opacity-50 cursor-not-allowed transition-colors ${theme === 'dark' ? 'text-white hover:bg-white/5' : 'text-[#1c1c1e] hover:bg-black/5'}`}>
                    Helixar Vision (Soon)
                  </button>
                  <button onClick={() => setShowModelMenu(false)} className={`flex items-center justify-between w-full px-4 py-2 text-left text-[13px] font-bold opacity-50 cursor-not-allowed transition-colors ${theme === 'dark' ? 'text-white hover:bg-white/5' : 'text-[#1c1c1e] hover:bg-black/5'}`}>
                    Helixar Heavy (Beta)
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setIsGroupInitModalOpen(true)} className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-90 ${theme === 'dark' ? 'text-[#8e8e93] hover:text-white' : 'text-[#636366] hover:text-[#1c1c1e]'}`} title="Add people">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M19 11h6"></path><path d="M22 8v6"></path></svg>
            </button>
            <button onClick={() => setIsTemporaryMode(!isTemporaryMode)} className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-90 ${isTemporaryMode ? 'text-indigo-500' : theme === 'dark' ? 'text-[#8e8e93] hover:text-white' : 'text-[#636366] hover:text-[#1c1c1e]'}`} title="Temporary Chat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3"><circle cx="12" cy="12" r="10" /></svg>
            </button>
            {currentSession && currentSession.messages.length > 0 && (
              <>
                <button onClick={() => setIsShareOpen(true)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all hover:scale-105 active:scale-95 ${theme === 'dark' ? 'text-[#8e8e93] hover:bg-white/5 hover:text-white' : 'text-[#636366] hover:bg-black/5 hover:text-[#1c1c1e]'}`}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                  Share
                </button>
                <div className="relative" ref={menuRef}>
                  <button onClick={() => setShowTopMenu(!showTopMenu)} className={`p-1.5 rounded-lg transition-all hover:scale-110 active:scale-90 flex items-center justify-center ${theme === 'dark' ? 'text-[#8e8e93] hover:bg-white/5 hover:text-white' : 'text-[#636366] hover:bg-black/5 hover:text-[#1c1c1e]'}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                  </button>
                  {showTopMenu && (
                    <div className={`absolute right-0 top-full mt-2 w-56 border rounded-[16px] shadow-2xl py-1.5 z-[100] animate-in fade-in zoom-in-95 duration-200 ${theme === 'dark' ? 'bg-[#212121] border-[#303030]' : 'bg-white border-[#e2e2e7]'}`}>
                      <button onClick={() => console.log('Move to project clicked')} className={`flex items-center justify-between w-full px-4 py-2.5 text-[13px] font-bold transition-colors ${theme === 'dark' ? 'text-[#e3e3e3] hover:bg-white/5' : 'text-[#1c1c1e] hover:bg-black/5'}`}>
                        <div className="flex items-center gap-3">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z"></path></svg>
                          Move to project
                        </div>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </button>
                      <button onClick={() => console.log('Pin chat clicked')} className={`flex items-center gap-3 w-full px-4 py-2.5 text-[13px] font-bold transition-colors ${theme === 'dark' ? 'text-[#e3e3e3] hover:bg-white/5' : 'text-[#1c1c1e] hover:bg-black/5'}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a12 12 0 1 1 0 24 12 12 0 0 1 0-24zm0 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path><path d="M12 2L12 8"></path></svg>
                        Pin chat
                      </button>
                      <button onClick={() => console.log('Archive clicked')} className={`flex items-center gap-3 w-full px-4 py-2.5 text-[13px] font-bold transition-colors ${theme === 'dark' ? 'text-[#e3e3e3] hover:bg-white/5' : 'text-[#1c1c1e] hover:bg-black/5'}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path><path d="M10 12h4"></path></svg>
                        Archive
                      </button>
                      <button onClick={() => console.log('Report clicked')} className={`flex items-center gap-3 w-full px-4 py-2.5 text-[13px] font-bold transition-colors ${theme === 'dark' ? 'text-[#e3e3e3] hover:bg-white/5' : 'text-[#1c1c1e] hover:bg-black/5'}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                        Report
                      </button>
                      <div className={`my-1 border-t ${theme === 'dark' ? 'border-white/5' : 'border-black/5'}`}></div>
                      <button
                        onClick={() => { setShowTopMenu(false); currentSessionId && deleteSession(currentSessionId); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col justify-center items-center">
          {currentSession?.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 text-center max-w-2xl w-full animate-fade-in -mt-10">
              <h2 className={`text-4xl font-bold tracking-tight mb-8 font-sans ${theme === 'dark' ? 'text-white' : 'text-[#1c1c1e]'}`}>Hey, Ved. Ready to dive in?</h2>
              <ChatInput onSend={handleSendMessage} disabled={isTyping} centered />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-12 pb-32 w-full flex-1 self-start">
              {currentSession?.messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} theme={theme} accentColor={accentColor} onRegenerate={handleRegenerate} onShare={() => setIsShareOpen(true)} />
              ))}
              {isTyping && (
                <div className="flex gap-4 animate-pulse px-4 items-center">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${theme === 'dark' ? 'bg-[#1e1e20] border-[#2a2a2d]' : 'bg-[#f1f1f4] border-[#e2e2e7]'}`}>
                    <div className="w-3 h-3 rounded-full bg-[#8e8e93] animate-bounce"></div>
                  </div>
                  <span className="text-[10px] text-[#8e8e93] font-mono uppercase tracking-widest font-bold">Thinking...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {currentSession && currentSession.messages.length > 0 && (
          <div className={`p-4 bg-gradient-to-t ${theme === 'dark' ? 'from-[#000000] via-[#000000]' : 'from-[#f9f9fb] via-[#f9f9fb]'} to-transparent z-10 shrink-0`}>
            <div className="max-w-3xl mx-auto">
              <ChatInput onSend={handleSendMessage} disabled={isTyping} />
              <p className="text-[10px] text-center text-[#8e8e93] mt-2 font-medium">Helixar can make mistakes. Check important info. See <span onClick={() => console.log('Cookie Preferences clicked')} className="underline cursor-pointer">Cookie Preferences</span>.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
```

### ChatMessage.tsx (Message Bubble)
```tsx
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  theme: 'dark' | 'light';
  accentColor: string;
  onRegenerate?: (id: string) => void;
  onShare?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, theme, accentColor, onRegenerate, onShare }) => {
  const isUser = message.role === 'user';
  const [showMenu, setShowMenu] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setShowMenu(false);
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col gap-3 px-4 py-2 animate-fade-in ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex gap-4 w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-8 h-8 shrink-0 rounded-lg border flex items-center justify-center text-[10px] font-bold ${isUser
          ? (theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-800 shadow-sm')
          : (theme === 'dark' ? 'bg-[#1e1e20] border-[#2a2a2d] text-white' : 'bg-white border-[#e2e2e7] text-[#1c1c1e] shadow-sm')
          }`}>
          {isUser ? 'VS' : 'HX'}
        </div>

        <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`
              text-[15px] leading-relaxed px-5 py-3.5 rounded-2xl font-light font-sans transition-all duration-300
              ${isUser
                ? 'bg-[#1A1A1A] text-white rounded-tr-sm'
                : (theme === 'dark' ? 'text-neutral-200 bg-transparent' : 'text-[#1c1c1e] bg-transparent')
              }
            `}
          >
            {message.content}
          </div>

          {!isUser && (
            <div className="flex items-center gap-2 mt-2 -ml-2">
              <ActionButton
                onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                active={feedback === 'up'}
                icon={<ThumbUpIcon />}
                theme={theme}
                glow
              />
              <ActionButton
                onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                active={feedback === 'down'}
                icon={<ThumbDownIcon />}
                theme={theme}
                glow
              />

              <div className="relative flex items-center">
                <ActionButton onClick={handleCopy} icon={isCopied ? <CheckIcon /> : <CopyIcon />} theme={theme} />
                {isCopied && (
                  <div className="absolute left-full ml-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in slide-in-from-left-1 shadow-lg shadow-emerald-500/5">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide">Copied</span>
                  </div>
                )}
              </div>

              <ActionButton onClick={onShare} icon={<ShareIcon />} theme={theme} />
              <ActionButton onClick={() => onRegenerate?.(message.id)} icon={<RefreshIcon />} theme={theme} />

              <div className="relative" ref={menuRef}>
                <button onClick={() => setShowMenu(!showMenu)} className={`p-1.5 transition-colors rounded-md ${theme === 'dark' ? 'text-[#5c5c5e] hover:text-[#8e8e93]' : 'text-[#8e8e93] hover:text-[#1c1c1e]'}`}>
                  <MoreIcon />
                </button>
                {showMenu && (
                  <div className={`absolute left-0 bottom-full mb-2 w-48 border rounded-xl shadow-2xl py-1 z-20 animate-in fade-in slide-in-from-bottom-2 duration-150 ${theme === 'dark' ? 'bg-[#1e1e20] border-[#2a2a2d]' : 'bg-white border-[#e2e2e7]'}`}>
                    <MenuItem onClick={() => console.log('Branch in new chat clicked')} label="Branch in new chat" icon={<BranchIcon />} theme={theme} />
                    <MenuItem onClick={() => console.log('Read aloud clicked')} label="Read aloud" icon={<VolumeIcon />} theme={theme} />
                    <MenuItem onClick={() => console.log('Report message clicked')} label="Report message" icon={<ReportIcon />} theme={theme} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

## 4. Dependencies (`package.json`)
```json
{
  "name": "helixar-ai",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.3",
    "@google/genai": "^1.35.0",
    "react-dom": "^19.2.3"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```
