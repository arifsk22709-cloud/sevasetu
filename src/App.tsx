import React, { useState, useEffect, useMemo } from 'react';
import {
  Menu,
  Ticket,
  ShieldCheck,
  Star,
  MapPin,
  Search,
  Heart,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Flame,
  Droplets,
  Scissors,
  Zap,
  Hammer,
  Paintbrush,
  BrickWall,
  X,
  ArrowRight,
  Award,
  RotateCcw,
  Navigation,
  IndianRupee,
  Filter,
  MessageSquarePlus,
  Copy,
  Check,
  AlertTriangle,
  Info,
  Sun,
  Moon,
  LogIn,
  LogOut,
  User,
  Mail,
  Lock,
  Smartphone,
  Share2,
  Bell,
} from 'lucide-react';
import {
  ServiceCategoryId,
  Professional,
  Booking,
  TrackingStage,
  PaymentMethod,
  ReviewItem,
} from './types';
import {
  SERVICE_CATEGORIES,
  INITIAL_PROFESSIONALS,
  INITIAL_DEMO_BOOKINGS,
  TIME_SLOTS,
  PROMO_OFFERS,
  DEMO_GIFT_CARDS,
  STAGE_DEFAULT_PROGRESS,
} from './data/mockData';
import { SafeImage } from './components/SafeImage';
import { LiveTrackingMap } from './components/LiveTrackingMap';
import { ChatbotWidget } from './components/ChatbotWidget';

type ActivePage = 'home' | 'services' | 'bookings' | 'tracking' | 'rewards';
type SupportedLanguage = 'en' | 'hi' | 'bn';

interface UserAccount {
  name: string;
  email: string;
  phone: string;
  provider: 'email' | 'google';
}

const STORAGE_KEYS = {
  BOOKINGS: 'sevasetu_bookings_v1',
  FAVOURITES: 'sevasetu_favourites_v1',
  USER_REVIEWS: 'sevasetu_user_reviews_v1',
  THEME: 'sevasetu_theme_v1',
  USER: 'sevasetu_auth_user_v1',
  LANG: 'sevasetu_chat_lang_v1',
  TEXT_SIZE: 'sevasetu_text_size_v1',
  ZONE: 'sevasetu_ncr_zone_v1',
  ALERTS: 'sevasetu_sms_alerts_v1',
};

const APP_TRANSLATIONS: Record<
  SupportedLanguage,
  {
    brandSub: string;
    navHome: string;
    navServices: string;
    navBookings: string;
    navTracking: string;
    navRewards: string;
    heroTag: string;
    heroTitle1: string;
    heroTitle2: string;
    heroDesc: string;
    bookServiceBtn: string;
    exploreBtn: string;
    liveTrackBtn: string;
    certifiedBadge: string;
    sampleListing: string;
    startingAt: string;
    priceFrom: string;
    estimatedCost: string;
    finalConfirmed: string;
    categoriesTitle: string;
    topRatedTitle: string;
    diffTitle: string;
    diffDesc: string;
  }
> = {
  en: {
    brandSub: 'Home & Religious Services',
    navHome: 'Home',
    navServices: 'Explore Services',
    navBookings: 'My Bookings',
    navTracking: 'Live Tracking',
    navRewards: 'Rewards & Offers',
    heroTag: 'One platform for everyday home services and trusted local religious services',
    heroTitle1: 'Trusted services,',
    heroTitle2: 'right at your doorstep.',
    heroDesc:
      'From Vedic Pandits for your Griha Pravesh puja to electricians, plumbers, deep cleaning squads, and at-home grooming—discover, book, and track everyday home repairs and sacred ceremonies in one place.',
    bookServiceBtn: 'Book a Service',
    exploreBtn: 'Explore All Services',
    liveTrackBtn: 'Live Tracking Demo',
    certifiedBadge: 'SevaSetu Certified',
    sampleListing: 'Sample Listing',
    startingAt: 'Starting at',
    priceFrom: 'Price from',
    estimatedCost: 'Estimated cost',
    finalConfirmed: 'Final price confirmed by the professional',
    categoriesTitle: 'What do you need today?',
    topRatedTitle: 'Top-Rated Professionals Near You',
    diffTitle: 'Everyday Help. Sacred Occasions. One Trusted Bridge.',
    diffDesc:
      'From fixing a leaking tap to arranging a pandit for your next puja, SevaSetu helps you discover, book, and manage services in one place.',
  },
  hi: {
    brandSub: 'घरेलू और धार्मिक सेवाएं',
    navHome: 'होम',
    navServices: 'सेवाएं खोजें',
    navBookings: 'मेरी बुकिंग्स',
    navTracking: 'लाइव ट्रैकिंग',
    navRewards: 'रिवॉर्ड्स और ऑफर्स',
    heroTag: 'दैनिक घरेलू सेवाओं और विश्वसनीय धार्मिक अनुष्ठानों के लिए एक मंच',
    heroTitle1: 'विश्वसनीय सेवाएं,',
    heroTitle2: 'सीधे आपके द्वार पर।',
    heroDesc:
      'गृह प्रवेश पूजा के लिए वैदिक पंडितों से लेकर इलेक्ट्रीशियन, प्लंबर, डीप क्लीनिंग और ग्रूमिंग तक—सब कुछ एक ही जगह खोजें, बुक करें और लाइव ट्रैक करें।',
    bookServiceBtn: 'सेवा बुक करें',
    exploreBtn: 'सभी सेवाएं देखें',
    liveTrackBtn: 'लाइव ट्रैकिंग डेमो',
    certifiedBadge: 'SevaSetu प्रमाणित',
    sampleListing: 'सैंपल लिस्टिंग',
    startingAt: 'शुरुआती कीमत',
    priceFrom: 'कीमत शुरू',
    estimatedCost: 'अनुमानित लागत (Estimated cost)',
    finalConfirmed: 'अंतिम कीमत प्रोफेशनल द्वारा कन्फर्म की जाएगी',
    categoriesTitle: 'आज आपको किस सेवा की आवश्यकता है?',
    topRatedTitle: 'आपके क्षेत्र के टॉप-रेटेड प्रोफेशनल्स',
    diffTitle: 'दैनिक सहायता। पवित्र अवसर। एक विश्वसनीय सेतु।',
    diffDesc:
      'टपकते नल को ठीक करने से लेकर अगली पूजा के लिए पंडित जी की व्यवस्था करने तक, SevaSetu सब कुछ एक ही स्थान पर प्रबंधित करता है।',
  },
  bn: {
    brandSub: 'ঘরোয়া ও ধর্মীয় পরিষেবা',
    navHome: 'হোম',
    navServices: 'পরিষেবা খুঁজুন',
    navBookings: 'আমার বুকিং',
    navTracking: 'লাইভ ট্র্যাকিং',
    navRewards: 'রিওয়ার্ড ও অফার',
    heroTag: 'প্রতিদিনের ঘরোয়া পরিষেবা এবং বিশ্বস্ত ধর্মীয় অনুষ্ঠানের জন্য একটি प्ल্যাটফর্ম',
    heroTitle1: 'বিশ্বস্ত পরিষেবা,',
    heroTitle2: 'এখন আপনার দোরগোড়ায়।',
    heroDesc:
      'গৃহপ্রবেশ পূজার বৈদিক পুরোহিত থেকে শুরু করে ইলেকট্রিশিয়ান, প্লাম্বার, ডিপ ক্লিনিং এবং গ্রুমিং—সবকিছু এক জায়গায় খুঁজুন, বুক করুন এবং ট্র্যাক করুন।',
    bookServiceBtn: 'পরিষেবা বুক করুন',
    exploreBtn: 'সব পরিষেবা দেখুন',
    liveTrackBtn: 'লাইভ ট্র্যাকিং ডেমো',
    certifiedBadge: 'SevaSetu সার্টিফাইড',
    sampleListing: 'স্যাম্পল লিস্টিং',
    startingAt: 'শুরু হচ্ছে',
    priceFrom: 'মূল্য শুরু',
    estimatedCost: 'আনুমানিক খরচ (Estimated cost)',
    finalConfirmed: 'চূড়ান্ত মূল্য প্রফেশনাল দ্বারা নিশ্চিত করা হবে',
    categoriesTitle: 'আজ আপনার কী পরিষেবা প্রয়োজন?',
    topRatedTitle: 'আপনার কাছাকাছি সেরা প্রফেশনাল',
    diffTitle: 'প্রতিদিনের সাহায্য। পবিত্র অনুষ্ঠান। একটি বিশ্বস্ত সেতু।',
    diffDesc:
      'জলের কল মেরামত থেকে শুরু করে পূজার পুরোহিত বুকিং পর্যন্ত, SevaSetu সব পরিষেবা এক জায়গায় নিয়ে এসেছে।',
  },
};

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isProCertified(pro: Professional): boolean {
  return pro.baseRating >= 4.7;
}

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [leftDrawerOpen, setLeftDrawerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Language, Readability, NCR Zone & SMS Alert Preferences
  const [appLang, setAppLang] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANG);
      return saved === 'hi' || saved === 'bn' || saved === 'en' ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const [textSizeLarge, setTextSizeLarge] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.TEXT_SIZE) === 'large';
    } catch {
      return false;
    }
  });

  const [cityFilter, setCityFilter] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ZONE) || 'All';
    } catch {
      return 'All';
    }
  });

  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ALERTS) !== 'false';
    } catch {
      return true;
    }
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME) === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const rootEl = document.documentElement;
    if (theme === 'dark') {
      rootEl.classList.add('dark');
    } else {
      rootEl.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      localStorage.setItem(STORAGE_KEYS.LANG, appLang);
      localStorage.setItem(STORAGE_KEYS.TEXT_SIZE, textSizeLarge ? 'large' : 'normal');
      localStorage.setItem(STORAGE_KEYS.ZONE, cityFilter);
      localStorage.setItem(STORAGE_KEYS.ALERTS, String(smsAlertsEnabled));
    } catch {
      // Ignore storage error
    }
  }, [theme, appLang, textSizeLarge, cityFilter, smsAlertsEnabled]);

  // Persistent State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_BOOKINGS;
    } catch {
      return INITIAL_DEMO_BOOKINGS;
    }
  });

  const [favourites, setFavourites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVOURITES);
      return saved ? JSON.parse(saved) : ['pro-priest-1', 'pro-housekeeping-1'];
    } catch {
      return ['pro-priest-1', 'pro-housekeeping-1'];
    }
  });

  const [userReviewsByPro, setUserReviewsByPro] = useState<Record<string, ReviewItem[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_REVIEWS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch {
      // Ignore
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(favourites));
    } catch {
      // Ignore
    }
  }, [favourites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_REVIEWS, JSON.stringify(userReviewsByPro));
    } catch {
      // Ignore
    }
  }, [userReviewsByPro]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch {
      // Ignore
    }
  }, [currentUser]);

  // Deep-Link Booking Highlight Support
  const [sharedBookingRef, setSharedBookingRef] = useState<string | null>(null);
  const [bookingTab, setBookingTab] = useState<'Upcoming' | 'Completed' | 'Cancelled'>('Upcoming');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    const bookingRefParam = params.get('booking');
    if (pageParam === 'bookings') {
      setActivePage('bookings');
      if (bookingRefParam) {
        setSharedBookingRef(bookingRefParam);
        const found = bookings.find((b) => b.reference === bookingRefParam);
        if (found) {
          setBookingTab(found.tabStatus);
        }
      }
    }
  }, [bookings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4200);
  };

  // Directory Filter & Modal States
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [certifiedOnlyFilter, setCertifiedOnlyFilter] = useState<boolean>(false);
  const [minRatingFilter, setMinRatingFilter] = useState<number>(0);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(5000);
  const [onlyFavourites, setOnlyFavourites] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'price-asc' | 'price-desc'>(
    'recommended'
  );
  const [selectedTrackingBookingId, setSelectedTrackingBookingId] = useState<string>(
    'bk-demo-upcoming-1'
  );

  // Modals
  const [assuranceModalOpen, setAssuranceModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authName, setAuthName] = useState<string>('');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPhone, setAuthPhone] = useState<string>('9876543210');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [googleChooserOpen, setGoogleChooserOpen] = useState<boolean>(false);

  const [profileModalProId, setProfileModalProId] = useState<string | null>(null);
  const [bookingModalPro, setBookingModalPro] = useState<Professional | null>(null);
  const [rescheduleModalBooking, setRescheduleModalBooking] = useState<Booking | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [feedbackModalBooking, setFeedbackModalBooking] = useState<Booking | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Booking Form State
  const [customerName, setCustomerName] = useState<string>('Aarav Sharma');
  const [customerPhone, setCustomerPhone] = useState<string>('9876543210');
  const [serviceAddress, setServiceAddress] = useState<string>(
    'Tower B, Flat 1402, Lotus Boulevard, Sector 100, Noida'
  );
  const [serviceNotes, setServiceNotes] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>(getTodayDateString());
  const [bookingSlot, setBookingSlot] = useState<string>(TIME_SLOTS[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI (Demo - GPay / PhonePe)');
  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string>('');
  const [promoMessage, setPromoMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );
  const [giftInput, setGiftInput] = useState<string>('');
  const [appliedGift, setAppliedGift] = useState<string>('');
  const [giftMessage, setGiftMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [applyLoyaltyReward, setApplyLoyaltyReward] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Reschedule, Cancel & Feedback Form State
  const [newRescheduleDate, setNewRescheduleDate] = useState<string>(getTodayDateString());
  const [newRescheduleSlot, setNewRescheduleSlot] = useState<string>(TIME_SLOTS[1]);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Schedule changed — will rebook soon');
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [feedbackSelectedTags, setFeedbackSelectedTags] = useState<string[]>([
    'Professional behaviour',
    'On time',
  ]);

  const t = APP_TRANSLATIONS[appLang];

  // Auth Handlers
  const handleEmailAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const trimmedEmail = authEmail.trim();
    if (!trimmedEmail.includes('@') || trimmedEmail.length < 5) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (authPassword.length < 4) {
      setAuthError('Password must be at least 4 characters.');
      return;
    }
    if (authMode === 'signup' && authName.trim().length < 2) {
      setAuthError('Please enter your full name.');
      return;
    }
    const displayName =
      authMode === 'signup'
        ? authName.trim()
        : trimmedEmail
            .split('@')[0]
            .replace(/[._-]/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
    const cleanPhone = authPhone.replace(/\D/g, '').slice(0, 10) || '9876543210';
    const userObj: UserAccount = {
      name: displayName,
      email: trimmedEmail,
      phone: cleanPhone,
      provider: 'email',
    };
    setCurrentUser(userObj);
    setCustomerName(userObj.name);
    setCustomerPhone(userObj.phone);
    setAuthModalOpen(false);
    setGoogleChooserOpen(false);
    showToast(`Welcome to SevaSetu, ${userObj.name}!`);
  };

  const handleGoogleLogin = (presetName: string, presetEmail: string) => {
    const userObj: UserAccount = {
      name: presetName,
      email: presetEmail,
      phone: '9876543210',
      provider: 'google',
    };
    setCurrentUser(userObj);
    setCustomerName(userObj.name);
    setCustomerPhone(userObj.phone);
    setAuthModalOpen(false);
    setGoogleChooserOpen(false);
    showToast(`Signed in with Google as ${userObj.name}`);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    showToast('Signed out safely.');
  };

  // Enrich Professionals
  const professionalsWithDynamicStats = useMemo(() => {
    return INITIAL_PROFESSIONALS.map((pro) => {
      const addedReviews = userReviewsByPro[pro.id] || [];
      const totalCount = pro.baseReviewCount + addedReviews.length;
      const sumAdded = addedReviews.reduce((acc, r) => acc + r.rating, 0);
      const exactRating =
        totalCount > 0
          ? Number(((pro.baseRating * pro.baseReviewCount + sumAdded) / totalCount).toFixed(1))
          : pro.baseRating;
      return {
        ...pro,
        computedRating: exactRating,
        computedReviewCount: totalCount,
        allReviews: [...addedReviews, ...pro.initialReviews],
      };
    });
  }, [userReviewsByPro]);

  // Filtered Professionals
  const filteredProfessionals = useMemo(() => {
    return professionalsWithDynamicStats
      .filter((pro) => {
        if (selectedCategory !== 'all' && pro.categoryId !== selectedCategory) return false;
        if (onlyFavourites && !favourites.includes(pro.id)) return false;
        if (certifiedOnlyFilter && !isProCertified(pro)) return false;
        if (cityFilter !== 'All' && pro.cityZone !== cityFilter) return false;
        if (pro.computedRating < minRatingFilter) return false;
        if (pro.priceInr > maxPriceFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = pro.name.toLowerCase().includes(q);
          const matchCat = pro.categoryName.toLowerCase().includes(q);
          const matchLoc = pro.location.toLowerCase().includes(q);
          const matchSpec = pro.specialties.some((s) => s.toLowerCase().includes(q));
          if (!matchName && !matchCat && !matchLoc && !matchSpec) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.computedRating - a.computedRating;
        if (sortBy === 'price-asc') return a.priceInr - b.priceInr;
        if (sortBy === 'price-desc') return b.priceInr - a.priceInr;
        return b.computedReviewCount - a.computedReviewCount;
      });
  }, [
    professionalsWithDynamicStats,
    selectedCategory,
    onlyFavourites,
    favourites,
    certifiedOnlyFilter,
    cityFilter,
    minRatingFilter,
    maxPriceFilter,
    searchQuery,
    sortBy,
  ]);

  const upcomingBookings = useMemo(
    () => bookings.filter((b) => b.tabStatus === 'Upcoming'),
    [bookings]
  );
  const completedBookings = useMemo(
    () => bookings.filter((b) => b.tabStatus === 'Completed'),
    [bookings]
  );
  const cancelledBookings = useMemo(
    () => bookings.filter((b) => b.tabStatus === 'Cancelled'),
    [bookings]
  );

  const completedCount = completedBookings.length;
  const loyaltyTarget = 3;
  const isLoyaltyUnlocked = completedCount >= 1;
  const loyaltyMilestoneProgress = Math.min(completedCount, loyaltyTarget);

  const toggleFavourite = (proId: string) => {
    setFavourites((prev) => {
      const exists = prev.includes(proId);
      const next = exists ? prev.filter((id) => id !== proId) : [...prev, proId];
      showToast(exists ? 'Removed from Favourites' : 'Saved to Favourites ♥');
      return next;
    });
  };

  // Share Booking Deep-Link Handler
  const handleShareBooking = (bk: Booking) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?page=bookings&booking=${encodeURIComponent(
      bk.reference
    )}`;
    const shareText = `SevaSetu Booking Ticket: ${bk.reference}\nProfessional: ${bk.professionalName} (${bk.categoryName})\nSchedule: ${bk.date} at ${bk.timeSlot}\nStatus: ${bk.trackingStage}\nAddress: ${bk.address}\nEstimated Cost: ₹${bk.totalPrice}\nTrack or view booking: ${shareUrl}`;
    navigator.clipboard?.writeText(shareText);
    showToast(`Booking ${bk.reference} summary & deep-link copied to clipboard!`);
  };

  const openBookingModal = (pro: Professional) => {
    setBookingModalPro(pro);
    if (currentUser) {
      setCustomerName(currentUser.name);
      setCustomerPhone(currentUser.phone);
    }
    setBookingDate(getTodayDateString());
    setBookingSlot(TIME_SLOTS[0]);
    setServiceNotes('');
    setPromoInput('');
    setAppliedPromo('');
    setPromoMessage(null);
    setGiftInput('');
    setAppliedGift('');
    setGiftMessage(null);
    setFormErrors({});
  };

  const priceBreakdown = useMemo(() => {
    if (!bookingModalPro) {
      return {
        basePrice: 0,
        platformFee: 0,
        promoDiscount: 0,
        loyaltyDiscount: 0,
        giftDeduction: 0,
        finalPayable: 0,
      };
    }
    const basePrice = bookingModalPro.priceInr;
    const platformFee = 49;
    let promoDiscount = 0;
    if (appliedPromo) {
      const offer = PROMO_OFFERS.find((o) => o.code === appliedPromo);
      if (offer && basePrice >= offer.minOrder) {
        promoDiscount =
          offer.discountType === 'PERCENT'
            ? offer.maxDiscount
              ? Math.min(Math.round((basePrice * offer.value) / 100), offer.maxDiscount)
              : Math.round((basePrice * offer.value) / 100)
            : offer.value;
      }
    }
    const loyaltyDiscount =
      applyLoyaltyReward && isLoyaltyUnlocked ? Math.round(basePrice * 0.05) : 0;
    const subtotalAfterDiscounts = Math.max(
      0,
      basePrice + platformFee - promoDiscount - loyaltyDiscount
    );
    let giftDeduction = 0;
    if (appliedGift) {
      const gift = DEMO_GIFT_CARDS.find((g) => g.code === appliedGift);
      if (gift) giftDeduction = Math.min(subtotalAfterDiscounts, gift.balanceInr);
    }
    const finalPayable = Math.max(0, subtotalAfterDiscounts - giftDeduction);
    return {
      basePrice,
      platformFee,
      promoDiscount,
      loyaltyDiscount,
      giftDeduction,
      finalPayable,
    };
  }, [bookingModalPro, appliedPromo, appliedGift, applyLoyaltyReward, isLoyaltyUnlocked]);

  const handleApplyPromo = () => {
    if (!bookingModalPro) return;
    const code = promoInput.trim().toUpperCase();
    const offer = PROMO_OFFERS.find((o) => o.code === code);
    if (!offer) {
      setAppliedPromo('');
      setPromoMessage({ type: 'err', text: 'Invalid code. Try SEVA20, FIRST100, or FESTIVE15.' });
      return;
    }
    if (bookingModalPro.priceInr < offer.minOrder) {
      setAppliedPromo('');
      setPromoMessage({
        type: 'err',
        text: `Min order ₹${offer.minOrder} required for ${code}.`,
      });
      return;
    }
    setAppliedPromo(code);
    setPromoMessage({ type: 'ok', text: `Promo ${code} applied! (${offer.title})` });
  };

  const handleApplyGiftCard = () => {
    const code = giftInput.trim().toUpperCase();
    const gift = DEMO_GIFT_CARDS.find((g) => g.code === code);
    if (!gift) {
      setAppliedGift('');
      setGiftMessage({ type: 'err', text: 'Try GIFT-SEVA-500 or GIFT-WELCOME-250.' });
      return;
    }
    setAppliedGift(code);
    setGiftMessage({ type: 'ok', text: `${gift.label} applied!` });
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalPro) return;
    const errors: Record<string, string> = {};
    if (customerName.trim().length < 2) errors.customerName = 'Enter a valid customer name.';
    const cleanPhone = customerPhone.replace(/\s+/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone))
      errors.customerPhone = 'Enter a valid 10-digit Indian mobile number.';
    if (serviceAddress.trim().length < 10)
      errors.serviceAddress = 'Enter complete address (min 10 characters).';
    if (!bookingDate || bookingDate < getTodayDateString())
      errors.bookingDate = 'Select today or a future date.';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const randomRef = `SS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      reference: randomRef,
      professionalId: bookingModalPro.id,
      professionalName: bookingModalPro.name,
      professionalPhoto: bookingModalPro.imageUrl,
      categoryId: bookingModalPro.categoryId,
      categoryName: bookingModalPro.categoryName,
      customerName: customerName.trim(),
      customerPhone: cleanPhone,
      address: serviceAddress.trim(),
      notes: serviceNotes.trim(),
      date: bookingDate,
      timeSlot: bookingSlot,
      paymentMethod,
      basePrice: priceBreakdown.basePrice,
      platformFee: priceBreakdown.platformFee,
      discountAmount: priceBreakdown.promoDiscount,
      giftCardAmount: priceBreakdown.giftDeduction,
      loyaltyDiscountAmount: priceBreakdown.loyaltyDiscount,
      totalPrice: priceBreakdown.finalPayable,
      promoCodeUsed: appliedPromo || undefined,
      giftCardUsed: appliedGift || undefined,
      tabStatus: 'Upcoming',
      trackingStage: 'Booking placed',
      trackingProgress: STAGE_DEFAULT_PROGRESS['Booking placed'],
      createdAt: new Date().toISOString(),
      rescheduleHistory: [],
    };

    setBookings((prev) => [newBooking, ...prev]);
    setSelectedTrackingBookingId(newBooking.id);
    setBookingModalPro(null);
    setBookingTab('Upcoming');
    setActivePage('bookings');
    showToast(`Booking Confirmed! Ticket ${randomRef} created.`);
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleModalBooking) return;
    if (!newRescheduleDate || newRescheduleDate < getTodayDateString()) {
      setRescheduleError('Please choose today or a future date.');
      return;
    }
    setBookings((prev) =>
      prev.map((b) =>
        b.id !== rescheduleModalBooking.id
          ? b
          : {
              ...b,
              date: newRescheduleDate,
              timeSlot: newRescheduleSlot,
              rescheduleHistory: [
                ...b.rescheduleHistory,
                {
                  oldDate: b.date,
                  oldTimeSlot: b.timeSlot,
                  newDate: newRescheduleDate,
                  newTimeSlot: newRescheduleSlot,
                  changedAt: new Date().toISOString(),
                },
              ],
            }
      )
    );
    showToast(`Booking ${rescheduleModalBooking.reference} rescheduled.`);
    setRescheduleModalBooking(null);
  };

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalBooking) return;
    setBookings((prev) =>
      prev.map((b) =>
        b.id !== cancelModalBooking.id
          ? b
          : {
              ...b,
              tabStatus: 'Cancelled',
              cancellationReason: cancelReason.trim() || 'Cancelled by customer',
              cancelledAt: new Date().toISOString(),
            }
      )
    );
    showToast(`Booking ${cancelModalBooking.reference} cancelled.`);
    setCancelModalBooking(null);
    setBookingTab('Cancelled');
  };

  const handleUpdateTracking = (
    bookingId: string,
    newStage: TrackingStage,
    newProgress: number
  ) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const isNowComplete = newStage === 'Service complete';
        return {
          ...b,
          trackingStage: newStage,
          trackingProgress: newProgress,
          tabStatus: isNowComplete ? 'Completed' : 'Upcoming',
          completedAt: isNowComplete ? b.completedAt || new Date().toISOString() : b.completedAt,
        };
      })
    );
    if (newStage === 'Service complete') {
      showToast('Service Complete! Moved to Completed tab & Feedback unlocked.');
    }
  };

  const handleResetTracking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id !== bookingId
          ? b
          : {
              ...b,
              tabStatus: 'Upcoming',
              trackingStage: 'Booking placed',
              trackingProgress: STAGE_DEFAULT_PROGRESS['Booking placed'],
            }
      )
    );
    showToast('Tracking reset to Booking placed.');
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackModalBooking) return;
    const feedbackObj = {
      rating: feedbackRating,
      comment:
        feedbackComment.trim() || 'Great service experience! Punctual and polite professional.',
      tags: feedbackSelectedTags,
      submittedAt: new Date().toISOString().slice(0, 10),
    };
    setBookings((prev) =>
      prev.map((b) => (b.id === feedbackModalBooking.id ? { ...b, feedback: feedbackObj } : b))
    );
    const proId = feedbackModalBooking.professionalId;
    const newReviewItem: ReviewItem = {
      id: `user-rev-${feedbackModalBooking.id}`,
      bookingRef: feedbackModalBooking.reference,
      customerName: `${feedbackModalBooking.customerName} (Ticket ${feedbackModalBooking.reference})`,
      rating: feedbackObj.rating,
      comment: feedbackObj.comment,
      tags: feedbackObj.tags,
      createdAt: feedbackObj.submittedAt,
      isDemoSample: false,
    };
    setUserReviewsByPro((prev) => {
      const existing = prev[proId] || [];
      return {
        ...prev,
        [proId]: [newReviewItem, ...existing.filter((r) => r.bookingRef !== feedbackModalBooking.reference)],
      };
    });
    showToast(`Thank you! Your ${feedbackRating}★ review is live.`);
    setFeedbackModalBooking(null);
  };

  const handleResetAllDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.FAVOURITES);
    localStorage.removeItem(STORAGE_KEYS.USER_REVIEWS);
    setBookings(INITIAL_DEMO_BOOKINGS);
    setFavourites(['pro-priest-1', 'pro-housekeeping-1']);
    setUserReviewsByPro({});
    setSelectedCategory('all');
    setCertifiedOnlyFilter(false);
    setSearchQuery('');
    showToast('Demo data reset to factory defaults.');
  };

  const renderCategoryIcon = (iconName: string, className = 'h-5 w-5') => {
    switch (iconName) {
      case 'Flame':
        return <Flame className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Droplets':
        return <Droplets className={className} />;
      case 'Scissors':
        return <Scissors className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Hammer':
        return <Hammer className={className} />;
      case 'Paintbrush':
        return <Paintbrush className={className} />;
      case 'BrickWall':
        return <BrickWall className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  const activeTrackedBooking = useMemo(() => {
    const found = bookings.find((b) => b.id === selectedTrackingBookingId);
    if (found && found.tabStatus !== 'Cancelled') return found;
    return upcomingBookings[0] || completedBookings[0] || null;
  }, [bookings, selectedTrackingBookingId, upcomingBookings, completedBookings]);

  const profileModalProfessional = useMemo(
    () => professionalsWithDynamicStats.find((p) => p.id === profileModalProId) || null,
    [professionalsWithDynamicStats, profileModalProId]
  );

  return (
    <div
      className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors duration-200 ${
        textSizeLarge ? 'text-[17px]' : 'text-base'
      }`}
    >
      {/* ==================== 5. TOP INTERACTIVE CONTROL BAR ==================== */}
      <div className="bg-slate-900 text-slate-200 px-4 py-2 text-xs sm:text-sm border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Language Segmented Selector */}
            <div className="inline-flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              {(
                [
                  { code: 'en', label: 'EN' },
                  { code: 'hi', label: 'हिन्दी' },
                  { code: 'bn', label: 'বাংলা' },
                ] as const
              ).map((langObj) => (
                <button
                  key={langObj.code}
                  type="button"
                  onClick={() => setAppLang(langObj.code)}
                  className={`rounded-md px-2 py-0.5 text-xs font-bold transition cursor-pointer ${
                    appLang === langObj.code
                      ? 'bg-orange-500 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {langObj.label}
                </button>
              ))}
            </div>

            {/* Quick NCR Zone Filter Dropdown */}
            <div className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 border border-slate-700">
              <MapPin className="h-3.5 w-3.5 text-orange-400" />
              <select
                aria-label="Select NCR Service Zone"
                value={cityFilter}
                onChange={(e) => {
                  setCityFilter(e.target.value);
                  showToast(`Service Zone set to: ${e.target.value}`);
                }}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="All" className="text-slate-900 bg-white">
                  All NCR
                </option>
                <option value="Noida" className="text-slate-900 bg-white">
                  Noida
                </option>
                <option value="Delhi" className="text-slate-900 bg-white">
                  Delhi
                </option>
                <option value="Gurgaon" className="text-slate-900 bg-white">
                  Gurgaon
                </option>
                <option value="Ghaziabad" className="text-slate-900 bg-white">
                  Ghaziabad
                </option>
              </select>
            </div>

            {/* Readability Font Size Toggle */}
            <button
              type="button"
              onClick={() => setTextSizeLarge((prev) => !prev)}
              className="rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs font-bold text-slate-200 hover:bg-slate-700 cursor-pointer"
            >
              {textSizeLarge ? 'Font: Large A+' : 'Font: Normal A'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActivePage('tracking')}
              className="inline-flex items-center gap-1 rounded-lg bg-teal-500/20 border border-teal-500/30 px-2.5 py-1 text-xs font-bold text-teal-300 hover:bg-teal-500/30 cursor-pointer"
            >
              <Navigation className="h-3 w-3" />
              <span>Live Track</span>
            </button>

            <button
              type="button"
              onClick={handleResetAllDemoData}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-semibold text-orange-300 hover:bg-slate-700 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================== STICKY MAIN HEADER ==================== */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Triple-Line Control Hub Button */}
            <button
              type="button"
              onClick={() => setLeftDrawerOpen(true)}
              aria-label="Open Control Hub Drawer"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-800 hover:bg-orange-50 hover:text-orange-600 transition cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Brand Logo */}
            <button
              type="button"
              onClick={() => setActivePage('home')}
              className="flex items-center gap-3 text-left cursor-pointer"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/20">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Seva<span className="text-orange-600">Setu</span>
                </span>
                <span className="block text-xs sm:text-sm font-medium text-slate-500 -mt-0.5">
                  {t.brandSub}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
            {(
              [
                { id: 'home', label: t.navHome },
                { id: 'services', label: t.navServices },
                { id: 'bookings', label: t.navBookings, badge: upcomingBookings.length },
                { id: 'tracking', label: t.navTracking },
                { id: 'rewards', label: t.navRewards },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePage(item.id)}
                className={`relative rounded-xl px-3.5 py-2.5 text-sm sm:text-base font-bold transition cursor-pointer ${
                  activePage === item.id
                    ? 'bg-orange-500/15 text-orange-600'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.label}
                {'badge' in item && item.badge > 0 && (
                  <span className="ml-2 rounded-full bg-orange-600 px-2 py-0.5 text-xs font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label="Toggle Theme"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5 text-amber-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setOnlyFavourites(true);
                setActivePage('services');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
              <span>({favourites.length})</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-xs font-bold text-white">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {currentUser.name.split(' ')[0]}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="rounded-lg p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setAuthModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50 cursor-pointer"
              >
                <LogIn className="h-4 w-4 text-orange-600" />
                <span>Sign In</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setOnlyFavourites(false);
                setActivePage('services');
              }}
              className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-95 cursor-pointer"
            >
              {t.bookServiceBtn}
            </button>
          </div>

          {/* Mobile Right Icons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label="Toggle Theme"
              className="rounded-xl border border-slate-200 p-2.5 text-slate-700"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5 text-amber-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ==================== 1. FLIPKART-STYLE TRIPLE-LINE CONTROL HUB & ACCOUNT DRAWER ==================== */}
      {leftDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setLeftDrawerOpen(false)}
          />
          <aside className="relative z-10 flex w-80 max-w-[85vw] flex-col bg-white shadow-2xl overflow-y-auto">
            {/* User Account Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-lg font-extrabold text-white">
                    {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'G'}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold">
                      {currentUser ? currentUser.name : 'Guest User'}
                    </h3>
                    <p className="text-xs text-slate-300">
                      {currentUser ? currentUser.email : 'Sign in to sync orders'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLeftDrawerOpen(false)}
                  className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-950/60 px-3.5 py-2 text-xs border border-slate-700">
                <span className="font-bold text-amber-400">★ SevaSetu Plus Loyalty</span>
                <span className="font-bold text-teal-300">
                  {loyaltyMilestoneProgress}/{loyaltyTarget} Orders
                </span>
              </div>
            </div>

            {/* My Orders & Bookings Section */}
            <div className="p-4 space-y-1.5 border-b border-slate-200">
              <p className="px-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                My Orders & Bookings
              </p>

              <button
                type="button"
                onClick={() => {
                  setBookingTab('Upcoming');
                  setActivePage('bookings');
                  setLeftDrawerOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 hover:bg-orange-50 hover:text-orange-600 cursor-pointer"
              >
                <span>My Bookings (Upcoming)</span>
                <span className="rounded-full bg-orange-600 px-2 py-0.5 text-xs text-white">
                  {upcomingBookings.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setBookingTab('Completed');
                  setActivePage('bookings');
                  setLeftDrawerOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 hover:bg-orange-50 hover:text-orange-600 cursor-pointer"
              >
                <span>My Orders & History (Completed)</span>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-800">
                  {completedBookings.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePage('tracking');
                  setLeftDrawerOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-teal-700 hover:bg-teal-50 cursor-pointer"
              >
                <span>Track Active Order</span>
                <Navigation className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setCertifiedOnlyFilter(true);
                  setActivePage('services');
                  setLeftDrawerOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
              >
                <span>SevaSetu Certified Services</span>
                <ShieldCheck className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setOnlyFavourites(true);
                  setActivePage('services');
                  setLeftDrawerOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
              >
                <span>My Wishlist / Favourites</span>
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-600">
                  {favourites.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePage('rewards');
                  setLeftDrawerOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 hover:bg-orange-50 hover:text-orange-600 cursor-pointer"
              >
                <span>Coupons, Rewards & Gift Cards</span>
                <Award className="h-4 w-4 text-orange-500" />
              </button>
            </div>

            {/* App Settings & Preferences Section */}
            <div className="p-4 space-y-3 flex-1">
              <p className="px-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                App Settings & Preferences
              </p>

              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-semibold text-slate-700">App Language</span>
                <select
                  value={appLang}
                  onChange={(e) => setAppLang(e.target.value as SupportedLanguage)}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-900"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                  <option value="bn">বাংলা</option>
                </select>
              </div>

              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-semibold text-slate-700">Theme Mode</span>
                <button
                  type="button"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-800"
                >
                  {theme === 'light' ? '☀️ Light' : '🌙 Dark'}
                </button>
              </div>

              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-semibold text-slate-700">Text Readability</span>
                <button
                  type="button"
                  onClick={() => setTextSizeLarge((prev) => !prev)}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-800"
                >
                  {textSizeLarge ? 'Large A+' : 'Normal A'}
                </button>
              </div>

              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-semibold text-slate-700">NCR Service Zone</span>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-900"
                >
                  <option value="All">All Zones</option>
                  <option value="Noida">Noida</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Gurgaon">Gurgaon</option>
                  <option value="Ghaziabad">Ghaziabad</option>
                </select>
              </div>

              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <Bell className="h-4 w-4 text-orange-500" />
                  SMS & Live Alerts
                </span>
                <input
                  type="checkbox"
                  checked={smsAlertsEnabled}
                  onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
                  className="h-4 w-4 accent-orange-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    handleResetAllDemoData();
                    setLeftDrawerOpen(false);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Reset Demo Data
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-24 right-5 z-50 flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-xl"
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1">
        {activePage === 'home' && (
          <div>
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-10 pb-16 lg:py-16 bg-gradient-to-b from-white via-orange-50/40 to-slate-50">
              <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-sm font-bold text-orange-600">
                      <Sparkles className="h-4 w-4" />
                      <span>{t.heroTag}</span>
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.12]">
                      {t.heroTitle1}{' '}
                      <span className="bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                        {t.heroTitle2}
                      </span>
                    </h1>

                    <p className="max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
                      {t.heroDesc}
                    </p>

                    <div className="flex flex-wrap items-center gap-3.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory('all');
                          setActivePage('services');
                        }}
                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-orange-500/25 hover:opacity-95 cursor-pointer"
                      >
                        <span>{t.bookServiceBtn}</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setAssuranceModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3.5 text-sm font-bold text-emerald-700 hover:bg-emerald-500/20 cursor-pointer"
                      >
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                        <span>{t.certifiedBadge}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActivePage('tracking')}
                        className="inline-flex items-center gap-2 rounded-2xl border border-teal-500/30 bg-teal-500/10 px-4 py-3.5 text-sm font-bold text-teal-600 hover:bg-teal-500/20 cursor-pointer"
                      >
                        <Navigation className="h-4 w-4 text-teal-600" />
                        <span>{t.liveTrackBtn}</span>
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="relative rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
                      <SafeImage
                        src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80"
                        alt="SevaSetu Professional Service"
                        fallbackLabel="SevaSetu Doorstep Professionals"
                        className="h-72 w-full rounded-2xl"
                      />
                      <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-900 p-4 text-white">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                            Active Live Demo Booking
                          </span>
                          <p className="text-base font-bold mt-0.5">
                            Acharya Vishwanath • Griha Pravesh Puja
                          </p>
                          <p className="text-sm text-slate-300">Status: On the way • ETA 11 mins</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActivePage('tracking')}
                          className="rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-teal-400 cursor-pointer"
                        >
                          Track Live
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 8 Service Categories */}
            <section id="what-do-you-need" className="py-14 mx-auto max-w-7xl px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="text-sm font-bold uppercase tracking-wider text-orange-600">
                    8 Specialized Categories
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
                    {t.categoriesTitle}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setActivePage('services');
                  }}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                >
                  <span>View All 16 Professionals</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {SERVICE_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setOnlyFavourites(false);
                      setActivePage('services');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg cursor-pointer"
                  >
                    <div className="relative h-44 w-full overflow-hidden">
                      <SafeImage
                        src={cat.imageUrl}
                        alt={cat.name}
                        fallbackLabel={cat.fallbackLabel}
                        className="h-full w-full transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-xl bg-slate-900/85 px-3 py-1.5 text-xs font-semibold text-white">
                        <span className="text-orange-400">
                          {renderCategoryIcon(cat.iconName, 'h-4 w-4')}
                        </span>
                        <span>{cat.name}</span>
                      </div>
                      <div className="absolute bottom-3 right-3 rounded-lg bg-slate-900/90 px-3 py-1 text-xs font-extrabold text-white shadow">
                        {t.startingAt} ₹{cat.startingPrice}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <p className="text-xs font-semibold text-orange-600">{cat.hindiSub}</p>
                        <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">{cat.name}</h3>
                        <p className="mt-2 text-base text-slate-600 line-clamp-2 leading-relaxed">
                          {cat.shortDescription}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-sm font-bold text-orange-600">
                        <span>Explore Professionals</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Top-Rated Near You */}
            <section className="bg-white py-14 border-y border-slate-200/80">
              <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                  <div>
                    <span className="text-sm font-bold uppercase tracking-wider text-teal-600">
                      Customer Favourites
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
                      {t.topRatedTitle}
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {professionalsWithDynamicStats.slice(0, 6).map((pro) => {
                    const isFav = favourites.includes(pro.id);
                    return (
                      <div
                        key={pro.id}
                        className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-xs transition hover:border-orange-200 hover:bg-white hover:shadow-md"
                      >
                        <div>
                          <div className="flex items-start gap-4">
                            <SafeImage
                              src={pro.imageUrl}
                              alt={pro.name}
                              fallbackLabel={pro.categoryName}
                              className="h-20 w-20 rounded-2xl shrink-0 border border-slate-200"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="rounded-full bg-orange-500/15 px-2.5 py-0.5 text-xs font-bold text-orange-600">
                                  {pro.categoryName}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => toggleFavourite(pro.id)}
                                  className="rounded-full p-1.5 hover:bg-slate-100 cursor-pointer"
                                >
                                  <Heart
                                    className={`h-4 w-4 ${
                                      isFav
                                        ? 'fill-rose-500 text-rose-500'
                                        : 'text-slate-400 hover:text-rose-500'
                                    }`}
                                  />
                                </button>
                              </div>
                              <h3 className="mt-1 text-lg font-extrabold text-slate-900 truncate">
                                {pro.name}
                              </h3>
                              <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                                <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                  {pro.computedRating} ({pro.computedReviewCount})
                                </span>
                                <span>•</span>
                                <span>{pro.experienceYears} yrs exp</span>
                              </div>
                            </div>
                          </div>

                          <p className="mt-3 text-base text-slate-600 line-clamp-2 leading-relaxed">
                            {pro.shortDescription}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                            <span className="inline-flex items-center gap-1 text-slate-500">
                              <MapPin className="h-4 w-4 text-slate-400" />
                              {pro.location}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {isProCertified(pro) && (
                                <button
                                  type="button"
                                  onClick={() => setAssuranceModalOpen(true)}
                                  className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-700 cursor-pointer"
                                >
                                  <ShieldCheck className="h-3.5 w-3.5" />
                                  Certified
                                </button>
                              )}
                              <span className="inline-flex items-center gap-1 rounded-md bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 text-xs font-semibold text-orange-600">
                                <Ticket className="h-3.5 w-3.5" />
                                {t.sampleListing}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between pt-3.5 border-t border-slate-200/80">
                          <div>
                            <span className="block text-xs font-medium text-slate-500">
                              {t.priceFrom} ₹{pro.priceInr}
                            </span>
                            <span className="text-lg font-extrabold text-slate-900">
                              {t.startingAt} ₹{pro.priceInr}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setProfileModalProId(pro.id)}
                              className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                            >
                              View Profile
                            </button>
                            <button
                              type="button"
                              onClick={() => openBookingModal(pro)}
                              className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2 text-sm font-bold text-white shadow-xs hover:opacity-95 cursor-pointer"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* The SevaSetu Difference Section */}
            <section className="bg-slate-900 py-16 text-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-4 py-1.5 text-xs sm:text-sm font-bold text-orange-300 border border-orange-400/30">
                  The SevaSetu Difference
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{t.diffTitle}</h2>
                <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                  {t.diffDesc}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    'Home Services + Religious Services',
                    'Simple Booking Management',
                    'Clear Pricing',
                    'Track Your Service',
                    'Feedback After Completion',
                  ].map((pill) => (
                    <span
                      key={pill}
                      className="rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-200"
                    >
                      ✓ {pill}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ==================== EXPLORE SERVICES DIRECTORY ==================== */}
        {activePage === 'services' && (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  Discover Home & Religious Service Professionals
                </h1>
                <p className="text-base text-slate-600 mt-1">{t.finalConfirmed}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCertifiedOnlyFilter((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition cursor-pointer ${
                    certifiedOnlyFilter
                      ? 'bg-emerald-600 text-white'
                      : 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-700'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Certified Only</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setCityFilter('All');
                    setCertifiedOnlyFilter(false);
                    setMinRatingFilter(0);
                    setMaxPriceFilter(5000);
                    setOnlyFavourites(false);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-orange-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-700'
                }`}
              >
                All Categories (16)
              </button>
              {SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white'
                      : 'border border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  {renderCategoryIcon(cat.iconName, 'h-4 w-4')}
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProfessionals.map((pro) => {
                const isFav = favourites.includes(pro.id);
                return (
                  <div
                    key={pro.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
                  >
                    <div>
                      <div className="flex items-start gap-4">
                        <SafeImage
                          src={pro.imageUrl}
                          alt={pro.name}
                          fallbackLabel={pro.categoryName}
                          className="h-20 w-20 rounded-2xl shrink-0 border border-slate-200"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="rounded-full bg-orange-500/15 px-2.5 py-0.5 text-xs font-bold text-orange-600">
                              {pro.categoryName}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleFavourite(pro.id)}
                              className="p-1 cursor-pointer"
                            >
                              <Heart
                                className={`h-4 w-4 ${
                                  isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                                }`}
                              />
                            </button>
                          </div>
                          <h3 className="mt-1 text-lg font-extrabold text-slate-900">{pro.name}</h3>
                          <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                            <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              {pro.computedRating} ({pro.computedReviewCount})
                            </span>
                            <span>•</span>
                            <span>{pro.experienceYears} yrs</span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-base text-slate-600 leading-relaxed">
                        {pro.shortDescription}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm pt-2">
                        <span className="inline-flex items-center gap-1 text-slate-500">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {pro.location}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {isProCertified(pro) && (
                            <button
                              type="button"
                              onClick={() => setAssuranceModalOpen(true)}
                              className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-700 cursor-pointer"
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Certified
                            </button>
                          )}
                          <span className="inline-flex items-center gap-1 rounded-md bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 text-xs font-semibold text-orange-600">
                            <Ticket className="h-3.5 w-3.5" />
                            {t.sampleListing}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between pt-3.5 border-t border-slate-100">
                      <div>
                        <span className="block text-xs font-medium text-slate-500">
                          {t.priceFrom} ₹{pro.priceInr}
                        </span>
                        <span className="text-lg font-extrabold text-slate-900">
                          {t.startingAt} ₹{pro.priceInr}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setProfileModalProId(pro.id)}
                          className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 cursor-pointer"
                        >
                          View Profile
                        </button>
                        <button
                          type="button"
                          onClick={() => openBookingModal(pro)}
                          className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2 text-sm font-bold text-white cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== 3. MY BOOKINGS WITH DEEP-LINK & SHARE BUTTON ==================== */}
        {activePage === 'bookings' && (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
            {sharedBookingRef && (
              <div className="flex items-center justify-between rounded-2xl border border-teal-500/40 bg-teal-500/10 px-4 py-3 text-sm font-bold text-teal-800">
                <span>Viewing Shared Family Booking Ticket: {sharedBookingRef}</span>
                <button
                  type="button"
                  onClick={() => setSharedBookingRef(null)}
                  className="text-xs underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                My Bookings Dashboard
              </h1>
              <button
                type="button"
                onClick={() => setActivePage('services')}
                className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2.5 text-sm font-bold text-white cursor-pointer"
              >
                + Book Another Service
              </button>
            </div>

            <div className="flex border-b border-slate-200 gap-2">
              {(
                [
                  { id: 'Upcoming', count: upcomingBookings.length },
                  { id: 'Completed', count: completedBookings.length },
                  { id: 'Cancelled', count: cancelledBookings.length },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setBookingTab(tab.id)}
                  className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm sm:text-base font-bold cursor-pointer ${
                    bookingTab === tab.id
                      ? 'border-orange-600 text-orange-600 bg-orange-500/10 rounded-t-xl'
                      : 'border-transparent text-slate-600'
                  }`}
                >
                  <span>{tab.id}</span>
                  <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-extrabold text-slate-800">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {(bookingTab === 'Upcoming'
                ? upcomingBookings
                : bookingTab === 'Completed'
                ? completedBookings
                : cancelledBookings
              ).map((bk) => (
                <div
                  key={bk.id}
                  className={`rounded-2xl border bg-white p-5 shadow-xs transition ${
                    sharedBookingRef === bk.reference
                      ? 'border-teal-500 ring-2 ring-teal-500/30'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <SafeImage
                        src={bk.professionalPhoto}
                        alt={bk.professionalName}
                        fallbackLabel={bk.categoryName}
                        className="h-20 w-20 rounded-2xl shrink-0 border border-slate-200"
                      />
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-0.5 font-mono text-xs sm:text-sm font-bold text-slate-700">
                            <Ticket className="h-3.5 w-3.5 text-orange-600" />
                            Booking Ticket: {bk.reference}
                          </span>
                          <span className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-bold text-orange-600">
                            {bk.categoryName}
                          </span>
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900">
                          {bk.professionalName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base text-slate-600">
                          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                            <Calendar className="h-4 w-4 text-orange-600" />
                            {bk.date}
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                            <Clock className="h-4 w-4 text-orange-600" />
                            {bk.timeSlot}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            {bk.address}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                      <div className="sm:text-right">
                        <span className="block text-xs font-medium text-slate-400">
                          {t.estimatedCost}
                        </span>
                        <span className="text-xl font-extrabold text-slate-900">
                          ₹{bk.totalPrice}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Share Deep-Link Button */}
                        <button
                          type="button"
                          onClick={() => handleShareBooking(bk)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          <Share2 className="h-4 w-4 text-orange-600" />
                          <span>Share</span>
                        </button>

                        {bk.tabStatus === 'Upcoming' && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setRescheduleModalBooking(bk);
                                setNewRescheduleDate(bk.date);
                                setNewRescheduleSlot(bk.timeSlot);
                                setRescheduleError(null);
                              }}
                              className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-sm font-semibold text-amber-600 cursor-pointer"
                            >
                              Reschedule
                            </button>
                            <button
                              type="button"
                              onClick={() => setCancelModalBooking(bk)}
                              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-sm font-semibold text-rose-600 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTrackingBookingId(bk.id);
                                setActivePage('tracking');
                              }}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white cursor-pointer"
                            >
                              <Navigation className="h-4 w-4" />
                              Track Live
                            </button>
                          </>
                        )}

                        {bk.tabStatus === 'Completed' && (
                          <button
                            type="button"
                            onClick={() => {
                              setFeedbackModalBooking(bk);
                              setFeedbackRating(bk.feedback?.rating ?? 5);
                              setFeedbackComment(bk.feedback?.comment ?? '');
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2 text-sm font-bold text-white cursor-pointer"
                          >
                            <MessageSquarePlus className="h-4 w-4" />
                            {bk.feedback ? 'Edit Feedback' : 'Leave Feedback'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== LIVE TRACKING PAGE ==================== */}
        {activePage === 'tracking' && (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Live Service Tracking & Doorstep Navigation
            </h1>
            {activeTrackedBooking ? (
              <LiveTrackingMap
                booking={activeTrackedBooking}
                onUpdateTracking={handleUpdateTracking}
                onResetTracking={handleResetTracking}
                onOpenFeedback={(bk) => setFeedbackModalBooking(bk)}
                onViewProvider={(proId) => setProfileModalProId(proId)}
              />
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <p className="text-base font-bold text-slate-700">No active bookings to track.</p>
              </div>
            )}
          </div>
        )}

        {/* ==================== REWARDS PAGE ==================== */}
        {activePage === 'rewards' && (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Rewards, Promo Codes & Demo Gift Cards
            </h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {PROMO_OFFERS.map((offer) => (
                <div
                  key={offer.code}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
                >
                  <div>
                    <span className="rounded-lg bg-orange-500/15 px-3 py-1 font-mono text-sm font-extrabold text-orange-600">
                      {offer.code}
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-slate-900">{offer.title}</h3>
                    <p className="mt-1 text-base text-slate-600">{offer.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(offer.code);
                      setCopiedCode(offer.code);
                      showToast(`Promo code ${offer.code} copied!`);
                    }}
                    className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-bold text-slate-800 cursor-pointer"
                  >
                    {copiedCode === offer.code ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Copy Code
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ==================== 2. SEVASETU CERTIFIED ASSURANCE MODAL ==================== */}
      {assuranceModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-700 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-7 w-7 text-emerald-300" />
                <div>
                  <h2 className="text-xl font-extrabold">SevaSetu Certified Assurance</h2>
                  <p className="text-xs text-emerald-100">Quality & Transparency Promise</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAssuranceModalOpen(false)}
                className="rounded-lg p-1 text-white/80 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm text-slate-700">
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
                <p className="font-bold text-slate-900">
                  ✓ 100% Government ID & Background Checked Framework
                </p>
                <p className="mt-0.5 text-xs text-slate-600">
                  Designed for identity verification and accountable doorstep service records.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
                <p className="font-bold text-slate-900">
                  ✓ Vetted Skill Assessment & Authentic Materials
                </p>
                <p className="mt-0.5 text-xs text-slate-600">
                  Top-rated professionals (4.7★+) across home repairs and sacred Vedic rituals.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
                <p className="font-bold text-slate-900">
                  ✓ Upfront Transparent Pricing (No Hidden Charges)
                </p>
                <p className="mt-0.5 text-xs text-slate-600">
                  Clear starting prices and estimated cost breakdowns before you book.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
                <p className="font-bold text-slate-900">
                  ✓ 7-Day Post-Service Support & Re-Visit Assurance
                </p>
                <p className="mt-0.5 text-xs text-slate-600">
                  Dedicated post-completion rating, feedback, and re-booking support.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAssuranceModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCertifiedOnlyFilter(true);
                    setAssuranceModalOpen(false);
                    setActivePage('services');
                  }}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white cursor-pointer"
                >
                  View Certified Pros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== AUTH MODAL ==================== */}
      {authModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h2 className="text-lg font-extrabold">
                {authMode === 'signin' ? 'Sign In to SevaSetu' : 'Create Account'}
              </h2>
              <button
                type="button"
                onClick={() => setAuthModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <button
                type="button"
                onClick={() => handleGoogleLogin('Arif Sk', 'arifsk22709@gmail.com')}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-100 cursor-pointer"
              >
                Continue with Google (Demo)
              </button>
              {authError && (
                <div className="rounded-xl bg-rose-50 p-2.5 text-xs font-bold text-rose-700">
                  {authError}
                </div>
              )}
              <form onSubmit={handleEmailAuthSubmit} className="space-y-3">
                {authMode === 'signup' && (
                  <input
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Full Name"
                    required
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                  />
                )}
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                />
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3 text-sm font-bold text-white cursor-pointer"
                >
                  {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PROFILE MODAL ==================== */}
      {profileModalProfessional && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1 rounded-md bg-orange-500/10 px-2.5 py-0.5 text-xs font-bold text-orange-600">
                  <Ticket className="h-3.5 w-3.5" /> {t.sampleListing}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {profileModalProfessional.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setProfileModalProId(null)}
                className="rounded-lg p-1 text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-base text-slate-700 leading-relaxed">
              {profileModalProfessional.bio}
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setProfileModalProId(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const pro = profileModalProfessional;
                  setProfileModalProId(null);
                  openBookingModal(pro);
                }}
                className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2 text-sm font-bold text-white"
              >
                Book Now ({t.startingAt} ₹{profileModalProfessional.priceInr})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== BOOKING MODAL ==================== */}
      {bookingModalPro && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs overflow-y-auto"
        >
          <div className="my-8 w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between bg-slate-900 px-6 py-4 text-white">
              <h2 className="text-xl font-extrabold">
                Book {bookingModalPro.name} ({t.startingAt} ₹{bookingModalPro.priceInr})
              </h2>
              <button type="button" onClick={() => setBookingModalPro(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleConfirmBooking} className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer Name"
                  required
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                />
                <input
                  type="tel"
                  maxLength={10}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-Digit Mobile"
                  required
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                />
              </div>
              <input
                type="text"
                value={serviceAddress}
                onChange={(e) => setServiceAddress(e.target.value)}
                placeholder="Complete Doorstep Address"
                required
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="date"
                  min={getTodayDateString()}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                />
                <select
                  value={bookingSlot}
                  onChange={(e) => setBookingSlot(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo Code (SEVA20)"
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p className="text-xs font-bold text-emerald-600">{promoMessage.text}</p>
              )}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-800">{t.estimatedCost}</span>
                <span className="text-xl font-extrabold text-orange-600">
                  ₹{priceBreakdown.finalPayable}
                </span>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBookingModalPro(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-2.5 text-sm font-bold text-white"
                >
                  Confirm Booking (₹{priceBreakdown.finalPayable})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== RESCHEDULE, CANCEL & FEEDBACK MODALS ==================== */}
      {rescheduleModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-extrabold">
              Reschedule ({rescheduleModalBooking.reference})
            </h2>
            <form onSubmit={handleConfirmReschedule} className="mt-4 space-y-4">
              {rescheduleError && (
                <p className="text-xs font-bold text-rose-600">{rescheduleError}</p>
              )}
              <input
                type="date"
                min={getTodayDateString()}
                value={newRescheduleDate}
                onChange={(e) => setNewRescheduleDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
              />
              <select
                value={newRescheduleSlot}
                onChange={(e) => setNewRescheduleSlot(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModalBooking(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-5 py-2 text-sm font-bold text-slate-950"
                >
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-extrabold text-rose-600">
              Cancel Booking {cancelModalBooking.reference}?
            </h2>
            <form onSubmit={handleConfirmCancel} className="mt-4 space-y-4">
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCancelModalBooking(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-600 px-5 py-2 text-sm font-bold text-white"
                >
                  Confirm Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {feedbackModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-extrabold">Rate {feedbackModalBooking.professionalName}</h2>
            <form onSubmit={handleSubmitFeedback} className="mt-4 space-y-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= feedbackRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Write your feedback..."
                className="w-full rounded-xl border border-slate-300 p-3 text-sm"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackModalBooking(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2 text-sm font-bold text-white"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Multilingual AI Chatbot */}
      <ChatbotWidget
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          setOnlyFavourites(false);
          setActivePage('services');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-600 gap-2">
          <span>© 2026 SevaSetu Hackathon Prototype. All rights reserved.</span>
          <span className="inline-flex items-center gap-1.5">
            <Info className="h-4 w-4 text-orange-600" />
            All professionals, phone numbers, and reviews are illustrative sample data.
          </span>
        </div>
      </footer>
    </div>
  );
}