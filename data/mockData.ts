import { User, AMA, Message, Role, UserTier, AMAStatus, AMAType } from '../types';

// --- MOCK DATA STORE ---

const adminUser: User = {
    id: 'user-1',
    name: 'Admin',
    avatar_url: 'https://api.dicebear.com/8.x/bottts/svg?seed=admin',
    role: Role.ADMIN,
    tier: 'PREMIUM',
    bio: 'The administrator of AMA Fi.',
    following: ['user-2', 'user-3'],
};

const premiumHost: User = {
    id: 'user-2',
    name: 'Crypto Chad',
    avatar_url: 'https://api.dicebear.com/8.x/bottts/svg?seed=chad',
    role: Role.HOST,
    tier: 'PREMIUM',
    bio: 'Host of the biggest AMAs in the crypto space. Ask me anything about blockchain, NFTs, and the future of finance.',
    following: ['user-3'],
    wallet_ticker: 'ETH',
    wallet_address: '0x1234567890AbCdEf1234567890aBcDeF12345678',
};

const freeHost: User = {
    id: 'user-3',
    name: 'Indie Dev',
    avatar_url: 'https://api.dicebear.com/8.x/bottts/svg?seed=dev',
    role: Role.HOST,
    tier: 'FREE',
    bio: 'Building cool projects and sharing my journey. I love talking about startups, coding, and indie hacking.',
    following: [],
};

const viewerUser: User = {
    id: 'user-4',
    name: 'Curious Cat',
    avatar_url: 'https://api.dicebear.com/8.x/bottts/svg?seed=cat',
    role: Role.VIEWER,
    following: ['user-2'],
};

let users: User[] = [adminUser, premiumHost, freeHost, viewerUser];

let amas: AMA[] = [
    {
        id: 1,
        title: 'Live Now: The Future of Decentralized Finance',
        description: 'Join me live as we discuss the latest trends in DeFi, yield farming, and what to expect in the next bull run. Bring your toughest questions!',
        host: premiumHost,
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder
        youtubeUrls: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
        status: AMAStatus.LIVE,
        start_time: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        startTime: new Date(Date.now() - 10 * 60 * 1000),
        viewers: 1337,
        is_featured: true,
        isFeatured: true,
        time_limit_minutes: 120,
        timeLimitMinutes: 120,
        likes: 256,
        dislikes: 12,
        wallet_address: premiumHost.wallet_address,
        walletTicker: premiumHost.wallet_ticker,
        ama_type: AMAType.VIDEO,
        amaType: AMAType.VIDEO,
    },
    {
        id: 2,
        title: 'Upcoming: Building a SaaS with Zero Funding',
        description: 'I bootstrapped my company to $10k MRR in 6 months. In this audio-only session, I\'ll share my strategies, mistakes, and lessons learned.',
        host: freeHost,
        youtube_url: '',
        youtubeUrls: [],
        status: AMAStatus.UPCOMING,
        start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        viewers: 0,
        time_limit_minutes: 30,
        timeLimitMinutes: 30,
        likes: 5,
        dislikes: 0,
        ama_type: AMAType.AUDIO,
        amaType: AMAType.AUDIO,
    },
    {
        id: 3,
        title: 'Past AMA: NFT Gaming & The Metaverse',
        description: 'A look back at our deep dive into the intersection of non-fungible tokens and the future of online gaming worlds.',
        host: premiumHost,
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeUrls: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
        status: AMAStatus.ENDED,
        start_time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        viewers: 5280,
        time_limit_minutes: 120,
        timeLimitMinutes: 120,
        likes: 1024,
        dislikes: 30,
        ama_type: AMAType.VIDEO,
        amaType: AMAType.VIDEO,
    },
     {
        id: 4,
        title: 'AMA with an Indie Game Developer',
        description: 'Ask me anything about my journey creating my first commercial game. We can talk about Unity, marketing, Steam, and more!',
        host: freeHost,
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeUrls: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
        status: AMAStatus.UPCOMING,
        start_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        viewers: 0,
        time_limit_minutes: 30,
        timeLimitMinutes: 30,
        likes: 2,
        dislikes: 0,
        ama_type: AMAType.VIDEO,
        amaType: AMAType.VIDEO,
    },
];

let messages: Message[] = [
    { id: 1, ama_id: 1, user_id: 'user-4', text: 'Hey Crypto Chad, great to be here! What do you think is the single most important factor for a DeFi project\'s long-term success?', created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), profiles: { ...viewerUser } },
    { id: 2, ama_id: 1, user_id: 'user-2', text: 'Great question! In my opinion, it\'s a combination of robust security and a strong, engaged community. You can have the best tech, but without trust and users, it\'s nothing.', created_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(), profiles: { ...premiumHost } },
    { id: 3, ama_id: 1, user_id: 'user-4', text: 'Makes sense. How do you vet a project for security? Are audits enough?', created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(), profiles: { ...viewerUser } },
];

let loggedInUser: User | null = viewerUser; // Start logged in as a viewer for demo purposes

const SIMULATED_LATENCY = 300; // ms

const simulateRequest = <T>(data: T): Promise<T | null> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(data))); // Deep copy to prevent mutation issues
        }, SIMULATED_LATENCY);
    });
};

const findUser = (id: string) => users.find(u => u.id === id);
const findAma = (id: number) => amas.find(a => a.id === id);

// --- MOCK API SERVICE ---
export const mockApi = {
    // AUTH
    checkAuth: () => simulateRequest(loggedInUser),
    login: async (email: string, password: string) => {
        const user = users.find(u => u.name.toLowerCase().includes(email.split('@')[0]));
        if (user) loggedInUser = user;
        return simulateRequest(user || null);
    },
    signup: async (name: string, email: string, password: string, role: Role) => {
        const newUser: User = { id: `user-${Date.now()}`, name, avatar_url: `https://api.dicebear.com/8.x/bottts/svg?seed=${name}`, role, tier: role === Role.HOST ? 'FREE' : undefined, following: [] };
        users.push(newUser);
        loggedInUser = newUser;
        return simulateRequest(newUser);
    },
    logout: async () => {
        loggedInUser = null;
        return simulateRequest(true);
    },
    requestPasswordReset: async (email: string) => simulateRequest(true),
    updateUserPassword: async (password: string) => simulateRequest(true),

    // DATA FETCHING
    fetchAmas: () => simulateRequest(amas),
    fetchUsers: () => simulateRequest(users),
    fetchMessages: async (amaId: number) => simulateRequest(messages.filter(m => m.ama_id === amaId)),

    // MUTATIONS
    createAma: async (amaData: any) => {
        const newAMA: AMA = {
            ...amaData,
            id: Date.now(),
            host: loggedInUser,
            viewers: 0,
            youtubeUrls: amaData.youtube_url.split(',').filter(Boolean),
            startTime: new Date(amaData.start_time),
        };
        amas.unshift(newAMA);
        return simulateRequest(newAMA);
    },
    updateAma: async (amaId: number, updates: Partial<AMA>) => {
        let updatedAma: AMA | undefined;
        amas = amas.map(a => {
            if (a.id === amaId) {
                updatedAma = { ...a, ...updates };
                if (updates.start_time) updatedAma.startTime = new Date(updates.start_time);
                if (updates.youtube_url) updatedAma.youtubeUrls = updates.youtube_url.split(',').filter(Boolean);
                return updatedAma;
            }
            return a;
        });
        return simulateRequest(updatedAma || null);
    },
    deleteAma: async (amaId: number) => {
        amas = amas.filter(a => a.id !== amaId);
        return simulateRequest(true);
    },
    createMessage: async (amaId: number, text: string) => {
        if (!loggedInUser) return null;
        const newMessage: Message = { id: Date.now(), ama_id: amaId, user_id: loggedInUser.id, text, created_at: new Date().toISOString(), profiles: { ...loggedInUser } };
        messages.push(newMessage);
        return simulateRequest(newMessage);
    },
    updateAmaInteraction: async (amaId: number, type: 'like' | 'dislike') => {
        const ama = findAma(amaId);
        if (ama) {
            if (type === 'like') ama.likes = (ama.likes || 0) + 1;
            else ama.dislikes = (ama.dislikes || 0) + 1;
        }
        return simulateRequest(ama);
    },

    // User Profile
    updateUser: async (userId: string, updates: Partial<User>) => {
        let updatedUser: User | undefined;
        users = users.map(u => {
            if (u.id === userId) {
                updatedUser = { ...u, ...updates };
                return updatedUser;
            }
            return u;
        });
        if (loggedInUser?.id === userId) loggedInUser = updatedUser || null;
        return simulateRequest(updatedUser || null);
    },
    upgradeToHost: async (userId: string) => mockApi.updateUser(userId, { role: Role.HOST, tier: 'FREE' }),
    toggleFollow: async (currentUserId: string, hostId: string) => {
        const user = findUser(currentUserId);
        if (user) {
            const isFollowing = user.following?.includes(hostId);
            if (isFollowing) {
                user.following = user.following?.filter(id => id !== hostId);
            } else {
                user.following = [...(user.following || []), hostId];
            }
            if (loggedInUser?.id === currentUserId) loggedInUser = user;
        }
        return simulateRequest(user);
    },
    uploadAvatarFile: async (file: File) => {
        if (!loggedInUser) return null;
        const newAvatarUrl = `https://api.dicebear.com/8.x/bottts/svg?seed=${Date.now()}`;
        return simulateRequest({ publicUrl: newAvatarUrl });
    },
     
     // Admin
     featureAma: async (amaId: number) => {
        let featuredAma: AMA | undefined;
        amas = amas.map(a => {
            const isThisOne = a.id === amaId;
            if (isThisOne) featuredAma = { ...a, is_featured: true, isFeatured: true };
            return isThisOne ? featuredAma! : { ...a, is_featured: false, isFeatured: false };
        });
        return simulateRequest(featuredAma || null);
     },

     // MISC
     getPaypalClientId: (): string | undefined => {
        // Return a public sandbox client ID for testing purposes
        return 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8iPXYD21_lgQNTYs_xG42QeM2arMs2461g';
     }
};
