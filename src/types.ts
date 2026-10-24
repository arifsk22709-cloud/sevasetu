export type ServiceCategoryId =
  | 'priest'
  | 'housekeeping'
  | 'plumber'
  | 'barber'
  | 'electrician'
  | 'carpentry'
  | 'painting'
  | 'masonry';

export type TrackingStage =
  | 'Booking placed'
  | 'Professional assigned'
  | 'On the way'
  | 'Arrived'
  | 'Service in progress'
  | 'Service complete';

export type BookingTabStatus = 'Upcoming' | 'Completed' | 'Cancelled';

export type PaymentMethod =
  | 'UPI (Demo - GPay / PhonePe)'
  | 'Card (Demo - No Real Card Collected)'
  | 'Net Banking (Demo)'
  | 'Cash on Service';

export interface ServiceCategory {
  id: ServiceCategoryId;
  name: string;
  hindiSub: string;
  iconName: string;
  shortDescription: string;
  startingPrice: number;
  imageUrl: string;
  fallbackLabel: string;
}

export interface ReviewItem {
  id: string;
  bookingRef?: string;
  customerName: string;
  rating: number;
  comment: string;
  tags: string[];
  createdAt: string;
  isDemoSample?: boolean;
}

export interface Professional {
  id: string;
  name: string;
  categoryId: ServiceCategoryId;
  categoryName: string;
  shortDescription: string;
  bio: string;
  specialties: string[];
  baseRating: number;
  baseReviewCount: number;
  experienceYears: number;
  priceInr: number;
  location: string;
  cityZone: 'Noida' | 'Delhi' | 'Gurgaon' | 'Ghaziabad';
  imageUrl: string;
  isDemoVerified: boolean;
  initialReviews: ReviewItem[];
}

export interface RescheduleRecord {
  oldDate: string;
  oldTimeSlot: string;
  newDate: string;
  newTimeSlot: string;
  changedAt: string;
}

export interface FeedbackRecord {
  rating: number;
  comment: string;
  tags: string[];
  submittedAt: string;
}

export interface Booking {
  id: string;
  reference: string;
  professionalId: string;
  professionalName: string;
  professionalPhoto: string;
  categoryId: ServiceCategoryId;
  categoryName: string;
  customerName: string;
  customerPhone: string;
  address: string;
  notes: string;
  date: string;
  timeSlot: string;
  paymentMethod: PaymentMethod;
  basePrice: number;
  platformFee: number;
  discountAmount: number;
  giftCardAmount: number;
  loyaltyDiscountAmount: number;
  totalPrice: number;
  promoCodeUsed?: string;
  giftCardUsed?: string;
  tabStatus: BookingTabStatus;
  trackingStage: TrackingStage;
  trackingProgress: number; // 0 to 100
  createdAt: string;
  rescheduleHistory: RescheduleRecord[];
  cancellationReason?: string;
  cancelledAt?: string;
  completedAt?: string;
  feedback?: FeedbackRecord;
}

export interface PromoOffer {
  code: string;
  title: string;
  description: string;
  discountType: 'PERCENT' | 'FLAT';
  value: number;
  maxDiscount?: number;
  minOrder: number;
}

export interface GiftCardDemo {
  code: string;
  balanceInr: number;
  label: string;
}