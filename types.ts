export type Role = 'admin' | 'contributor';
export type ViewMode = 'mini' | 'max';

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  status?: 'none' | 'pending_sent' | 'pending_received' | 'friend';
}

export interface Member {
  userId: string;
  role: Role;
  joinedAt: number;
  status?: 'pending' | 'accepted';
}

export interface Scribble {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  timestamp: number;
}

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'file' | 'link';
  url: string;
  name?: string;
}

export interface Card {
  id: string;
  text: string;
  attachments: Attachment[];
  scribbles: Scribble[];
  creatorId: string;
  creatorName: string;
  basketIds: string[];
  timestamp: number;
  order?: number;
  isPinned?: boolean;
}

export interface Basket {
  id: string;
  title: string;
  description: string;
  color: string;
  image?: string;
  members: Member[];
  scribbles: Scribble[];
  isPinned: boolean;
  isArchived: boolean;
  groupId?: string;
  creatorId: string;
  createdAt: number;
  lastViewedAt: number;
  lastReadChatAt?: number;
  viewMode: ViewMode;
}

export interface BasketGroup {
  id: string;
  name: string;
}

export type ActivityType = 
  | 'card_added' 
  | 'card_moved'
  | 'card_pinned'
  | 'card_unpinned'
  | 'basket_added' 
  | 'basket_invited' 
  | 'basket_invitation_accepted' 
  | 'basket_archived' 
  | 'basket_deleted'
  | 'member_added' 
  | 'member_removed' 
  | 'scribble_added' 
  | 'friend_added' 
  | 'friend_invited' 
  | 'friend_invitation_received' 
  | 'friend_invitation_declined';

export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  targetId: string;
  targetName: string;
  secondaryTargetId?: string;
  secondaryTargetName?: string;
  details?: string;
  timestamp: number;
}

export interface AppState {
  currentUser: User;
  baskets: Basket[];
  cards: Card[];
  groups: BasketGroup[];
  activities: Activity[];
  friends: User[];
  seenCardIds: string[];
  feedSettings: {
    showCards: boolean;
    showMembers: boolean;
    showScribbles: boolean;
    showBaskets: boolean;
  };
}