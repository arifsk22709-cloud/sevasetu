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
  Phone,
  IndianRupee,
  Filter,
  MessageSquarePlus,
  Copy,
  Check,
  AlertTriangle,
  Info,
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

const STORAGE_KEYS = {
  BOOKINGS: 'sevasetu_bookings_v1',
  FAVOURITES: 'sevasetu_favourites_v1',
  USER_REVIEWS: 'sevasetu_user_reviews_v1',
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

  // Persistent User-Submitted Reviews Map (professionalId -> ReviewItem[])
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
      // Ignore storage quota errors in restricted environments
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(favourites));
    } catch {
      // Ignore storage quota errors
    }
  }, [favourites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_REVIEWS, JSON.stringify(userReviewsByPro));
    } catch {
      // Ignore storage quota errors
    }
  }, [userReviewsByPro]);

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

  // Loyalty Streak Calculation (Consistent with actual completed bookings)
  const completedCount = completedBookings.length;
  const loyaltyTarget = 3;
  const isLoyaltyUnlocked = completedCount >= 1; // At least 1 completed booking gives 5% or 3+ gives 10%
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

    // Check duplicate active booking for same professional + date + slot
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

  // Update Tracking Stage & Automatically Move to Completed if Stage == 'Service complete'
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

  // Reset Tracking Simulation for Demo Re-Runs
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

  // Submit or Update Customer Feedback for Completed Booking
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

    // 1. Save feedback on the booking
    setBookings((prev) =>
      prev.map((b) => (b.id === feedbackModalBooking.id ? { ...b, feedback: feedbackObj } : b))
    );

    // 2. Link feedback to the professional's review list (replace if editing existing booking review)
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

  // Reset All Demo Data to Initial State
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

  // Active booking for Live Tracking page
  const activeTrackedBooking = useMemo(() => {
    const found = bookings.find((b) => b.id === selectedTrackingBookingId);
    if (found && found.tabStatus !== 'Cancelled') return found;
    return upcomingBookings[0] || completedBookings[0] || null;
  }, [bookings, selectedTrackingBookingId, upcomingBookings, completedBookings]);

  // Active Professional for Profile Modal
  const profileModalProfessional = useMemo(
    () => professionalsWithDynamicStats.find((p) => p.id === profileModalProId) || null,
    [professionalsWithDynamicStats, profileModalProId]
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Demo Transparency Strip */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-300 border border-orange-400/30">
              Hackathon Prototype
            </span>
            <span className="text-[11px] text-slate-300">
              Sample profiles, simulated route GPS, and demo payment options. No real credentials collected.
            </span>
          </div>
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
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
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
                className={`relative rounded-xl px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
                  activePage === item.id
                    ? 'bg-orange-50 text-orange-600'
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

          {/* Right Quick Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setOnlyFavourites(true);
                setActivePage('services');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
              <span>Favourites ({favourites.length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setOnlyFavourites(false);
                setActivePage('services');
              }}
              className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-95 cursor-pointer"
            >
              Book a Service
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
            className="md:hidden rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
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
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-5 z-50 flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl"
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
            <section className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/40 to-slate-50 pt-8 pb-14 lg:py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1.5 text-xs font-semibold text-orange-700">
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
                        className="inline-flex items-center gap-2 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3.5 text-xs font-bold text-teal-800 hover:bg-teal-100 cursor-pointer"
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
                        <p className="text-xs text-slate-500 mt-0.5">
                          Curated sample specialists
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900">
                          <IndianRupee className="h-4 w-4 text-orange-600" />
                          <span>Upfront Pricing</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Zero hidden visit charges
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span>4.8★ Avg Rating</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Live interactive reviews
                        </p>
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
                      <div className="absolute bottom-3 right-3 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-extrabold text-slate-900 shadow">
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
                                <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-orange-800">
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
                                <span className="inline-flex items-center gap-1 font-bold text-amber-600">
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
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
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

            {/* Dark Navy Premium Promotional Section — "The SevaSetu Difference" */}
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
                        <p className="mt-2 text-[11px] text-slate-400">
                          {completedCount >= loyaltyTarget
                            ? 'Milestone achieved! Extra Loyalty Discount unlocked at checkout.'
                            : `Complete ${
                                loyaltyTarget - loyaltyMilestoneProgress
                              } more booking(s) to reach the 3-booking Gold Milestone!`}
                        </p>
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
                    ? 'bg-slate-900 text-white shadow-xs'
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
                {/* Search Input */}
                <div className="sm:col-span-2 relative">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, service, puja, plumber, Noida..."
                    aria-label="Search professionals"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* City Filter */}
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

                {/* Rating Filter */}
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

                {/* Max Price Filter */}
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

                {/* Sort By */}
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
                  <Heart className={`h-3.5 w-3.5 ${onlyFavourites ? 'fill-white' : 'text-rose-500'}`} />
                  <span>{onlyFavourites ? 'Showing Saved Favourites' : 'Filter Favourites Only'}</span>
                </button>
              </div>
            </div>

            {/* Results Grid or Empty State */}
            {filteredProfessionals.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
                <Filter className="mx-auto h-10 w-10 text-slate-400" />
                <h3 className="mt-3 text-lg font-bold text-slate-900">
                  No matching professionals found
                </h3>
                <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                  Try clearing your search query, expanding your price filter, or switching back to All Categories.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setCityFilter('All');
                    setMinRatingFilter(0);
                    setMaxPriceFilter(5000);
                    setOnlyFavourites(false);
                  }}
                  className="mt-4 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-orange-500 cursor-pointer"
                >
                  Reset Filters & Show All
                </button>
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
                              <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-200">
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
                              <span className="inline-flex items-center gap-1 font-bold text-amber-600">
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
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
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

            {/* 3 Working Status Tabs: Upcoming | Completed | Cancelled */}
            <div className="flex border-b border-slate-200 gap-2">
              {(
                [
                  { id: 'Upcoming', count: upcomingBookings.length, color: 'text-orange-600' },
                  { id: 'Completed', count: completedBookings.length, color: 'text-emerald-600' },
                  { id: 'Cancelled', count: cancelledBookings.length, color: 'text-rose-600' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setBookingTab(tab.id)}
                  className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-bold transition cursor-pointer ${
                    bookingTab === tab.id
                      ? 'border-orange-600 text-orange-600 bg-orange-50/50 rounded-t-xl'
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

            {/* Tab Content List */}
            <div className="space-y-4">
              {(bookingTab === 'Upcoming'
                ? upcomingBookings
                : bookingTab === 'Completed'
                ? completedBookings
                : cancelledBookings
              ).length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                  <Calendar className="mx-auto h-9 w-9 text-slate-400" />
                  <h3 className="mt-2 text-base font-bold text-slate-900">
                    No {bookingTab.toLowerCase()} bookings yet
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Explore our 8 service categories to schedule a doorstep professional.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActivePage('services')}
                    className="mt-4 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white cursor-pointer"
                  >
                    Browse Services
                  </button>
                </div>
              ) : (
                (bookingTab === 'Upcoming'
                  ? upcomingBookings
                  : bookingTab === 'Completed'
                  ? completedBookings
                  : cancelledBookings
                ).map((bk) => (
                  <div
                    key={bk.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      {/* Left Info */}
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

                            {/* Status Pill */}
                            {bk.tabStatus === 'Upcoming' && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-bold text-teal-700 border border-teal-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-ping" />
                                {bk.trackingStage}
                              </span>
                            )}
                            {bk.tabStatus === 'Completed' && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Completed
                              </span>
                            )}
                            {bk.tabStatus === 'Cancelled' && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-800">
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

                          {bk.notes && (
                            <p className="text-xs text-slate-500 italic">Note: "{bk.notes}"</p>
                          )}

                          {bk.rescheduleHistory.length > 0 && (
                            <p className="text-[11px] font-medium text-amber-700 bg-amber-50 inline-block px-2 py-0.5 rounded">
                              Rescheduled from{' '}
                              {bk.rescheduleHistory[bk.rescheduleHistory.length - 1].oldDate} (
                              {bk.rescheduleHistory[bk.rescheduleHistory.length - 1].oldTimeSlot})
                            </p>
                          )}

                          {bk.tabStatus === 'Cancelled' && bk.cancellationReason && (
                            <p className="text-xs font-medium text-rose-700">
                              Cancellation Reason: {bk.cancellationReason}
                            </p>
                          )}

                          {bk.tabStatus === 'Completed' && bk.feedback && (
                            <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50/70 p-2.5 text-xs">
                              <div className="flex items-center gap-1 font-bold text-amber-800">
                                <span>Your Submitted Rating: {bk.feedback.rating}★</span>
                                <span>•</span>
                                <span className="text-[11px] font-normal text-slate-600">
                                  {bk.feedback.tags.join(', ')}
                                </span>
                              </div>
                              <p className="mt-0.5 text-slate-700">"{bk.feedback.comment}"</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Price & Context-Sensitive Action Buttons */}
                      <div className="flex flex-col sm:items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                        <div className="sm:text-right">
                          <span className="text-lg font-extrabold text-slate-900">
                            ₹{bk.totalPrice}
                          </span>
                          <span className="block text-[11px] text-slate-500">
                            {bk.paymentMethod}
                          </span>
                        </div>

                        {/* Actions strictly governed by booking status */}
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
                                className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100 cursor-pointer"
                              >
                                Reschedule
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setCancelModalBooking(bk);
                                  setCancelReason('Change of plans — will rebook later');
                                }}
                                className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 cursor-pointer"
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
                                className="rounded-xl border border-orange-300 bg-orange-50 px-3.5 py-2 text-xs font-bold text-orange-700 hover:bg-orange-100 cursor-pointer"
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
                ))
              )}
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

              {/* Switch between active bookings to track */}
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
                <p className="mt-1 text-xs text-slate-500">
                  Book a service first to test the live animated route and status simulator.
                </p>
                <button
                  type="button"
                  onClick={() => setActivePage('services')}
                  className="mt-4 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white cursor-pointer"
                >
                  Book a Service Now
                </button>
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
              <p className="text-xs text-slate-600 mt-0.5">
                All reward counts and discounts below are synchronized with your actual completed demo bookings.
              </p>
            </div>

            {/* Loyalty Progress Card */}
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300">
                    <Award className="h-4 w-4" />
                    <span>Consecutive Completed Bookings Tracker</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold">
                    You have completed {completedCount} {completedCount === 1 ? 'booking' : 'bookings'} on SevaSetu
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    Every booking that reaches "Service complete" automatically increments your verified counter. Having at least 1 completed booking unlocks an extra 5% Loyalty Streak discount checkbox in the booking checkout form!
                  </p>
                </div>

                <div className="lg:col-span-4 rounded-2xl bg-slate-950/80 p-5 border border-slate-700">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Gold Streak Goal</span>
                    <span className="text-teal-400">
                      {loyaltyMilestoneProgress} of {loyaltyTarget} Completed
                    </span>
                  </div>
                  <div className="mt-2.5 h-3 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((loyaltyMilestoneProgress / loyaltyTarget) * 100)
                        )}%`,
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-teal-400"
                    />
                  </div>
                  <p className="mt-2.5 text-[11px] text-slate-300">
                    Status:{' '}
                    <strong className="text-emerald-400">
                      {isLoyaltyUnlocked ? '5% Extra Checkout Reward Active' : 'Complete 1 booking to unlock'}
                    </strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Promo Codes Grid */}
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 mb-4">
                Active Demo Promo Codes (Use at Checkout)
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {PROMO_OFFERS.map((offer) => (
                  <div
                    key={offer.code}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-lg bg-orange-50 px-3 py-1 font-mono text-sm font-extrabold text-orange-700 border border-orange-200">
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

            {/* Demo Gift Cards */}
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 mb-4">
                Demo Gift Cards (Instant Balance Deduction in Booking Form)
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {DEMO_GIFT_CARDS.map((gc) => (
                  <div
                    key={gc.code}
                    className="flex items-center justify-between rounded-2xl border border-teal-200 bg-teal-50/50 p-5"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white">
                        <Gift className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="font-mono text-sm font-extrabold text-teal-900">
                          {gc.code}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">{gc.label}</h3>
                        <p className="text-xs text-slate-600">
                          Deducts up to ₹{gc.balanceInr} from your booking total (Illustrative Demo Voucher)
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(gc.code);
                        setCopiedCode(gc.code);
                        showToast(`Gift card ${gc.code} copied!`);
                      }}
                      className="rounded-xl bg-teal-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-teal-600 cursor-pointer"
                    >
                      {copiedCode === gc.code ? 'Copied!' : 'Copy Voucher'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==================== MODALS ==================== */}

      {/* 1. PROFESSIONAL PROFILE MODAL */}
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
              <div className="absolute bottom-4 left-4 rounded-xl bg-slate-900/85 backdrop-blur-xs px-3 py-1 text-xs font-bold text-white">
                {profileModalProfessional.categoryName} • {profileModalProfessional.location}
              </div>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Illustrative Sample Profile (Demo Verified)
                  </span>
                  <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
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

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Specialties & Services Included
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profileModalProfessional.specialties.map((s) => (
                    <span
                      key={s}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Customer Reviews Section */}
              <div className="border-t border-slate-200 pt-4">
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  Customer Reviews ({profileModalProfessional.allReviews.length})
                </h3>
                {profileModalProfessional.allReviews.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">
                    No written reviews yet for this sample profile. Complete a booking to add the first review!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {profileModalProfessional.allReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{rev.customerName}</span>
                          <span className="font-bold text-amber-600">{rev.rating} ★</span>
                        </div>
                        <p className="mt-1 text-slate-700">"{rev.comment}"</p>
                        {rev.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {rev.tags.map((t) => (
                              <span
                                key={t}
                                className="rounded bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

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
                  Book {profileModalProfessional.name.split(' ')[0]} Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BOOKING FORM MODAL */}
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
                <h2 className="text-lg font-extrabold">
                  Book {bookingModalPro.name}
                </h2>
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

              {/* Selected Service Summary */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                <SafeImage
                  src={bookingModalPro.imageUrl}
                  alt={bookingModalPro.name}
                  fallbackLabel={bookingModalPro.categoryName}
                  className="h-14 w-14 rounded-xl shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-orange-600">
                    {bookingModalPro.categoryName}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {bookingModalPro.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Base Visit Charge: ₹{bookingModalPro.priceInr} • {bookingModalPro.location}
                  </p>
                </div>
              </div>

              {/* Customer Name & Indian 10-Digit Mobile */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="cust-name"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Customer Name *
                  </label>
                  <input
                    id="cust-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:outline-none"
                  />
                  {formErrors.customerName && (
                    <p className="mt-1 text-[11px] font-semibold text-rose-600">
                      {formErrors.customerName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="cust-phone"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Mobile Number (10-digit India +91) *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 px-3 text-xs font-bold text-slate-600">
                      +91
                    </span>
                    <input
                      id="cust-phone"
                      type="tel"
                      maxLength={10}
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      required
                      className="w-full rounded-r-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  {formErrors.customerPhone && (
                    <p className="mt-1 text-[11px] font-semibold text-rose-600">
                      {formErrors.customerPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* Service Address */}
              <div>
                <label
                  htmlFor="cust-address"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Complete Doorstep Service Address *
                </label>
                <input
                  id="cust-address"
                  type="text"
                  value={serviceAddress}
                  onChange={(e) => setServiceAddress(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:outline-none"
                />
                {formErrors.serviceAddress && (
                  <p className="mt-1 text-[11px] font-semibold text-rose-600">
                    {formErrors.serviceAddress}
                  </p>
                )}
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="bk-date"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Preferred Service Date *
                  </label>
                  <input
                    id="bk-date"
                    type="date"
                    min={getTodayDateString()}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:outline-none"
                  />
                  {formErrors.bookingDate && (
                    <p className="mt-1 text-[11px] font-semibold text-rose-600">
                      {formErrors.bookingDate}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="bk-slot"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Available Time Slot *
                  </label>
                  <select
                    id="bk-slot"
                    value={bookingSlot}
                    onChange={(e) => setBookingSlot(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-orange-500 focus:outline-none"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional Special Instructions */}
              <div>
                <label
                  htmlFor="bk-notes"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Special Instructions / Notes (Optional)
                </label>
                <input
                  id="bk-notes"
                  type="text"
                  value={serviceNotes}
                  onChange={(e) => setServiceNotes(e.target.value)}
                  placeholder="E.g., Gate passcode, puja samagri preference, pet at home..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Promo Code & Gift Card Inputs */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Promo Code (Try SEVA20 or FIRST100)
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
                      className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
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
                    Demo Gift Card (Try GIFT-SEVA-500)
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
                      className="rounded-xl bg-teal-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-600 cursor-pointer"
                    >
                      Redeem
                    </button>
                  </div>
                  {giftMessage && (
                    <p
                      className={`mt-1 text-[11px] font-semibold ${
                        giftMessage.type === 'ok' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {giftMessage.text}
                    </p>
                  )}
                </div>
              </div>

              {/* Loyalty Discount Toggle */}
              {isLoyaltyUnlocked && (
                <label className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyLoyaltyReward}
                    onChange={(e) => setApplyLoyaltyReward(e.target.checked)}
                    className="h-4 w-4 rounded text-orange-600"
                  />
                  <span className="font-semibold text-amber-950">
                    Apply 5% Loyalty Streak Reward (-₹{Math.round(bookingModalPro.priceInr * 0.05)})
                    based on your {completedCount} completed booking(s)
                  </span>
                </label>
              )}

              {/* Demo Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Payment Option (Demo Mode — No Real Payment Collected)
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {(
                    [
                      'UPI (Demo - GPay / PhonePe)',
                      'Card (Demo - No Real Card Collected)',
                      'Net Banking (Demo)',
                      'Cash on Service',
                    ] as PaymentMethod[]
                  ).map((method) => (
                    <label
                      key={method}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-semibold cursor-pointer ${
                        paymentMethod === method
                          ? 'border-orange-500 bg-orange-50/60 text-orange-900'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Itemized Price Summary */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Indicative Service Visit Charge</span>
                  <span>₹{priceBreakdown.basePrice}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Platform Hygiene & Safety Support Fee</span>
                  <span>₹{priceBreakdown.platformFee}</span>
                </div>
                {priceBreakdown.promoDiscount > 0 && (
                  <div className="flex justify-between font-semibold text-emerald-600">
                    <span>Promo Discount ({appliedPromo})</span>
                    <span>-₹{priceBreakdown.promoDiscount}</span>
                  </div>
                )}
                {priceBreakdown.loyaltyDiscount > 0 && (
                  <div className="flex justify-between font-semibold text-emerald-600">
                    <span>Loyalty Streak Reward (5%)</span>
                    <span>-₹{priceBreakdown.loyaltyDiscount}</span>
                  </div>
                )}
                {priceBreakdown.giftDeduction > 0 && (
                  <div className="flex justify-between font-semibold text-teal-600">
                    <span>Gift Card Deduction ({appliedGift})</span>
                    <span>-₹{priceBreakdown.giftDeduction}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-extrabold text-slate-900">
                  <span>Total Payable (Demo)</span>
                  <span>₹{priceBreakdown.finalPayable}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingModalPro(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 cursor-pointer"
                >
                  Confirm Demo Booking (₹{priceBreakdown.finalPayable})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. RESCHEDULE BOOKING MODAL */}
      {rescheduleModalBooking && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Reschedule Booking"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900">
                Reschedule Booking ({rescheduleModalBooking.reference})
              </h2>
              <button
                type="button"
                onClick={() => setRescheduleModalBooking(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-1 text-xs text-slate-600">
              Current slot with <strong>{rescheduleModalBooking.professionalName}</strong>:{' '}
              {rescheduleModalBooking.date} ({rescheduleModalBooking.timeSlot})
            </p>

            <form onSubmit={handleConfirmReschedule} className="mt-4 space-y-4">
              {rescheduleError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                  {rescheduleError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select New Date *
                </label>
                <input
                  type="date"
                  min={getTodayDateString()}
                  value={newRescheduleDate}
                  onChange={(e) => setNewRescheduleDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select New Time Slot *
                </label>
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
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModalBooking(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Keep Current Slot
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 cursor-pointer"
                >
                  Confirm New Date & Time
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. CANCEL BOOKING CONFIRMATION MODAL */}
      {cancelModalBooking && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Cancel Booking Confirmation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <h2 className="text-lg font-extrabold text-slate-900">
                Cancel Booking {cancelModalBooking.reference}?
              </h2>
            </div>

            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel your appointment with{' '}
              <strong>{cancelModalBooking.professionalName}</strong> scheduled for{' '}
              {cancelModalBooking.date} ({cancelModalBooking.timeSlot})? Cancelled bookings cannot be tracked or rescheduled.
            </p>

            <form onSubmit={handleConfirmCancel} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Cancellation (Optional)
                </label>
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalBooking(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-500 cursor-pointer"
                >
                  Yes, Cancel Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. LEAVE FEEDBACK & STAR RATING MODAL */}
      {feedbackModalBooking && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Rate Your Experience"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                  Verified Completed Service ({feedbackModalBooking.reference})
                </span>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Rate {feedbackModalBooking.professionalName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackModalBooking(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="mt-4 space-y-4">
              {/* 1 to 5 Star Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Star Rating (1 to 5 Stars) *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition cursor-pointer ${
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
                  <span className="ml-2 text-sm font-extrabold text-slate-800">
                    {feedbackRating} / 5
                  </span>
                </div>
              </div>

              {/* Selectable Feedback Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  What went well? (Optional Tags)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {FEEDBACK_TAGS.map((tag) => {
                    const active = feedbackSelectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          setFeedbackSelectedTags((prev) =>
                            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                          )
                        }
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                          active
                            ? 'bg-orange-600 text-white'
                            : 'border border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Written Review */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Write a Review (Optional)
                </label>
                <textarea
                  rows={3}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Share how the professional performed..."
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFeedbackModalBooking(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2 text-xs font-bold text-white shadow cursor-pointer"
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
      <footer className="border-t border-slate-200 bg-white py-10 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-lg font-extrabold text-slate-900">
                  Seva<span className="text-orange-600">Setu</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Trusted services, right at your doorstep. Connecting Indian households with sample Vedic Pandits, home cleaners, plumbers, electricians, and skilled artisans.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                Service Categories
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {SERVICE_CATEGORIES.slice(0, 4).map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(c.id);
                        setActivePage('services');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-orange-600 cursor-pointer"
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                More Categories
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {SERVICE_CATEGORIES.slice(4, 8).map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(c.id);
                        setActivePage('services');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-orange-600 cursor-pointer"
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                Quick Demo Links
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li>
                  <button
                    type="button"
                    onClick={() => setActivePage('bookings')}
                    className="hover:text-orange-600 cursor-pointer"
                  >
                    My Bookings Dashboard
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActivePage('tracking')}
                    className="hover:text-orange-600 cursor-pointer"
                  >
                    Live Route Tracking Simulator
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActivePage('rewards')}
                    className="hover:text-orange-600 cursor-pointer"
                  >
                    Loyalty Rewards & Promo Codes
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleResetAllDemoData}
                    className="font-semibold text-rose-600 hover:underline cursor-pointer"
                  >
                    Reset Demo Data to Defaults
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <span>© 2026 SevaSetu Hackathon Prototype. All rights reserved.</span>
            <span className="inline-flex items-center gap-1">
              <Info className="h-3.5 w-3.5" />
              All professionals, phone numbers, and reviews are clearly labeled illustrative demo data.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}