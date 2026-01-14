
export type Role = 'user' | 'assistant';

export interface AnalysisInfo {
  title: string;
  timestamp: string;
  type: 'video' | 'document' | 'spreadsheet';
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  analysis?: AnalysisInfo;
  attachmentUrl?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
  isGroup?: boolean;
  groupLink?: string;
}

export enum ModelType {
  FLASH = 'gemini-3-flash-preview',
  PRO = 'gemini-3-pro-preview'
}
