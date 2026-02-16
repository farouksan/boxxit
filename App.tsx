import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, useParams, Navigate, Link } from 'react-router-dom';
import { 
  Plus, 
  MoreHorizontal, 
  Link as LinkIcon, 
  User as UserIcon,
  MessageCircle,
  ChevronLeft,
  Layers,
  Search as SearchIcon,
  Clock,
  Package,
  Trash2,
  Info,
  Send,
  SortAsc,
  Archive,
  File as FileIcon,
  Check,
  LayoutGrid,
  List,
  Move,
  Edit2,
  ChevronRight as ChevronRightIcon,
  UserPlus,
  UserX,
  UserCheck,
  Mail,
  Calendar,
  ArrowDown,
  Pin,
  Copy,
  Image as ImageIcon,
  AlertCircle,
  X,
  Maximize2,
  CircleX,
  ArrowDownCircle,
  Share2
} from 'lucide-react';
import { AppState, Basket, Card, Activity, Scribble, Role, Member, ViewMode, ActivityType, User, Attachment } from './types';
import { INITIAL_STATE, ME } from './mockData';

// --- Shared Components ---

const PlayfulLogo = () => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate('/')}
      className="flex items-center leading-none select-none transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer group px-1 py-1"
    >
      <span className="text-[20px] font-black italic tracking-tighter text-[#FF3B30] group-hover:text-black transition-colors">Boxxit!</span>
    </div>
  );
};

const ScrollToBottomButton = ({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const isScrollable = el.scrollHeight > el.clientHeight + 100;
      const isNotAtBottom = el.scrollTop + el.clientHeight < el.scrollHeight - 50;
      setVisible(isScrollable && isNotAtBottom);
    };

    el.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => el.removeEventListener('scroll', handleScroll);
  }, [scrollRef]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  if (!visible) return null;

  return (
    <button 
      onClick={scrollToBottom}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-[60] bg-white/90 backdrop-blur shadow-lg border border-black/5 text-[#FF3B30] p-3 rounded-full active:scale-90 transition-all animate-bounce"
      aria-label="Scroll to bottom"
    >
      <ArrowDown size={24} strokeWidth={3} />
    </button>
  );
};

const IOSHeader = ({ 
  title, 
  subtitle,
  showBack, 
  hideBackLabel,
  onTitleClick,
  rightContent, 
  leftContent,
  titleAlign = 'center'
}: { 
  title: string | React.ReactNode, 
  subtitle?: string,
  showBack?: boolean, 
  hideBackLabel?: boolean,
  onTitleClick?: () => void,
  rightContent?: React.ReactNode, 
  leftContent?: React.ReactNode,
  titleAlign?: 'center' | 'left'
}) => {
  const navigate = useNavigate();
  return (
    <div className="ios-header sticky top-0 left-0 right-0 z-50 min-h-[44px] flex items-center px-4 py-1 bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <div className="flex-1 flex items-center">
        {showBack ? (
          <button onClick={() => navigate(-1)} className="flex items-center text-[#FF3B30] -ml-1 active:opacity-50 transition-opacity">
            <ChevronLeft size={24} />
            {!hideBackLabel && <span className="text-[17px] font-medium">Back</span>}
          </button>
        ) : leftContent}
      </div>
      <div className={`flex-[4] flex flex-col truncate px-2 ${titleAlign === 'center' ? 'items-center justify-center' : 'items-start justify-center'}`}>
        <button 
          onClick={onTitleClick}
          disabled={!onTitleClick}
          className={`flex flex-col min-w-0 w-full ${titleAlign === 'center' ? 'items-center' : 'items-start'} ${onTitleClick ? 'active:opacity-50 transition-opacity' : ''}`}
        >
          <span className={`font-bold text-[17px] truncate w-full leading-tight ${titleAlign === 'center' ? 'text-center' : 'text-left'}`}>{title}</span>
          {subtitle && <span className={`text-[11px] text-[#8E8E93] font-medium leading-none mt-0.5 truncate w-full ${titleAlign === 'center' ? 'text-center' : 'text-left'}`}>{subtitle}</span>}
        </button>
      </div>
      <div className="flex-1 flex justify-end items-center">
        {rightContent}
      </div>
    </div>
  );
};

const IOSTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const basketMatch = location.pathname.match(/\/basket\/([^/]+)/);
  const currentBasketId = basketMatch ? basketMatch[1] : null;

  const tabs = [
    { path: '/', icon: Package, label: 'Boxes' },
    { path: '/feed', icon: Clock, label: 'Activity' },
    { 
      path: '/new-card', 
      icon: Plus, 
      label: 'Card', 
      isAction: true 
    },
    { path: '/search', icon: SearchIcon, label: 'Search' },
    { path: '/members', icon: UserIcon, label: 'Members' },
  ];

  return (
    <div className="ios-tab-bar fixed bottom-0 left-0 right-0 h-[83px] flex items-center pt-2 px-0 pb-[safe-area-inset-bottom] z-50">
      {tabs.map((tab) => {
        const isActive = !tab.isAction && (
          location.pathname === tab.path || 
          (tab.path === '/' && location.pathname.startsWith('/basket/')) || 
          (tab.path === '/members' && (location.pathname === '/members' || location.pathname.startsWith('/member/')))
        );
        
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path + (tab.isAction && currentBasketId ? `?basketId=${currentBasketId}` : ''))}
            className={`flex flex-col items-center gap-1 transition-colors flex-1 ${isActive ? 'text-[#FF3B30]' : 'text-[#8E8E93]'}`}
          >
            {tab.isAction ? (
              <div className="w-9 h-9 bg-[#FF3B30] rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform mb-0.5">
                <Plus size={22} color="white" strokeWidth={3} />
              </div>
            ) : (
              <tab.icon size={24} strokeWidth={isActive ? 2.5 : 2} className="mb-1" />
            )}
            <span className={`text-[10px] font-medium ${tab.isAction ? 'text-[#FF3B30]' : ''}`}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// --- Dialog Components ---

const ConfirmDialog = ({ title, message, onConfirm, onCancel }: { title: string, message: string, onConfirm: () => void, onCancel: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[24px] w-full max-w-xs overflow-hidden shadow-2xl animate-scale-up">
        <div className="p-6 text-center">
          <h3 className="text-[19px] font-black text-gray-900 mb-2">{title}</h3>
          <p className="text-[14px] text-gray-500 font-medium leading-relaxed">{message}</p>
        </div>
        <div className="flex flex-col border-t border-gray-100">
          <button onClick={onConfirm} className="w-full py-4 text-[#FF3B30] font-black uppercase tracking-widest text-[13px] active:bg-gray-50 transition-colors">Confirm</button>
          <button onClick={onCancel} className="w-full py-4 text-gray-900 font-bold uppercase tracking-widest text-[13px] border-t border-gray-100 active:bg-gray-50 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
};

// --- Chat Input ---

const BoxChatInput = ({ basketId, dispatch }: { basketId: string, dispatch: any }) => {
  const [text, setText] = useState('');
  const handleSend = () => {
    if (!text.trim()) return;
    dispatch({ 
      type: 'ADD_BASKET_SCRIBBLE', 
      basketId, 
      scribble: { id: Date.now().toString(), authorId: ME.id, authorName: ME.name, text: text.trim(), timestamp: Date.now() } 
    });
    setText('');
  };
  return (
    <div className="fixed bottom-[83px] left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-3 z-50 flex items-center gap-2">
      <input 
        className="flex-1 bg-[#F2F2F7] rounded-full px-4 py-2 outline-none text-[15px] font-medium focus:bg-white transition-all border border-transparent focus:border-black/5" 
        placeholder="Quick scribble..." 
        value={text} 
        onChange={e => setText(e.target.value)} 
        onKeyDown={e => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend} className="bg-[#FF3B30] text-white p-2 rounded-full active:scale-90 transition-transform shadow-md"><Send size={18}/></button>
    </div>
  );
};

// --- Card Components ---

const CardPost: React.FC<{ card: Card, viewMode: ViewMode, dispatch: any, state: AppState }> = ({ card, viewMode, dispatch, state }) => {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  const isMax = viewMode === 'max';

  const images = card.attachments.filter(a => a.type === 'image');
  const otherAttachments = card.attachments.filter(a => a.type !== 'image');

  return (
    <div className={`border-b border-gray-100 bg-white ${isMax ? 'py-4' : 'py-2 px-4'}`}>
      {isMax ? (
        <div className="space-y-3">
          <div className="px-4 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[10px] font-black uppercase text-gray-400">
                {card.creatorName.substring(0, 2)}
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-900 leading-tight">{card.creatorName}</p>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{new Date(card.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {card.isPinned && <Pin size={14} className="text-[#FF3B30] fill-[#FF3B30] mr-1" />}
              <button onClick={() => setShowActions(!showActions)} className="p-1 text-gray-400"><MoreHorizontal size={20} /></button>
            </div>
          </div>

          {images.length > 0 && (
            <div className="px-0">
              <img src={images[0].url} className="w-full aspect-[4/3] object-cover" alt="" />
            </div>
          )}

          <div className="px-4">
            <p className="text-[16px] text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">{card.text}</p>
          </div>

          {otherAttachments.length > 0 && (
            <div className="px-4 flex flex-wrap gap-2">
              {otherAttachments.map(att => (
                <div key={att.id} className="flex items-center gap-2 bg-[#F2F2F7] px-3 py-1.5 rounded-full border border-black/5 max-w-full">
                  {att.type === 'link' ? <LinkIcon size={14}/> : <FileIcon size={14}/>}
                  <span className="text-[12px] font-bold truncate max-w-[150px]">{att.name || att.url}</span>
                </div>
              ))}
            </div>
          )}

          {card.scribbles.length > 0 && (
            <div className="px-4 mt-2 space-y-1">
              {card.scribbles.slice(-2).map(s => (
                <p key={s.id} className="text-[13px] leading-snug">
                  <span className="font-bold mr-1.5 text-black">{s.authorName}</span>
                  <span className="text-gray-600 font-medium">{s.text}</span>
                </p>
              ))}
              {card.scribbles.length > 2 && (
                <button onClick={() => navigate(`/edit-card/${card.id}`)} className="text-[12px] font-black text-[#FF3B30] mt-1 uppercase tracking-wider">View all {card.scribbles.length} scribbles</button>
              )}
            </div>
          )}

          {showActions && (
            <div className="px-4 pt-2 flex gap-2 animate-fade-in">
              <button onClick={() => navigate(`/edit-card/${card.id}`)} className="flex-1 bg-[#F2F2F7] py-2.5 rounded-xl text-[13px] font-black uppercase tracking-tight text-gray-700 flex items-center justify-center gap-2 active:bg-gray-200 transition-colors"><Edit2 size={14}/> Edit</button>
              <button onClick={() => dispatch({ type: 'TOGGLE_CARD_PIN', cardId: card.id })} className="flex-1 bg-[#F2F2F7] py-2.5 rounded-xl text-[13px] font-black uppercase tracking-tight text-gray-700 flex items-center justify-center gap-2 active:bg-gray-200 transition-colors"><Pin size={14}/> {card.isPinned ? 'Unpin' : 'Pin'}</button>
              <button onClick={() => dispatch({ type: 'DELETE_CARD', cardId: card.id })} className="flex-1 bg-[#FF3B30]/10 py-2.5 rounded-xl text-[13px] font-black uppercase tracking-tight text-[#FF3B30] flex items-center justify-center gap-2 active:bg-[#FF3B30]/20 transition-colors"><Trash2 size={14}/> Delete</button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4 py-1.5" onClick={() => navigate(`/edit-card/${card.id}`)}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#F2F2F7] flex items-center justify-center flex-shrink-0 border border-black/5 overflow-hidden shadow-sm">
              {images[0] ? <img src={images[0].url} className="w-full h-full object-cover" /> : <FileIcon className="text-gray-300" size={18}/>}
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-gray-900 truncate leading-tight flex items-center gap-1.5">
                {card.isPinned && <Pin size={10} className="text-[#FF3B30] fill-[#FF3B30]" />}
                {card.text}
              </p>
              <p className="text-[11px] text-[#8E8E93] font-bold uppercase tracking-tight mt-0.5">{card.creatorName} • {new Date(card.timestamp).toLocaleDateString()}</p>
            </div>
          </div>
          <ChevronRightIcon size={16} className="text-gray-300 flex-shrink-0" />
        </div>
      )}
    </div>
  );
};

const CardFormScreen = ({ state, dispatch, isEdit = false }: { state: AppState, dispatch: any, isEdit?: boolean }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialBasketId = queryParams.get('basketId') || (state.baskets[0]?.id || '');

  const card = isEdit ? state.cards.find(c => c.id === id) : null;
  
  const [text, setText] = useState(card?.text || '');
  const [basketIds, setBasketIds] = useState<string[]>(card?.basketIds || (initialBasketId ? [initialBasketId] : []));
  const [attachments, setAttachments] = useState<Attachment[]>(card?.attachments || []);
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');
  const [newScribble, setNewScribble] = useState('');

  const handleSave = () => {
    if (!text.trim() || basketIds.length === 0) return;
    if (isEdit && card) {
      dispatch({ type: 'UPDATE_CARD', cardId: card.id, updates: { text, basketIds, attachments } });
    } else {
      const newCard: Card = {
        id: Math.random().toString(36).substr(2, 9),
        text,
        attachments,
        scribbles: [],
        creatorId: ME.id,
        creatorName: ME.name,
        basketIds,
        timestamp: Date.now(),
        isPinned: false
      };
      dispatch({ type: 'ADD_CARD', card: newCard });
    }
    navigate(-1);
  };

  const addAttachment = () => {
    if (!newAttachmentUrl.trim()) return;
    const type: any = newAttachmentUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'image' : 'link';
    const newAtt: Attachment = { id: Date.now().toString(), type, url: newAttachmentUrl };
    setAttachments([...attachments, newAtt]);
    setNewAttachmentUrl('');
  };

  const addScribble = () => {
    if (!newScribble.trim() || !card) return;
    const scribble: Scribble = { id: Date.now().toString(), authorId: ME.id, authorName: ME.name, text: newScribble, timestamp: Date.now() };
    dispatch({ type: 'ADD_CARD_SCRIBBLE', cardId: card.id, scribble });
    setNewScribble('');
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <IOSHeader 
        title={isEdit ? "Edit Card" : "New Card"} 
        leftContent={<button onClick={() => navigate(-1)} className="text-[#FF3B30] font-bold">Cancel</button>} 
        rightContent={<button onClick={handleSave} className="text-[#FF3B30] font-bold">Done</button>} 
      />
      <div className="p-4 space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Content</label>
          <textarea 
            className="w-full p-4 bg-[#F2F2F7] rounded-3xl outline-none min-h-[120px] text-[17px] font-medium resize-none focus:bg-white focus:ring-2 ring-[#FF3B30]/10 transition-all shadow-sm border border-black/5" 
            placeholder="What's on your mind? Link, idea, or note..." 
            value={text} 
            onChange={e => setText(e.target.value)} 
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">In Boxes</label>
          <div className="flex flex-wrap gap-2">
            {state.baskets.filter(b => !b.isArchived).map(b => {
              const isSelected = basketIds.includes(b.id);
              return (
                <button 
                  key={b.id} 
                  onClick={() => setBasketIds(isSelected ? basketIds.filter(id => id !== b.id) : [...basketIds, b.id])}
                  className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all border ${isSelected ? 'bg-black text-white border-black shadow-md' : 'bg-white text-gray-500 border-gray-100 shadow-sm'}`}
                >
                  {b.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Attachments</label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input 
                className="flex-1 bg-[#F2F2F7] rounded-2xl px-4 py-3 outline-none text-[14px] font-medium focus:bg-white border border-transparent focus:border-black/5" 
                placeholder="Link or Image URL" 
                value={newAttachmentUrl} 
                onChange={e => setNewAttachmentUrl(e.target.value)} 
              />
              <button onClick={addAttachment} className="bg-black text-white px-5 rounded-2xl font-black uppercase tracking-widest text-[12px] active:scale-95 transition-transform shadow-md">Add</button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {attachments.map(att => (
                <div key={att.id} className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    {att.type === 'image' ? <ImageIcon size={18} className="text-blue-500"/> : <LinkIcon size={18} className="text-orange-500"/>}
                    <span className="text-[13px] font-bold truncate text-gray-700">{att.url}</span>
                  </div>
                  <button onClick={() => setAttachments(attachments.filter(a => a.id !== att.id))} className="text-gray-300 p-1 hover:text-[#FF3B30] transition-colors"><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isEdit && (
          <div className="space-y-3 pt-6 border-t border-gray-100">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Card Scribbles</label>
            <div className="space-y-3">
              {card?.scribbles.map(s => (
                <div key={s.id} className="p-3 bg-[#F2F2F7] rounded-2xl border border-black/5 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-[#8E8E93] mb-1">{s.authorName} • {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-[14px] text-gray-800 font-medium">{s.text}</p>
                </div>
              ))}
              <div className="flex gap-2">
                <input 
                  className="flex-1 bg-white border border-gray-100 rounded-2xl px-4 py-3 outline-none text-[14px] font-medium focus:ring-2 ring-[#FF3B30]/10 transition-all shadow-sm" 
                  placeholder="Add a scribble..." 
                  value={newScribble} 
                  onChange={e => setNewScribble(e.target.value)} 
                />
                <button onClick={addScribble} className="bg-[#FF3B30] text-white p-3 rounded-2xl active:scale-90 transition-transform shadow-md"><Send size={18}/></button>
              </div>
            </div>
            <button 
              onClick={() => { dispatch({ type: 'DELETE_CARD', cardId: card?.id }); navigate(-1); }}
              className="w-full mt-8 py-4 text-[#FF3B30] font-black uppercase tracking-widest text-[11px] opacity-60 hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
            >
              <Trash2 size={16} /> Delete Card Permanently
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Invitation Screen ---

const InviteFriendScreen = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('Hey! I use Boxxit! to collect and share links, videos, and files. I\'d love to connect with you there so we can share stuff together!');

  const appLink = "https://boxxit.app/download";
  const inviteMessage = `${note}\n\nDownload Boxxit! here: ${appLink}\n\nOnce you sign up with your email, you'll see my invitation to connect!`;

  const handleEmailInvite = () => {
    const subject = encodeURIComponent("Join me on Boxxit!");
    const body = encodeURIComponent(inviteMessage);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const handleWhatsAppInvite = () => {
    const text = encodeURIComponent(inviteMessage);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteMessage);
    alert('Invitation text copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <IOSHeader title="Invite Friend" showBack hideBackLabel />
      <div className="p-6 space-y-8 animate-slide-up">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-[#FF3B30]/10 text-[#FF3B30] rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900">New Connection</h2>
          <p className="text-gray-500 text-sm px-6 font-medium">Invite someone to join Boxxit! and connect with you to start sharing boxes.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest px-1">Their Name</label>
            <input 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full p-4 bg-[#F2F2F7] rounded-2xl outline-none focus:bg-white focus:ring-2 ring-[#FF3B30]/10 transition-all text-[16px] font-medium border border-black/5"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest px-1">Their Email</label>
            <input 
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full p-4 bg-[#F2F2F7] rounded-2xl outline-none focus:bg-white focus:ring-2 ring-[#FF3B30]/10 transition-all text-[16px] font-medium border border-black/5"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest px-1">Personal Note</label>
            <textarea 
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={4}
              className="w-full p-4 bg-[#F2F2F7] rounded-2xl outline-none focus:bg-white focus:ring-2 ring-[#FF3B30]/10 transition-all text-[15px] font-medium resize-none border border-black/5"
            />
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={handleEmailInvite}
            disabled={!email || !name}
            className="w-full bg-[#FF3B30] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[13px] flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
          >
            <Mail size={22} /> Send via Email
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleWhatsAppInvite}
              className="bg-[#25D366] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[12px] flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <MessageCircle size={20} /> WhatsApp
            </button>
            <button 
              onClick={handleCopyLink}
              className="bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[12px] flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <Copy size={20} /> Copy Text
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-[#8E8E93] font-bold uppercase tracking-tight">
          Once they sign up, you'll be connected automatically!
        </p>
      </div>
    </div>
  );
};

// --- Screen Containers ---

const BasketsScreen = ({ state, dispatch }: { state: AppState, dispatch: any }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [sortType, setSortType] = useState<'recent' | 'unread' | 'alpha' | 'archived'>('recent');
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredBaskets = useMemo(() => {
    const showArchived = sortType === 'archived';
    let result = state.baskets.filter(b => b.isArchived === showArchived && b.title.toLowerCase().includes(filter.toLowerCase()));
    result.sort((a, b) => {
      if (!showArchived && a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      if (sortType === 'alpha') return a.title.localeCompare(b.title);
      return b.lastViewedAt - a.lastViewedAt;
    });
    return result;
  }, [state.baskets, filter, sortType]);

  const pinnedCards = useMemo(() => state.cards.filter(c => c.isPinned), [state.cards]);

  const getBoxActivityStatus = useCallback((basket: Basket) => {
    const latestCard = state.cards
      .filter(c => c.basketIds.includes(basket.id))
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    const latestScribble = basket.scribbles[basket.scribbles.length - 1];
    
    const lastContentTs = Math.max(
      latestCard?.timestamp || 0,
      latestScribble?.timestamp || 0,
      basket.createdAt
    );
    
    return lastContentTs > basket.lastViewedAt;
  }, [state.cards]);

  return (
    <div className="min-h-screen bg-white pb-32 h-screen overflow-y-auto no-scrollbar" ref={scrollRef}>
      <IOSHeader title="Boxes" leftContent={<PlayfulLogo />} rightContent={<button onClick={() => navigate('/new-basket')} className="text-[#FF3B30] active:scale-90 transition-transform"><Plus size={28} strokeWidth={3} /></button>} />
      
      {pinnedCards.length > 0 && (
        <div className="px-4 py-3 bg-white border-b border-gray-50 overflow-hidden shadow-sm">
          <h2 className="text-xs font-black text-[#8E8E93] uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Pin size={12} className="fill-[#8E8E93] text-[#8E8E93]" /> Pinned Cards
          </h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {pinnedCards.map(card => (
              <div 
                key={card.id} 
                onClick={() => {
                  if (card.basketIds.length > 0) navigate(`/basket/${card.basketIds[0]}`);
                }}
                className="flex-shrink-0 w-32 bg-white rounded-2xl border border-gray-100 shadow-sm p-2 active:scale-95 transition-transform"
              >
                <div className="aspect-square bg-[#F2F2F7] rounded-xl mb-2 flex items-center justify-center overflow-hidden border border-black/5">
                  {card.attachments.filter(a => a.type === 'image')[0] ? (
                    <img src={card.attachments.filter(a => a.type === 'image')[0].url} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <Package size={24} className="text-gray-300" />
                  )}
                </div>
                <p className="text-[11px] font-bold line-clamp-2 leading-tight text-gray-900">{card.text}</p>
                <div className="flex items-center justify-between mt-1">
                   <button 
                    onClick={(e) => { e.stopPropagation(); dispatch({ type: 'TOGGLE_CARD_PIN', cardId: card.id }); }}
                    className="p-1 text-[#FF3B30]"
                   >
                     <Pin size={12} className="fill-current" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 py-2 bg-white sticky top-0 z-40 border-b border-gray-50 space-y-3 shadow-sm">
        <div className="bg-[#F2F2F7] rounded-xl h-[40px] flex items-center px-3 gap-2 border border-black/5 focus-within:ring-2 ring-[#FF3B30]/20 transition-all relative">
          <SearchIcon size={18} className="text-[#8E8E93] flex-shrink-0" />
          <input 
            placeholder="Search Boxes" 
            className="bg-transparent w-full text-[17px] font-medium outline-none placeholder:text-[#8E8E93] pr-8" 
            value={filter} 
            onChange={e => setFilter(e.target.value)} 
          />
          {filter && (
            <button 
              onClick={() => setFilter('')} 
              className="absolute right-2 p-1 text-[#8E8E93] active:opacity-50"
            >
              <CircleX size={18} fill="currentColor" className="text-gray-400" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {[{ id: 'recent', label: 'Recent', icon: Clock }, { id: 'alpha', label: 'A-Z', icon: SortAsc }, { id: 'archived', label: 'Archived', icon: Archive }].map(t => {
            const isActive = sortType === t.id;
            return (
              <button 
                key={t.id} 
                onClick={() => setSortType(t.id as any)} 
                className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm ${
                  isActive 
                    ? 'bg-black text-white shadow-md' 
                    : 'bg-[#F2F2F7] text-[#8E8E93]'
                }`}
              >
                <t.icon size={13} strokeWidth={3} /> {t.label}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        {filteredBaskets.map(b => {
          const myMemberStatus = b.members.find(m => m.userId === ME.id)?.status;
          const isPending = myMemberStatus === 'pending';
          const hasNewActivity = getBoxActivityStatus(b);
          const cardsCount = state.cards.filter(c => c.basketIds.includes(b.id)).length;
          const membersCount = b.members.filter(m => m.status === 'accepted').length;
          
          return (
            <div key={b.id} className={`ios-row rounded-2xl overflow-hidden shadow-sm border border-black/5 bg-white ${isPending ? 'opacity-60' : ''}`}>
              <div 
                className="ios-row-content p-4 flex items-center justify-between active:bg-gray-50 cursor-pointer transition-colors bg-white" 
                onClick={() => { dispatch({ type: 'VIEW_BASKET', basketId: b.id }); navigate(`/basket/${b.id}`); }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm border border-black/5 relative bg-[#F2F2F7] ${isPending ? 'grayscale' : ''}`}>
                    {b.image ? <img src={b.image} className="w-full h-full object-cover" alt="" /> : <Layers size={28} className="text-gray-300" />}
                    {hasNewActivity && !isPending && (
                       <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-[#FF3B30] rounded-full border border-white shadow-sm z-10 animate-pulse" />
                    )}
                    {b.isPinned && (
                      <div className="absolute bottom-1 right-1 bg-black p-0.5 rounded-full border border-white">
                        <Pin size={8} className="text-white fill-white" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-bold truncate leading-tight flex items-center gap-2 text-gray-900">
                      {b.title}
                      {isPending && <span className="bg-[#FF3B30]/10 text-[#FF3B30] text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-black">Invitation</span>}
                    </h3>
                    <p className="text-[13px] text-[#8E8E93] font-bold uppercase tracking-tight truncate mt-0.5">{cardsCount} cards • {membersCount} members</p>
                  </div>
                </div>
                <ChevronRightIcon size={18} className="text-gray-300" />
              </div>
              <div className="ios-row-actions">
                <button 
                  onClick={(e) => { e.stopPropagation(); dispatch({ type: 'TOGGLE_PIN', basketId: b.id }); }} 
                  className={`action-btn min-w-[80px] font-black uppercase text-[12px] tracking-widest ${b.isPinned ? 'bg-gray-800' : 'bg-black'}`}
                >
                  <Pin size={18} className={`mr-1 ${b.isPinned ? 'fill-white' : ''}`} />
                  {b.isPinned ? 'Unpin' : 'Pin'}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); dispatch({ type: 'TOGGLE_ARCHIVE', basketId: b.id }); }} 
                  className="action-btn min-w-[100px] font-black uppercase text-[12px] tracking-widest bg-gray-400"
                >
                  <Archive size={18} className="mr-1" />
                  {b.isArchived ? 'Restore' : 'Archive'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <ScrollToBottomButton scrollRef={scrollRef} />
    </div>
  );
};

const BasketDetailScreen = ({ state, dispatch }: { state: AppState, dispatch: any }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const basket = state.baskets.find(b => b.id === id);
  const scrollRef = useRef<HTMLDivElement>(null);

  const cards = useMemo(() => {
    let filtered = state.cards.filter(c => c.basketIds.includes(id || ''));
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(c => c.text.toLowerCase().includes(q));
    }
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return (b.timestamp || 0) - (a.timestamp || 0);
    });
  }, [state.cards, id, searchTerm]);

  const userMember = basket?.members.find(m => m.userId === ME.id);
  const isPending = userMember?.status === 'pending';

  const creatorName = useMemo(() => {
    if (!basket) return '';
    if (basket.creatorId === ME.id) return 'You';
    return state.friends.find(f => f.id === basket.creatorId)?.name || 'Someone';
  }, [basket, state.friends]);

  const membersCount = useMemo(() => basket?.members.filter(m => m.status === 'accepted').length || 0, [basket]);

  const hasNewChat = useMemo(() => {
    if (!basket) return false;
    const lastChat = basket.scribbles[basket.scribbles.length - 1];
    if (!lastChat) return false;
    return !basket.lastReadChatAt || lastChat.timestamp > basket.lastReadChatAt;
  }, [basket]);

  const toggleViewMode = () => {
    if (!basket) return;
    dispatch({ type: 'UPDATE_BASKET', basketId: basket.id, updates: { viewMode: basket.viewMode === 'max' ? 'mini' : 'max' } });
  };

  if (!basket) return null;

  return (
    <div className="min-h-screen bg-white pb-[180px] h-screen overflow-y-auto no-scrollbar" ref={scrollRef}>
      <IOSHeader 
        title={basket.title} 
        subtitle={`${cards.length} cards • ${membersCount} members • By ${creatorName}`} 
        showBack 
        hideBackLabel 
        titleAlign="left"
        onTitleClick={() => navigate(`/edit-basket/${basket.id}`)} 
        rightContent={
          <div className="flex items-center gap-1.5">
            {!isPending && (
              <button onClick={toggleViewMode} className="text-[#FF3B30] p-1.5 active:scale-90 transition-transform">
                {basket.viewMode === 'max' ? <List size={22} strokeWidth={2.5}/> : <LayoutGrid size={22} strokeWidth={2.5}/>}
              </button>
            )}
          </div>
        } 
      />
      
      {isPending && (
        <div className="p-8 bg-white m-4 rounded-3xl text-center space-y-5 animate-slide-up shadow-sm border border-black/5">
          <div className="w-16 h-16 bg-[#F2F2F7] rounded-full flex items-center justify-center mx-auto text-[#FF3B30] shadow-sm">
            <Layers size={32} />
          </div>
          <div>
            <h2 className="font-black text-lg mb-1 text-gray-900">Invitation Received</h2>
            <p className="text-gray-500 text-sm font-medium">You've been invited to join this box by <span className="font-bold">{creatorName}</span>.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => dispatch({ type: 'ACCEPT_BASKET_INVITATION', basketId: basket.id })} 
              className="flex-1 bg-[#FF3B30] text-white py-3.5 rounded-2xl font-black uppercase tracking-widest text-[12px] shadow-lg active:scale-95 transition-transform"
            >
              Accept
            </button>
            <button 
              onClick={() => { dispatch({ type: 'DECLINE_BASKET_INVITATION', basketId: basket.id }); navigate('/'); }} 
              className="flex-1 bg-white text-gray-700 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[12px] active:scale-95 transition-transform shadow-sm border border-black/5"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {!isPending && (
        <div className="px-4 py-3 bg-white sticky top-0 z-40 border-b border-gray-50 flex items-center gap-2 shadow-sm">
          <div className="bg-[#F2F2F7] rounded-xl h-[40px] flex-1 flex items-center px-3 gap-2 border border-black/5 focus-within:ring-2 ring-[#FF3B30]/20 transition-all relative">
            <SearchIcon size={18} className="text-[#8E8E93] flex-shrink-0" />
            <input 
              placeholder={`Search in ${basket.title}...`} 
              className="bg-transparent w-full text-[16px] font-medium outline-none placeholder:text-[#8E8E93] pr-8" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-2 p-1 text-[#8E8E93] active:opacity-50"
              >
                <CircleX size={18} fill="currentColor" className="text-gray-200" />
              </button>
            )}
          </div>
          <button 
            onClick={() => navigate(`/basket-chat/${basket.id}`)}
            className="p-2 relative active:scale-90 transition-transform text-[#FF3B30] bg-[#F2F2F7] rounded-xl border border-black/5"
          >
            <MessageCircle size={22} strokeWidth={2.5} />
            {hasNewChat && <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF3B30] rounded-full border border-white shadow-sm" />}
          </button>
        </div>
      )}

      <div className="space-y-0">
        {!isPending && cards.map((c: Card) => <CardPost key={c.id} card={c} viewMode={basket.viewMode} dispatch={dispatch} state={state} />)}
        {!isPending && cards.length === 0 && (
          <div className="p-16 text-center space-y-4">
            <div className="w-20 h-20 bg-[#F2F2F7] rounded-full flex items-center justify-center mx-auto text-gray-300 shadow-inner">
              <Package size={40} />
            </div>
            <p className="text-[#8E8E93] font-bold uppercase tracking-tight">
              {searchTerm ? `No cards match "${searchTerm}"` : 'This box is empty. Add a card!'}
            </p>
          </div>
        )}
      </div>
      {!isPending && <BoxChatInput basketId={basket.id} dispatch={dispatch} />}
      <ScrollToBottomButton scrollRef={scrollRef} />
    </div>
  );
};

const BasketChatScreen = ({ state, dispatch }: { state: AppState, dispatch: any }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const basket = state.baskets.find(b => b.id === id);
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (basket) {
      dispatch({ type: 'MARK_BASKET_CHAT_READ', basketId: basket.id });
    }
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [id, basket?.scribbles.length]);

  if (!basket) return null;

  const handleSend = () => {
    if (!text.trim()) return;
    dispatch({ 
      type: 'ADD_BASKET_SCRIBBLE', 
      basketId: basket.id, 
      scribble: { id: Date.now().toString(), authorId: ME.id, authorName: ME.name, text: text.trim(), timestamp: Date.now() } 
    });
    setText('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col h-screen overflow-hidden">
      <IOSHeader title={`${basket.title} Chat`} showBack hideBackLabel />
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar pb-32">
        {basket.scribbles.map(s => (
          <div key={s.id} className={`flex ${s.authorId === ME.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3.5 rounded-2xl shadow-sm ${s.authorId === ME.id ? 'bg-[#FF3B30] text-white rounded-tr-none' : 'bg-[#F2F2F7] text-gray-800 rounded-tl-none border border-black/5'}`}>
              {s.authorId !== ME.id && <p className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-wider">{s.authorName}</p>}
              <p className="text-[15px] font-medium leading-relaxed">{s.text}</p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      <div className="p-3 border-t border-gray-100 flex items-center gap-2 mb-[83px] bg-white/80 backdrop-blur-md">
        <input 
          className="flex-1 bg-[#F2F2F7] rounded-full px-4 py-2.5 outline-none text-[16px] font-medium focus:bg-white focus:ring-2 ring-[#FF3B30]/10 transition-all border border-black/5" 
          placeholder="Type a message..." 
          value={text} 
          onChange={e => setText(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="bg-[#FF3B30] text-white p-2.5 rounded-full active:scale-90 transition-transform shadow-lg"><Send size={20}/></button>
      </div>
    </div>
  );
};

const BasketFormScreen = ({ state, dispatch, isEdit = false }: { state: AppState, dispatch: any, isEdit?: boolean }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const basket = isEdit ? state.baskets.find(b => b.id === id) : null;
  
  const userMember = basket?.members.find(m => m.userId === ME.id);
  const isAdmin = !isEdit || userMember?.role === 'admin';

  const [title, setTitle] = useState(basket?.title || '');
  const [description, setDescription] = useState(basket?.description || '');
  const [imageUrl, setImageUrl] = useState(basket?.image || '');
  const [members, setMembers] = useState<Member[]>(basket?.members || [{ userId: ME.id, role: 'admin', joinedAt: Date.now(), status: 'accepted' }]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const creatorName = useMemo(() => {
    if (!basket) return ME.name;
    if (basket.creatorId === ME.id) return 'You';
    return state.friends.find(f => f.id === basket.creatorId)?.name || 'Someone';
  }, [basket, state.friends]);

  const handleSave = () => {
    if (!title) return;
    if (isEdit && basket) {
      dispatch({ type: 'UPDATE_BASKET', basketId: basket.id, updates: { title, description, image: imageUrl, members }});
      navigate(-1);
    } else {
      const newBasket: Basket = { 
        id: Math.random().toString(36).substr(2, 9), 
        title, 
        description, 
        image: imageUrl, 
        color: '#FF3B30', 
        members, 
        scribbles: [], 
        isPinned: false, 
        isArchived: false, 
        creatorId: ME.id, 
        createdAt: Date.now(), 
        lastViewedAt: Date.now(), 
        viewMode: 'max' 
      };
      dispatch({ type: 'ADD_BASKET', basket: newBasket });
      navigate('/');
    }
  };

  const handleClone = () => {
    if (!basket) return;
    const clonedBasket: Basket = {
      ...basket,
      id: Math.random().toString(36).substr(2, 9),
      title: `${basket.title} (Copy)`,
      creatorId: ME.id,
      createdAt: Date.now(),
      lastViewedAt: Date.now(),
      members: [{ userId: ME.id, role: 'admin', joinedAt: Date.now(), status: 'accepted' }],
      scribbles: [],
      isPinned: false,
      isArchived: false
    };
    dispatch({ type: 'ADD_BASKET', basket: clonedBasket });
    navigate(`/edit-basket/${clonedBasket.id}`);
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <IOSHeader 
        title={isEdit ? "Box Info" : "New Box"} 
        leftContent={<button onClick={() => navigate(-1)} className="text-[#FF3B30] font-black uppercase tracking-widest text-[13px]">Cancel</button>} 
        rightContent={isAdmin && <button onClick={handleSave} className="text-[#FF3B30] font-black uppercase tracking-widest text-[13px]">Save</button>} 
      />
      
      <div className="p-4 space-y-6">
        {isEdit && (
          <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-black/5">
            <div>
              <p className="text-[11px] font-black text-[#8E8E93] uppercase tracking-widest">Creator</p>
              <p className="text-[15px] font-bold text-gray-800">{creatorName}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-black text-[#8E8E93] uppercase tracking-widest">Created On</p>
              <p className="text-[15px] font-bold text-[#8E8E93] uppercase tracking-tight">{new Date(basket?.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-xs font-black text-[#8E8E93] uppercase tracking-widest px-2">Appearance</p>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-black/5 space-y-4">
            {imageUrl && (
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#F2F2F7] border border-black/5">
                <img src={imageUrl} className="w-full h-full object-cover" alt="Box preview" />
                <button onClick={() => setImageUrl('')} className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full backdrop-blur-md">
                  <Plus className="rotate-45" size={16} />
                </button>
              </div>
            )}
            {isAdmin ? (
              <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-dashed border-gray-200">
                <ImageIcon className="text-[#8E8E93]" size={20} />
                <input 
                  className="bg-transparent flex-1 text-[14px] font-medium outline-none" 
                  placeholder="Paste Image URL..." 
                  value={imageUrl} 
                  onChange={e => setImageUrl(e.target.value)} 
                />
              </div>
            ) : imageUrl && <div className="text-[14px] text-[#8E8E93] text-center font-bold uppercase tracking-tight">Only administrators can change the image.</div>}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-black text-[#8E8E93] uppercase tracking-widest px-2">Basics</p>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5 divide-y">
            <input 
              readOnly={!isAdmin}
              className="w-full p-4 bg-transparent font-bold outline-none text-[18px] focus:bg-gray-50 transition-colors" 
              placeholder="Box Title" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
            <textarea 
              readOnly={!isAdmin}
              className="w-full p-4 bg-transparent outline-none min-h-[100px] text-[16px] font-medium resize-none focus:bg-gray-50 transition-colors" 
              placeholder="Description" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
            />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-black text-[#8E8E93] uppercase tracking-widest px-2">Members ({members.length})</p>
          <div className="space-y-2">
            {members.map(m => {
              const u = m.userId === ME.id ? ME : state.friends.find(f => f.id === m.userId);
              if (!u) return null;
              return (
                <div key={m.userId} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-black/5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} className="w-10 h-10 rounded-full border border-gray-100 shadow-sm" alt="" />
                    <div>
                      <span className="font-bold text-gray-800 text-[15px]">{u.name} {u.id === ME.id && '(You)'}</span>
                      <p className="text-[10px] font-black uppercase text-[#FF3B30] tracking-widest mt-0.5">{m.role}</p>
                    </div>
                  </div>
                  {isAdmin && u.id !== ME.id && (
                    <div className="flex gap-2">
                      <select 
                        value={m.role} 
                        onChange={e => setMembers(prev => prev.map(pm => pm.userId === u.id ? { ...pm, role: e.target.value as Role } : pm))} 
                        className="text-[11px] font-black uppercase bg-[#F2F2F7] border border-black/5 rounded-xl px-2.5 py-1.5 outline-none shadow-sm"
                      >
                        <option value="contributor">Contributor</option>
                        <option value="admin">Administrator</option>
                      </select>
                      <button onClick={() => setMembers(members.filter(pm => pm.userId !== u.id))} className="text-gray-300 p-1.5 active:text-[#FF3B30] transition-colors"><Trash2 size={16}/></button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {isAdmin && isEdit && (
          <div className="space-y-4 pt-4">
              <button 
                onClick={handleClone}
                className="w-full py-4 bg-white rounded-2xl text-gray-700 font-black uppercase tracking-widest text-[12px] border border-black/5 shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Copy size={18} /> Clone this Box
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(true)} 
                className="w-full py-4 text-[#FF3B30] font-black uppercase tracking-widest text-[12px] opacity-60 hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> Delete Box Permanently
              </button>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog 
          title="Delete Box?" 
          message="This will permanently delete this box and all its cards for everyone." 
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={() => {
            dispatch({ type: 'DELETE_BASKET', basketId: basket?.id });
            navigate('/');
          }}
        />
      )}
    </div>
  );
};

const FeedScreen = ({ state, dispatch }: { state: AppState, dispatch: any }) => {
  const [search, setSearch] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const filteredActivities = useMemo(() => {
    return state.activities.filter(a => 
      a.userName.toLowerCase().includes(search.toLowerCase()) ||
      a.targetName.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => b.timestamp - a.timestamp);
  }, [state.activities, search]);

  const renderActivity = (activity: Activity) => {
    const iconClass = "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm";
    let Icon = Info;
    let bgColor = "bg-[#F2F2F7]";
    let iconColor = "text-[#8E8E93]";
    let content = "";

    switch (activity.type) {
      case 'card_added': Icon = Plus; iconColor = "text-blue-500"; content = `added a card to "${activity.targetName}"`; break;
      case 'basket_invited': Icon = UserPlus; iconColor = "text-orange-500"; content = `invited someone to "${activity.targetName}"`; break;
      case 'basket_invitation_accepted': Icon = Check; iconColor = "text-green-500"; content = `joined "${activity.targetName}"`; break;
      case 'basket_added': Icon = Package; iconColor = "text-green-500"; content = `created "${activity.targetName}"`; break;
      case 'basket_deleted': Icon = Trash2; iconColor = "text-red-500"; content = `deleted a box`; break;
      case 'scribble_added': Icon = MessageCircle; iconColor = "text-pink-500"; content = `messaged in "${activity.targetName}"`; break;
      case 'friend_added': Icon = UserCheck; iconColor = "text-green-500"; content = `connected with ${activity.targetName}`; break;
      case 'friend_invited': Icon = UserPlus; iconColor = "text-[#FF3B30]"; content = `invited ${activity.targetName}`; break;
      case 'card_pinned': Icon = Pin; iconColor = "text-yellow-600"; content = `pinned a card in "${activity.targetName}"`; break;
      default: Icon = Info; content = `did something in "${activity.targetName}"`;
    }

    return (
      <div 
        key={activity.id} 
        onClick={() => {
          if (activity.targetId !== 'none' && activity.targetId !== 'basket-deleted') navigate(`/basket/${activity.targetId}`);
        }}
        className="p-4 flex gap-4 items-start active:bg-gray-50 transition-colors bg-white rounded-2xl mb-3 border border-gray-100 cursor-pointer shadow-sm"
      >
        <div className={`${iconClass} ${bgColor} ${iconColor}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] leading-snug text-gray-800 font-medium">
            <span className="font-black text-black">{activity.userId === ME.id ? 'You' : activity.userName}</span>
            {' '}{content}
          </div>
          <p className="text-[11px] text-[#8E8E93] mt-1 font-black uppercase tracking-widest">
            {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <ChevronRightIcon size={16} className="text-gray-300 mt-1" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white pb-32 h-screen overflow-y-auto no-scrollbar" ref={scrollRef}>
      <IOSHeader 
        title="Activity Feed" 
        leftContent={<PlayfulLogo />}
      />
      <div className="px-4 py-3 bg-white sticky top-0 z-40 border-b border-gray-50 shadow-sm">
        <div className="bg-[#F2F2F7] rounded-xl h-[40px] flex items-center px-3 gap-2 border border-black/5 focus-within:ring-2 ring-[#FF3B30]/20 transition-all relative">
          <SearchIcon size={18} className="text-[#8E8E93] flex-shrink-0" />
          <input 
            placeholder="Search feed..." 
            className="bg-transparent w-full text-[17px] font-medium outline-none placeholder:text-[#8E8E93] pr-8" 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 p-1 text-[#8E8E93]">
              <CircleX size={18} fill="currentColor" className="text-gray-400" />
            </button>
          )}
        </div>
      </div>
      <div className="p-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map(renderActivity)
        ) : (
          <div className="p-24 text-center space-y-4">
             <p className="text-[#8E8E93] font-black uppercase tracking-widest text-[12px]">No activity yet.</p>
          </div>
        )}
      </div>
      <ScrollToBottomButton scrollRef={scrollRef} />
    </div>
  );
};

const MembersScreen = ({ state, dispatch }: { state: AppState, dispatch: any }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const sortedMemberList = useMemo(() => {
    const all = [ME, ...state.friends];
    const filtered = all.filter(f => 
      (f.id === ME.id || f.status !== 'none') &&
      (f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       f.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    const meEntry = filtered.find(f => f.id === ME.id);
    const others = filtered.filter(f => f.id !== ME.id).sort((a, b) => a.name.localeCompare(b.name));
    return meEntry ? [meEntry, ...others] : others;
  }, [state.friends, searchQuery]);

  const getStatusLabel = (member: User) => {
    if (member.id === ME.id) return 'Self';
    switch (member.status) {
      case 'friend': return 'Connected';
      case 'pending_sent': return 'Invited to join';
      case 'pending_received': return 'Invitation received';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32 h-screen overflow-y-auto no-scrollbar" ref={scrollRef}>
      <IOSHeader title="Members" leftContent={<PlayfulLogo />} rightContent={<button onClick={() => navigate('/invite-member')} className="text-[#FF3B30] p-2 active:scale-90 transition-transform"><Plus size={28} strokeWidth={3}/></button>} />
      <div className="p-4 space-y-4">
        <div className="bg-[#F2F2F7] rounded-xl h-12 flex items-center px-4 gap-3 shadow-sm border border-black/5 relative">
          <SearchIcon className="text-[#8E8E93] flex-shrink-0" size={18} />
          <input placeholder="Search members..." className="bg-transparent outline-none w-full font-bold pr-8" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 p-1 text-[#8E8E93] active:opacity-50">
              <CircleX size={18} fill="currentColor" className="text-gray-300" />
            </button>
          )}
        </div>
        <div className="space-y-3">
          {sortedMemberList.map(f => (
            <div key={f.id} className="p-4 bg-white rounded-2xl flex items-center justify-between active:bg-gray-50 transition-all cursor-pointer border border-gray-100 shadow-sm" onClick={() => navigate(`/member/${f.id}`)}>
              <div className="flex items-center gap-3">
                <img src={f.avatar} className="w-11 h-11 rounded-full border border-gray-100 shadow-sm" alt="" />
                <div>
                  <p className="font-bold text-[15px] leading-tight text-gray-900">{f.name}</p>
                  <p className={`text-[11px] font-black uppercase mt-0.5 tracking-widest ${getStatusLabel(f) === 'Invitation received' ? 'text-[#FF3B30]' : 'text-[#8E8E93]'}`}>
                    {getStatusLabel(f)}
                  </p>
                </div>
              </div>
              <ChevronRightIcon size={18} className="text-gray-300" />
            </div>
          ))}
          {sortedMemberList.length === 0 && <div className="p-12 text-center text-[#8E8E93] font-black uppercase tracking-widest text-[11px]">No active members.</div>}
        </div>
      </div>
      <ScrollToBottomButton scrollRef={scrollRef} />
    </div>
  );
};

const MemberDetailScreen = ({ state, dispatch }: { state: AppState, dispatch: any }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMe = id === ME.id;
  const targetMember = isMe ? ME : state.friends.find(f => f.id === id);

  const myBoxesWithThem = useMemo(() => {
    if (!targetMember) return [];
    if (isMe) return state.baskets.filter(b => b.creatorId === ME.id);
    return state.baskets.filter(b => b.creatorId === ME.id && b.members.some(m => m.userId === targetMember.id));
  }, [state.baskets, targetMember, isMe]);

  if (!targetMember) return <Navigate to="/members" replace />;

  const getStatusLabel = () => {
    if (isMe) return 'Self';
    switch (targetMember.status) {
      case 'friend': return 'Connected';
      case 'pending_sent': return 'Invited to join';
      case 'pending_received': return 'Invitation received';
      default: return 'No connection';
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <IOSHeader title={isMe ? "My Profile" : "Member Details"} showBack hideBackLabel />
      <div className="p-6 flex flex-col items-center bg-white border-b border-gray-100">
        <div className="relative">
          <img src={targetMember.avatar} className="w-24 h-24 rounded-full border-4 border-[#F2F2F7] shadow-lg" alt="" />
          {(targetMember.status === 'friend' || isMe) && <div className={`absolute bottom-0 right-0 p-1.5 ${isMe ? 'bg-[#FF3B30]' : 'bg-green-500'} text-white rounded-full border-2 border-white shadow-sm`}><UserCheck size={14} /></div>}
        </div>
        <h2 className="text-2xl font-black mt-4 text-gray-900">{targetMember.name}</h2>
        <div className="flex items-center gap-2 text-[#8E8E93] mt-1"><Mail size={14} /><span className="text-sm font-bold">{targetMember.email}</span></div>
        
        <p className={`text-[11px] font-black uppercase mt-3 px-3 py-1 rounded-full tracking-widest ${getStatusLabel() === 'Invitation received' ? 'bg-[#FF3B30] text-white' : 'bg-[#F2F2F7] text-[#8E8E93]'}`}>
          {getStatusLabel()}
        </p>

        {!isMe && (
          <div className="mt-6 flex flex-col gap-3 w-full px-4 max-w-xs">
            {targetMember.status === 'pending_received' && (
              <>
                <button 
                  onClick={() => { dispatch({ type: 'ACCEPT_FRIEND', userId: targetMember.id }); navigate(-1); }}
                  className="w-full bg-[#FF3B30] text-white py-3.5 rounded-2xl font-black uppercase tracking-widest text-[12px] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                >
                  <UserCheck size={20} /> Accept Invitation
                </button>
                <button 
                  onClick={() => { dispatch({ type: 'DECLINE_FRIEND', userId: targetMember.id }); navigate(-1); }}
                  className="w-full bg-white text-gray-500 border border-black/5 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[12px] active:scale-95 transition-all"
                >
                  Decline Invitation
                </button>
              </>
            )}
            {targetMember.status === 'pending_sent' && (
              <button 
                onClick={() => { dispatch({ type: 'CANCEL_INVITATION', userId: targetMember.id }); navigate(-1); }}
                className="w-full bg-white text-[#FF3B30] border border-[#FF3B30]/20 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[12px] active:scale-95 transition-all"
              >
                Cancel Invitation
              </button>
            )}
            {targetMember.status === 'none' && (
              <button 
                onClick={() => { navigate('/invite-member'); }}
                className="w-full bg-[#FF3B30] text-white py-3.5 rounded-2xl font-black uppercase tracking-widest text-[12px] active:scale-95 transition-all shadow-lg"
              >
                Send Invitation
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-4 space-y-6">
        <section className="space-y-3">
          <p className="text-xs font-black text-[#8E8E93] uppercase tracking-widest px-2">{isMe ? "My Boxes" : "Shared Boxes"}</p>
          <div className="space-y-3">
            {myBoxesWithThem.length > 0 ? myBoxesWithThem.map(b => (
              <div key={b.id} onClick={() => navigate(`/basket/${b.id}`)} className="p-4 bg-white rounded-2xl flex items-center justify-between active:bg-gray-50 transition-all cursor-pointer border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F2F2F7] flex items-center justify-center overflow-hidden border border-black/5 shadow-sm">
                    {b.image ? <img src={b.image} className="w-full h-full object-cover" alt="" /> : <Layers className="text-gray-300" size={20} />}
                  </div>
                  <span className="font-bold text-gray-800">{b.title}</span>
                </div>
                <ChevronRightIcon size={18} className="text-gray-300" />
              </div>
            )) : <div className="p-12 text-center text-[#8E8E93] font-black uppercase tracking-widest text-[11px] bg-white rounded-3xl border border-dashed border-gray-200">No shared boxes.</div>}
          </div>
        </section>
      </div>
    </div>
  );
};

const SearchScreen = ({ state, dispatch }: { state: AppState, dispatch: any }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return { boxes: [], cards: [], members: [] };
    const q = query.toLowerCase();
    return {
      boxes: state.baskets.filter(b => b.title.toLowerCase().includes(q) || b.description.toLowerCase().includes(q)),
      cards: state.cards.filter(c => c.text.toLowerCase().includes(q)),
      members: [ME, ...state.friends].filter(f => f.name.toLowerCase().includes(q) || f.email.toLowerCase().includes(q))
    };
  }, [state.baskets, state.cards, state.friends, query]);

  const hasResults = results.boxes.length > 0 || results.cards.length > 0 || results.members.length > 0;

  return (
    <div className="min-h-screen bg-white pb-32 h-screen overflow-y-auto no-scrollbar" ref={scrollRef}>
      <IOSHeader title="Global Search" leftContent={<PlayfulLogo />} />
      <div className="p-4 space-y-4">
        <div className="bg-[#F2F2F7] rounded-xl h-12 flex items-center px-4 gap-3 shadow-sm border border-black/5 relative">
          <SearchIcon size={18} className="text-[#8E8E93] flex-shrink-0" />
          <input placeholder="Search Boxxit!..." className="bg-transparent w-full text-[17px] font-bold outline-none placeholder:text-[#8E8E93] pr-8" autoFocus value={query} onChange={e => setQuery(e.target.value)} />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 p-1 text-[#8E8E93] active:opacity-50">
              <CircleX size={18} fill="currentColor" className="text-gray-300" />
            </button>
          )}
        </div>

        {query && !hasResults ? (
          <div className="p-12 text-center text-[#8E8E93] font-black uppercase tracking-widest text-[12px] space-y-2">No results found.</div>
        ) : !query && (
          <p className="text-center text-[#8E8E93] mt-10 font-bold uppercase tracking-widest text-[11px] px-8">Find boxes, cards, or members.</p>
        )}

        <div className="space-y-6">
          {results.boxes.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-black text-[#8E8E93] uppercase tracking-widest px-2">Boxes</h2>
              <div className="space-y-2">
                {results.boxes.map(b => (
                  <div key={b.id} onClick={() => navigate(`/basket/${b.id}`)} className="p-4 bg-white rounded-2xl flex items-center gap-3 active:bg-gray-50 transition-all cursor-pointer border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#F2F2F7] flex items-center justify-center border border-black/5 overflow-hidden shadow-sm">
                      {b.image ? <img src={b.image} className="w-full h-full object-cover" alt="" /> : <Layers className="text-gray-300" size={20} />}
                    </div>
                    <div className="min-w-0 flex-1"><p className="font-bold text-[15px] truncate text-gray-900">{b.title}</p><p className="text-[12px] text-[#8E8E93] font-medium truncate">{b.description}</p></div>
                    <ChevronRightIcon size={18} className="text-gray-300" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {results.cards.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-black text-[#8E8E93] uppercase tracking-widest px-2">Cards</h2>
              <div className="space-y-2">
                {results.cards.map(c => (
                  <div key={c.id} onClick={() => navigate(`/basket/${c.basketIds[0]}`)} className="p-4 bg-white rounded-2xl flex items-center gap-3 active:bg-gray-50 transition-all cursor-pointer border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#F2F2F7] flex items-center justify-center border border-black/5 overflow-hidden shadow-sm">
                      {c.attachments[0] ? <img src={c.attachments[0].url} className="w-full h-full object-cover" alt="" /> : <FileIcon className="text-gray-400" size={18} />}
                    </div>
                    <div className="min-w-0 flex-1"><p className="font-bold text-[15px] truncate text-gray-900">{c.text}</p><p className="text-[10px] text-[#FF3B30] font-black uppercase tracking-widest">In: {state.baskets.find(b => b.id === c.basketIds[0])?.title}</p></div>
                    <ChevronRightIcon size={18} className="text-gray-300" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {results.members.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-black text-[#8E8E93] uppercase tracking-widest px-2">Members</h2>
              <div className="space-y-2">
                {results.members.map(m => (
                  <div key={m.id} onClick={() => navigate(`/member/${m.id}`)} className="p-4 bg-white rounded-2xl flex items-center gap-3 active:bg-gray-50 transition-all cursor-pointer border border-gray-100 shadow-sm">
                    <img src={m.avatar} className="w-10 h-10 rounded-full border border-gray-100 shadow-sm" alt="" />
                    <div className="min-w-0 flex-1"><p className="font-bold text-[15px] truncate text-gray-900">{m.name}</p><p className="text-[12px] text-[#8E8E93] font-bold uppercase tracking-tight truncate">{m.email}</p></div>
                    <ChevronRightIcon size={18} className="text-gray-300" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      <ScrollToBottomButton scrollRef={scrollRef} />
    </div>
  );
};

const MainApp = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const navigate = useNavigate();

  const dispatch = useCallback((action: any) => {
    setState(prev => {
      let activity: Activity | null = null;
      let newBaskets = [...prev.baskets];
      let newCards = [...prev.cards];
      let newFriends = [...prev.friends];

      switch (action.type) {
        case 'VIEW_BASKET':
          newBaskets = prev.baskets.map(b => b.id === action.basketId ? { ...b, lastViewedAt: Date.now() } : b);
          return { ...prev, baskets: newBaskets };
        case 'ADD_BASKET':
          const creator = { userId: ME.id, role: 'admin' as Role, joinedAt: Date.now(), status: 'accepted' as const };
          const invitees = action.basket.members.filter((m: Member) => m.userId !== ME.id).map((m: Member) => ({ ...m, status: 'pending' }));
          const finalBasket = { ...action.basket, members: [creator, ...invitees], scribbles: [] };
          activity = { id: Math.random().toString(), type: 'basket_added', userId: ME.id, userName: ME.name, targetId: action.basket.id, targetName: action.basket.title, timestamp: Date.now() };
          return { ...prev, baskets: [finalBasket, ...prev.baskets], activities: [activity, ...prev.activities] };
        case 'UPDATE_BASKET':
          newBaskets = prev.baskets.map(b => b.id === action.basketId ? { ...b, ...action.updates } : b);
          return { ...prev, baskets: newBaskets };
        case 'ACCEPT_BASKET_INVITATION':
          newBaskets = prev.baskets.map(b => b.id === action.basketId ? { ...b, members: b.members.map(m => m.userId === ME.id ? { ...m, status: 'accepted' } : m) } : b);
          activity = { id: Math.random().toString(), type: 'basket_invitation_accepted', userId: ME.id, userName: ME.name, targetId: action.basketId, targetName: prev.baskets.find(b => b.id === action.basketId)?.title || 'Box', timestamp: Date.now() };
          return { ...prev, baskets: newBaskets, activities: [activity, ...prev.activities] };
        case 'DECLINE_BASKET_INVITATION':
          newBaskets = prev.baskets.filter(b => b.id !== action.basketId);
          return { ...prev, baskets: newBaskets };
        case 'REMOVE_MEMBER_FROM_BASKET':
          newBaskets = prev.baskets.map(b => b.id === action.basketId ? { ...b, members: b.members.filter(m => m.userId !== action.userId) } : b);
          return { ...prev, baskets: newBaskets };
        case 'ADD_BASKET_SCRIBBLE':
          newBaskets = prev.baskets.map(b => b.id === action.basketId ? { ...b, scribbles: [...b.scribbles, action.scribble] } : b);
          return { ...prev, baskets: newBaskets };
        case 'MARK_BASKET_CHAT_READ':
          newBaskets = prev.baskets.map(b => b.id === action.basketId ? { ...b, lastReadChatAt: Date.now() } : b);
          return { ...prev, baskets: newBaskets };
        case 'ADD_CARD':
          const targetBox = prev.baskets.find(b => b.id === action.card.basketIds[0]);
          activity = { id: Math.random().toString(), type: 'card_added', userId: ME.id, userName: ME.name, targetId: targetBox?.id || 'none', targetName: targetBox?.title || 'Box', timestamp: Date.now() };
          return { ...prev, cards: [action.card, ...prev.cards], activities: [activity, ...prev.activities] };
        case 'UPDATE_CARD':
          newCards = prev.cards.map(c => c.id === action.cardId ? { ...c, ...action.updates } : c);
          return { ...prev, cards: newCards };
        case 'DELETE_CARD':
          newCards = prev.cards.filter(c => c.id !== action.cardId);
          return { ...prev, cards: newCards };
        case 'TOGGLE_CARD_PIN':
          newCards = prev.cards.map(c => {
             if (c.id === action.cardId) {
                const newPinned = !c.isPinned;
                const targetB = prev.baskets.find(b => b.id === c.basketIds[0]);
                activity = { id: Math.random().toString(), type: newPinned ? 'card_pinned' : 'card_unpinned', userId: ME.id, userName: ME.name, targetId: targetB?.id || 'none', targetName: targetB?.title || 'Box', timestamp: Date.now() };
                return { ...c, isPinned: newPinned };
             }
             return c;
          });
          return { ...prev, cards: newCards, activities: activity ? [activity, ...prev.activities] : prev.activities };
        case 'INVITE_FRIEND':
          newFriends = prev.friends.map(f => f.id === action.userId ? { ...f, status: 'pending_sent' } : f);
          return { ...prev, friends: newFriends };
        case 'ACCEPT_FRIEND':
          newFriends = prev.friends.map(f => f.id === action.userId ? { ...f, status: 'friend' } : f);
          return { ...prev, friends: newFriends };
        case 'DECLINE_FRIEND':
        case 'CANCEL_INVITATION':
          newFriends = prev.friends.map(f => f.id === action.userId ? { ...f, status: 'none' } : f);
          return { ...prev, friends: newFriends };
        case 'TOGGLE_PIN':
          newBaskets = prev.baskets.map(b => b.id === action.basketId ? { ...b, isPinned: !b.isPinned } : b);
          return { ...prev, baskets: newBaskets };
        case 'TOGGLE_ARCHIVE':
          newBaskets = prev.baskets.map(b => b.id === action.basketId ? { ...b, isArchived: !b.isArchived } : b);
          return { ...prev, baskets: newBaskets };
        case 'DELETE_BASKET':
          newBaskets = prev.baskets.filter(b => b.id !== action.basketId);
          return { ...prev, baskets: newBaskets };
        case 'ADD_CARD_SCRIBBLE':
          newCards = prev.cards.map(c => c.id === action.cardId ? { ...c, scribbles: [...c.scribbles, action.scribble] } : c);
          return { ...prev, cards: newCards };
        default: return prev;
      }
    });
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative shadow-2xl flex flex-col h-screen overflow-hidden ring-1 ring-black/5">
      <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
        <Routes>
          <Route path="/" element={<BasketsScreen state={state} dispatch={dispatch} />} />
          <Route path="/feed" element={<FeedScreen state={state} dispatch={dispatch} />} />
          <Route path="/basket/:id" element={<BasketDetailScreen state={state} dispatch={dispatch} />} />
          <Route path="/basket-chat/:id" element={<BasketChatScreen state={state} dispatch={dispatch} />} />
          <Route path="/member/:id" element={<MemberDetailScreen state={state} dispatch={dispatch} />} />
          <Route path="/new-card" element={<CardFormScreen state={state} dispatch={dispatch} />} />
          <Route path="/edit-card/:id" element={<CardFormScreen state={state} dispatch={dispatch} isEdit />} />
          <Route path="/new-basket" element={<BasketFormScreen state={state} dispatch={dispatch} />} />
          <Route path="/edit-basket/:id" element={<BasketFormScreen state={state} dispatch={dispatch} isEdit />} />
          <Route path="/members" element={<MembersScreen state={state} dispatch={dispatch} />} />
          <Route path="/invite-member" element={<InviteFriendScreen />} />
          <Route path="/search" element={<SearchScreen state={state} dispatch={dispatch} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <IOSTabBar />
    </div>
  );
};

const App = () => (
  <HashRouter>
    <MainApp />
  </HashRouter>
);

export default App;
