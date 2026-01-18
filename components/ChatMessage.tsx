import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  theme: 'dark' | 'light';
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [isCopied, setIsCopied] = useState(false);

  // Copy handler for code blocks and tables
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleRegenerate = () => {
    // Placeholder for regeneration logic
    console.log("Regenerating...");
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Helixar Chat',
        text: message.content,
      });
    } catch (err) {
      navigator.clipboard.writeText(message.content);
      // Fallback or toast could go here
    }
  };

  const toggleLike = () => setFeedback(prev => prev === 'like' ? null : 'like');
  const toggleDislike = () => setFeedback(prev => prev === 'dislike' ? null : 'dislike');

  return (
    <div className={`flex w-full ${isUser ? 'justify-end mb-8' : 'justify-start mb-14'} last:mb-24 animate-in fade-in slide-in-from-bottom-2 duration-300 group`}>
      {/* Message Bubble */}
      <div className={`
        relative max-w-full text-[15.5px] leading-relaxed font-normal
        ${isUser
          ? 'bg-[#101010] text-white px-5 py-3.5 rounded-[20px] shadow-sm max-w-[85%] ml-auto border border-white/10'
          : 'text-gray-200 pl-0 w-full'
        }
      `}>
        {isUser ? (
          <p className="whitespace-pre-wrap font-sans">{message.content}</p>
        ) : (
          <>
            <div className={`w-full prose prose-invert max-w-none prose-p:text-gray-300 prose-p:leading-relaxed prose-headings:text-white prose-headings:font-semibold prose-strong:text-white prose-pre:my-0 [&>*:last-child]:!mb-0 ${isSpeaking ? 'opacity-80' : ''}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Paragraph

                  // Code Blocks
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="mt-6 mb-6 last:mb-0 rounded-xl overflow-hidden border border-white/10 bg-[#050505] relative group">
                        <div className="flex justify-between items-center px-4 py-2 bg-[#0A0A0A]/50 border-b border-white/5">
                          <span className="text-[12px] text-gray-400 font-mono tracking-wide lowercase">{match[1]}</span>
                        </div>

                        <button
                          onClick={() => handleCopy(String(children).replace(/\n$/, ''))}
                          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-[#333] text-gray-400 hover:text-white hover:bg-[#252525] hover:border-[#444] transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                          title="Copy Code"
                        >
                          {isCopied ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-500"><polyline points="20 6 9 17 4 12" /></svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                          )}
                        </button>

                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ margin: 0, padding: '1.25rem', background: 'transparent', fontSize: '13.5px', lineHeight: '1.6', fontFamily: '"JetBrains Mono", monospace' }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-[#1A1A1A] px-1.5 py-0.5 rounded text-gray-200 font-mono text-[13px]" {...props}>
                        {children}
                      </code>
                    );
                  },
                  // Headers - Consistent tight spacing
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-3 last:mb-0 mt-6 tracking-tight">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold text-white mb-3 last:mb-0 mt-6 tracking-tight">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-[17px] font-semibold text-white mb-3 last:mb-0 mt-6">{children}</h3>,

                  // Lists - Consistent spacing
                  ul: ({ children }) => <ul className="list-disc pl-5 mb-6 last:mb-0 space-y-1.5 marker:text-gray-600 text-gray-300">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 mb-6 last:mb-0 space-y-1.5 marker:text-gray-600 text-gray-300">{children}</ol>,

                  // Typography
                  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                  em: ({ children }) => <em className="italic text-gray-500">{children}</em>,
                  p: ({ children }) => <p className="mb-3 last:mb-0 leading-7 text-[#E0E0E0]">{children}</p>,

                  // Blockquotes - Consistent spacing
                  blockquote: ({ children }) => (
                    <div className="border-l-[3px] border-[#333] pl-4 my-6 last:mb-0 text-gray-400 italic">
                      {children}
                    </div>
                  ),

                  // Tables
                  table: ({ children }) => {
                    const tableRef = useRef<HTMLDivElement>(null);
                    const [isTableCopied, setIsTableCopied] = useState(false);

                    const handleTableCopy = () => {
                      if (tableRef.current) {
                        const text = tableRef.current.innerText;
                        navigator.clipboard.writeText(text);
                        setIsTableCopied(true);
                        setTimeout(() => setIsTableCopied(false), 2000);
                      }
                    };

                    return (
                      <div className="my-8 last:mb-0 w-full relative group">
                        <button
                          onClick={handleTableCopy}
                          className="absolute -top-2 -right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-[#333] text-gray-400 hover:text-white hover:bg-[#252525] hover:border-[#444] transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                          title="Copy Table"
                        >
                          {isTableCopied ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-500"><polyline points="20 6 9 17 4 12" /></svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                          )}
                        </button>
                        <div className="overflow-x-auto" ref={tableRef}>
                          <table className="w-full text-left text-[15px] text-[#E0E0E0] font-normal leading-relaxed">
                            {children}
                          </table>
                        </div>
                      </div>
                    );
                  },
                  thead: ({ children }) => <thead className="text-gray-200 font-semibold uppercase text-[11px] tracking-wider border-b border-white/20 h-10 align-bottom">{children}</thead>,
                  tbody: ({ children }) => <tbody className="divide-y divide-white/5">{children}</tbody>,
                  tr: ({ children }) => <tr className="group hover:bg-white/[0.02] transition-colors">{children}</tr>,
                  th: ({ children }) => <th className="px-3 py-3 font-semibold text-left align-bottom">{children}</th>,
                  td: ({ children }) => <td className="px-3 py-4 align-top text-gray-400 group-hover:text-gray-200 transition-colors">{children}</td>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>

            {/* Action Bar - Tap-to-Reveal Pill on Mobile, Hover on Desktop */}
            <div
              className={`
                flex items-center gap-4 mt-3 z-10 
                md:bg-transparent md:border-none md:p-0 md:-ml-1.5
                md:opacity-0 md:group-hover:opacity-100 transition-all duration-200
                ${showActions ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none md:pointer-events-auto md:translate-y-0'}
              `}
            >
              <div className="flex items-center gap-1 bg-black/90 border border-white/10 rounded-full px-3 py-1 shadow-2xl backdrop-blur-md md:bg-transparent md:border-none md:p-0 md:shadow-none md:backdrop-blur-none">
                <ActionButton
                  onClick={handleRegenerate}
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 21h5v-5" /></svg>}
                  label="Regenerate"
                />
                <ActionButton
                  onClick={handleReadAloud}
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill={isSpeaking ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>}
                  label={isSpeaking ? "Stop" : "Read Aloud"}
                  active={isSpeaking}
                />
                <ActionButton
                  onClick={() => handleCopy(message.content)}
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>}
                  label="Copy"
                />
                <div className="w-[1px] h-4 bg-[#333] mx-1 md:hidden"></div>
                <ActionButton
                  onClick={handleShare}
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>}
                  label="Share"
                />
                <div className="w-[1px] h-4 bg-[#333] mx-1"></div>
                <ActionButton
                  onClick={toggleLike}
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill={feedback === 'like' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" /></svg>}
                  label="Good Response"
                  active={feedback === 'like'}
                />
                <ActionButton
                  onClick={toggleDislike}
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill={feedback === 'dislike' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" /></svg>}
                  label="Bad Response"
                  active={feedback === 'dislike'}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Helper Component for Action Buttons with Tooltip
const ActionButton = ({ icon, label, onClick, active }: { icon: React.ReactNode, label: string, onClick?: () => void, active?: boolean }) => (
  <button
    onClick={onClick}
    className={`group/btn relative p-1.5 rounded-md transition-all ${active ? 'text-white bg-[#1a1a1a]' : 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]'}`}
  >
    {icon}
    {/* Tooltip */}
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 text-[10px] font-medium text-white bg-black border border-[#222] rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
      {label}
    </span>
  </button>
);
