import React, { useState } from 'react';
import { ChatSession, Message, ModelType } from '../../types';
import { ChatMessage } from '../ChatMessage';
import { ChatInput } from '../ChatInput';
import { Sidebar } from '../Sidebar';
import { SettingsSection } from '../SettingsModal';

interface MobileLayoutProps {
    sessions: ChatSession[];
    currentSessionId: string | null;
    currentSession: ChatSession | undefined;

    // Actions
    onDeleteSession: (id: string) => void;
    onRenameSession: (id: string, newTitle: string) => void;
    onCreateNewSession: () => void;
    onSelectSession: (id: string) => void;
    onSendMessage: (text: string) => void;

    // UI State
    isTyping: boolean;
    theme: 'dark' | 'light';
    selectedModel: ModelType;
    setSelectedModel: (m: ModelType) => void;

    // Modals Actions
    onUpgrade: () => void;
    onOpenSearch: () => void;
    onOpenSettings: (section: SettingsSection) => void;

    // Input State
    inputValue: string;
    setInputValue: (v: string) => void;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
    sessions,
    currentSessionId,
    currentSession,
    onDeleteSession,
    onRenameSession,
    onCreateNewSession,
    onSelectSession,
    onSendMessage,
    isTyping,
    theme,
    selectedModel,
    setSelectedModel,
    onUpgrade,
    onOpenSearch,
    onOpenSettings,
    inputValue,
    setInputValue
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Quick actions for empty state
    const quickActions = [
        { label: 'DeepSearch', icon: '🔍' },
        { label: 'Create Image', icon: '🎨' },
        { label: 'Pick Personas', icon: '👥' },
        { label: 'Voice', icon: '🎙️' }
    ];

    return (
        <div className="flex flex-col h-[100dvh] w-full bg-[#000000] text-white overflow-hidden selection:bg-white/20">

            {/* 1. Header (Minimal) */}
            <header className="flex h-14 items-center justify-between px-4 shrink-0 bg-transparent relative z-20 pointer-events-none">
                <div className="pointer-events-auto">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-white/90 hover:text-white">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                </div>

                <div className="flex items-center gap-1 opacity-90">
                    <span className="font-bold text-lg tracking-tight">Helixar</span>
                </div>

                <div className="pointer-events-auto">
                    <button onClick={onCreateNewSession} className="p-2 -mr-2 text-white/90">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                    </button>
                </div>
            </header>

            {/* 2. Main Content */}
            <main className="flex-1 overflow-y-auto w-full relative scroll-smooth no-scrollbar">
                <div className="px-5 pb-[calc(180px+env(safe-area-inset-bottom))] min-h-full flex flex-col">
                    {currentSession && currentSession.messages.length > 0 ? (
                        <div className="pt-4 space-y-6">
                            {currentSession.messages.map((msg) => (
                                <ChatMessage key={msg.id} message={msg} theme={theme} />
                            ))}
                            {isTyping && (
                                <div className="ml-0 mt-2 pl-0 max-w-[85%] w-fit">
                                    <div className="flex flex-col gap-2 p-4 rounded-[20px] rounded-tl-none bg-transparent">
                                        <div className="h-2.5 bg-zinc-800 rounded-full w-24 animate-pulse"></div>
                                        <div className="h-2.5 bg-zinc-800 rounded-full w-32 animate-pulse delay-75"></div>
                                        <div className="h-2.5 bg-zinc-800 rounded-full w-16 animate-pulse delay-150"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center -mt-20">
                            <div className="mb-10 opacity-90 text-center">
                                <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Helixar</h1>
                                <p className="text-gray-500 text-sm">Design. Code. Create.</p>
                            </div>

                            {/* Pill Grid */}
                            <div className="grid grid-cols-2 gap-3 w-full max-w-sm px-4">
                                {quickActions.map((action) => (
                                    <button
                                        key={action.label}
                                        onClick={() => onSendMessage(action.label)}
                                        className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-[13px] font-medium text-gray-300"
                                    >
                                        <span className="opacity-70">{action.icon}</span>
                                        <span>{action.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* 3. Input Capsule (Self-contained in ChatInput mode='mobile') */}
            <ChatInput
                onSend={onSendMessage}
                disabled={isTyping}
                value={inputValue}
                onChange={setInputValue}
                mode="mobile"
            />

            {/* 4. Mobile Drawer */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-[60] flex">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>

                    {/* Panel */}
                    <div className="relative w-[85%] max-w-[340px] h-full bg-black/70 backdrop-blur-xl shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col border-r-0 pb-6">

                        {/* Search Header in Drawer */}
                        <div className="px-4 pt-6 pb-2">
                            <button
                                onClick={() => { onOpenSearch(); setIsSidebarOpen(false); }}
                                className="flex items-center gap-3 w-full bg-white/5 border-none rounded-xl px-4 py-3 text-white placeholder-gray-500 mb-2 hover:bg-white/10 transition-colors text-left focus:ring-1 focus:ring-gray-700"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                <span className="text-sm font-medium">Search</span>
                            </button>
                        </div>

                        {/* Sidebar Content */}
                        <div className="flex-1 overflow-y-auto pl-1">
                            <Sidebar
                                sessions={sessions}
                                currentId={currentSessionId}
                                onSelect={(id) => { onSelectSession(id); setIsSidebarOpen(false); }}
                                onDelete={onDeleteSession}
                                onRename={onRenameSession}
                                onNewChat={() => { onCreateNewSession(); setIsSidebarOpen(false); }}
                                onToggleSidebar={() => { }}
                                model={selectedModel}
                                setModel={setSelectedModel}
                                onUpgrade={onUpgrade}
                                onOpenSearch={onOpenSearch}
                                onOpenSettings={onOpenSettings}
                                onOpenGroupLink={() => { }}
                                theme={theme}
                                isCollapsed={false}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
