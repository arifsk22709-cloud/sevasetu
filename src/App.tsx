import React, { useState, useEffect, useMemo } from 'react';
import {
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
  Menu,
  X,
  ArrowRight,
  Gift,
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
  FEEDBACK_TAGS,
  STAGE_DEFAULT_PROGRESS,
} from './data/mockData';
import { SafeImage } from './components/SafeImage';
import { LiveTrackingMap } from './components/LiveTrackingMap';
import { ChatbotWidget } from './components/ChatbotWidget';

type ActivePage = 'home' | 'services' | 'bookings' | 'tracking' | 'rewards';

interface UserAccount {
  name: string;
  email: string;
  phone: string;
  provider: 'email' | 'google';
  avatarUrl?: string;
}

const STORAGE_KEYS = {
  BOOKINGS: 'sevasetu_bookings_v1',
  FAVOURITES: 'sevasetu_favourites_v1',
  USER_REVIEWS: 'sevasetu_user_reviews_v1',
  THEME: 'sevasetu_theme_v1',
  USER: 'sevasetu_auth_user_v1',
};

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function App() {
  // Navigation & Page State
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Theme State (Light / Dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      return saved === 'dark' ? 'dark' : 'light';
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
    } catch {
      // Ignore storage error
    }
  }, [theme]);

  // Authenticated User State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authName, setAuthName] = useState<string>('');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPhone, setAuthPhone] = useState<string>('9876543210');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [googleChooserOpen, setGoogleChooserOpen] = useState<boolean>(false);

  // Persistent Bookings State
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_BOOKINGS;
    } catch {
      return INITIAL_DEMO_BOOKINGS;
    }
  });

  // Persistent Favourites State
  const [favourites, setFavourites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVOURITES);
      return saved ? JSON.parse(saved) : ['pro-priest-1', 'pro-housekeeping-1'];
    } catch {
      return ['pro-priest-1', 'pro-housekeeping-1'];
    }
  });

  // Persistent User-Submitted Reviews Map
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
      // Ignore quota errors
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(favourites));
    } catch {
      // Ignore quota errors
    }
  }, [favourites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_REVIEWS, JSON.stringify(userReviewsByPro));
    } catch {
      // Ignore quota errors
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
      // Ignore quota errors
    }
  }, [currentUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4200);
  };

  // Search, Filter & Sort State
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [minRatingFilter, setMinRatingFilter] = useState<number>(0);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(5000);
  const [onlyFavourites, setOnlyFavourites] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'price-asc' | 'price-desc'>(
    'recommended'
  );

  // My Bookings Tab State
  const [bookingTab, setBookingTab] = useState<'Upcoming' | 'Completed' | 'Cancelled'>('Upcoming');
  const [selectedTrackingBookingId, setSelectedTrackingBookingId] = useState<string>(
    'bk-demo-upcoming-1'
  );

  // Modals State
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

  // Reschedule Form State
  const [newRescheduleDate, setNewRescheduleDate] = useState<string>(getTodayDateString());
  const [newRescheduleSlot, setNewRescheduleSlot] = useState<string>(TIME_SLOTS[1]);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  // Cancel Form State
  const [cancelReason, setCancelReason] = useState<string>('Schedule changed — will rebook soon');

  // Feedback Form State
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [feedbackSelectedTags, setFeedbackSelectedTags] = useState<string[]>([
    'Professional behaviour',
    'On time',
  ]);

  // Handle Email Sign In / Sign Up
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
      setAuthError('Please enter your full name to create an account.');
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
    showToast(
      authMode === 'signup'
        ? `Account created! Welcome to SevaSetu, ${userObj.name}.`
        : `Welcome back, ${userObj.name}!`
    );
  };

  // Handle Google OAuth Simulation
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
    showToast(`Signed in with Google as ${userObj.name} (${userObj.email})`);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    showToast('You have been signed out safely.');
  };

  // Enrich Professionals with Dynamic Ratings & Reviews
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

  // Filtered & Sorted Professionals
  const filteredProfessionals = useMemo(() => {
    return professionalsWithDynamicStats
      .filter((pro) => {
        if (selectedCategory !== 'all' && pro.categoryId !== selectedCategory) return false;
        if (onlyFavourites && !favourites.includes(pro.id)) return false;
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
    cityFilter,
    minRatingFilter,
    maxPriceFilter,
    searchQuery,
    sortBy,
  ]);

  // Bookings grouped by status
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

  // Loyalty Streak Calculation
  const completedCount = completedBookings.length;
  const loyaltyTarget = 3;
  const isLoyaltyUnlocked = completedCount >= 1;
  const loyaltyMilestoneProgress = Math.min(completedCount, loyaltyTarget);

  // Toggle Favourite
  const toggleFavourite = (proId: string) => {
    setFavourites((prev) => {
      const exists = prev.includes(proId);
      const next = exists ? prev.filter((id) => id !== proId) : [...prev, proId];
      showToast(exists ? 'Removed from your Favourites' : 'Saved to your Favourites ♥');
      return next;
    });
  };

  // Open Booking Modal
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

  // Price Calculation inside Booking Modal
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
        if (offer.discountType === 'PERCENT') {
          const raw = Math.round((basePrice * offer.value) / 100);
          promoDiscount = offer.maxDiscount ? Math.min(raw, offer.maxDiscount) : raw;
        } else {
          promoDiscount = offer.value;
        }
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
      if (gift) {
        giftDeduction = Math.min(subtotalAfterDiscounts, gift.balanceInr);
      }
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
      setPromoMessage({
        type: 'err',
        text: 'Invalid promo code. Try SEVA20, FIRST100, or FESTIVE15.',
      });
      return;
    }
    if (bookingModalPro.priceInr < offer.minOrder) {
      setAppliedPromo('');
      setPromoMessage({
        type: 'err',
        text: `Minimum service value of ₹${offer.minOrder} required for ${code}.`,
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
      setGiftMessage({
        type: 'err',
        text: 'Invalid demo gift card. Try GIFT-SEVA-500 or GIFT-WELCOME-250.',
      });
      return;
    }
    setAppliedGift(code);
    setGiftMessage({
      type: 'ok',
      text: `${gift.label} applied (up to ₹${gift.balanceInr} deduction).`,
    });
  };

  // Confirm Booking Submission
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalPro) return;

    const errors: Record<string, string> = {};
    if (customerName.trim().length < 2) {
      errors.customerName = 'Please enter a valid customer name (at least 2 characters).';
    }
    const cleanPhone = customerPhone.replace(/\s+/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errors.customerPhone =
        'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.';
    }
    if (serviceAddress.trim().length < 10) {
      errors.serviceAddress = 'Please enter your complete doorstep address (min 10 characters).';
    }
    const today = getTodayDateString();
    if (!bookingDate || bookingDate < today) {
      errors.bookingDate = 'Please select today or a future date for your booking.';
    }

    const duplicate = bookings.find(
      (b) =>
        b.tabStatus === 'Upcoming' &&
        b.professionalId === bookingModalPro.id &&
        b.date === bookingDate &&
        b.timeSlot === bookingSlot
    );
    if (duplicate) {
      errors.duplicate = `You already have an upcoming booking (${duplicate.reference}) with ${bookingModalPro.name} for this exact date and time slot.`;
    }

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
    showToast(`Booking Confirmed! Reference ${randomRef} added to Upcoming Bookings.`);
  };

  // Reschedule Existing Booking
  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleModalBooking) return;

    const today = getTodayDateString();
    if (!newRescheduleDate || newRescheduleDate < today) {
      setRescheduleError('Please choose today or a valid future date.');
      return;
    }
    if (
      newRescheduleDate === rescheduleModalBooking.date &&
      newRescheduleSlot === rescheduleModalBooking.timeSlot
    ) {
      setRescheduleError('Please select a different date or time slot to reschedule.');
      return;
    }

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== rescheduleModalBooking.id) return b;
        return {
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
        };
      })
    );

    showToast(
      `Booking ${rescheduleModalBooking.reference} rescheduled to ${newRescheduleDate} (${newRescheduleSlot}).`
    );
    setRescheduleModalBooking(null);
  };

  // Cancel Existing Booking
  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalBooking) return;

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== cancelModalBooking.id) return b;
        return {
          ...b,
          tabStatus: 'Cancelled',
          cancellationReason: cancelReason.trim() || 'Cancelled by customer',
          cancelledAt: new Date().toISOString(),
        };
      })
    );

    showToast(`Booking ${cancelModalBooking.reference} has been cancelled.`);
    setCancelModalBooking(null);
    setBookingTab('Cancelled');
  };

  // Update Tracking Stage
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
      showToast('Service marked Complete! Booking moved to Completed tab & Feedback unlocked.');
    }
  };

  // Reset Tracking Simulation
  const handleResetTracking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          tabStatus: 'Upcoming',
          trackingStage: 'Booking placed',
          trackingProgress: STAGE_DEFAULT_PROGRESS['Booking placed'],
        };
      })
    );
    showToast('Live tracking simulation reset to Stage 1 (Booking placed).');
  };

  // Submit Customer Feedback
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackModalBooking) return;

    const feedbackObj = {
      rating: feedbackRating,
      comment:
        feedbackComment.trim() ||
        'Great service experience! Punctual and professional throughout the visit.',
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
      customerName: `${feedbackModalBooking.customerName} (Verified Booking ${feedbackModalBooking.reference})`,
      rating: feedbackObj.rating,
      comment: feedbackObj.comment,
      tags: feedbackObj.tags,
      createdAt: feedbackObj.submittedAt,
      isDemoSample: false,
    };

    setUserReviewsByPro((prev) => {
      const existingList = prev[proId] || [];
      const filtered = existingList.filter((r) => r.bookingRef !== feedbackModalBooking.reference);
      return {
        ...prev,
        [proId]: [newReviewItem, ...filtered],
      };
    });

    showToast(
      `Thank you! Your ${feedbackRating}★ review for ${feedbackModalBooking.professionalName} is now live.`
    );
    setFeedbackModalBooking(null);
  };

  // Reset All Demo Data
  const handleResetAllDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.FAVOURITES);
    localStorage.removeItem(STORAGE_KEYS.USER_REVIEWS);
    setBookings(INITIAL_DEMO_BOOKINGS);
    setFavourites(['pro-priest-1', 'pro-housekeeping-1']);
    setUserReviewsByPro({});
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedTrackingBookingId('bk-demo-upcoming-1');
    showToast('All demo bookings, reviews, and favourites have been reset to factory defaults.');
  };

  // Render Category Icon
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors duration-200">
      {/* Top Demo Transparency Strip */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-300 border border-orange-400/30">
              Hackathon Prototype
            </span>
            <span className="text-[11px] text-slate-300">
              Sample profiles, simulated route GPS, and demo payment options. No real credentials collected.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetAllDemoData}
              className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-orange-300 hover:bg-slate-700 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Demo Data
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2.5 text-left cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Seva<span className="text-orange-600">Setu</span>
              </span>
              <span className="block text-[10px] font-medium text-slate-500 -mt-0.5">
                Trusted services, right at your doorstep
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {(
              [
                { id: 'home', label: 'Home' },
                { id: 'services', label: 'Explore Services' },
                {
                  id: 'bookings',
                  label: 'My Bookings',
                  badge: upcomingBookings.length,
                },
                { id: 'tracking', label: 'Live Tracking' },
                { id: 'rewards', label: 'Rewards & Offers' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePage(item.id)}
                className={`relative rounded-xl px-3 py-2 text-xs font-semibold transition cursor-pointer ${
                  activePage === item.id
                    ? 'bg-orange-500/15 text-orange-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.label}
                {'badge' in item && item.badge > 0 && (
                  <span className="ml-1.5 rounded-full bg-orange-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Quick Actions: Theme Toggle + Favourites + Auth + Book CTA */}
          <div className="hidden md:flex items-center gap-2">
            {/* Light / Dark Theme Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = theme === 'light' ? 'dark' : 'light';
                setTheme(next);
                showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`);
              }}
              aria-label="Toggle Light or Dark Theme"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4 text-slate-700" />
              ) : (
                <Sun className="h-4 w-4 text-amber-400" />
              )}
            </button>

            {/* Favourites */}
            <button
              type="button"
              onClick={() => {
                setOnlyFavourites(true);
                setActivePage('services');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
              <span>({favourites.length})</span>
            </button>

            {/* User Auth Button / Profile Pill */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-[11px] font-bold text-white">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-bold text-slate-900 leading-none">
                    {currentUser.name.split(' ')[0]}
                  </p>
                  <p className="text-[9px] text-slate-500 leading-none mt-0.5">
                    {currentUser.provider === 'google' ? 'Google Linked' : 'Member'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="ml-1 rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError(null);
                  setAuthModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5 text-orange-600" />
                <span>Sign In</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setOnlyFavourites(false);
                setActivePage('services');
              }}
              className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-95 cursor-pointer"
            >
              Book Service
            </button>
          </div>

          {/* Mobile Controls (Theme + Hamburger) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label="Toggle Theme"
              className="rounded-xl border border-slate-200 p-2 text-slate-700"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4 text-amber-400" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Menu"
              className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1.5">
            {(
              [
                { id: 'home', label: 'Home' },
                { id: 'services', label: 'Explore Services & Professionals' },
                { id: 'bookings', label: `My Bookings (${upcomingBookings.length} Upcoming)` },
                { id: 'tracking', label: 'Live Service Tracking' },
                { id: 'rewards', label: 'Loyalty Rewards & Promo Codes' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold ${
                  activePage === item.id
                    ? 'bg-orange-500/15 text-orange-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              {currentUser ? (
                <div className="flex flex-1 items-center justify-between rounded-xl bg-slate-100 px-3 py-2 text-xs">
                  <span className="font-bold text-slate-900">
                    Signed in: {currentUser.name} ({currentUser.email})
                  </span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="font-bold text-rose-600"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthMode('signin');
                    setAuthModalOpen(true);
                  }}
                  className="w-full rounded-xl bg-slate-900 py-2.5 text-center text-xs font-bold text-white"
                >
                  Sign In / Sign Up / Link Google
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-5 z-50 flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* ==================== 1. HOMEPAGE ==================== */}
        {activePage === 'home' && (
          <div>
            {/* Hero Section */}
            <section
              className={`relative overflow-hidden pt-8 pb-14 lg:py-16 ${
                theme === 'dark'
                  ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900'
                  : 'bg-gradient-to-b from-white via-orange-50/40 to-slate-50'
              }`}
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1.5 text-xs font-semibold text-orange-600">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>India’s AI-Powered Home, Personal & Spiritual Services Platform</span>
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-[1.15]">
                      Trusted services,{' '}
                      <span className="bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                        right at your doorstep.
                      </span>
                    </h1>

                    <p className="max-w-2xl text-base text-slate-600 leading-relaxed">
                      From Vedic Pandits for your Griha Pravesh puja to expert electricians, plumbers, deep cleaning squads, and at-home grooming—book transparent, upfront-priced home services across NCR in 60 seconds.
                    </p>

                    {/* Primary Hero CTAs */}
                    <div className="flex flex-wrap items-center gap-3.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory('all');
                          setActivePage('services');
                        }}
                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:opacity-95 cursor-pointer"
                      >
                        <span>Book a Service</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById('what-do-you-need');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 hover:bg-slate-50 cursor-pointer"
                      >
                        <span>Explore All Services</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActivePage('tracking')}
                        className="inline-flex items-center gap-2 rounded-2xl border border-teal-500/30 bg-teal-500/10 px-4 py-3.5 text-xs font-bold text-teal-600 hover:bg-teal-500/20 cursor-pointer"
                      >
                        <Navigation className="h-4 w-4 text-teal-600" />
                        <span>Live Tracking Demo</span>
                      </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/80 max-w-xl">
                      <div>
                        <div className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900">
                          <ShieldCheck className="h-4 w-4 text-emerald-600" />
                          <span>Demo Verified</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Curated sample specialists</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900">
                          <IndianRupee className="h-4 w-4 text-orange-600" />
                          <span>Upfront Pricing</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Zero hidden visit charges</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span>4.8★ Avg Rating</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Live interactive reviews</p>
                      </div>
                    </div>
                  </div>

                  {/* Hero Right Visual Showcase Card */}
                  <div className="lg:col-span-5">
                    <div className="relative rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
                      <SafeImage
                        src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80"
                        alt="SevaSetu Professional Home Service"
                        fallbackLabel="SevaSetu Doorstep Professionals"
                        className="h-72 w-full rounded-2xl"
                      />
                      <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-900 p-4 text-white">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                            Active Live Demo Booking
                          </span>
                          <p className="text-sm font-bold mt-0.5">
                            Acharya Vishwanath • Griha Pravesh Puja
                          </p>
                          <p className="text-xs text-slate-300">
                            Status: On the way • ETA 11 mins
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActivePage('tracking')}
                          className="rounded-xl bg-teal-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-teal-400 cursor-pointer"
                        >
                          Track Live
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* "What do you need today?" — 8 Real Photographic Category Cards */}
            <section id="what-do-you-need" className="py-14 mx-auto max-w-7xl px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                    8 Specialized Categories
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                    What do you need today?
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setActivePage('services');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                >
                  <span>View All 16 Sample Professionals</span>
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
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedCategory(cat.id);
                        setOnlyFavourites(false);
                        setActivePage('services');
                      }
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
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-xl bg-slate-900/85 backdrop-blur-xs px-2.5 py-1 text-xs font-semibold text-white">
                        <span className="text-orange-400">
                          {renderCategoryIcon(cat.iconName, 'h-3.5 w-3.5')}
                        </span>
                        <span>{cat.name}</span>
                      </div>
                      <div className="absolute bottom-3 right-3 rounded-lg bg-slate-900/90 px-2.5 py-1 text-xs font-extrabold text-white shadow">
                        From ₹{cat.startingPrice}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <p className="text-[11px] font-medium text-orange-600">{cat.hindiSub}</p>
                        <h3 className="text-base font-bold text-slate-900 mt-0.5">{cat.name}</h3>
                        <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {cat.shortDescription}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-orange-600 group-hover:text-orange-700">
                        <span>Explore Professionals</span>
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* "Top-Rated Near You" Section */}
            <section className="bg-white py-14 border-y border-slate-200/80">
              <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                      Customer Favourites • Illustrative Sample Profiles
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                      Top-Rated Professionals Near You
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setActivePage('services');
                    }}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    See All 16 Professionals
                  </button>
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
                                <span className="rounded-full bg-orange-500/15 px-2.5 py-0.5 text-[10px] font-bold text-orange-600">
                                  {pro.categoryName}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => toggleFavourite(pro.id)}
                                  aria-label={`Favourite ${pro.name}`}
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

                              <h3 className="mt-1 text-base font-bold text-slate-900 truncate">
                                {pro.name}
                              </h3>

                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                                <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                  {pro.computedRating} ({pro.computedReviewCount})
                                </span>
                                <span>•</span>
                                <span>{pro.experienceYears} yrs exp</span>
                              </div>
                            </div>
                          </div>

                          <p className="mt-3 text-xs text-slate-600 line-clamp-2">
                            {pro.shortDescription}
                          </p>

                          <div className="mt-3 flex items-center justify-between text-xs">
                            <span className="inline-flex items-center gap-1 text-slate-500">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              {pro.location}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                              <ShieldCheck className="h-3 w-3" />
                              Demo Verified
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between pt-3.5 border-t border-slate-200/80">
                          <div>
                            <span className="block text-[10px] uppercase text-slate-400">
                              Indicative Visit Price
                            </span>
                            <span className="text-base font-extrabold text-slate-900">
                              ₹{pro.priceInr}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setProfileModalProId(pro.id)}
                              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                            >
                              View Profile
                            </button>
                            <button
                              type="button"
                              onClick={() => openBookingModal(pro)}
                              className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:opacity-95 cursor-pointer"
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

            {/* Dark Navy Premium Promotional Section */}
            <section className="bg-slate-900 py-16 text-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
                  <div className="lg:col-span-7 space-y-5">
                    <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-3.5 py-1 text-xs font-bold text-orange-300 border border-orange-400/30">
                      The SevaSetu Difference
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                      Built for Indian households—combining traditional trust with live digital convenience.
                    </h2>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                      Whether you are organizing a family Griha Pravesh puja at 7 AM or fixing an urgent electrical fault before guests arrive, SevaSetu keeps pricing transparent, arrival tracked in real time, and post-service feedback accountable.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
                        <h3 className="text-sm font-bold text-orange-400">
                          1. Transparent INR Rate Cards
                        </h3>
                        <p className="text-xs text-slate-300 mt-1">
                          Clear indicative visit charges with promo codes (SEVA20, FIRST100) and zero surprise commissions.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
                        <h3 className="text-sm font-bold text-teal-400">
                          2. Animated Doorstep Tracking
                        </h3>
                        <p className="text-xs text-slate-300 mt-1">
                          Follow your assigned professional across 6 live stages from booking placement to completion.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
                        <h3 className="text-sm font-bold text-amber-400">
                          3. Instant Reschedule & Control
                        </h3>
                        <p className="text-xs text-slate-300 mt-1">
                          Plans changed? Reschedule upcoming slots in two clicks without losing your booking reference.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
                        <h3 className="text-sm font-bold text-rose-400">
                          4. Seva Loyalty Rewards
                        </h3>
                        <p className="text-xs text-slate-300 mt-1">
                          Every completed booking counts toward consecutive Seva loyalty discounts and festive gift cards.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Loyalty & Promo Spotlight Card */}
                  <div className="lg:col-span-5">
                    <div className="rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-teal-500/20 px-3 py-1 text-xs font-bold text-teal-300">
                          SevaSetu Rewards Club
                        </span>
                        <Award className="h-6 w-6 text-amber-400" />
                      </div>

                      <h3 className="mt-4 text-xl font-extrabold">
                        Your Completed Bookings Progress
                      </h3>
                      <p className="mt-1 text-xs text-slate-300">
                        Calculated directly from your actual Completed bookings ({completedCount}{' '}
                        completed so far).
                      </p>

                      <div className="mt-4 rounded-2xl bg-slate-950/70 p-4 border border-slate-800">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>Milestone Tier Progress</span>
                          <span className="text-teal-400">
                            {loyaltyMilestoneProgress} of {loyaltyTarget} Completed Bookings
                          </span>
                        </div>
                        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                          <div
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round((loyaltyMilestoneProgress / loyaltyTarget) * 100)
                              )}%`,
                            }}
                            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-teal-400 transition-all duration-500"
                          />
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2.5 text-xs">
                          <div>
                            <span className="font-mono font-bold text-orange-400">SEVA20</span>
                            <span className="ml-2 text-slate-300">20% off up to ₹250</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText('SEVA20');
                              setCopiedCode('SEVA20');
                              showToast('Copied promo code SEVA20');
                            }}
                            className="text-xs font-bold text-teal-400 hover:underline cursor-pointer"
                          >
                            {copiedCode === 'SEVA20' ? 'Copied!' : 'Copy Code'}
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActivePage('rewards')}
                        className="mt-5 w-full rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3 text-xs font-bold text-white shadow hover:opacity-95 cursor-pointer"
                      >
                        View All Promo Codes & Demo Gift Cards
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ==================== 2. EXPLORE SERVICES & PROFESSIONALS ==================== */}
        {activePage === 'services' && (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Discover Trusted Professionals
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  All profiles below are clearly labeled illustrative sample listings for the hackathon demonstration.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setCityFilter('All');
                  setMinRatingFilter(0);
                  setMaxPriceFilter(5000);
                  setOnlyFavourites(false);
                  setSortBy('recommended');
                }}
                className="self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>

            {/* Category Pills Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                All Categories (16)
              </button>
              {SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-xs'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {renderCategoryIcon(cat.iconName, 'h-3.5 w-3.5')}
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Search, Filter & Sort Controls Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
                <div className="sm:col-span-2 relative">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, service, puja, plumber, Noida..."
                    aria-label="Search professionals"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Location Zone
                  </label>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    aria-label="Filter by city"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800"
                  >
                    <option value="All">All NCR Zones</option>
                    <option value="Noida">Noida & Greater Noida</option>
                    <option value="Delhi">Delhi (South & Dwarka)</option>
                    <option value="Gurgaon">Gurgaon</option>
                    <option value="Ghaziabad">Ghaziabad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Min Rating
                  </label>
                  <select
                    value={minRatingFilter}
                    onChange={(e) => setMinRatingFilter(Number(e.target.value))}
                    aria-label="Filter by minimum rating"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={4.5}>4.5★ & above</option>
                    <option value={4.8}>4.8★ & above</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Max Price (₹)
                  </label>
                  <select
                    value={maxPriceFilter}
                    onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                    aria-label="Filter by maximum price"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800"
                  >
                    <option value={5000}>All Prices</option>
                    <option value={400}>Under ₹400</option>
                    <option value={800}>Under ₹800</option>
                    <option value={1200}>Under ₹1,200</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as 'recommended' | 'rating' | 'price-asc' | 'price-desc'
                      )
                    }
                    aria-label="Sort professionals"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800"
                  >
                    <option value="recommended">Most Reviewed</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <span className="text-xs font-medium text-slate-500">
                  Showing <strong>{filteredProfessionals.length}</strong> matching sample professionals
                </span>
                <button
                  type="button"
                  onClick={() => setOnlyFavourites((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    onlyFavourites
                      ? 'bg-rose-600 text-white'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Heart
                    className={`h-3.5 w-3.5 ${onlyFavourites ? 'fill-white' : 'text-rose-500'}`}
                  />
                  <span>{onlyFavourites ? 'Showing Saved Favourites' : 'Filter Favourites Only'}</span>
                </button>
              </div>
            </div>

            {/* Results Grid */}
            {filteredProfessionals.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
                <Filter className="mx-auto h-10 w-10 text-slate-400" />
                <h3 className="mt-3 text-lg font-bold text-slate-900">
                  No matching professionals found
                </h3>
                <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                  Try clearing your search query, expanding your price filter, or switching back to All Categories.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProfessionals.map((pro) => {
                  const isFav = favourites.includes(pro.id);
                  return (
                    <div
                      key={pro.id}
                      className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-orange-300 hover:shadow-md"
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
                            <div className="flex items-center justify-between gap-1">
                              <span className="rounded-full bg-orange-500/15 px-2.5 py-0.5 text-[10px] font-bold text-orange-600">
                                {pro.categoryName}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleFavourite(pro.id)}
                                aria-label={`Toggle favourite for ${pro.name}`}
                                className="rounded-full p-1 hover:bg-slate-100 cursor-pointer"
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
                            <h3 className="mt-1 text-base font-bold text-slate-900">
                              {pro.name}
                            </h3>
                            <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                              <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                {pro.computedRating} ({pro.computedReviewCount} reviews)
                              </span>
                              <span>•</span>
                              <span>{pro.experienceYears} yrs</span>
                            </div>
                          </div>
                        </div>

                        <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                          {pro.shortDescription}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {pro.specialties.slice(0, 3).map((spec) => (
                            <span
                              key={spec}
                              className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs pt-2">
                          <span className="inline-flex items-center gap-1 text-slate-500">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            {pro.location}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                            <ShieldCheck className="h-3 w-3" />
                            Demo Sample Verified
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between pt-3.5 border-t border-slate-100">
                        <div>
                          <span className="block text-[10px] uppercase text-slate-400">
                            Indicative Price
                          </span>
                          <span className="text-lg font-extrabold text-slate-900">
                            ₹{pro.priceInr}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setProfileModalProId(pro.id)}
                            className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            View Profile
                          </button>
                          <button
                            type="button"
                            onClick={() => openBookingModal(pro)}
                            className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2 text-xs font-bold text-white shadow-xs hover:opacity-95 cursor-pointer"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================== 3. MY BOOKINGS DASHBOARD ==================== */}
        {activePage === 'bookings' && (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  My Bookings Dashboard
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Manage upcoming appointments, track live progress, reschedule slots, or leave feedback on completed services.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivePage('services')}
                className="self-start rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs cursor-pointer"
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
                  className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-bold transition cursor-pointer ${
                    bookingTab === tab.id
                      ? 'border-orange-600 text-orange-600 bg-orange-500/10 rounded-t-xl'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.id}</span>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-extrabold text-slate-800">
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
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <SafeImage
                        src={bk.professionalPhoto}
                        alt={bk.professionalName}
                        fallbackLabel={bk.categoryName}
                        className="h-20 w-20 rounded-2xl shrink-0 border border-slate-200"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-500">
                            Ref: {bk.reference}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                            {bk.categoryName}
                          </span>
                          {bk.tabStatus === 'Upcoming' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/15 px-2.5 py-0.5 text-[11px] font-bold text-teal-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-ping" />
                              {bk.trackingStage}
                            </span>
                          )}
                          {bk.tabStatus === 'Completed' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Completed
                            </span>
                          )}
                          {bk.tabStatus === 'Cancelled' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2.5 py-0.5 text-[11px] font-bold text-rose-600">
                              <XCircle className="h-3.5 w-3.5" />
                              Cancelled
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-slate-900">
                          {bk.professionalName}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                            <Calendar className="h-3.5 w-3.5 text-orange-600" />
                            {bk.date}
                          </span>
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                            <Clock className="h-3.5 w-3.5 text-orange-600" />
                            {bk.timeSlot}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            {bk.address}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                      <div className="sm:text-right">
                        <span className="text-lg font-extrabold text-slate-900">
                          ₹{bk.totalPrice}
                        </span>
                        <span className="block text-[11px] text-slate-500">
                          {bk.paymentMethod}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setProfileModalProId(bk.professionalId)}
                          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          View Provider
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
                              className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-500/20 cursor-pointer"
                            >
                              Reschedule
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setCancelModalBooking(bk);
                                setCancelReason('Change of plans — will rebook later');
                              }}
                              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 cursor-pointer"
                            >
                              Cancel Booking
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTrackingBookingId(bk.id);
                                setActivePage('tracking');
                              }}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-500 cursor-pointer"
                            >
                              <Navigation className="h-3.5 w-3.5" />
                              Track Live
                            </button>
                          </>
                        )}

                        {bk.tabStatus === 'Completed' && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                const pro = professionalsWithDynamicStats.find(
                                  (p) => p.id === bk.professionalId
                                );
                                if (pro) openBookingModal(pro);
                              }}
                              className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-3.5 py-2 text-xs font-bold text-orange-600 cursor-pointer"
                            >
                              Book Again
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setFeedbackModalBooking(bk);
                                setFeedbackRating(bk.feedback?.rating ?? 5);
                                setFeedbackComment(bk.feedback?.comment ?? '');
                                setFeedbackSelectedTags(
                                  bk.feedback?.tags ?? ['Professional behaviour', 'On time']
                                );
                              }}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:opacity-95 cursor-pointer"
                            >
                              <MessageSquarePlus className="h-3.5 w-3.5" />
                              {bk.feedback ? 'Edit Feedback' : 'Leave Feedback'}
                            </button>
                          </>
                        )}

                        {bk.tabStatus === 'Cancelled' && (
                          <button
                            type="button"
                            onClick={() => {
                              const pro = professionalsWithDynamicStats.find(
                                (p) => p.id === bk.professionalId
                              );
                              if (pro) openBookingModal(pro);
                            }}
                            className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2 text-xs font-bold text-white shadow-xs hover:opacity-95 cursor-pointer"
                          >
                            Book Again
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

        {/* ==================== 4. LIVE TRACKING PAGE ==================== */}
        {activePage === 'tracking' && (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Live Service Tracking & Doorstep Navigation
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Select any active booking below to simulate real-time route movement and status progression.
                </p>
              </div>

              {upcomingBookings.length > 0 && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-600">Tracking Booking:</label>
                  <select
                    value={activeTrackedBooking?.id || ''}
                    onChange={(e) => setSelectedTrackingBookingId(e.target.value)}
                    aria-label="Select booking to track"
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    {upcomingBookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.reference} — {b.professionalName.split(' ')[0]} ({b.trackingStage})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {activeTrackedBooking ? (
              <LiveTrackingMap
                booking={activeTrackedBooking}
                onUpdateTracking={handleUpdateTracking}
                onResetTracking={handleResetTracking}
                onOpenFeedback={(bk) => {
                  setFeedbackModalBooking(bk);
                  setFeedbackRating(bk.feedback?.rating ?? 5);
                  setFeedbackComment(bk.feedback?.comment ?? '');
                  setFeedbackSelectedTags(
                    bk.feedback?.tags ?? ['Professional behaviour', 'On time']
                  );
                }}
                onViewProvider={(proId) => setProfileModalProId(proId)}
              />
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <Navigation className="mx-auto h-10 w-10 text-slate-400" />
                <h3 className="mt-3 text-base font-bold text-slate-900">
                  No active bookings to track right now
                </h3>
              </div>
            )}
          </div>
        )}

        {/* ==================== 5. REWARDS & PROMOTIONAL OFFERS PAGE ==================== */}
        {activePage === 'rewards' && (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                SevaSetu Loyalty & Savings
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Rewards, Promo Codes & Demo Gift Cards
              </h1>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {PROMO_OFFERS.map((offer) => (
                <div
                  key={offer.code}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-orange-500/15 px-3 py-1 font-mono text-sm font-extrabold text-orange-600">
                        {offer.code}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        Min Order ₹{offer.minOrder}
                      </span>
                    </div>
                    <h3 className="mt-3 text-base font-bold text-slate-900">{offer.title}</h3>
                    <p className="mt-1 text-xs text-slate-600">{offer.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(offer.code);
                      setCopiedCode(offer.code);
                      showToast(`Promo code ${offer.code} copied!`);
                    }}
                    className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 cursor-pointer"
                  >
                    {copiedCode === offer.code ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy Code
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ==================== AUTHENTICATION MODAL (SIGN IN / SIGN UP / GOOGLE) ==================== */}
      {authModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Sign In or Create Account"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto"
        >
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold">
                    {authMode === 'signin' ? 'Sign In to SevaSetu' : 'Create Your SevaSetu Account'}
                  </h2>
                  <p className="text-[11px] text-slate-300">
                    Sync bookings, loyalty rewards & doorstep addresses
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAuthModalOpen(false);
                  setGoogleChooserOpen(false);
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-700 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Mode Switch Tabs */}
              <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthError(null);
                  }}
                  className={`rounded-lg py-2 text-xs font-bold transition cursor-pointer ${
                    authMode === 'signin'
                      ? 'bg-white text-orange-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In (Log In)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthError(null);
                  }}
                  className={`rounded-lg py-2 text-xs font-bold transition cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-white text-orange-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign Up (New User)
                </button>
              </div>

              {/* Continue with Google Button */}
              {!googleChooserOpen ? (
                <button
                  type="button"
                  onClick={() => setGoogleChooserOpen(true)}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.9C3.5 21.4 7.4 24 12 24z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">
                      Choose a Google Account to link with SevaSetu:
                    </span>
                    <button
                      type="button"
                      onClick={() => setGoogleChooserOpen(false)}
                      className="text-[11px] text-slate-400 hover:text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGoogleLogin('Arif Sk', 'arifsk22709@gmail.com')}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 text-left hover:border-orange-400 cursor-pointer"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">
                      A
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900">Arif Sk</p>
                      <p className="text-[11px] text-slate-500 truncate">arifsk22709@gmail.com</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGoogleLogin('Aarav Sharma', 'aarav.sharma.demo@gmail.com')}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 text-left hover:border-orange-400 cursor-pointer"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                      S
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900">
                        Aarav Sharma (Demo Account)
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        aarav.sharma.demo@gmail.com
                      </p>
                    </div>
                  </button>
                </div>
              )}

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200" />
                <span className="shrink-0 mx-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Or continue with email
                </span>
                <div className="flex-grow border-t border-slate-200" />
              </div>

              {authError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs font-semibold text-rose-700">
                  {authError}
                </div>
              )}

              <form onSubmit={handleEmailAuthSubmit} className="space-y-3">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="Arif Sk"
                        required
                        className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="arifsk22709@gmail.com"
                      required
                      className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      10-Digit Mobile Number
                    </label>
                    <div className="relative">
                      <Smartphone className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        maxLength={10}
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 cursor-pointer"
                >
                  {authMode === 'signin' ? 'Sign In to Account' : 'Create Account & Sign In'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==================== EXISTING MODALS (PROFILE, BOOKING, RESCHEDULE, CANCEL, FEEDBACK) ==================== */}
      {profileModalProfessional && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Professional Profile Details"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs overflow-y-auto"
        >
          <div className="relative my-8 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200">
            <div className="relative h-56 w-full">
              <SafeImage
                src={profileModalProfessional.imageUrl}
                alt={profileModalProfessional.name}
                fallbackLabel={profileModalProfessional.categoryName}
                className="h-full w-full"
              />
              <button
                type="button"
                onClick={() => setProfileModalProId(null)}
                aria-label="Close profile modal"
                className="absolute top-4 right-4 rounded-full bg-slate-900/80 p-2 text-white hover:bg-slate-900 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    {profileModalProfessional.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {profileModalProfessional.experienceYears} Years Experience •{' '}
                    {profileModalProfessional.computedRating}★ (
                    {profileModalProfessional.computedReviewCount} Reviews)
                  </p>
                </div>

                <div className="text-right">
                  <span className="block text-[10px] font-bold uppercase text-slate-400">
                    Indicative Visit Charge
                  </span>
                  <span className="text-2xl font-extrabold text-orange-600">
                    ₹{profileModalProfessional.priceInr}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {profileModalProfessional.bio}
              </p>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setProfileModalProId(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
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
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-2.5 text-xs font-bold text-white shadow hover:opacity-95 cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {bookingModalPro && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Book a Service"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs overflow-y-auto"
        >
          <div className="relative my-8 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between bg-slate-900 px-6 py-4 text-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                  Instant Doorstep Booking
                </span>
                <h2 className="text-lg font-extrabold">Book {bookingModalPro.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setBookingModalPro(null)}
                aria-label="Close booking form"
                className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleConfirmBooking}
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
              noValidate
            >
              {formErrors.duplicate && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800">
                  {formErrors.duplicate}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900"
                  />
                  {formErrors.customerName && (
                    <p className="mt-1 text-[11px] font-semibold text-rose-600">
                      {formErrors.customerName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number (10-digit India +91) *
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                    required
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900"
                  />
                  {formErrors.customerPhone && (
                    <p className="mt-1 text-[11px] font-semibold text-rose-600">
                      {formErrors.customerPhone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Complete Doorstep Service Address *
                </label>
                <input
                  type="text"
                  value={serviceAddress}
                  onChange={(e) => setServiceAddress(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900"
                />
                {formErrors.serviceAddress && (
                  <p className="mt-1 text-[11px] font-semibold text-rose-600">
                    {formErrors.serviceAddress}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Service Date *
                  </label>
                  <input
                    type="date"
                    min={getTodayDateString()}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Available Time Slot *
                  </label>
                  <select
                    value={bookingSlot}
                    onChange={(e) => setBookingSlot(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-900"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Promo Code (Try SEVA20)
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="SEVA20"
                      className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoMessage && (
                    <p
                      className={`mt-1 text-[11px] font-semibold ${
                        promoMessage.type === 'ok' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {promoMessage.text}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Demo Gift Card (GIFT-SEVA-500)
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={giftInput}
                      onChange={(e) => setGiftInput(e.target.value)}
                      placeholder="GIFT-SEVA-500"
                      className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyGiftCard}
                      className="rounded-xl bg-teal-700 px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Base Visit Charge + Hygiene Support Fee</span>
                  <span>₹{priceBreakdown.basePrice + priceBreakdown.platformFee}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-extrabold text-slate-900">
                  <span>Total Payable (Demo)</span>
                  <span>₹{priceBreakdown.finalPayable}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingModalPro(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  Confirm Demo Booking (₹{priceBreakdown.finalPayable})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {rescheduleModalBooking && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-extrabold text-slate-900">
              Reschedule Booking ({rescheduleModalBooking.reference})
            </h2>
            <form onSubmit={handleConfirmReschedule} className="mt-4 space-y-4">
              {rescheduleError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                  {rescheduleError}
                </div>
              )}
              <input
                type="date"
                min={getTodayDateString()}
                value={newRescheduleDate}
                onChange={(e) => setNewRescheduleDate(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900"
              />
              <select
                value={newRescheduleSlot}
                onChange={(e) => setNewRescheduleSlot(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-900"
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
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950"
                >
                  Save New Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {cancelModalBooking && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <h2 className="text-lg font-extrabold text-slate-900">
                Cancel Booking {cancelModalBooking.reference}?
              </h2>
            </div>
            <form onSubmit={handleConfirmCancel} className="mt-4 space-y-4">
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCancelModalBooking(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white"
                >
                  Yes, Cancel Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {feedbackModalBooking && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-extrabold text-slate-900">
              Rate {feedbackModalBooking.professionalName}
            </h2>
            <form onSubmit={handleSubmitFeedback} className="mt-4 space-y-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                      star <= feedbackRating
                        ? 'border-amber-400 bg-amber-50 text-amber-500'
                        : 'border-slate-200 bg-slate-50 text-slate-300'
                    }`}
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= feedbackRating ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Share how the professional performed..."
                className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackModalBooking(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2 text-xs font-bold text-white"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating AI Assistant Widget */}
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>© 2026 SevaSetu Hackathon Prototype. All rights reserved.</span>
          <span className="inline-flex items-center gap-1">
            <Info className="h-3.5 w-3.5" />
            All professionals, phone numbers, and reviews are illustrative demo data.
          </span>
        </div>
      </footer>
    </div>
  );
}