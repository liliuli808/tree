import { Post, Category, Chat, Message } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const MOCK_POSTS: Post[] = [
    {
      id: 'p1',
      userId: 'u1',
      userNickname: 'Secret Squirrel',
      userAvatar: 'bg-emerald-200',
      category: 'moment',
      content: 'Sometimes I just want to sit under a tree and forget the world exists for a while. 🌳 #peace',
      images: ['https://picsum.photos/600/400'],
      likes: 12,
      comments: [
        { id: 'cm1', userId: 'u99', nickname: 'Forest Spirit', userAvatar: 'bg-green-100', content: 'Take a deep breath.', timestamp: Date.now() - 3000000 }
      ],
      timestamp: Date.now() - 3600000,
      isLivePhoto: true,
    },
    {
      id: 'p2',
      userId: 'u2',
      userNickname: 'Retro Gamer',
      userAvatar: 'bg-indigo-200',
      category: 'game',
      content: 'Anyone else excited for the new RPG release next week? Looking for teammates!',
      likes: 45,
      comments: [],
      timestamp: Date.now() - 7200000,
    },
    {
      id: 'p3',
      userId: 'u3',
      userNickname: 'Melody Maker',
      userAvatar: 'bg-rose-200',
      category: 'music',
      content: 'Just wrote this little melody, what do you think? (Imaginary Audio)',
      audio: '0:45',
      likes: 8,
      comments: [],
      timestamp: Date.now() - 15000000,
    },
    {
      id: 'p4',
      userId: 'u4',
      userNickname: 'Cinephile',
      userAvatar: 'bg-stone-300',
      category: 'movie',
      content: 'That plot twist at the end... I am still recovering. No spoilers but wow.',
      likes: 23,
      comments: [],
      timestamp: Date.now() - 86400000,
    },
    // Add posts for the current user 'me'
    {
      id: 'p_me_1',
      userId: 'me',
      userNickname: 'Anonymous Fox',
      userAvatar: 'bg-emerald-300', // Matches ProfilePage avatar
      category: 'love',
      content: 'Thinking about sending a letter to my future self. What should I say?',
      likes: 5,
      comments: [],
      timestamp: Date.now() - 100000000,
    },
    {
      id: 'p_me_2',
      userId: 'me',
      userNickname: 'Anonymous Fox',
      userAvatar: 'bg-emerald-300',
      category: 'moment',
      content: 'The sunset today was absolutely breathtaking. 🌅',
      images: ['https://picsum.photos/id/10/600/400'],
      likes: 18,
      comments: [],
      timestamp: Date.now() - 200000000,
    }
];

const MOCK_CHATS: Chat[] = [
    {
      id: 'c1',
      userId: 'u5',
      userName: 'Quiet Tree',
      userAvatar: 'bg-amber-200',
      lastMessage: 'Hey, I saw your post about the movie!',
      timestamp: Date.now() - 120000,
      unread: 2,
      messages: [
        { id: 'm1', senderId: 'u5', type: 'text', content: 'Hi there!', timestamp: Date.now() - 3600000 },
        { id: 'm2', senderId: 'me', type: 'text', content: 'Hello! How are you?', timestamp: Date.now() - 3500000 },
        { id: 'm3', senderId: 'u5', type: 'text', content: 'Hey, I saw your post about the movie!', timestamp: Date.now() - 120000 },
      ]
    },
    {
      id: 'c2',
      userId: 'u6',
      userName: 'Blue Whale',
      userAvatar: 'bg-sky-200',
      lastMessage: 'Do you play on PC or Console?',
      timestamp: Date.now() - 5000000,
      unread: 0,
      messages: [
         { id: 'm4', senderId: 'u6', type: 'text', content: 'Do you play on PC or Console?', timestamp: Date.now() - 5000000 },
      ]
    }
];

export const getInitialPosts = (): Post[] => MOCK_POSTS;

export const getPostById = (id: string): Post | undefined => {
  return MOCK_POSTS.find(p => p.id === id);
};

export const getPostsByUser = (userId: string): Post[] => {
  return MOCK_POSTS.filter(p => p.userId === userId).sort((a, b) => b.timestamp - a.timestamp);
};

export const getChats = (): Chat[] => MOCK_CHATS;

export const getChatById = (id: string): Chat | undefined => {
  return MOCK_CHATS.find(c => c.id === id);
};

export const createNewChat = (userId: string, userName: string, userAvatar: string): Chat => {
    return {
        id: 'new_' + Date.now(),
        userId,
        userName,
        userAvatar,
        lastMessage: 'Started a conversation',
        timestamp: Date.now(),
        unread: 0,
        messages: []
    }
}