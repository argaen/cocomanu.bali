'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { DayPicker, type DateRange, type Matcher } from 'react-day-picker';

import { estimateColiveTotalFromNights, formatCompactPrice, formatPriceNumberAsK } from '@/lib/notion';
import {
  buildColiveBookingWhatsappMessage,
  buildWhatsappBookingUrl,
  createBookingId,
} from '@/lib/booking-whatsapp';
import type { ColivePricing } from '@/lib/notion';

type ColiveBookingFormProps = {
  pricing: ColivePricing[];
  /** ISO YYYY-MM-DD nights when all rooms are occupied */
  unavailableNights?: string[];
};

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toIsoDate(date: Date): string {
  const d = startOfDay(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function nightsBetweenDates(from?: Date, to?: Date): number {
  if (!from || !to) return 0;
  const start = startOfDay(from);
  const end = startOfDay(to);
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

function formatDisplayDate(date?: Date): string {
  if (!date) return 'Select date';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function rangeIncludesUnavailableNight(
  from: Date,
  to: Date,
  unavailable: Set<string>,
): boolean {
  if (unavailable.size === 0) return false;
  const start = startOfDay(from);
  const end = startOfDay(to);
  for (let t = start.getTime(); t < end.getTime(); t += 86_400_000) {
    if (unavailable.has(toIsoDate(new Date(t)))) return true;
  }
  return false;
}

export default function ColiveBookingForm({
  pricing,
  unavailableNights = [],
}: ColiveBookingFormProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(undefined);
  const [resetOnNextPick, setResetOnNextPick] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const unavailableSet = useMemo(
    () => new Set(unavailableNights),
    [unavailableNights],
  );

  const nights = nightsBetweenDates(startDate, endDate);
  const total = nights > 0 ? estimateColiveTotalFromNights(nights, pricing) : 0;
  const nightlyRate = nights > 0 ? Math.round(total / nights) : 0;

  const bookingId = useMemo(() => {
    if (!startDate || !endDate || nights <= 0) return '';
    return createBookingId();
  }, [startDate, endDate, nights]);

  const whatsappMessage = useMemo(() => {
    if (!startDate || !endDate || nights <= 0 || !bookingId) return '';
    return buildColiveBookingWhatsappMessage({
      checkIn: startDate,
      checkOut: endDate,
      nights,
      nightlyRateIdr: nightlyRate,
      totalIdr: total,
      bookingId,
    });
  }, [startDate, endDate, nights, nightlyRate, total, bookingId]);

  const canBook = Boolean(whatsappMessage);

  const bookingHref = canBook ? buildWhatsappBookingUrl(whatsappMessage) : '#';
  const calendarTheme = {
    '--rdp-accent-color': 'var(--color-ocean-blue-200)',
    '--rdp-accent-background-color': 'var(--color-ocean-blue-300)',
    '--rdp-font-family': 'var(--font-josefin)',
  } as CSSProperties;
  const tomorrowIso = useMemo(() => {
    const d = startOfDay(new Date(Date.now() + 86_400_000));
    return toIsoDate(d);
  }, []);
  const tomorrow = useMemo(() => {
    const [y, m, d] = tomorrowIso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }, [tomorrowIso]);

  const selectedRange: DateRange | undefined = isCalendarOpen
    ? draftRange
    : (startDate ? { from: startDate, to: endDate } : undefined);

  const selectingEnd = Boolean(
    (isCalendarOpen ? draftRange?.from : startDate)
    && !(isCalendarOpen ? draftRange?.to : endDate)
    && !resetOnNextPick,
  );
  const rangeStart = selectingEnd
    ? startOfDay((isCalendarOpen ? draftRange?.from : startDate) as Date)
    : undefined;

  const disabledMatchers = useMemo((): Matcher | Matcher[] => {
    const matchers: Matcher[] = [{ before: tomorrow }];

    if (selectingEnd && rangeStart) {
      matchers.push((date) => {
        const day = startOfDay(date);
        if (day.getTime() <= rangeStart.getTime()) return true;
        return rangeIncludesUnavailableNight(rangeStart, day, unavailableSet);
      });
    } else {
      matchers.push((date) => unavailableSet.has(toIsoDate(date)));
    }

    return matchers;
  }, [tomorrow, selectingEnd, rangeStart, unavailableSet]);

  const bookedMatcher = useMemo(
    (): Matcher => (date) => unavailableSet.has(toIsoDate(date)),
    [unavailableSet],
  );

  function handleRangeSelect(range?: DateRange) {
    if (resetOnNextPick) return;

    const nextStart = range?.from ? startOfDay(range.from) : undefined;
    const nextEnd = range?.to ? startOfDay(range.to) : undefined;

    if (
      nextStart
      && nextEnd
      && rangeIncludesUnavailableNight(nextStart, nextEnd, unavailableSet)
    ) {
      return;
    }

    if (nextStart && unavailableSet.has(toIsoDate(nextStart)) && !nextEnd) {
      return;
    }

    setDraftRange(range);
    setStartDate(nextStart);
    setEndDate(nextEnd);

    if (nextStart && nextEnd) {
      setIsCalendarOpen(false);
    }
  }

  function openCalendar() {
    // Show existing range, but the next click should restart from start.
    setDraftRange(startDate ? { from: startDate, to: endDate } : undefined);
    setResetOnNextPick(true);
    setIsCalendarOpen(true);
  }

  function handleCalendarDayClick(day: Date, modifiers: { disabled?: boolean }) {
    if (!resetOnNextPick || modifiers.disabled) return;

    const nextStart = startOfDay(day);
    if (unavailableSet.has(toIsoDate(nextStart))) return;

    setDraftRange({ from: nextStart, to: undefined });
    setStartDate(nextStart);
    setEndDate(undefined);
    setResetOnNextPick(false);
  }

  useEffect(() => {
    if (!isCalendarOpen) return undefined;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (!popoverRef.current?.contains(target)) {
        setIsCalendarOpen(false);
      }
    }

    function onEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsCalendarOpen(false);
      }
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onEscape);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onEscape);
    };
  }, [isCalendarOpen]);

  return (
    <div className="mx-auto mt-10 w-full max-w-3xl rounded-xl border border-ocean-blue-300/30 bg-white-water p-5 text-black-sand shadow-sm md:p-6">
      <h3 className="text-2xl font-bold text-ocean-blue-200">Check your stay price</h3>
      <p className="mt-1 text-sm text-black-sand/70">
        Pick your check in and check out dates to calculate your total.
      </p>

      <div ref={popoverRef} className="relative mt-4 rounded-xl border border-ocean-blue-300/50 bg-rainy-day/70 p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="relative">
            <button
              type="button"
              onClick={openCalendar}
              className={`flex w-full items-center justify-between rounded-lg border bg-white-water px-3 py-3 text-left shadow-sm transition-colors ${
                isCalendarOpen
                  ? 'border-ocean-blue-200 ring-2 ring-ocean-blue-200/25'
                  : 'border-ocean-blue-300 hover:border-ocean-blue-200'
              }`}
            >
              <span>
                <span className="block text-xs uppercase tracking-wide text-black-sand/60">Start date</span>
                <span className="block text-sm font-medium text-black-sand">{formatDisplayDate(startDate)}</span>
              </span>
              <CalendarDaysIcon className="size-5 text-ocean-blue-200" />
            </button>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={openCalendar}
              className={`flex w-full items-center justify-between rounded-lg border bg-white-water px-3 py-3 text-left shadow-sm transition-colors ${
                isCalendarOpen
                  ? 'border-ocean-blue-200 ring-2 ring-ocean-blue-200/25'
                  : 'border-ocean-blue-300 hover:border-ocean-blue-200'
              }`}
            >
              <span>
                <span className="block text-xs uppercase tracking-wide text-black-sand/60">End date</span>
                <span className="block text-sm font-medium text-black-sand">{formatDisplayDate(endDate)}</span>
              </span>
              <CalendarDaysIcon className="size-5 text-ocean-blue-200" />
            </button>
          </div>
        </div>
        {isCalendarOpen ? (
          <div className="absolute left-4 right-4 top-[calc(100%+0.5rem)] z-30 rounded-xl border border-ocean-blue-300/60 bg-white-water p-3 shadow-xl md:left-auto md:right-4 md:w-[44rem]">
            <p className="mb-2 text-sm font-medium text-black-sand/80">Choose your stay dates</p>
            <DayPicker
              mode="range"
              min={1}
              numberOfMonths={2}
              pagedNavigation
              selected={selectedRange}
              onSelect={handleRangeSelect}
              onDayClick={handleCalendarDayClick}
              defaultMonth={startDate ?? tomorrow}
              disabled={disabledMatchers}
              modifiers={{ booked: bookedMatcher }}
              className="booking-range-calendar mx-auto font-josefin text-black-sand"
              style={calendarTheme}
              classNames={{
                day: 'text-sm',
              }}
              modifiersStyles={{
                booked: {
                  backgroundColor: 'var(--color-dusk-glow-200)',
                  color: 'var(--color-white-water)',
                  opacity: 1,
                  borderRadius: '9999px',
                },
                selected: {
                  backgroundColor: 'var(--color-ocean-blue-200)',
                  color: 'var(--color-white-water)',
                  borderRadius: '9999px',
                },
                range_start: {
                  backgroundColor: 'var(--color-ocean-blue-200)',
                  color: 'var(--color-white-water)',
                  borderRadius: '9999px',
                },
                range_end: {
                  backgroundColor: 'var(--color-ocean-blue-200)',
                  color: 'var(--color-white-water)',
                  borderRadius: '9999px',
                },
                range_middle: {
                  backgroundColor: 'var(--color-ocean-blue-200)',
                  color: 'var(--color-white-water)',
                  borderRadius: '9999px',
                },
              }}
            />
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-black-sand/70">
              <span className="inline-flex items-center gap-2">
                <span
                  className="inline-block size-3 rounded-full bg-ocean-blue-200"
                  aria-hidden
                />
                Your booking
              </span>
              {unavailableNights.length > 0 ? (
                <span className="inline-flex items-center gap-2">
                  <span
                    className="inline-block size-3 rounded-full bg-dusk-glow-200"
                    aria-hidden
                  />
                  Fully booked
                </span>
              ) : null}
            </div>
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                className="text-sm text-black-sand/70 underline underline-offset-2"
                onClick={() => setIsCalendarOpen(false)}
              >
                Close calendar
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 rounded-md border border-ocean-blue-300/40 bg-rainy-day p-4 md:grid-cols-[1fr_auto] md:items-center">
        <ul className="space-y-1 text-sm">
          {nights > 0 ? (
            <>
              <li>{`Stay length: ${nights} night${nights > 1 ? 's' : ''}`}</li>
              <li>{`Nightly rate: IDR ${formatPriceNumberAsK(nightlyRate)}/night`}</li>
              <li className="font-semibold">{`Total: IDR ${formatCompactPrice(total)}`}</li>
            </>
          ) : (
            <li className="text-black-sand/70">Pick valid start and end dates to calculate your total.</li>
          )}
        </ul>
        {canBook ? (
          <a
            href={bookingHref}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="cta before:bg-ocean-blue-100 inline-flex min-h-14 min-w-56 cursor-pointer items-center justify-center rounded-md bg-ocean-blue-200 px-5 py-2 font-medium text-white-water"
          >
            <span className="z-10 flex flex-col items-center leading-tight">
              <span>Book via WhatsApp</span>
              <span className="text-[11px] opacity-90">subject to availability</span>
            </span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
