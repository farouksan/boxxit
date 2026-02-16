
import { AppState, User } from './types';

export const ME: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
};

export const INITIAL_STATE: AppState = {
  currentUser: ME,
  seenCardIds: [],
  friends: [
    { id: 'user-2', name: 'Sarah Miller', email: 'sarah@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', status: 'friend' },
    { id: 'user-3', name: 'John Doe', email: 'john@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', status: 'friend' },
    { id: 'user-4', name: 'Emma Wilson', email: 'emma@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', status: 'pending_received' },
    { id: 'user-5', name: 'Mike Ross', email: 'mike@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', status: 'none' }
  ],
  groups: [
    { id: 'group-1', name: 'Family' },
    { id: 'group-2', name: 'Work Projects' }
  ],
  baskets: [
    {
      id: 'basket-1',
      title: 'Summer Vacation Ideas',
      description: 'Places to visit in Greece and Italy.',
      color: '#3B82F6',
      image: 'https://picsum.photos/seed/beach/400/200',
      members: [
        { userId: ME.id, role: 'admin', joinedAt: Date.now(), status: 'accepted' },
        { userId: 'user-2', role: 'contributor', joinedAt: Date.now(), status: 'accepted' }
      ],
      scribbles: [
        { id: 's1', authorId: 'user-2', authorName: 'Sarah Miller', text: 'Check out this beach!', timestamp: Date.now() - 10000 }
      ],
      isPinned: true,
      isArchived: false,
      creatorId: ME.id,
      groupId: 'group-1',
      createdAt: Date.now() - 1000000,
      lastViewedAt: Date.now() - 500000,
      lastReadChatAt: Date.now() - 20000,
      viewMode: 'max'
    },
    {
      id: 'basket-2',
      title: 'Technical Learning',
      description: 'Resources for React and GenAI.',
      color: '#10B981',
      members: [{ userId: ME.id, role: 'admin', joinedAt: Date.now(), status: 'accepted' }],
      scribbles: [],
      isPinned: false,
      isArchived: false,
      creatorId: ME.id,
      createdAt: Date.now() - 2000000,
      lastViewedAt: Date.now() - 1000000,
      viewMode: 'max'
    },
    {
      id: 'basket-invitation',
      title: 'Secret Project',
      description: 'A top secret invitation.',
      color: '#8E8E93',
      members: [
        { userId: ME.id, role: 'contributor', joinedAt: Date.now(), status: 'pending' },
        { userId: 'user-3', role: 'admin', joinedAt: Date.now(), status: 'accepted' }
      ],
      scribbles: [],
      isPinned: false,
      isArchived: false,
      creatorId: 'user-3',
      createdAt: Date.now() - 50000,
      lastViewedAt: Date.now() - 50000,
      viewMode: 'max'
    }
  ],
  cards: [
    {
      id: 'card-1',
      text: 'Santorini Travel Guide: Sunset views are amazing.',
      attachments: [{ id: 'att-1', type: 'image', url: 'https://picsum.photos/seed/santorini/400/300' }],
      scribbles: [],
      creatorId: ME.id,
      creatorName: ME.name,
      basketIds: ['basket-1'],
      timestamp: Date.now() - 50000,
      order: 0
    }
  ],
  activities: [
    {
      id: 'a1',
      type: 'card_added',
      userId: ME.id,
      userName: ME.name,
      targetId: 'basket-1',
      targetName: 'Summer Vacation Ideas',
      timestamp: Date.now() - 50000
    },
    {
      id: 'inv-1',
      type: 'basket_invited',
      userId: 'user-3',
      userName: 'John Doe',
      targetId: 'basket-invitation',
      targetName: 'Secret Project',
      timestamp: Date.now() - 40000
    }
  ],
  feedSettings: {
    showCards: true,
    showMembers: true,
    showScribbles: true,
    showBaskets: true
  }
};
