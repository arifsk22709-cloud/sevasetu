import { ServiceCategoryId } from '../types';

export type AppLanguage = 'en' | 'hi' | 'bn';

export interface LanguageOption {
  code: AppLanguage;
  label: string;
  nativeLabel: string;
  shortLabel: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', shortLabel: 'EN' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', shortLabel: 'हिं' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', shortLabel: 'বাং' },
];

export interface LocalizedStrings {
  // Control Bar
  controlBarLabel: string;
  languageLabel: string;
  zoneLabel: string;
  allZones: string;
  textSizeLabel: string;
  textNormal: string;
  textLarge: string;
  themeLight: string;
  themeDark: string;
  quickTrack: string;
  resetDemo: string;
  prototypeNotice: string;

  // Navigation
  brandSubtitle: string;
  navHome: string;
  navServices: string;
  navBookings: string;
  navTracking: string;
  navRewards: string;
  signIn: string;
  signOut: string;
  bookServiceBtn: string;

  // Hero Section
  heroBadge: string;
  heroTitlePart1: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroTrackingCta: string;
  trustSampleListings: string;
  trustCategoriesCount: string;
  trustClearPricing: string;
  trustStartingPrice: string;
  trustAvgRating: string;
  trustInteractiveReviews: string;
  activeLiveBookingLabel: string;

  // Home Sections
  categoriesKicker: string;
  whatDoYouNeedTitle: string;
  viewAllProsLink: string;
  startingAt: string;
  exploreProsCta: string;
  topRatedKicker: string;
  topRatedTitle: string;
  seeAllProsBtn: string;
  viewProfileBtn: string;
  bookNowBtn: string;
  priceFrom: string;

  // Services Directory
  servicesPageTitle: string;
  servicesPageSubtitle: string;
  allCategoriesBtn: string;
  searchPlaceholder: string;
  locationZoneLabel: string;
  minRatingLabel: string;
  maxPriceLabel: string;
  sortByLabel: string;
  showingProsLabel: string;
  filterFavouritesBtn: string;
  showingFavouritesBtn: string;

  // My Bookings Page
  bookingsPageTitle: string;
  bookingsPageSubtitle: string;
  bookAnotherServiceBtn: string;
  tabUpcoming: string;
  tabCompleted: string;
  tabCancelled: string;
  bookingTicketLabel: string;
  estimatedCostLabel: string;
  shareBtn: string;
  copiedBtn: string;
  viewProviderBtn: string;
  rescheduleBtn: string;
  cancelBookingBtn: string;
  trackLiveBtn: string;
  bookAgainBtn: string;
  leaveFeedbackBtn: string;
  editFeedbackBtn: string;
  sharedHighlightBanner: string;
  dismissBtn: string;

  // Tracking & Rewards
  trackingPageTitle: string;
  trackingPageSubtitle: string;
  rewardsPageKicker: string;
  rewardsPageTitle: string;

  // Triple-Line Control Drawer & Certified Badge
  menuButtonLabel: string;
  drawerTitle: string;
  drawerMyOrdersSection: string;
  drawerMyBookings: string;
  drawerMyOrdersHistory: string;
  drawerTrackOrder: string;
  drawerCertifiedServices: string;
  drawerWishlist: string;
  drawerRewards: string;
  drawerSettingsSection: string;
  drawerNotifications: string;
  certifiedBadge: string;
  certifiedFilterBtn: string;
  showingCertifiedBtn: string;
  certifiedModalTitle: string;
  certifiedModalSubtitle: string;

  // Category Names & Descriptions
  categories: Record<
    ServiceCategoryId,
    {
      name: string;
      sub: string;
      desc: string;
    }
  >;
}

export const APP_TRANSLATIONS: Record<AppLanguage, LocalizedStrings> = {
  en: {
    controlBarLabel: 'Control Bar',
    languageLabel: 'Language',
    zoneLabel: 'Service Zone',
    allZones: 'All NCR Zones',
    textSizeLabel: 'Text Size',
    textNormal: 'A',
    textLarge: 'A+',
    themeLight: 'Light',
    themeDark: 'Dark',
    quickTrack: 'Live Track',
    resetDemo: 'Reset Data',
    prototypeNotice: 'Sample listings, simulated GPS route & demo payments.',

    brandSubtitle: 'Home & Religious Services',
    navHome: 'Home',
    navServices: 'Explore Services',
    navBookings: 'My Bookings',
    navTracking: 'Live Tracking',
    navRewards: 'Rewards & Offers',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    bookServiceBtn: 'Book Service',

    heroBadge: 'One platform for everyday home services and trusted local religious services',
    heroTitlePart1: 'Trusted services,',
    heroTitleHighlight: 'right at your doorstep.',
    heroSubtitle:
      'From Vedic Pandits for your Griha Pravesh puja to electricians, plumbers, deep cleaning squads, and at-home grooming—discover, book, and track everyday home repairs and sacred ceremonies in one place.',
    heroPrimaryCta: 'Book a Service',
    heroSecondaryCta: 'Explore All Services',
    heroTrackingCta: 'Live Tracking Demo',
    trustSampleListings: 'Sample Listings',
    trustCategoriesCount: '8 service categories',
    trustClearPricing: 'Clear Pricing',
    trustStartingPrice: 'Starting at ₹199',
    trustAvgRating: '4.8★ Avg Rating',
    trustInteractiveReviews: 'Interactive customer reviews',
    activeLiveBookingLabel: 'Active Live Demo Booking',

    categoriesKicker: '8 Specialized Categories',
    whatDoYouNeedTitle: 'What do you need today?',
    viewAllProsLink: 'View All 16 Sample Professionals',
    startingAt: 'Starting at',
    exploreProsCta: 'Explore Professionals',
    topRatedKicker: 'Customer Favourites • Illustrative Sample Listings',
    topRatedTitle: 'Top-Rated Professionals Near You',
    seeAllProsBtn: 'See All 16 Professionals',
    viewProfileBtn: 'View Profile',
    bookNowBtn: 'Book Now',
    priceFrom: 'Price from',

    servicesPageTitle: 'Explore Home & Religious Services',
    servicesPageSubtitle:
      'Filter by category, NCR city zone, rating, or budget to book verified sample professionals.',
    allCategoriesBtn: 'All Categories (16)',
    searchPlaceholder: 'Search name, service, puja, plumber, Noida...',
    locationZoneLabel: 'Location Zone',
    minRatingLabel: 'Min Rating',
    maxPriceLabel: 'Max Price (₹)',
    sortByLabel: 'Sort By',
    showingProsLabel: 'sample professionals',
    filterFavouritesBtn: 'Filter Favourites Only',
    showingFavouritesBtn: 'Showing Saved Favourites',

    bookingsPageTitle: 'My Bookings Dashboard',
    bookingsPageSubtitle:
      'Manage upcoming appointments, share details with family, track live progress, or leave feedback.',
    bookAnotherServiceBtn: '+ Book Another Service',
    tabUpcoming: 'Upcoming',
    tabCompleted: 'Completed',
    tabCancelled: 'Cancelled',
    bookingTicketLabel: 'Booking Ticket',
    estimatedCostLabel: 'Estimated cost',
    shareBtn: 'Share',
    copiedBtn: 'Copied!',
    viewProviderBtn: 'View Provider',
    rescheduleBtn: 'Reschedule',
    cancelBookingBtn: 'Cancel Booking',
    trackLiveBtn: 'Track Live',
    bookAgainBtn: 'Book Again',
    leaveFeedbackBtn: 'Leave Feedback',
    editFeedbackBtn: 'Edit Feedback',
    sharedHighlightBanner: 'Shared Booking — Highlighted from family link',
    dismissBtn: 'Dismiss',

    trackingPageTitle: 'Live Service Tracking & Doorstep Navigation',
    trackingPageSubtitle:
      'Select any active booking below to simulate real-time route movement and status progression.',
    rewardsPageKicker: 'SevaSetu Loyalty & Savings',
    rewardsPageTitle: 'Rewards, Promo Codes & Demo Gift Cards',

    menuButtonLabel: 'Menu & Controls',
    drawerTitle: 'SevaSetu Control Hub',
    drawerMyOrdersSection: 'My Orders & Bookings',
    drawerMyBookings: 'My Bookings (Upcoming)',
    drawerMyOrdersHistory: 'My Orders & History',
    drawerTrackOrder: 'Track Active Order',
    drawerCertifiedServices: 'SevaSetu Certified Services',
    drawerWishlist: 'My Wishlist / Favourites',
    drawerRewards: 'Coupons, Rewards & Gift Cards',
    drawerSettingsSection: 'App Settings & Preferences',
    drawerNotifications: 'Doorstep SMS & Order Alerts',
    certifiedBadge: 'SevaSetu Certified',
    certifiedFilterBtn: 'Certified Only',
    showingCertifiedBtn: 'Showing Certified Only',
    certifiedModalTitle: 'SevaSetu Certified Assurance',
    certifiedModalSubtitle: 'Verified background, skill-tested & 30-day service guarantee',

    categories: {
      priest: {
        name: 'Vedic Priest & Puja Services',
        sub: 'पंडित और वैदिक पूजा सेवाएं',
        desc: 'Experienced Acharyas and Pandits for Griha Pravesh, Satyanarayan Katha, Havan, and festival rituals.',
      },
      housekeeping: {
        name: 'Housekeeping & Deep Cleaning',
        sub: 'घर की डीप क्लीनिंग और सफाई',
        desc: 'Full-home deep cleaning, kitchen degreasing, bathroom sanitization, and sofa shampooing.',
      },
      plumber: {
        name: 'Plumbing & Water Solutions',
        sub: 'प्लंबिंग और पाइपलाइन रिपेयर',
        desc: 'Leakage repair, tap and mixer fitting, drainage blockage removal, and overhead tank installation.',
      },
      barber: {
        name: 'Barber & At-Home Grooming',
        sub: 'घर पर सैलून और ग्रूमिंग',
        desc: 'Hygienic doorstep haircuts, beard styling, head massage, and festive grooming packages.',
      },
      electrician: {
        name: 'Electrician & Appliance Repair',
        sub: 'इलेक्ट्रीशियन और वायरिंग सुधार',
        desc: 'MCB fault troubleshooting, ceiling fan installation, inverter wiring, and switchboard upgrades.',
      },
      carpentry: {
        name: 'Carpentry & Furniture Care',
        sub: 'कारपेंटर और फर्नीचर रिपेयर',
        desc: 'Door lock installation, modular wardrobe hinge repair, bed assembly, and custom wood polishing.',
      },
      painting: {
        name: 'Home Painting & Waterproofing',
        sub: 'होम पेंटिंग और वाटरप्रूफिंग',
        desc: 'Interior wall painting, dampness waterproofing, textured accent walls, and festive whitewashing.',
      },
      masonry: {
        name: 'Masonry, Tiles & Civil Work',
        sub: 'राजमिस्त्री और टाइल फिटिंग',
        desc: 'Floor tile replacement, bathroom grouting, brick plastering, and kitchen slab repair.',
      },
    },
  },

  hi: {
    controlBarLabel: 'कंट्रोल बार',
    languageLabel: 'भाषा (Language)',
    zoneLabel: 'सेवा क्षेत्र',
    allZones: 'सभी NCR ज़ोन',
    textSizeLabel: 'फ़ॉन्ट आकार',
    textNormal: 'अ',
    textLarge: 'अ+',
    themeLight: 'लाइट',
    themeDark: 'डार्क',
    quickTrack: 'लाइव ट्रैक',
    resetDemo: 'रीसेट डेटा',
    prototypeNotice: 'नमूना प्रोफाइल, सिम्युलेटेड GPS रूट और डेमो पेमेंट।',

    brandSubtitle: 'घरेलू और धार्मिक सेवाएं',
    navHome: 'होम',
    navServices: 'सेवाएं खोजें',
    navBookings: 'मेरी बुकिंग्स',
    navTracking: 'लाइव ट्रैकिंग',
    navRewards: 'रिवॉर्ड्स और ऑफ़र',
    signIn: 'साइन इन',
    signOut: 'साइन आउट',
    bookServiceBtn: 'सेवा बुक करें',

    heroBadge: 'दैनिक घरेलू सेवाओं और विश्वसनीय धार्मिक अनुष्ठानों के लिए एक मंच',
    heroTitlePart1: 'विश्वसनीय सेवाएं,',
    heroTitleHighlight: 'सीधे आपके द्वार पर।',
    heroSubtitle:
      'गृह प्रवेश और सत्यनारायण पूजा के लिए वैदिक पंडितों से लेकर इलेक्ट्रीशियन, प्लंबर, डीप क्लीनिंग और होम सैलून तक—सब कुछ एक ही जगह खोजें, बुक करें और लाइव ट्रैक करें।',
    heroPrimaryCta: 'सेवा बुक करें',
    heroSecondaryCta: 'सभी सेवाएं देखें',
    heroTrackingCta: 'लाइव ट्रैकिंग डेमो',
    trustSampleListings: 'नमूना प्रोफाइल',
    trustCategoriesCount: '8 सेवा श्रेणियां',
    trustClearPricing: 'स्पष्ट कीमतें',
    trustStartingPrice: '₹199 से शुरू',
    trustAvgRating: '4.8★ औसत रेटिंग',
    trustInteractiveReviews: 'ग्राहक समीक्षाएं और फीडबैक',
    activeLiveBookingLabel: 'सक्रिय लाइव डेमो बुकिंग',

    categoriesKicker: '8 विशेष सेवा श्रेणियां',
    whatDoYouNeedTitle: 'आज आपको किस सेवा की आवश्यकता है?',
    viewAllProsLink: 'सभी 16 प्रोफेशनल्स देखें',
    startingAt: 'शुरुआती कीमत',
    exploreProsCta: 'प्रोफेशनल्स देखें',
    topRatedKicker: 'ग्राहकों की पसंद • नमूना सूची',
    topRatedTitle: 'आपके आस-पास के टॉप-रेटेड प्रोफेशनल्स',
    seeAllProsBtn: 'सभी 16 प्रोफेशनल्स देखें',
    viewProfileBtn: 'प्रोफाइल देखें',
    bookNowBtn: 'बुक करें',
    priceFrom: 'शुरुआती शुल्क',

    servicesPageTitle: 'घरेलू और धार्मिक सेवाएं खोजें',
    servicesPageSubtitle:
      'अपनी आवश्यकता के अनुसार श्रेणी, शहर ज़ोन, रेटिंग या बजट चुनें और तुरंत स्लॉट बुक करें।',
    allCategoriesBtn: 'सभी श्रेणियां (16)',
    searchPlaceholder: 'नाम, पूजा, प्लंबर, इलेक्ट्रीशियन या नोएडा खोजें...',
    locationZoneLabel: 'शहर / ज़ोन',
    minRatingLabel: 'न्यूनतम रेटिंग',
    maxPriceLabel: 'अधिकतम बजट (₹)',
    sortByLabel: 'क्रमबद्ध करें',
    showingProsLabel: 'उपलब्ध प्रोफेशनल्स',
    filterFavouritesBtn: 'केवल पसंदीदा (Favourites)',
    showingFavouritesBtn: 'पसंदीदा प्रोफेशनल्स दिख रहे हैं',

    bookingsPageTitle: 'मेरी बुकिंग्स डैशबोर्ड',
    bookingsPageSubtitle:
      'आगामी अपॉइंटमेंट प्रबंधित करें, परिवार के साथ बुकिंग विवरण साझा करें, लाइव ट्रैक करें या फीडबैक दें।',
    bookAnotherServiceBtn: '+ नई सेवा बुक करें',
    tabUpcoming: 'आगामी (Upcoming)',
    tabCompleted: 'पूर्ण (Completed)',
    tabCancelled: 'रद्द (Cancelled)',
    bookingTicketLabel: 'बुकिंग टिकट',
    estimatedCostLabel: 'अनुमानित कुल राशि',
    shareBtn: 'शेयर करें',
    copiedBtn: 'कॉपी हो गया!',
    viewProviderBtn: 'प्रोफाइल देखें',
    rescheduleBtn: 'रीशेड्यूल',
    cancelBookingBtn: 'बुकिंग रद्द करें',
    trackLiveBtn: 'लाइव ट्रैक',
    bookAgainBtn: 'फिर से बुक करें',
    leaveFeedbackBtn: 'फीडबैक दें',
    editFeedbackBtn: 'फीडबैक बदलें',
    sharedHighlightBanner: 'परिवार लिंक से साझा की गई बुकिंग',
    dismissBtn: 'हटाएं',

    trackingPageTitle: 'लाइव सर्विस ट्रैकिंग और डोरस्टेप नेविगेशन',
    trackingPageSubtitle:
      'रियल-टाइम रूट मूवमेंट और 6-स्टेज सर्विस प्रोग्रेस देखने के लिए नीचे अपनी बुकिंग चुनें।',
    rewardsPageKicker: 'सेवासेतु लॉयल्टी और बचत',
    rewardsPageTitle: 'रिवॉर्ड्स, प्रोमो कोड और डेमो गिफ्ट कार्ड',

    menuButtonLabel: 'मेनू और कंट्रोल',
    drawerTitle: 'सेवासेतु कंट्रोल हब',
    drawerMyOrdersSection: 'मेरे ऑर्डर और बुकिंग्स',
    drawerMyBookings: 'मेरी बुकिंग्स (आगामी)',
    drawerMyOrdersHistory: 'मेरे ऑर्डर और हिस्ट्री',
    drawerTrackOrder: 'सक्रिय ऑर्डर ट्रैक करें',
    drawerCertifiedServices: 'प्रमाणित (Certified) सेवाएं',
    drawerWishlist: 'पसंदीदा सूची (Wishlist)',
    drawerRewards: 'कूपन, रिवॉर्ड्स और गिफ्ट कार्ड',
    drawerSettingsSection: 'ऐप सेटिंग्स और प्राथमिकताएं',
    drawerNotifications: 'डोरस्टेप SMS और ऑर्डर अलर्ट',
    certifiedBadge: 'सेवासेतु प्रमाणित (Certified)',
    certifiedFilterBtn: 'केवल प्रमाणित (Certified)',
    showingCertifiedBtn: 'प्रमाणित प्रोफेशनल्स दिख रहे हैं',
    certifiedModalTitle: 'सेवासेतु प्रमाणित (Certified) भरोसा',
    certifiedModalSubtitle: 'सत्यापित पहचान, कौशल-परीक्षित और 30-दिन की सेवा गारंटी',

    categories: {
      priest: {
        name: 'वैदिक पंडित और पूजा सेवाएं',
        sub: 'Vedic Priest & Puja Services',
        desc: 'गृह प्रवेश, सत्यनारायण कथा, हवन, विवाह और त्योहारों के अनुष्ठान के लिए अनुभवी आचार्य।',
      },
      housekeeping: {
        name: 'हाउसकीपिंग और डीप क्लीनिंग',
        sub: 'Housekeeping & Deep Cleaning',
        desc: 'पूरे घर की डीप क्लीनिंग, किचन की सफाई, बाथरूम सैनिटाइजेशन और सोफा शैम्पूइंग।',
      },
      plumber: {
        name: 'प्लंबिंग और वाटर सॉल्यूशंस',
        sub: 'Plumbing & Water Solutions',
        desc: 'पाइप लीकेज रिपेयर, नल और मिक्सर फिटिंग, ड्रेनेज ब्लॉकेज और पानी की टंकी की मरम्मत।',
      },
      barber: {
        name: 'होम सैलून और ग्रूमिंग',
        sub: 'Barber & At-Home Grooming',
        desc: 'घर पर सुरक्षित हेयरकट, बियर्ड स्टाइलिंग, हेड मसाज और फेस्टिव ग्रूमिंग पैकेज।',
      },
      electrician: {
        name: 'इलेक्ट्रीशियन और उपकरण रिपेयर',
        sub: 'Electrician & Appliance Repair',
        desc: 'MCB फॉल्ट सुधार, पंखा और लाइट फिटिंग, इन्वर्टर वायरिंग और स्विचबोर्ड अपग्रेड।',
      },
      carpentry: {
        name: 'कारपेंटर और फर्नीचर केयर',
        sub: 'Carpentry & Furniture Care',
        desc: 'दरवाजे के ताले, अलमारी के कब्जे, बेड असेंबली और लकड़ी की पॉलिशिंग का कार्य।',
      },
      painting: {
        name: 'होम पेंटिंग और वाटरप्रूफिंग',
        sub: 'Home Painting & Waterproofing',
        desc: 'दीवारों की पेंटिंग, सीलन से सुरक्षा (वाटरप्रूफिंग), टेक्सचर पेंट और पुताई।',
      },
      masonry: {
        name: 'राजमिस्त्री और टाइल फिटिंग',
        sub: 'Masonry, Tiles & Civil Work',
        desc: 'फ्लोर टाइल बदलना, बाथरूम ग्राउटिंग, प्लास्टर और किचन स्लैब रिपेयर।',
      },
    },
  },

  bn: {
    controlBarLabel: 'কন্ট্রোল বার',
    languageLabel: 'ভাষা (Language)',
    zoneLabel: 'সার্ভিস জোন',
    allZones: 'সব NCR জোন',
    textSizeLabel: 'লেখার আকার',
    textNormal: 'অ',
    textLarge: 'অ+',
    themeLight: 'লাইট',
    themeDark: 'ডার্ক',
    quickTrack: 'লাইভ ট্র্যাক',
    resetDemo: 'রিসেট ডেটা',
    prototypeNotice: 'নমুনা প্রোফাইল, সিমুলেটেড GPS রুট এবং ডেমো পেমেন্ট।',

    brandSubtitle: 'ঘরোয়া ও ধর্মীয় পরিষেবা',
    navHome: 'হোম',
    navServices: 'পরিষেবা খুঁজুন',
    navBookings: 'আমার বুকিং',
    navTracking: 'লাইভ ট্র্যাকিং',
    navRewards: 'রিওয়ার্ড ও অফার',
    signIn: 'সাইন ইন',
    signOut: 'সাইন আউট',
    bookServiceBtn: 'বুক করুন',

    heroBadge: 'প্রতিদিনের ঘরোয়া কাজ এবং বিশ্বস্ত ধর্মীয় পূজা-পার্বণের একটাই প্ল্যাটফর্ম',
    heroTitlePart1: 'বিশ্বস্ত পরিষেবা,',
    heroTitleHighlight: 'এখন আপনার ঘরের দরজায়।',
    heroSubtitle:
      'গৃহপ্রবেশ ও সত্যনারায়ণ পূজার বৈদিক পুরোহিত থেকে শুরু করে ইলেকট্রিশিয়ান, প্লাম্বার, ডিপ ক্লিনিং এবং হোম সেলুন—সবকিছু এক জায়গায় খুঁজুন, বুক করুন এবং ট্র্যাক করুন।',
    heroPrimaryCta: 'পরিষেবা বুক করুন',
    heroSecondaryCta: 'সব পরিষেবা দেখুন',
    heroTrackingCta: 'লাইভ ট্র্যাকিং ডেমো',
    trustSampleListings: 'নমুনা তালিকা',
    trustCategoriesCount: '৮টি পরিষেবা বিভাগ',
    trustClearPricing: 'স্বচ্ছ মূল্য',
    trustStartingPrice: '₹১৯৯ থেকে শুরু',
    trustAvgRating: '৪.৮★ গড় রেটিং',
    trustInteractiveReviews: 'গ্রাহকদের রিভিউ ও ফিডব্যাক',
    activeLiveBookingLabel: 'সক্রিয় লাইভ ডেমো বুকিং',

    categoriesKicker: '৮টি বিশেষ পরিষেবা বিভাগ',
    whatDoYouNeedTitle: 'আজ আপনার কোন পরিষেবাটি প্রয়োজন?',
    viewAllProsLink: 'সব ১৬ জন প্রফেশনাল দেখুন',
    startingAt: 'শুরু মাত্র',
    exploreProsCta: 'প্রফেশনাল দেখুন',
    topRatedKicker: 'গ্রাহকদের পছন্দ • নমুনা প্রোফাইল',
    topRatedTitle: 'আপনার কাছাকাছি টপ-রেটেড প্রফেশনাল',
    seeAllProsBtn: 'সব ১৬ জন প্রফেশনাল দেখুন',
    viewProfileBtn: 'প্রোফাইল দেখুন',
    bookNowBtn: 'বুক করুন',
    priceFrom: 'প্রারম্ভিক মূল্য',

    servicesPageTitle: 'ঘরোয়া ও ধর্মীয় পরিষেবা খুঁজুন',
    servicesPageSubtitle:
      'বিভাগ, শহর জোন, রেটিং বা বাজেট অনুযায়ী ফিল্টার করুন এবং পছন্দের স্লট বুক করুন।',
    allCategoriesBtn: 'সব বিভাগ (১৬)',
    searchPlaceholder: 'নাম, পূজা, প্লাম্বার, ইলেকট্রিশিয়ান বা নয়ডা খুঁজুন...',
    locationZoneLabel: 'লোকেশন জোন',
    minRatingLabel: 'ন্যূনতম রেটিং',
    maxPriceLabel: 'সর্বোচ্চ বাজেট (₹)',
    sortByLabel: 'সাজান (Sort)',
    showingProsLabel: 'জন প্রফেশনাল উপলব্ধ',
    filterFavouritesBtn: 'শুধু পছন্দের তালিকা',
    showingFavouritesBtn: 'পছন্দের তালিকা দেখানো হচ্ছে',

    bookingsPageTitle: 'আমার বুকিং ড্যাশবোর্ড',
    bookingsPageSubtitle:
      'আসন্ন অ্যাপয়েন্টমেন্ট পরিচালনা করুন, পরিবারের সাথে বুকিং শেয়ার করুন, লাইভ ট্র্যাক করুন বা ফিডব্যাক দিন।',
    bookAnotherServiceBtn: '+ নতুন পরিষেবা বুক করুন',
    tabUpcoming: 'আসন্ন (Upcoming)',
    tabCompleted: 'সম্পন্ন (Completed)',
    tabCancelled: 'বাতিল (Cancelled)',
    bookingTicketLabel: 'বুকিং টিকিট',
    estimatedCostLabel: 'আনুমানিক খরচ',
    shareBtn: 'শেয়ার করুন',
    copiedBtn: 'কপি হয়েছে!',
    viewProviderBtn: 'প্রোফাইল দেখুন',
    rescheduleBtn: 'রিশিডিউল',
    cancelBookingBtn: 'বুকিং বাতিল করুন',
    trackLiveBtn: 'লাইভ ট্র্যাক',
    bookAgainBtn: 'আবার বুক করুন',
    leaveFeedbackBtn: 'ফিডব্যাক দিন',
    editFeedbackBtn: 'ফিডব্যাক বদলান',
    sharedHighlightBanner: 'পরিবারের লিঙ্ক থেকে শেয়ার করা বুকিং',
    dismissBtn: 'সরান',

    trackingPageTitle: 'লাইভ সার্ভিস ট্র্যাকিং ও ডোরস্টেপ নেভিগেশন',
    trackingPageSubtitle:
      'রিয়েল-টাইম রুট মুভমেন্ট এবং ৬-ধাপের অগ্রগতি দেখতে নিচে আপনার বুকিং বেছে নিন।',
    rewardsPageKicker: 'সেবাসেতু লয়্যালটি ও সাশ্রয়',
    rewardsPageTitle: 'রিওয়ার্ড, প্রোমো কোড ও ডেমো গিফট কার্ড',

    menuButtonLabel: 'মেনু ও কন্ট্রোল',
    drawerTitle: 'সেবাসেতু কন্ট্রোল হাব',
    drawerMyOrdersSection: 'আমার অর্ডার ও বুকিং',
    drawerMyBookings: 'আমার বুকিং (আসন্ন)',
    drawerMyOrdersHistory: 'আমার অর্ডার ও হিস্ট্রি',
    drawerTrackOrder: 'অর্ডার লাইভ ট্র্যাক করুন',
    drawerCertifiedServices: 'সার্টিফাইড (Certified) পরিষেবা',
    drawerWishlist: 'পছন্দের তালিকা (Wishlist)',
    drawerRewards: 'কুপন, রিওয়ার্ড ও গিফট কার্ড',
    drawerSettingsSection: 'অ্যাপ সেটিংস ও পছন্দসমূহ',
    drawerNotifications: 'ডোরস্টেপ SMS ও অর্ডার অ্যালার্ট',
    certifiedBadge: 'সেবাসেতু সার্টিফাইড',
    certifiedFilterBtn: 'শুধু সার্টিফাইড (Certified)',
    showingCertifiedBtn: 'সার্টিফাইড প্রফেশনাল দেখানো হচ্ছে',
    certifiedModalTitle: 'সেবাসেতু সার্টিফাইড (Certified) আশ্বাস',
    certifiedModalSubtitle: 'যাচাইকৃত পরিচয়, দক্ষতা-পরীক্ষিত এবং ৩০-দিনের সার্ভিস গ্যারান্টি',

    categories: {
      priest: {
        name: 'বৈদিক পুরোহিত ও পূজা পরিষেবা',
        sub: 'Vedic Priest & Puja Services',
        desc: 'গৃহপ্রবেশ, সত্যনারায়ণ কথা, যজ্ঞ, বিবাহ এবং উৎসবের পূজার জন্য অভিজ্ঞ আচার্য ও পুরোহিত।',
      },
      housekeeping: {
        name: 'হাউসকিপিং ও ডিপ ক্লিনিং',
        sub: 'Housekeeping & Deep Cleaning',
        desc: 'সম্পূর্ণ ঘর ডিপ ক্লিনিং, রান্নাঘর পরিষ্কার, বাথরুম স্যানিটাইজেশন এবং সোফা শ্যাম্পুয়িং।',
      },
      plumber: {
        name: 'প্লাম্বিং ও জলের কাজ',
        sub: 'Plumbing & Water Solutions',
        desc: 'পাইপ লিকেজ মেরামত, কল ও মিক্সার ফিটিং, ড্রেন পরিষ্কার এবং জলের ট্যাঙ্ক ইনস্টলেশন।',
      },
      barber: {
        name: 'হোম সেলুন ও গ্রুমিং',
        sub: 'Barber & At-Home Grooming',
        desc: 'ঘরে বসেই স্বাস্থ্যসম্মত চুল কাটা, দাড়ি স্টাইলিং, হেড ম্যাসাজ এবং ফেস্টিভ গ্রুমিং।',
      },
      electrician: {
        name: 'ইলেকট্রিশিয়ান ও অ্যাপ্লায়েন্স মেরামত',
        sub: 'Electrician & Appliance Repair',
        desc: 'MCB ফল্ট মেরামত, সিলিং ফ্যান ইনস্টলেশন, ইনভার্টার ওয়্যারিং এবং সুইচবোর্ড আপগ्रेड।',
      },
      carpentry: {
        name: 'কার্পেন্ট্রি ও আসবাবপত্র মেরামত',
        sub: 'Carpentry & Furniture Care',
        desc: 'দরজার তালা লাগানো, আলমারির কব্জা মেরামত, খাট অ্যাসেম্বলি এবং কাঠের পালিশ।',
      },
      painting: {
        name: 'হোম পেইন্টিং ও ওয়াটারপ্রুফিং',
        sub: 'Home Painting & Waterproofing',
        desc: 'ঘরের দেওয়াল রঙ করা, ড্যাম্প ওয়াটারপ্রুফিং, টেক্সচার ওয়াল এবং চুনকাম।',
      },
      masonry: {
        name: 'রাজমিস্ত্রি ও টাইলস ফিটিং',
        sub: 'Masonry, Tiles & Civil Work',
        desc: 'মেঝের টাইলস পরিবর্তন, বাথরুম গ্রাউটিং, প্লাস্টার এবং রান্নাঘরের স্ল্যাব মেরামত।',
      },
    },
  },
};
