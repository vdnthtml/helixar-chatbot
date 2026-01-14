import React, { useState } from 'react';
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

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-8 animate-fade-in group`}>
      {/* Avatar Section */}
      {!isUser && (
        <div className="w-8 h-8 mr-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-white">HX</span>
        </div>
      )}

      {/* Message Bubble */}
      <div className={`
        relative max-w-[85%] px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed tracking-wide font-light
        ${isUser
          ? 'bg-[#1a1a1c] text-white border border-white/10 rounded-2xl shadow-sm'
          : 'text-gray-300 pl-0'
        }
      `}>
        {isUser ? (
          <p className="whitespace-pre-wrap font-sans">{message.content}</p>
        ) : (
          /* The Markdown Engine */
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Code Blocks
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="my-6 rounded-lg overflow-hidden border border-white/10">
                    <div className="flex justify-between items-center px-4 py-1.5 bg-black/50 text-[11px] text-gray-400 font-mono uppercase tracking-wider">
                      <span>{match[1]}</span>
                      <button
                        onClick={() => handleCopy(String(children).replace(/\n$/, ''))}
                        className="hover:text-white transition-colors"
                      >
                        {isCopied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ margin: 0, padding: '1.25rem', background: '#0a0a0a', fontSize: '13px', lineHeight: '1.6' }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono text-[13px]" {...props}>
                    {children}
                  </code>
                );
              },
              // Headers
              h1: ({ children }) => <h1 className="text-2xl font-semibold text-white mb-6 mt-4 tracking-tight">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-medium text-white mb-4 mt-8 pb-2 border-b border-white/5">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-medium text-white mb-3 mt-6">{children}</h3>,
              // Lists
              ul: ({ children }) => <ul className="list-disc pl-5 mb-6 space-y-2 marker:text-white/40 text-gray-300">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5 mb-6 space-y-2 marker:text-white/40 text-gray-300">{children}</ol>,
              // Blockquotes
              blockquote: ({ children }) => (
                <div className="border-l-2 border-white/20 pl-4 my-6 italic text-gray-400">
                  {children}
                </div>
              ),
              p: ({ children }) => <p className="mb-4 last:mb-0 leading-7 text-gray-300">{children}</p>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};
