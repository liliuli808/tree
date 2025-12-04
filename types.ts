export type Category = 'love' | 'game' | 'music' | 'movie' | 'friend' | 'moment';

export const CATEGORY_LABELS: Record<Category, string> = {
  love: '恋爱',
  game: '游戏',
  music: '音乐',
  movie: '电影',
  friend: '交友',
  moment: '此刻'
};

export interface User {
  id: string;
  nickname: string;
  avatar: string; // URL or color code
  isAnonymous: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  nickname: string;
  userAvatar: string;
  content: string;
  timestamp: number;
}

export interface Post {
  id: string;
  userId: string;
  userNickname: string;
  userAvatar: string;
  category: Category;
  content: string;
  images?: string[];
  video?: string;
  audio?: string; // duration string for demo
  isLivePhoto?: boolean;
  likes: number;
  comments: Comment[];
  timestamp: number;
  location?: string;
}

export type MessageType = 'text' | 'image' | 'audio' | 'sticker';

export interface Message {
  id: string;
  senderId: string;
  type: MessageType;
  content: string; // Text content, image URL, or audio duration
  timestamp: number;
}

export interface Chat {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  timestamp: number;
  unread: number;
  messages: Message[]; // Added messages history
}
