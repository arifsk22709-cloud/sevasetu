import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, ArrowRight, Bot } from 'lucide-react';
import { ServiceCategoryId } from '../types';

interface ChatbotWidgetProps {
  onSelectCategory: (categoryId: ServiceCategoryId | 'all') => void;
  onNavigate: (page: 'home' | 'services' | 'bookings' | 'tracking' | 'rewards') => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}

const SUGGESTED_PROMPTS = [
  'I need a priest for a puja.',
  'What services are available?',
  'How do I book a service?',
  'Is my area covered?',
  'How can I reschedule a booking?',
];

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  onSelectCategory,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Namaste! 🙏 I am your SevaSetu AI Assistant (Demo). Ask me about Vedic Pandits, home repairs, area coverage, promo codes, or how to manage your bookings.',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const generateReply = (query: string): ChatMessage => {
    const q = query.toLowerCase();

    if (q.includes('priest') || q.includes('pandit') || q.includes('puja') || q.includes('havan')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'We have experienced Vedic Pandits (such as Acharya Vishwanath Shastri & Pandit Raghavendra Joshi) for Griha Pravesh, Satyanarayan Katha, Rudrabhishek, and Vastu Shanti starting at ₹1,100. Would you like to view Priest / Pandit profiles?',
        actionLabel: 'Browse Priest / Pandit Pros',
        onAction: () => {
          onSelectCategory('priest');
          setIsOpen(false);
        },
      };
    }

    if (q.includes('what services') || q.includes('available') || q.includes('categories')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'SevaSetu offers 8 core categories: 1) Priest / Pandit, 2) Housekeeping, 3) Plumber, 4) Barber at Home, 5) Electrician, 6) Carpentry, 7) Painting, and 8) Masonry. All prices are transparent in INR (₹).',
        actionLabel: 'Explore All 8 Services',
        onAction: () => {
          onSelectCategory('all');
          setIsOpen(false);
        },
      };
    }

    if (q.includes('how do i book') || q.includes('book a service') || q.includes('booking step')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Booking takes 4 quick steps: 1) Choose a category & professional, 2) Click "Book Now", 3) Enter your name, 10-digit Indian mobile number, address, date & time slot, and 4) Apply a promo code like SEVA20 and confirm! (Note: I guide you to the form; you complete the confirmation directly.)',
        actionLabel: 'Go to Professionals Directory',
        onAction: () => {
          onSelectCategory('all');
          setIsOpen(false);
        },
      };
    }

    if (q.includes('area') || q.includes('covered') || q.includes('location') || q.includes('noida') || q.includes('delhi')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Our demo service network covers Noida (Sectors 18, 44, 50, 62, 76, 100, 137 & Greater Noida West), Delhi (South Delhi, Saket, Lajpat Nagar, Dwarka), Gurgaon (DLF Phase 3, Sohna Road), and Ghaziabad (Indirapuram, Vaishali).',
        actionLabel: 'Filter Professionals by City',
        onAction: () => {
          onSelectCategory('all');
          setIsOpen(false);
        },
      };
    }

    if (q.includes('reschedule') || q.includes('cancel') || q.includes('change date')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'To reschedule or cancel an active booking, open "My Bookings" -> "Upcoming" tab and click "Reschedule" to pick a new future date/time slot, or "Cancel Booking" to cancel with confirmation.',
        actionLabel: 'Open My Bookings',
        onAction: () => {
          onNavigate('bookings');
          setIsOpen(false);
        },
      };
    }

    if (q.includes('promo') || q.includes('discount') || q.includes('offer') || q.includes('gift')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'You can use promo codes SEVA20 (20% off up to ₹250), FIRST100 (Flat ₹100 off), or FESTIVE15 (15% off), plus demo gift cards GIFT-SEVA-500 or GIFT-WELCOME-250 at checkout!',
        actionLabel: 'View Rewards & Offers',
        onAction: () => {
          onNavigate('rewards');
          setIsOpen(false);
        },
      };
    }

    if (q.includes('plumber') || q.includes('leak') || q.includes('pipe')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Our plumbers handle tap mixers, concealed leaks, and tank overflows starting at ₹299.',
        actionLabel: 'View Plumbers',
        onAction: () => {
          onSelectCategory('plumber');
          setIsOpen(false);
        },
      };
    }

    if (q.includes('electrician') || q.includes('mcb') || q.includes('fan')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Our electricians fix MCB tripping, inverter wiring, and fan installations starting at ₹249.',
        actionLabel: 'View Electricians',
        onAction: () => {
          onSelectCategory('electrician');
          setIsOpen(false);
        },
      };
    }

    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: 'I can help you find professionals across Priest/Pandit, Housekeeping, Plumbing, Barber at Home, Electrical, Carpentry, Painting, or Masonry, or guide you to My Bookings and Live Tracking. Where would you like to go?',
      actionLabel: 'Browse All Services',
      onAction: () => {
        onSelectCategory('all');
        setIsOpen(false);
      },
    };
  };

  const handleSend = (textToSend?: string) => {
    const trimmed = (textToSend ?? input).trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
    };

    const botMsg = generateReply(trimmed);
    setMessages((prev) => [...prev, userMsg, botMsg]);
    if (!textToSend) setInput('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {isOpen && (
        <div
          role="dialog"
          aria-label="SevaSetu AI Assistant"
          className="mb-3 flex h-[480px] w-[340px] sm:w-[380px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-4 py-3.5 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  SevaSetu Sahayak
                  <span className="rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-orange-300">
                    Demo AI
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300">Instant service & booking guide</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
              className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-br-xs'
                      : 'border border-slate-200 bg-white text-slate-800 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.actionLabel && msg.onAction && (
                  <button
                    type="button"
                    onClick={msg.onAction}
                    className="mt-1.5 inline-flex items-center gap-1 rounded-xl border border-orange-200 bg-orange-50 px-3 py-1.5 text-[11px] font-semibold text-orange-700 hover:bg-orange-100 cursor-pointer"
                  >
                    {msg.actionLabel}
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="border-t border-slate-100 bg-white px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Suggested Questions
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about services, area, or booking..."
              aria-label="Chat message input"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow hover:opacity-95 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-3 text-xs font-bold text-white shadow-xl ring-4 ring-orange-500/20 hover:scale-[1.02] transition cursor-pointer"
      >
        <Sparkles className="h-4 w-4" />
        <span>{isOpen ? 'Close Assistant' : 'SevaSetu AI Help'}</span>
        <MessageSquare className="h-4 w-4" />
      </button>
    </div>
  );
};