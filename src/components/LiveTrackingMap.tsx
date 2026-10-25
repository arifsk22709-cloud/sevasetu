import React, { useState, useEffect } from 'react';
import {
  Navigation,
  MapPin,
  ShieldCheck,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  CheckCircle2,
  Clock,
  PhoneCall,
  LocateFixed,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { Booking, TrackingStage } from '../types';
import { TRACKING_STAGES, STAGE_DEFAULT_PROGRESS } from '../data/mockData';
import { SafeImage } from './SafeImage';

interface LiveTrackingMapProps {
  booking: Booking;
  onUpdateTracking: (bookingId: string, newStage: TrackingStage, newProgress: number) => void;
  onResetTracking: (bookingId: string) => void;
  onOpenFeedback: (booking: Booking) => void;
  onViewProvider: (professionalId: string) => void;
}

interface RoutePoint {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  lat: number;
  lng: number;
}

const ROUTE_WAYPOINTS: RoutePoint[] = [
  { x: 14, y: 78, lat: 28.6219, lng: 77.3642 }, // Dispatch Hub: Sector 62 Noida
  { x: 29, y: 64, lat: 28.6095, lng: 77.3688 }, // Crossing 1: Sector 71
  { x: 48, y: 55, lat: 28.5912, lng: 77.3721 }, // Crossing 2: Expressway Link
  { x: 66, y: 40, lat: 28.5744, lng: 77.3795 }, // Crossing 3: Sector 93
  { x: 84, y: 24, lat: 28.5568, lng: 77.3849 }, // Customer Doorstep: Sector 100
];

function interpolateRoutePosition(progress: number): RoutePoint {
  const clamped = Math.max(0, Math.min(100, progress));
  const totalSegments = ROUTE_WAYPOINTS.length - 1;
  const exactIndex = (clamped / 100) * totalSegments;
  const lowerIndex = Math.min(Math.floor(exactIndex), totalSegments - 1);
  const upperIndex = Math.min(lowerIndex + 1, totalSegments);
  const t = exactIndex - lowerIndex;

  const p1 = ROUTE_WAYPOINTS[lowerIndex];
  const p2 = ROUTE_WAYPOINTS[upperIndex];

  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
    lat: Number((p1.lat + (p2.lat - p1.lat) * t).toFixed(4)),
    lng: Number((p1.lng + (p2.lng - p1.lng) * t).toFixed(4)),
  };
}

function stageFromProgress(progress: number): TrackingStage {
  if (progress >= 100) return 'Service complete';
  if (progress >= 93) return 'Service in progress';
  if (progress >= 84) return 'Arrived';
  if (progress >= 32) return 'On the way';
  if (progress >= 15) return 'Professional assigned';
  return 'Booking placed';
}

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  booking,
  onUpdateTracking,
  onResetTracking,
  onOpenFeedback,
  onViewProvider,
}) => {
  const [displayProgress, setDisplayProgress] = useState<number>(booking.trackingProgress);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  // Customer Geolocation Sharing state
  const [locationConsentOpen, setLocationConsentOpen] = useState<boolean>(false);
  const [isSharingLocation, setIsSharingLocation] = useState<boolean>(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(
    null
  );
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState<boolean>(false);
  const [callNotice, setCallNotice] = useState<string | null>(null);

  // Sync displayProgress smoothly toward booking.trackingProgress when stage button is clicked
  useEffect(() => {
    let animationFrameId: number;
    const animateTowardTarget = () => {
      setDisplayProgress((prev) => {
        const diff = booking.trackingProgress - prev;
        if (Math.abs(diff) < 0.4) {
          return booking.trackingProgress;
        }
        animationFrameId = requestAnimationFrame(animateTowardTarget);
        return Number((prev + diff * 0.14).toFixed(2));
      });
    };
    animationFrameId = requestAnimationFrame(animateTowardTarget);
    return () => cancelAnimationFrame(animationFrameId);
  }, [booking.trackingProgress]);

  // Continuous Auto-Play simulation mode
  useEffect(() => {
    if (!isAutoPlaying) return;
    if (booking.trackingProgress >= 100) {
      setIsAutoPlaying(false);
      return;
    }

    const timer = window.setInterval(() => {
      const nextProgress = Math.min(100, Number((booking.trackingProgress + 2.5).toFixed(1)));
      const nextStage = stageFromProgress(nextProgress);
      onUpdateTracking(booking.id, nextStage, nextProgress);
    }, 350);

    return () => window.clearInterval(timer);
  }, [isAutoPlaying, booking.trackingProgress, booking.id, onUpdateTracking]);

  const handleSimulateNextStage = () => {
    setIsAutoPlaying(false);
    const currentIndex = TRACKING_STAGES.indexOf(booking.trackingStage);
    const nextIndex = Math.min(currentIndex + 1, TRACKING_STAGES.length - 1);
    const nextStage = TRACKING_STAGES[nextIndex];
    const nextProgress = STAGE_DEFAULT_PROGRESS[nextStage];
    onUpdateTracking(booking.id, nextStage, nextProgress);
  };

  const handleResetDemo = () => {
    setIsAutoPlaying(false);
    onResetTracking(booking.id);
    setDisplayProgress(STAGE_DEFAULT_PROGRESS['Booking placed']);
  };

  const requestBrowserLocation = () => {
    setGeoError(null);
    if (!('geolocation' in navigator)) {
      setGeoError(
        'Browser geolocation is not supported on this device. Continuing with illustrative Noida route coordinates.'
      );
      setLocationConsentOpen(false);
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoading(false);
        setLocationConsentOpen(false);
        setIsSharingLocation(true);
        setUserCoords({
          lat: Number(position.coords.latitude.toFixed(4)),
          lng: Number(position.coords.longitude.toFixed(4)),
          accuracy: Math.round(position.coords.accuracy),
        });
      },
      (err) => {
        setGeoLoading(false);
        setLocationConsentOpen(false);
        setIsSharingLocation(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError(
            'Location permission was declined. Your privacy is respected — we are using the booking address pin instead.'
          );
        } else {
          setGeoError(
            'Unable to fetch live GPS coordinates right now. Using illustrative destination coordinates.'
          );
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const stopSharingLocation = () => {
    setIsSharingLocation(false);
    setUserCoords(null);
    setGeoError(null);
  };

  const markerPos = interpolateRoutePosition(displayProgress);
  const totalRouteKm = 6.4;
  const remainingKm = Math.max(0, Number(((1 - displayProgress / 100) * totalRouteKm).toFixed(1)));
  const remainingEtaMins =
    displayProgress >= 84 ? 0 : Math.max(2, Math.round((1 - displayProgress / 84) * 24));

  const currentStageIndex = TRACKING_STAGES.indexOf(booking.trackingStage);

  return (
    <div className="space-y-6">
      {/* Demo Simulation Banner & Controls */}
      <div className="rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 p-5 text-white shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-300 border border-teal-400/30">
              <span className="h-2 w-2 rounded-full bg-teal-400 animate-ping" />
              SIMULATED LIVE TRACKING DEMO — HACKATHON MODE
            </div>
            <h3 className="mt-2 text-lg font-bold">
              Interactive Route & Status Simulator ({booking.reference})
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Watch the professional marker move smoothly along the route waypoints or step through each stage manually.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAutoPlaying((prev) => !prev)}
              disabled={booking.trackingStage === 'Service complete'}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition cursor-pointer ${
                isAutoPlaying
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  : 'bg-teal-500 text-slate-950 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isAutoPlaying ? 'Pause Auto-Move' : 'Auto-Play Route'}
            </button>

            <button
              type="button"
              onClick={handleSimulateNextStage}
              disabled={booking.trackingStage === 'Service complete'}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2.5 text-xs font-semibold text-white shadow hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <FastForward className="h-4 w-4" />
              Simulate Next Status
            </button>

            <button
              type="button"
              onClick={handleResetDemo}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-600 bg-slate-800 px-3.5 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-700 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Simulation
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Animated Map + Professional & Privacy Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 7 Cols: Interactive Animated Route Map */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Map Top Telemetry Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                <Navigation className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Status: <span className="text-teal-700">{booking.trackingStage}</span>
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  Marker Pos: {markerPos.lat}° N, {markerPos.lng}° E ({Math.round(displayProgress)}%)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="block text-[11px] uppercase tracking-wider text-slate-400">
                  Distance
                </span>
                <span className="text-sm font-bold text-slate-800">{remainingKm} km</span>
              </div>
              <div className="h-7 w-px bg-slate-200" />
              <div className="text-right">
                <span className="block text-[11px] uppercase tracking-wider text-slate-400">
                  Est. Arrival
                </span>
                <span className="text-sm font-bold text-teal-600">
                  {remainingEtaMins === 0 ? 'At Doorstep' : `${remainingEtaMins} mins`}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Map Canvas */}
          <div className="relative h-80 sm:h-96 w-full bg-[#eef2f6] overflow-hidden select-none">
            {/* Illustrative City Grid, Parks & Roads SVG */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="h-full w-full"
              aria-label="Illustrative Live Service Route Map"
            >
              {/* Soft city blocks & green zones */}
              <rect x="0" y="0" width="100" height="100" fill="#f1f5f9" />
              <rect x="6" y="8" width="28" height="22" rx="3" fill="#dcfce7" opacity="0.7" />
              <rect x="64" y="62" width="28" height="26" rx="4" fill="#dcfce7" opacity="0.65" />
              <path d="M 0 35 Q 45 42 100 18" stroke="#bae6fd" strokeWidth="5" fill="none" />

              {/* Major Arterial Roads */}
              <line x1="0" y1="20" x2="100" y2="20" stroke="#e2e8f0" strokeWidth="2" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#ffffff" strokeWidth="3.5" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="#e2e8f0" strokeWidth="2.5" />
              <line x1="25" y1="0" x2="25" y2="100" stroke="#ffffff" strokeWidth="3" />
              <line x1="55" y1="0" x2="55" y2="100" stroke="#e2e8f0" strokeWidth="2" />
              <line x1="82" y1="0" x2="82" y2="100" stroke="#ffffff" strokeWidth="3" />

              {/* Full Planned Route Shadow */}
              <polyline
                points="14,78 29,64 48,55 66,40 84,24"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Active Dashed Route Line */}
              <polyline
                points="14,78 29,64 48,55 66,40 84,24"
                fill="none"
                stroke="#0d9488"
                strokeWidth="1.6"
                strokeDasharray="2.5 1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Line from current professional position to destination */}
              <line
                x1={markerPos.x}
                y1={markerPos.y}
                x2="84"
                y2="24"
                stroke="#f97316"
                strokeWidth="0.9"
                strokeDasharray="1.5 1.5"
              />

              {/* Waypoint Dots */}
              {ROUTE_WAYPOINTS.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="1.3"
                  fill="#0f766e"
                  stroke="#ffffff"
                  strokeWidth="0.5"
                />
              ))}
            </svg>

            {/* Map Sector Labels */}
            <div className="pointer-events-none absolute left-4 bottom-4 rounded-md bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm">
              Start: Sector 62 Dispatch Hub
            </div>
            <div className="pointer-events-none absolute left-1/3 top-4 rounded-md bg-emerald-900/10 px-2 py-0.5 text-[10px] font-medium text-emerald-900">
              Noida Expressway Corridor (Illustrative Demo Route)
            </div>

            {/* Destination Customer Marker (Fixed at 84%, 24%) */}
            <div
              style={{ left: '84%', top: '24%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <span className="absolute -inset-3 rounded-full bg-rose-500/25 animate-pulse-ring" />
              <div className="relative flex flex-col items-center">
                <div className="rounded-lg bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white shadow whitespace-nowrap mb-1">
                  {isSharingLocation ? 'Your Live Shared Pin' : 'Customer Home'}
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white shadow-md ring-2 ring-white">
                  <MapPin className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Moving Professional Marker (Smoothly interpolated left% / top%) */}
            <div
              style={{
                left: `${markerPos.x}%`,
                top: `${markerPos.y}%`,
                transition: 'left 120ms linear, top 120ms linear',
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <span className="absolute -inset-3 rounded-full bg-teal-500/30 animate-pulse-ring" />
              <div className="relative flex flex-col items-center">
                <div className="rounded-full bg-teal-700 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md whitespace-nowrap mb-1 border border-teal-300">
                  {booking.professionalName.split(' ')[0]} • {Math.round(displayProgress)}%
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg ring-3 ring-white">
                  <Navigation className="h-5 w-5 rotate-45" />
                </div>
              </div>
            </div>
          </div>

          {/* Location Sharing Bar */}
          <div className="border-t border-slate-100 bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    isSharingLocation
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <LocateFixed className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-900">
                      Customer Doorstep Location Sharing
                    </h4>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isSharingLocation
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isSharingLocation ? 'Sharing Active' : 'Not Shared'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isSharingLocation && userCoords
                      ? `Browser GPS active (${userCoords.lat}°, ${userCoords.lng}° • ±${userCoords.accuracy}m accuracy).`
                      : 'Optional: Share your live browser coordinates to refine doorstep arrival accuracy.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isSharingLocation ? (
                  <button
                    type="button"
                    onClick={() => setLocationConsentOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
                  >
                    <LocateFixed className="h-3.5 w-3.5 text-orange-400" />
                    Share My Location
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopSharingLocation}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 cursor-pointer"
                  >
                    <EyeOff className="h-3.5 w-3.5" />
                    Stop Sharing
                  </button>
                )}
              </div>
            </div>

            {/* Privacy Explanation & Consent Box before calling navigator.geolocation */}
            {locationConsentOpen && (
              <div className="mt-3 rounded-xl border border-orange-200 bg-orange-50/70 p-3.5 text-xs text-slate-700">
                <p className="font-semibold text-slate-900">
                  Why SevaSetu requests your browser location:
                </p>
                <p className="mt-1">
                  Your coordinates are used solely within this session to display your doorstep pin and calculate illustrative arrival distance. Coordinates are never transmitted to external servers, and you can stop sharing with a single tap.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={requestBrowserLocation}
                    disabled={geoLoading}
                    className="rounded-lg bg-orange-600 px-3 py-1.5 font-semibold text-white hover:bg-orange-500 cursor-pointer"
                  >
                    {geoLoading ? 'Requesting Browser GPS...' : 'Allow & Request Browser Permission'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocationConsentOpen(false)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {geoError && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <span>{geoError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Cols: Assigned Professional Card + Live Progress Timeline */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Assigned Professional Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3.5">
              <SafeImage
                src={booking.professionalPhoto}
                alt={booking.professionalName}
                fallbackLabel={booking.categoryName}
                className="h-16 w-16 rounded-2xl shrink-0 border border-slate-200"
              />
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Demo Assigned Professional
                </span>
                <h4 className="mt-1 truncate text-base font-bold text-slate-900">
                  {booking.professionalName}
                </h4>
                <p className="text-xs text-slate-500">
                  {booking.categoryName} • {booking.date} ({booking.timeSlot})
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onViewProvider(booking.professionalId)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                View Provider Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  setCallNotice(
                    `Demo Call Interface: Dialing sample professional ${booking.professionalName} (+91-98765-43210 — Illustrative Number)`
                  );
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-500 cursor-pointer"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                Demo Call Provider
              </button>
            </div>

            {callNotice && (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-teal-50 p-2.5 text-xs text-teal-900 border border-teal-200">
                <span className="truncate">{callNotice}</span>
                <button
                  type="button"
                  onClick={() => setCallNotice(null)}
                  className="ml-2 font-bold text-teal-700 hover:text-teal-900 cursor-pointer shrink-0"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* 6-Stage Progress Timeline */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-900">Live Service Progress</h4>
              <span className="text-xs font-semibold text-teal-600">
                Stage {currentStageIndex + 1} of {TRACKING_STAGES.length}
              </span>
            </div>

            <ol className="space-y-3.5">
              {TRACKING_STAGES.map((stage, idx) => {
                const isCompleted = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <li key={stage} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAutoPlaying(false);
                          onUpdateTracking(booking.id, stage, STAGE_DEFAULT_PROGRESS[stage]);
                        }}
                        title={`Jump to stage: ${stage}`}
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition cursor-pointer ${
                          isCompleted
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'border border-slate-300 bg-slate-50 text-slate-400 hover:border-teal-400'
                        } ${isCurrent ? 'ring-4 ring-teal-100' : ''}`}
                      >
                        {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                      </button>
                      {idx < TRACKING_STAGES.length - 1 && (
                        <div
                          className={`mt-1 h-4 w-0.5 ${
                            idx < currentStageIndex ? 'bg-teal-600' : 'bg-slate-200'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-semibold ${
                            isCurrent
                              ? 'text-teal-700 font-bold'
                              : isCompleted
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {stage}
                        </span>
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700">
                            <Clock className="h-3 w-3" /> Active
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>

            {booking.trackingStage === 'Service complete' && (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5">
                <p className="text-xs font-bold text-emerald-900">
                  Service Completed! Moved to "Completed" Bookings tab.
                </p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  You can now rate your experience and leave feedback for {booking.professionalName}.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenFeedback(booking)}
                  className="mt-2.5 w-full rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 cursor-pointer"
                >
                  {booking.feedback ? 'View / Edit Your Feedback' : 'Rate Your Experience ★'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};