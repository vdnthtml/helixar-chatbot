// LOCKED / FINALIZED COMPONENT - DO NOT EDIT WITHOUT EXPLICIT USER REQUEST
import React, { useState, useRef, useEffect } from 'react';
import { ChatSession, ModelType } from '../types';
import { SettingsSection } from './SettingsModal';

// Helper function to group chats by time periods
// Helper function to group chats by time periods
const groupChatsByTime = (sessions: ChatSession[]) => {
  const groups = {
    today: [] as ChatSession[],
    yesterday: [] as ChatSession[],
    older: {} as Record<string, ChatSession[]>
  };

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  sessions.forEach(session => {
    const date = new Date(session.updatedAt);

    const isToday = date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const isYesterday = date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isToday) {
      groups.today.push(session);
    } else if (isYesterday) {
      groups.yesterday.push(session);
    } else {
      const monthName = date.toLocaleString('default', { month: 'long' });
      if (!groups.older[monthName]) {
        groups.older[monthName] = [];
      }
      groups.older[monthName].push(session);
    }
  });

  return groups;
};

interface SidebarProps {
  sessions: ChatSession[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onNewChat: () => void;
  onToggleSidebar: () => void;
  model: ModelType;
  setModel: (m: ModelType) => void;
  onUpgrade: () => void;
  onOpenSearch: () => void;
  onOpenSettings: (section: SettingsSection) => void;
  onOpenGroupLink: () => void;
  theme: 'dark' | 'light';
  isCollapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentId,
  onSelect,
  onDelete,
  onRename,
  onNewChat,
  onToggleSidebar,
  model,
  setModel,
  onUpgrade,
  onOpenSearch,
  onOpenSettings,
  onOpenGroupLink,
  theme,
  isCollapsed
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const groupChats = sessions.filter(s => s.isGroup === true);
  const personalChats = sessions.filter(s => !s.isGroup);
  const groupedChats = groupChatsByTime(personalChats);



  return (
    <div className={`flex flex-col h-full transition-all duration-300 ${theme === 'dark' ? 'bg-black' : 'bg-[#f1f1f4]'}`}>
      <div className={`flex-1 overflow-y-auto no-scrollbar flex flex-col ${isCollapsed ? 'px-2 items-center' : 'px-5'}`}>
        {/* Logo Area */}
        <div className={`pt-5 pb-6 ${isCollapsed ? 'mb-6' : 'mb-2 pl-1'}`}>
          <div className="w-8 h-8 flex items-center justify-center">
            <svg width={isCollapsed ? "28" : "26"} height={isCollapsed ? "28" : "26"} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" /><path d="M2.05 2.05h2l2 2h-2z" fill="white" /></svg>
          </div>
        </div>

        {/* Main Navigation */}
        <div className={`space-y-1 ${isCollapsed ? 'mb-1 w-full flex flex-col items-center' : 'mb-0'}`}>
          {/* Search - Styled as an Input Field */}
          <button
            onClick={onOpenSearch}
            className={`
              flex items-center gap-3 transition-all mb-2
              ${isCollapsed
                ? 'w-10 h-10 justify-center rounded-full bg-[#1a1a1a] text-white hover:bg-[#252525]'
                : 'w-full px-3 py-2 rounded-xl text-left bg-[#1a1a1a] hover:bg-[#252525] text-[#8e8e93] hover:text-white'
              }
            `}
            title="Search"
          >
            <SearchIcon size={18} />
            {!isCollapsed && (
              <>
                <span className="text-[14px] font-normal flex-1">Search</span>
                <span className="text-[11px] font-medium opacity-60 tracking-wider">⌘K</span>
              </>
            )}
          </button>

          <NavButton
            onClick={onNewChat}
            icon={<ChatIcon size={18} />}
            label="Chat"
            theme={theme}
            collapsed={isCollapsed}
          />
          <NavButton
            onClick={() => console.log('Voice')}
            icon={<VoiceIcon size={18} />}
            label="Voice"
            theme={theme}
            collapsed={isCollapsed}
          />
          <NavButton
            onClick={() => console.log('Dashboard')}
            icon={<DashboardIcon size={18} />}
            label="Helixar Dashboard"
            theme={theme}
            collapsed={isCollapsed}
          />
        </div>

        {/* Tree View Structure */}
        <div className={`flex flex-col ${isCollapsed ? 'items-center space-y-1' : 'space-y-6'}`}>
          <div className={isCollapsed ? 'w-full flex justify-center' : ''}>
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-10 h-10 rounded-xl hover:bg-[#1a1a1a] cursor-pointer text-[#e0e0e0]' : 'px-3 py-2 mb-0 text-[#e0e0e0] font-medium text-[14px]'}`}>
              <ProjectsIcon />
              {!isCollapsed && <span>Projects</span>}
            </div>

            {!isCollapsed && (
              <div className="space-y-0.5 mt-1">
                <button className="flex items-center gap-3 w-full px-3 py-1.5 text-[14px] text-[#e0e0e0] hover:text-white transition-colors text-left group rounded-md hover:bg-[#1a1a1a]">
                  <span className="w-5 flex justify-center text-yellow-500"><SparklesIcon size={14} /></span>
                  <span>Helixar research</span>
                </button>
                <button className="flex items-center gap-3 w-full px-3 py-1.5 pl-11 text-[13px] text-[#9ca3af] hover:text-white transition-colors text-left rounded-md hover:bg-[#1a1a1a]">
                  <span>See all</span>
                </button>
              </div>
            )}
          </div>

          {/* History Section */}
          <div className={`pb-10 ${isCollapsed ? 'w-full flex justify-center' : ''}`}>
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-10 h-10 rounded-xl hover:bg-[#1a1a1a] cursor-pointer text-[#e0e0e0]' : 'px-3 py-2 mb-2 text-[#e0e0e0] font-medium text-[14px]'}`}>
              <HistoryIcon />
              {!isCollapsed && <span>History</span>}
            </div>

            {!isCollapsed && (
              <div className="space-y-4 mt-2">
                {/* Today Group */}
                {groupedChats.today.length > 0 && (
                  <div>
                    <h4 className="px-3 text-[12px] font-medium text-[#9ca3af] mb-1 pl-11">Today</h4>
                    <div className="space-y-0.5">
                      {groupedChats.today.map(session => (
                        <SidebarChatItem key={session.id} session={session} isActive={currentId === session.id} onSelect={onSelect} onDelete={onDelete} onRename={onRename} theme={theme} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Yesterday Group */}
                {groupedChats.yesterday.length > 0 && (
                  <div>
                    <h4 className="px-3 text-[12px] font-medium text-[#9ca3af] mb-1 pl-11">Yesterday</h4>
                    <div className="space-y-0.5">
                      {groupedChats.yesterday.map(session => (
                        <SidebarChatItem key={session.id} session={session} isActive={currentId === session.id} onSelect={onSelect} onDelete={onDelete} onRename={onRename} theme={theme} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Month Groups */}
                {Object.entries(groupedChats.older).map(([month, sessions]) => (
                  <div key={month}>
                    <h4 className="px-3 text-[12px] font-medium text-[#9ca3af] mb-1 pl-11">{month}</h4>
                    <div className="space-y-0.5">
                      {sessions.map(session => (
                        <SidebarChatItem key={session.id} session={session} isActive={currentId === session.id} onSelect={onSelect} onDelete={onDelete} onRename={onRename} theme={theme} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`mt-auto border-t border-[#1a1a1a] transition-all duration-300 ${isCollapsed ? 'p-2 flex flex-col items-center gap-4 bg-black' : 'p-4 bg-black'}`}>
        {!isCollapsed ? (
          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => onOpenSettings('account')}
              className="w-9 h-9 rounded-full overflow-hidden border border-[#2a2a2a] hover:border-white/20 transition-all"
            >
              <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center text-[11px] font-bold text-white">VS</div>
            </button>
            <button
              onClick={onToggleSidebar}
              className="text-[#e0e0e0] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#1a1a1a]"
            >
              <SidebarToggleIcon />
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => onOpenSettings('account')}
              className="w-8 h-8 rounded-full overflow-hidden border border-[#2a2a2a] hover:border-white/20 transition-all mt-2"
            >
              <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center text-[10px] font-bold text-white">VS</div>
            </button>
            <button
              onClick={onToggleSidebar}
              className="text-[#e0e0e0] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#1a1a1a] mb-2"
            >
              <SidebarToggleIcon />
            </button>
          </>
        )}
      </div>
    </div>
  );
};













interface SidebarChatItemProps {
  session: ChatSession;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  isActive?: boolean;
  theme: 'dark' | 'light';
}

const SidebarChatItem: React.FC<SidebarChatItemProps> = ({ session, onSelect, onRename, onDelete, isActive, theme }) => {
  const [showActions, setShowActions] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const actionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(e.target as Node)) {
        setShowActions(false);
      }
    };
    if (showActions) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [showActions]);

  const toggleActions = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showActions && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({ top: rect.top, left: rect.right + 8 });
    }
    setShowActions(!showActions);
  };

  return (
    <div className="relative group" ref={actionRef}>
      <button
        ref={buttonRef}
        onClick={() => onSelect(session.id)}
        className={`flex items-center justify-between w-full py-1.5 px-3 pl-11 text-[13px] rounded-md transition-all text-left group ${isActive
          ? 'bg-[#262626] text-white font-medium'
          : 'text-[#e0e0e0] font-normal hover:bg-[#1a1a1a] hover:text-white'
          }`}
      >
        <span className="truncate pr-4">{session.title || 'New chat'}</span>
        <div
          onClick={toggleActions}
          className={`p-1 rounded-md transition-all hover:bg-black/10 dark:hover:bg-white/10 ${isActive || showActions ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
        </div>
      </button>

      {showActions && (
        <div className={`fixed border rounded-xl shadow-2xl py-1.5 z-[9999] backdrop-blur-xl animate-in fade-in duration-150 min-w-[200px] ${theme === 'dark' ? 'bg-[#0a0a0a]/90 border-white/10' : 'bg-white border-[#e2e2e7]'}`} style={{ top: `${buttonPosition.top}px`, left: `${buttonPosition.left}px` }}>
          <button
            onClick={(e) => { e.stopPropagation(); onRename(session.id, prompt('New title:') || session.title); setShowActions(false); }}
            className={`w-full px-3 py-2 text-left text-sm transition-colors rounded-md ${theme === 'dark' ? 'text-neutral-400 hover:bg-white/5 hover:text-white' : 'text-[#636366] hover:bg-black/5 hover:text-[#1c1c1e]'}`}
          >
            Rename
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); if (confirm('Delete?')) onDelete(session.id); setShowActions(false); }}
            className={`w-full px-3 py-2 text-left text-sm transition-colors rounded-md ${theme === 'dark' ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300' : 'text-red-500 hover:bg-red-500/10'}`}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

interface IconButtonProps {
  onClick?: () => void;
  title: string;
  icon: React.ReactNode;
  theme: 'dark' | 'light';
}

const IconButton = ({ onClick, title, icon, theme }: IconButtonProps) => (
  <button onClick={onClick} title={title} className={`p-2.5 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-white/5 text-white/50 hover:text-white' : 'hover:bg-black/5 text-[#636366] hover:text-[#1c1c1e]'}`}>
    {icon}
  </button>
);

interface HelixItemProps {
  icon: React.ReactNode | string;
  label: string;
  theme: 'dark' | 'light';
  onClick?: () => void;
}

// Helper Components for Cleaner Main Component
const NavButton = ({ onClick, icon, label, theme, collapsed }: any) => (
  <button
    onClick={onClick}
    className={`
      flex items-center transition-all group rounded-lg
      ${collapsed
        ? 'w-10 h-10 justify-center hover:bg-[#1a1a1a] text-[#e0e0e0] hover:text-white mb-1'
        : `w-full gap-3 px-3 py-2 text-left ${theme === 'dark' ? 'text-[#e0e0e0] hover:text-white hover:bg-[#1a1a1a]' : 'hover:bg-[#e2e2e7]'}`
      }
    `}
    title={collapsed ? label : ''}
  >
    <div className={`${collapsed ? '' : theme === 'dark' ? '' : 'text-neutral-600'}`}>
      {icon}
    </div>
    {!collapsed && (
      <span className={`text-[15px] font-medium ${theme === 'dark' ? 'text-[#e0e0e0] group-hover:text-white' : 'text-neutral-600'}`}>{label}</span>
    )}
  </button>
);

const SearchIcon = ({ size }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
// Updated Chat Icon (Square Edit Style)
const ChatIcon = ({ size }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const VoiceIcon = ({ size }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20" /><path d="M12 12 2.5 2.5" /><path d="M12 12l9.5-9.5" /><path d="M12 12 2.5 21.5" /><path d="M12 12l9.5 9.5" /></svg>;
const DashboardIcon = ({ size }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /></svg>;

const ProjectsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></svg>;
const HistoryIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>;
const SparklesIcon = ({ size }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;

const SidebarToggleIcon = ({ collapsed }: { collapsed?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {collapsed ? (
      <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />
    ) : (
      <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
    )}
  </svg>
);
