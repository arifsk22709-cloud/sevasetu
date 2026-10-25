import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Globe,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { ServiceCategoryId, Booking } from '../types';
import { SERVICE_CATEGORIES, INITIAL_PROFESSIONALS, PROMO_OFFERS } from '../data/mockData';

type ActivePage = 'home' | 'services' | 'bookings' | 'tracking' | 'rewards';
type SupportedLanguage = 'en' | 'hi' | 'bn';

interface ChatbotWidgetProps {
  onSelectCategory: (catId: ServiceCategoryId) => void;
  onNavigate: (page: ActivePage) => void;
  externalLanguage?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

interface ChatAction {
  label: string;
  type: 'category' | 'navigate';
  catId?: ServiceCategoryId;
  page?: ActivePage;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  actions?: ChatAction[];
}

const LANG_STORAGE_KEY = 'sevasetu_chat_lang_v1';
const BOOKINGS_STORAGE_KEY = 'sevasetu_bookings_v1';

// Flexible keyword map supporting both 'plumber'/'plumbing', 'mason'/'masonry', etc.
const KEYWORD_GROUPS: Array<{ matchTerms: string[]; keywords: string[] }> = [
  {
    matchTerms: ['priest', 'pandit', 'puja', 'spiritual', 'religious'],
    keywords: [
      'pandit', 'priest', 'puja', 'pooja', 'havan', 'wedding', 'vivah', 'griha pravesh',
      'satyanarayan', 'astrology', 'katha', 'mantra', 'panditji', 'purohit',
      'पंडित', 'पूजा', 'हवन', 'शादी', 'गृह प्रवेश', 'कथा',
      'পুরোহিত', 'পূজা', 'পুজো', 'বিয়ে', 'গৃহপ্রবেশ', 'যজ্ঞ',
    ],
  },
  {
    matchTerms: ['housekeeping', 'cleaning', 'clean', 'maid'],
    keywords: [
      'clean', 'cleaning', 'housekeeping', 'maid', 'deep clean', 'sofa', 'bathroom',
      'kitchen', 'sanitization', 'mop', 'dusting', 'safai', 'jhadu',
      'सफाई', 'झाड़ू', 'पोछा', 'क्लीनिंग', 'हाउसकीपिंग',
      'পরিষ্কার', 'সাফাই', 'ক্লিনিং', 'ঘর পরিষ্কার',
    ],
  },
  {
    matchTerms: ['plumber', 'plumbing', 'water', 'pipe'],
    keywords: [
      'plumber', 'plumbing', 'tap', 'leak', 'leaking', 'pipe', 'water', 'drain',
      'sink', 'toilet', 'flush', 'geyser', 'motor', 'tank', 'nal', 'paani',
      'प्लंबर', 'नल', 'पानी', 'पाइप', 'लीक', 'टंकी',
      'প্লাম্বার', 'কল', 'জল', 'পাইপ', 'লিক',
    ],
  },
  {
    matchTerms: ['barber', 'salon', 'grooming', 'hair'],
    keywords: [
      'barber', 'salon', 'hair', 'haircut', 'beard', 'shave', 'trim', 'grooming',
      'facial', 'massage', 'spa', 'stylist', 'nai', 'baal',
      'नाई', 'बाल', 'हेयरकट', 'दाढ़ी', 'सैलून', 'मसाज',
      'নাপিত', 'চুল', 'দাড়ি', 'সেলুন', 'হেয়ারকাট',
    ],
  },
  {
    matchTerms: ['electrician', 'electrical', 'electric'],
    keywords: [
      'electrician', 'electric', 'electrical', 'fan', 'light', 'switch', 'socket',
      'wiring', 'mcb', 'fuse', 'inverter', 'ac', 'cooler', 'power', 'short circuit', 'bijli', 'pankha',
      'इलेक्ट्रीशियन', 'बिजली', 'पंखा', 'लाइट', 'स्विच', 'वायरिंग',
      'ইলেকট্রিশিয়ান', 'বিজলি', 'পাখা', 'ফ্যান', 'লাইট', 'সুইচ', 'কারেন্ট',
    ],
  },
  {
    matchTerms: ['carpenter', 'carpentry', 'wood', 'furniture'],
    keywords: [
      'carpenter', 'carpentry', 'wood', 'door', 'window', 'lock', 'hinge', 'cupboard',
      'wardrobe', 'bed', 'furniture', 'table', 'chair', 'drill', 'badhai', 'lakdi',
      'कारपेंटर', 'बढ़ई', 'लकड़ी', 'दरवाजा', 'फर्नीचर', 'ताला',
      'ছুতার', 'কাঠমিস্ত্রি', 'কাঠ', 'দরজা', 'আসবাবপত্র', 'ফার্নিচার',
    ],
  },
  {
    matchTerms: ['painter', 'painting', 'paint'],
    keywords: [
      'painter', 'painting', 'paint', 'wall', 'whitewash', 'color', 'colour',
      'putty', 'texture', 'waterproofing', 'damp', 'rang', 'putai',
      'पेंटर', 'पेंट', 'पेंटिंग', 'रंग', 'दीवार', 'पुताई',
      'পেইন্টার', 'রঙ', 'দেওয়াল', 'পেইন্টিং',
    ],
  },
  {
    matchTerms: ['masonry', 'mason', 'tile', 'civil', 'construction'],
    keywords: [
      'mason', 'masonry', 'tile', 'tiles', 'brick', 'cement', 'plaster',
      'flooring', 'marble', 'granite', 'renovation', 'construction', 'rajmistri', 'mistri',
      'राजमिस्त्री', 'मिस्त्री', 'टाइल', 'ईंट', 'सीमेंट', 'प्लास्टर',
      'রাজমিস্ত্রি', 'মিস্ত্রি', 'টাইলস', 'ইট', 'সিমেন্ট',
    ],
  },
];

const UI_STRINGS: Record<
  SupportedLanguage,
  {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    welcome: string;
    suggestionsLabel: string;
    suggestions: string[];
    fallback: string;
    exploreBtn: (name: string) => string;
    goToBookings: string;
    goToTracking: string;
    goToRewards: string;
    goToServices: string;
  }
> = {
  en: {
    title: 'SevaSetu Assistant',
    subtitle: 'Home & Religious Services Help',
    placeholder: 'Ask about services, prices, bookings...',
    send: 'Send',
    welcome:
      'Namaste! I am your SevaSetu assistant. Ask me about finding an electrician, plumber, or Vedic pandit, checking prices, tracking your professional, or managing your bookings.',
    suggestionsLabel: 'Try asking:',
    suggestions: [
      'I need someone to repair my fan',
      'How much does a plumber charge?',
      'I want to book a pandit for a puja',
      'Where is my service professional?',
      'Can I reschedule my appointment?',
    ],
    fallback: `Sorry, I couldn't understand that request. I'm your SevaSetu assistant, and I can help you with:
- Finding home-service professionals
- Booking an appointment
- Checking service prices
- Rescheduling or cancelling a booking
- Tracking your service
- Understanding payments
- Submitting feedback

What would you like help with?`,
    exploreBtn: (name) => `View ${name}`,
    goToBookings: 'Open My Bookings',
    goToTracking: 'Open Live Tracking',
    goToRewards: 'View Promo Codes',
    goToServices: 'Browse All Services',
  },
  hi: {
    title: 'सेवासेतु सहायक (Assistant)',
    subtitle: 'घरेलू और धार्मिक सेवा सहायता',
    placeholder: 'सेवा, कीमत या बुकिंग के बारे में पूछें...',
    send: 'भेजें',
    welcome:
      'नमस्ते! मैं आपका सेवासेतु (SevaSetu) सहायक हूँ। आप मुझसे इलेक्ट्रीशियन, प्लंबर, पंडित जी बुक करने, कीमतें जानने, लाइव ट्रैकिंग या बुकिंग रीशेड्यूल करने के बारे में पूछ सकते हैं।',
    suggestionsLabel: 'सुझाए गए प्रश्न:',
    suggestions: [
      'मुझे पंखा ठीक करवाना है',
      'प्लंबर का क्या चार्ज है?',
      'पूजा के लिए पंडित जी बुक करने हैं',
      'मेरा प्रोफेशनल अभी कहाँ है?',
      'अपॉइंटमेंट कैसे बदलें?',
    ],
    fallback: `क्षमा करें, मैं आपका यह अनुरोध समझ नहीं पाया। मैं आपका SevaSetu सहायक हूँ और इनमें आपकी मदद कर सकता हूँ:
- घरेलू और धार्मिक सेवा प्रोफेशनल्स खोजना
- अपॉइंटमेंट बुक करना
- सेवाओं की कीमतें (Starting prices) जानना
- बुकिंग रीशेड्यूल या कैंसिल करना
- लाइव सर्विस ट्रैकिंग देखना
- पेमेंट और प्रोमो कोड समझना
- सेवा के बाद फीडबैक देना

बताइए, मैं आपकी क्या मदद करूँ?`,
    exploreBtn: (name) => `${name} देखें`,
    goToBookings: 'मेरी बुकिंग्स खोलें',
    goToTracking: 'लाइव ट्रैकिंग देखें',
    goToRewards: 'प्रोमो कोड देखें',
    goToServices: 'सभी सेवाएं देखें',
  },
  bn: {
    title: 'সেবাসেতু সহায়ক (Assistant)',
    subtitle: 'ঘরোয়া ও ধর্মীয় পরিষেবা সহায়তা',
    placeholder: 'পরিষেবা, খরচ বা বুকিং সম্পর্কে জিজ্ঞাসা করুন...',
    send: 'পাঠান',
    welcome:
      'নমস্কার! আমি আপনার সেবাসেতু (SevaSetu) সহায়ক। ইলেকট্রিশিয়ান, প্লাম্বার, পূজার পুরোহিত বুকিং, পরিষেবার খরচ, লাইভ ট্র্যাকিং বা বুকিং পরিবর্তনের বিষয়ে আমাকে জিজ্ঞাসা করতে পারেন।',
    suggestionsLabel: 'কিছু সাধারণ প্রশ্ন:',
    suggestions: [
      'আমার ফ্যান মেরামত করার লোক চাই',
      'প্লাম্বার কত টাকা নেয়?',
      'পূজার জন্য পুরোহিত বুক করতে চাই',
      'আমার প্রফেশনাল এখন কোথায়?',
      'বুকিংয়ের সময় কীভাবে বদলাবো?',
    ],
    fallback: `দুঃখিত, আমি আপনার অনুরোধটি বুঝতে পারিনি। আমি আপনার SevaSetu সহায়ক, এবং আমি আপনাকে এই বিষয়গুলিতে সাহায্য করতে পারি:
- ঘরোয়া ও ধর্মীয় পরিষেবার প্রফেশনাল খোঁজা
- অ্যাপয়েন্টমেন্ট বুক করা
- পরিষেবার খরচ (Starting prices) জানা
- বুকিং রিশিডিউল বা বাতিল করা
- সার্ভিস লাইভ ট্র্যাক করা
- পেমেন্ট ও প্রোমো কোড জানা
- ফিডব্যাক বা রেটিং দেওয়া

আপনি কোন বিষয়ে সাহায্য চান?`,
    exploreBtn: (name) => `${name} দেখুন`,
    goToBookings: 'আমার বুকিং দেখুন',
    goToTracking: 'লাইভ ট্র্যাকিং খুলুন',
    goToRewards: 'প্রোমো কোড দেখুন',
    goToServices: 'সব পরিষেবা দেখুন',
  },
};

function readLiveBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  onSelectCategory,
  onNavigate,
  externalLanguage,
  onLanguageChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    if (externalLanguage) return externalLanguage;
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'hi' || saved === 'bn' || saved === 'en') return saved;
      return 'en';
    } catch {
      return 'en';
    }
  });

  const [inputValue, setInputValue] = useState<string>('');
  const [lastCategoryContext, setLastCategoryContext] = useState<ServiceCategoryId | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: UI_STRINGS[language].welcome,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (externalLanguage && externalLanguage !== language) {
      setLanguage(externalLanguage);
      setMessages((prev) => [
        ...prev,
        {
          id: `lang-sync-${Date.now()}`,
          sender: 'bot',
          text: UI_STRINGS[externalLanguage].welcome,
        },
      ]);
    }
  }, [externalLanguage, language]);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, language);
    } catch {
      // Ignore storage error
    }
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    onLanguageChange?.(newLang);
    setMessages((prev) => [
      ...prev,
      {
        id: `lang-switch-${Date.now()}`,
        sender: 'bot',
        text: UI_STRINGS[newLang].welcome,
      },
    ]);
  };

  // Dynamically match user text to the actual ServiceCategoryId in SERVICE_CATEGORIES
  const detectCategory = (q: string): ServiceCategoryId | null => {
    const lower = q.toLowerCase();

    for (const group of KEYWORD_GROUPS) {
      if (group.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
        const foundCat = SERVICE_CATEGORIES.find((cat) => {
          const idStr = String(cat.id).toLowerCase();
          const nameStr = cat.name.toLowerCase();
          return group.matchTerms.some(
            (term) => idStr.includes(term) || nameStr.includes(term)
          );
        });
        if (foundCat) return foundCat.id;
      }
    }

    // Fallback check against SERVICE_CATEGORIES names directly
    const directMatch = SERVICE_CATEGORIES.find(
      (cat) =>
        lower.includes(String(cat.id).toLowerCase()) ||
        lower.includes(cat.name.toLowerCase())
    );
    return directMatch ? directMatch.id : null;
  };

  const generateBotReply = (rawInput: string): { text: string; actions?: ChatAction[] } => {
    const q = rawInput.trim().toLowerCase();
    const t = UI_STRINGS[language];
    const matchedCatId = detectCategory(q);
    const activeCatId = matchedCatId || lastCategoryContext;

    if (matchedCatId) {
      setLastCategoryContext(matchedCatId);
    }

    const isGreeting =
      /^(hi|hello|hey|namaste|namaskar|pranam|hola|good morning|good evening|नमस्ते|प्रणाम|हेलो|নমস্কার|হ্যালো)\b/i.test(
        q
      );
    const isPriceIntent =
      /(price|cost|charge|rate|fee|how much|starting|kitna|koto|daam|kharcha|कीमत|चार्ज|कितना|पैसा|खर्च|কত|দাম|খরচ|চার্জ)/i.test(
        q
      );
    const isTrackingIntent =
      /(where is|track|tracking|location|status|eta|reached|arrived|on the way|kaha|kahan|kothay|कहाँ|ट्रैक|लोकेशन|कब आएगा|কোথায়|ট্র্যাক|কখন আসবে)/i.test(
        q
      );
    const isRescheduleIntent =
      /(reschedule|change.*date|change.*time|change.*slot|change.*appointment|postpone|shift|badalna|रीशेड्यूल|समय बदल|तारीख बदल|রিশিডিউল|সময় পরিবর্তন|তারিখ পরিবর্তন)/i.test(
        q
      );
    const isCancelIntent =
      /(cancel|cancellation|abort|delete booking|radd|कैंसिल|रद्द|বাতিল|ক্যানসেল)/i.test(q);
    const isFeedbackIntent =
      /(rate|rating|review|feedback|stars|complain|रेटिंग|रिव्यू|फीडबैक|রেটিং|রিভিউ|ফিডব্যাক)/i.test(
        q
      );
    const isPaymentIntent =
      /(payment|pay|upi|gpay|phonepe|cash|card|promo|discount|coupon|gift card|offer|पेमेंट|प्रोमो|डिस्काउंट|कूपन|পেমেন্ট|প্রোমো|ডিসকাউন্ট|অফার)/i.test(
        q
      );
    const isAllServicesIntent =
      /(what services|all services|which services|available services|list of services|kya kya|ki ki|क्या सेवाएं|कौन सी सर्विस|কী কী পরিষেবা|কি কি সার্ভিস)/i.test(
        q
      );
    const isBookingHelpIntent =
      /(book|booking|appointment|schedule|send|need|want|find|hire|looking for|chahiye|lagbe|बुक|चाहिए|बुलाना|বুক|চাই|দরকার)/i.test(
        q
      );

    if (isTrackingIntent) {
      const bookings = readLiveBookings();
      const upcoming = bookings.filter((b) => b.tabStatus === 'Upcoming');
      if (upcoming.length > 0) {
        const latest = upcoming[0];
        if (language === 'hi') {
          return {
            text: `आपकी सक्रिय बुकिंग ${latest.reference} (${latest.professionalName} — ${latest.categoryName}) की वर्तमान स्थिति "${latest.trackingStage}" (${latest.trackingProgress}% पूर्ण) है। आप लाइव ट्रैकिंग पेज पर जाकर मैप और स्टेज देख सकते हैं।`,
            actions: [{ label: t.goToTracking, type: 'navigate', page: 'tracking' }],
          };
        }
        if (language === 'bn') {
          return {
            text: `আপনার সক্রিয় বুকিং ${latest.reference} (${latest.professionalName} — ${latest.categoryName})-এর বর্তমান অবস্থা হলো "${latest.trackingStage}" (${latest.trackingProgress}% সম্পন্ন)। আপনি লাইভ ট্র্যাকিং পেজে গিয়ে রুট দেখতে পারেন।`,
            actions: [{ label: t.goToTracking, type: 'navigate', page: 'tracking' }],
          };
        }
        return {
          text: `Your upcoming booking ${latest.reference} with ${latest.professionalName} (${latest.categoryName}) is currently at stage: "${latest.trackingStage}" (${latest.trackingProgress}% progress) for ${latest.date} (${latest.timeSlot}). Open Live Tracking to view the simulated route map.`,
          actions: [{ label: t.goToTracking, type: 'navigate', page: 'tracking' }],
        };
      } else {
        if (language === 'hi') {
          return {
            text: 'अभी आपकी कोई आगामी (Upcoming) बुकिंग सक्रिय नहीं है। नया प्रोफेशनल बुक करने के बाद आप यहाँ लाइव ट्रैकिंग देख सकते हैं।',
            actions: [{ label: t.goToServices, type: 'navigate', page: 'services' }],
          };
        }
        if (language === 'bn') {
          return {
            text: 'এই মুহূর্তে আপনার কোনো আসন্ন (Upcoming) বুকিং নেই। একটি পরিষেবা বুক করার পর আপনি লাইভ ট্র্যাকিং দেখতে পাবেন।',
            actions: [{ label: t.goToServices, type: 'navigate', page: 'services' }],
          };
        }
        return {
          text: 'You do not have any upcoming bookings to track right now. Once you book a service, you can track your professional across 6 live stages.',
          actions: [{ label: t.goToServices, type: 'navigate', page: 'services' }],
        };
      }
    }

    if (isRescheduleIntent) {
      const bookings = readLiveBookings().filter((b) => b.tabStatus === 'Upcoming');
      const refList = bookings.map((b) => b.reference).join(', ');
      if (language === 'hi') {
        return {
          text:
            bookings.length > 0
              ? `आप अपनी आगामी बुकिंग (${refList}) को आसानी से रीशेड्यूल कर सकते हैं। "My Bookings" पेज पर जाएं, "Reschedule" बटन दबाएं और अपनी नई तारीख व समय चुनें।`
              : 'अपॉइंटमेंट का समय बदलने के लिए "My Bookings" में "Upcoming" टैब पर जाएं और "Reschedule" पर क्लिक करें।',
          actions: [{ label: t.goToBookings, type: 'navigate', page: 'bookings' }],
        };
      }
      if (language === 'bn') {
        return {
          text:
            bookings.length > 0
              ? `আপনি আপনার আসন্ন বুকিং (${refList}) সহজেই রিশিডিউল করতে পারেন। "My Bookings"-এ গিয়ে "Reschedule" বাটনে ক্লিক করে নতুন তারিখ ও সময় বেছে নিন।`
              : 'অ্যাপয়েন্টমেন্টের সময় পরিবর্তন করতে "My Bookings" পেজের "Upcoming" ট্যাবে গিয়ে "Reschedule" বাটনে ক্লিক করুন।',
          actions: [{ label: t.goToBookings, type: 'navigate', page: 'bookings' }],
        };
      }
      return {
        text:
          bookings.length > 0
            ? `You have ${bookings.length} upcoming booking(s) (${refList}). Go to My Bookings and click the "Reschedule" button on your booking card to pick a new date and time slot.`
            : 'To change your appointment date or time slot, open My Bookings -> Upcoming tab and click "Reschedule" on your booking.',
        actions: [{ label: t.goToBookings, type: 'navigate', page: 'bookings' }],
      };
    }

    if (isCancelIntent) {
      if (language === 'hi') {
        return {
          text: 'बुकिंग रद्द (Cancel) करने के लिए "My Bookings" पेज के "Upcoming" टैब में जाएं और अपनी बुकिंग पर "Cancel Booking" बटन दबाएं।',
          actions: [{ label: t.goToBookings, type: 'navigate', page: 'bookings' }],
        };
      }
      if (language === 'bn') {
        return {
          text: 'বুকিং বাতিল (Cancel) করতে "My Bookings" পেজের "Upcoming" ট্যাবে যান এবং আপনার বুকিং কার্ডে "Cancel Booking" বাটনে ক্লিক করুন।',
          actions: [{ label: t.goToBookings, type: 'navigate', page: 'bookings' }],
        };
      }
      return {
        text: 'To cancel an appointment, open My Bookings -> Upcoming tab, click "Cancel Booking" on the booking card, and confirm your cancellation reason.',
        actions: [{ label: t.goToBookings, type: 'navigate', page: 'bookings' }],
      };
    }

    if (isPriceIntent) {
      if (activeCatId) {
        const cat = SERVICE_CATEGORIES.find((c) => c.id === activeCatId);
        const pros = INITIAL_PROFESSIONALS.filter((p) => p.categoryId === activeCatId);
        if (cat) {
          const proPrices = pros.map((p) => `${p.name} (₹${p.priceInr})`).join(', ');
          if (language === 'hi') {
            return {
              text: `${cat.name} की सेवाएं ₹${cat.startingPrice} से शुरू होती हैं (Starting at ₹${cat.startingPrice})। उपलब्ध डेमो प्रोफेशनल्स: ${proPrices}। बुकिंग के समय ₹49 प्लेटफॉर्म शुल्क जुड़ता है और अंतिम कीमत प्रोफेशनल द्वारा कन्फर्म की जाती है।`,
              actions: [
                {
                  label: t.exploreBtn(cat.name),
                  type: 'category',
                  catId: cat.id,
                },
              ],
            };
          }
          if (language === 'bn') {
            return {
              text: `${cat.name} পরিষেবা ₹${cat.startingPrice} থেকে শুরু (Starting at ₹${cat.startingPrice})। উপলব্ধ ডেমো প্রফেশনাল: ${proPrices}। বুকিংয়ে ₹49 প্ল্যাটফর্ম ফি প্রযোজ্য এবং চূড়ান্ত মূল্য প্রফেশনাল দ্বারা নিশ্চিত করা হয়।`,
              actions: [
                {
                  label: t.exploreBtn(cat.name),
                  type: 'category',
                  catId: cat.id,
                },
              ],
            };
          }
          return {
            text: `${cat.name} services start at ₹${cat.startingPrice}. Available sample professionals include: ${proPrices}. A ₹49 hygiene & support fee applies at checkout, and you can use promo codes like SEVA20 to save up to ₹250. Final price confirmed by the professional.`,
            actions: [
              {
                label: t.exploreBtn(cat.name),
                type: 'category',
                catId: cat.id,
              },
            ],
          };
        }
      }

      const summary = SERVICE_CATEGORIES.map(
        (c) => `${c.name}: Starting at ₹${c.startingPrice}`
      ).join(' • ');
      if (language === 'hi') {
        return {
          text: `सेवासेतु पर हमारी शुरुआती कीमतें (Starting prices) इस प्रकार हैं: ${summary}। आप किस सेवा की कीमत जानना चाहते हैं?`,
          actions: [{ label: t.goToServices, type: 'navigate', page: 'services' }],
        };
      }
      if (language === 'bn') {
        return {
          text: `সেবাসেতুতে আমাদের প্রারম্ভিক মূল্য (Starting prices): ${summary}। আপনি কোন পরিষেবার খরচ জানতে চান?`,
          actions: [{ label: t.goToServices, type: 'navigate', page: 'services' }],
        };
      }
      return {
        text: `Here are our transparent starting prices across categories: ${summary}. Final price is confirmed by the professional based on job scope.`,
        actions: [{ label: t.goToServices, type: 'navigate', page: 'services' }],
      };
    }

    if (matchedCatId) {
      const cat = SERVICE_CATEGORIES.find((c) => c.id === matchedCatId)!;
      const pros = INITIAL_PROFESSIONALS.filter((p) => p.categoryId === matchedCatId);
      const proNames = pros.map((p) => `${p.name} (₹${p.priceInr}, ${p.location})`).join(' and ');

      if (language === 'hi') {
        return {
          text: `जी हाँ! ${cat.name} (${cat.hindiSub}) के लिए हमारे पास ₹${cat.startingPrice} से शुरू होने वाली सेवाएं हैं। उपलब्ध प्रोफेशनल्स: ${proNames}। आप अभी प्रोफाइल देखकर स्लॉट बुक कर सकते हैं।`,
          actions: [
            {
              label: t.exploreBtn(cat.name),
              type: 'category',
              catId: cat.id,
            },
          ],
        };
      }
      if (language === 'bn') {
        return {
          text: `হ্যাঁ! ${cat.name}-এর জন্য আমাদের পরিষেবা ₹${cat.startingPrice} থেকে শুরু হচ্ছে। উপলব্ধ প্রফেশনাল: ${proNames}। নিচের বাটনে ক্লিক করে আপনি প্রোফাইল দেখতে ও স্লট বুক করতে পারেন।`,
          actions: [
            {
              label: t.exploreBtn(cat.name),
              type: 'category',
              catId: cat.id,
            },
          ],
        };
      }
      return {
        text: `I can help you with ${cat.name}! Services start at ₹${cat.startingPrice}. Available sample professionals: ${proNames}. Click below to view their profiles and book a preferred date and time slot.`,
        actions: [
          {
            label: t.exploreBtn(cat.name),
            type: 'category',
            catId: cat.id,
          },
        ],
      };
    }

    if (isFeedbackIntent) {
      if (language === 'hi') {
        return {
          text: 'सेवा पूरी होने के बाद रेटिंग और फीडबैक देने के लिए "My Bookings" पेज के "Completed" टैब पर जाएं और "Leave Feedback" बटन पर क्लिक करके 1 से 5 स्टार और अपना अनुभव साझा करें।',
          actions: [{ label: t.goToBookings, type: 'navigate', page: 'bookings' }],
        };
      }
      if (language === 'bn') {
        return {
          text: 'পরিষেবা সম্পূর্ণ হওয়ার পর রেটিং ও ফিডব্যাক দিতে "My Bookings"-এর "Completed" ট্যাবে যান এবং "Leave Feedback" বাটনে ক্লিক করে ১-৫ স্টার রেটিং দিন।',
          actions: [{ label: t.goToBookings, type: 'navigate', page: 'bookings' }],
        };
      }
      return {
        text: 'To rate a completed service, go to My Bookings -> Completed tab and click "Leave Feedback" on the booking card. Your star rating and review will immediately update the professional’s profile.',
        actions: [{ label: t.goToBookings, type: 'navigate', page: 'bookings' }],
      };
    }

    if (isPaymentIntent) {
      const codes = PROMO_OFFERS.map((o) => `${o.code} (${o.title})`).join(', ');
      if (language === 'hi') {
        return {
          text: `आप बुकिंग के समय UPI (GPay/PhonePe डेमो), कार्ड या सेवा के बाद नकद (Pay After Service) चुन सकते हैं। उपलब्ध प्रोमो कोड: ${codes} और गिफ्ट कार्ड GIFT-SEVA-500 हैं।`,
          actions: [{ label: t.goToRewards, type: 'navigate', page: 'rewards' }],
        };
      }
      if (language === 'bn') {
        return {
          text: `বুকিংয়ের সময় আপনি UPI (GPay/PhonePe ডেমো), কার্ড বা কাজের শেষে ক্যাশ পেমেন্ট বেছে নিতে পারেন। উপলব্ধ প্রোমো কোড: ${codes} এবং গিফট কার্ড GIFT-SEVA-500।`,
          actions: [{ label: t.goToRewards, type: 'navigate', page: 'rewards' }],
        };
      }
      return {
        text: `We support Demo UPI (GPay / PhonePe), Card, and Pay After Service. You can also apply active promo codes (${codes}) or demo gift cards (GIFT-SEVA-500) inside the booking form.`,
        actions: [{ label: t.goToRewards, type: 'navigate', page: 'rewards' }],
      };
    }

    if (isAllServicesIntent || isBookingHelpIntent || isGreeting) {
      const catNames = SERVICE_CATEGORIES.map((c) => c.name).join(', ');
      if (language === 'hi') {
        return {
          text: `सेवासेतु पर हम दैनिक घरेलू सेवाएं और धार्मिक अनुष्ठान दोनों एक ही जगह उपलब्ध कराते हैं: ${catNames}। बताइए, आज आपको किस सेवा की आवश्यकता है?`,
          actions: [
            { label: t.goToServices, type: 'navigate', page: 'services' },
            { label: t.goToBookings, type: 'navigate', page: 'bookings' },
          ],
        };
      }
      if (language === 'bn') {
        return {
          text: `সেবাসেতুতে আমরা প্রতিদিনের ঘরোয়া কাজ এবং ধর্মীয় পূজা-পার্বণ উভয় পরিষেবাই এক জায়গায় প্রদান করি: ${catNames}। আপনার আজ কোন পরিষেবাটি প্রয়োজন?`,
          actions: [
            { label: t.goToServices, type: 'navigate', page: 'services' },
            { label: t.goToBookings, type: 'navigate', page: 'bookings' },
          ],
        };
      }
      return {
        text: `SevaSetu brings everyday home repairs and sacred religious services onto one platform. We offer 8 categories: ${catNames}. Tell me what you need repaired or arranged, and I will guide you to the right professional!`,
        actions: [
          { label: t.goToServices, type: 'navigate', page: 'services' },
          { label: t.goToBookings, type: 'navigate', page: 'bookings' },
        ],
      };
    }

    return {
      text: t.fallback,
      actions: [
        { label: t.goToServices, type: 'navigate', page: 'services' },
        { label: t.goToBookings, type: 'navigate', page: 'bookings' },
      ],
    };
  };

  const handleSendMessage = (customText?: string) => {
    const textToSend = (customText ?? inputValue).trim();
    if (!textToSend) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
    };

    const reply = generateBotReply(textToSend);
    const botMsg: ChatMessage = {
      id: `bot-${Date.now() + 1}`,
      sender: 'bot',
      text: reply.text,
      actions: reply.actions,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    if (!customText) {
      setInputValue('');
    }
  };

  const t = UI_STRINGS[language];

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open SevaSetu Assistant"
          className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3.5 text-base font-bold text-white shadow-xl shadow-orange-500/30 hover:opacity-95 transition cursor-pointer"
        >
          <MessageSquare className="h-5 w-5" />
          <span>{t.title}</span>
        </button>
      ) : (
        <div
          role="dialog"
          aria-label="SevaSetu Assistant Chat Window"
          className="flex h-[540px] w-[360px] sm:w-[410px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        >
          <div className="bg-slate-900 px-4 py-3.5 text-white">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-extrabold leading-tight truncate">{t.title}</h3>
                  <p className="text-xs text-slate-300 truncate">{t.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <div className="flex items-center gap-1 rounded-xl bg-slate-800 px-2 py-1 border border-slate-700">
                  <Globe className="h-3.5 w-3.5 text-orange-400" />
                  <select
                    aria-label="Select chatbot language"
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                    className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                  >
                    <option value="en" className="text-slate-900 bg-white">
                      English
                    </option>
                    <option value="hi" className="text-slate-900 bg-white">
                      हिन्दी
                    </option>
                    <option value="bn" className="text-slate-900 bg-white">
                      বাংলা
                    </option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setLastCategoryContext(null);
                    setMessages([
                      {
                        id: `reset-${Date.now()}`,
                        sender: 'bot',
                        text: t.welcome,
                      },
                    ]);
                  }}
                  title="Clear Chat"
                  aria-label="Reset conversation"
                  className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Chatbot"
                  className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm sm:text-[15px] leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white font-medium shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.actions.map((act, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (act.type === 'category' && act.catId) {
                            onSelectCategory(act.catId);
                          } else if (act.type === 'navigate' && act.page) {
                            onNavigate(act.page);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-500/20 cursor-pointer"
                      >
                        <span>{act.label}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200 bg-white px-3.5 py-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              {t.suggestionsLabel}
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {t.suggestions.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => handleSendMessage(sug)}
                  className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-orange-300 hover:text-orange-600 cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
            />
            <button
              type="submit"
              aria-label={t.send}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2.5 text-sm font-bold text-white shadow-xs hover:opacity-95 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};