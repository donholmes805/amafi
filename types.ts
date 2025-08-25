
export enum Role {
  ADMIN = 'ADMIN',
  HOST = 'HOST',
  CO_HOST = 'CO_HOST',
  MODERATOR = 'MODERATOR',
  VIEWER = 'VIEWER', // Supporters will use this role
}

export type UserTier = 'FREE' | 'PREMIUM';

export interface User {
  id: string;
  name: string;
  avatar_url: string; // To match supabase column
  role: Role;
  tier?: UserTier; // Optional, but hosts will have it
  bio?: string;
  following?: string[]; // Array of host IDs
  wallet_address?: string;
  wallet_ticker?: string;
}

export interface Message {
  id: number;
  ama_id: number;
  user_id: string;
  text: string;
  created_at: string;
  // This is how Supabase returns joined data from a select query
  profiles: {
    id: string;
    name: string;
    avatar_url: string;
    role: Role; // Include role to style host messages
  }
}

export enum AMAStatus {
  UPCOMING = 'UPCOMING',
  LIVE = 'LIVE',
  ENDED = 'ENDED',
}

export enum AMAType {
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
}

export interface AMA {
  id: number;
  title: string;
  description: string;
  host: User;
  coHosts?: User[];
  moderators?: User[];
  youtube_url: string; // From supabase, potentially comma-separated
  youtubeUrls: string[]; // Client-side parsed from youtube_url
  status: AMAStatus;
  start_time: string; // from supabase
  startTime: Date; // converted
  viewers: number;
  is_featured?: boolean;
  isFeatured?: boolean; // Keep for compatibility
  time_limit_minutes: number;
  timeLimitMinutes: number; // Keep for compatibility
  likes?: number;
  dislikes?: number;
  wallet_address?: string;
  walletAddress?: string; // Keep for compatibility
  wallet_ticker?: string;
  walletTicker?: string; // Keep for compatibility
  ama_type?: AMAType;
  amaType?: AMAType; // Keep for compatibility
}

export interface AMAHighlightsData {
  keyTopics: string[];
  topQuestions: {
    question: string;
    answer: string;
  }[];
  goldenNuggets: string[];
  sentiment: string;
}

export interface AnalyzedMessage {
  messageId: number;
  category: 'Question' | 'Comment' | 'Spam' | 'Off-topic' | 'Other';
  isFlagged: boolean;
  flagReason?: string;
}
