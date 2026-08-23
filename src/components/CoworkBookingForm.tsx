'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { DayPicker, type DateRange } from 'react-day-picker';

import { estimateCoworkingTotalFromDays, formatCompactPrice, formatPriceNumberAsK } from '@/lib/notion';
import {
  buildCoworkBookingWhatsappMessage,
  buildWhatsappBookingUrl,
  createCoworkBookingId,
} from '@/lib/booking-whatsapp';
import type { CoworkingPricing } from '@/lib/notion';

type CoworkBookingFormProps = {
  pricing: CoworkingPricing[];
};

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Inclusive day count: 1 Jan → 30 Jan = 30 days (both endpoints included). */
function inclusiveDaysBetween(from?: Date, to?: Date): number {
  if (!from || !to) return 0;
  const start = startOfDay(from);
  const end = startOfDay(to);
  if (end.getTime() < start.getTime()) return 0;
  const ms = end.getTime() - start.getTime();
  return Math.round(ms / 86_400_000) + 1;
}

function formatDisplayDate(date?: Date): string {
  if (!date) return 'Select date';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function CoworkBookingForm({ pricing }: CoworkBookingFormProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(undefined);
  const [resetOnNextPick, setResetOnNextPick] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const days = inclusiveDaysBetween(startDate, endDate);
  const estimate = days > 0 ? estimateCoworkingTotalFromDays(days, pricing) : null;

  const bookingId = useMemo(() => {
    if (!startDate || !endDate || days <= 0) return '';
    return createCoworkBookingId();
  }, [startDate, endDate, days]);

  const whatsappMessage = useMemo(() => {
    if (!startDate || !endDate || days <= 0 || !estimate || estimate.totalIdr <= 0 || !bookingId) {
      return '';
    }
    return buildCoworkBookingWhatsappMessage({
      startDate,
      endDate,
      days,
      lines: estimate.lines,
      totalIdr: estimate.totalIdr,
      bookingId,
    });
  }, [startDate, endDate, days, estimate, bookingId]);

  const canBook = Boolean(whatsappMessage);
  const bookingHref = canBook ? buildWhatsappBookingUrl(whatsappMessage) : '#';

  const calendarTheme = {
    '--rdp-accent-color': 'var(--color-dusk-glow-200)',
    '--rdp-accent-background-color': 'var(--color-dusk-glow-300)',
    '--rdp-font-family': 'var(--font-josefin)',
  } as CSSProperties;

  const tomorrow = useMemo(() => startOfDay(new Date(Date.now() + 86_400_000)), []);

  const selectedRange: DateRange | undefined = isCalendarOpen
    ? draftRange
    : (startDate ? { from: startDate, to: endDate } : undefined);

  function handleRangeSelect(range?: DateRange) {
    if (resetOnNextPick) return;

    const nextStart = range?.from ? startOfDay(range.from) : undefined;
    const nextEnd = range?.to ? startOfDay(range.to) : undefined;

    setDraftRange(range);
    setStartDate(nextStart);
    setEndDate(nextEnd);

    if (nextStart && nextEnd) {
      setIsCalendarOpen(false);
    }
  }

  function openCalendar() {
    setDraftRange(startDate ? { from: startDate, to: endDate } : undefined);
    setResetOnNextPick(true);
    setIsCalendarOpen(true);
  }

  function handleCalendarDayClick(day: Date, modifiers: { disabled?: boolean }) {
    if (!resetOnNextPick || modifiers.disabled) return;

    const nextStart = startOfDay(day);
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
    <div className="mx-auto mt-10 w-full max-w-3xl rounded-xl border border-dusk-glow-300/30 bg-white-water p-5 text-black-sand shadow-sm md:p-6">
      <h3 className="text-2xl font-bold text-dusk-glow-200">Check your pass price</h3>
      <p className="mt-1 text-sm text-black-sand/70">
        Select your first and last day of coworking — both dates count toward your pass.
      </p>

      <div ref={popoverRef} className="relative mt-4 rounded-xl border border-dusk-glow-300/50 bg-rainy-day/70 p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="relative">
            <button
              type="button"
              onClick={openCalendar}
              className={`flex w-full items-center justify-between rounded-lg border bg-white-water px-3 py-3 text-left shadow-sm transition-colors ${
                isCalendarOpen
                  ? 'border-dusk-glow-200 ring-2 ring-dusk-glow-200/25'
                  : 'border-dusk-glow-300 hover:border-dusk-glow-200'
              }`}
            >
              <span>
                <span className="block text-xs uppercase tracking-wide text-black-sand/60">First day</span>
                <span className="block text-sm font-medium text-black-sand">{formatDisplayDate(startDate)}</span>
              </span>
              <CalendarDaysIcon className="size-5 text-dusk-glow-200" />
            </button>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={openCalendar}
              className={`flex w-full items-center justify-between rounded-lg border bg-white-water px-3 py-3 text-left shadow-sm transition-colors ${
                isCalendarOpen
                  ? 'border-dusk-glow-200 ring-2 ring-dusk-glow-200/25'
                  : 'border-dusk-glow-300 hover:border-dusk-glow-200'
              }`}
            >
              <span>
                <span className="block text-xs uppercase tracking-wide text-black-sand/60">Last day</span>
                <span className="block text-sm font-medium text-black-sand">{formatDisplayDate(endDate)}</span>
              </span>
              <CalendarDaysIcon className="size-5 text-dusk-glow-200" />
            </button>
          </div>
        </div>
        {isCalendarOpen ? (
          <div className="absolute left-4 right-4 top-[calc(100%+0.5rem)] z-30 rounded-xl border border-dusk-glow-300/60 bg-white-water p-3 shadow-xl md:left-auto md:right-4 md:w-[44rem]">
            <p className="mb-2 text-sm font-medium text-black-sand/80">Choose your pass dates</p>
            <DayPicker
              mode="range"
              numberOfMonths={2}
              pagedNavigation
              selected={selectedRange}
              onSelect={handleRangeSelect}
              onDayClick={handleCalendarDayClick}
              defaultMonth={startDate ?? tomorrow}
              disabled={{ before: tomorrow }}
              className="booking-range-calendar mx-auto font-josefin text-black-sand"
              style={calendarTheme}
              classNames={{
                day: 'text-sm',
              }}
              modifiersStyles={{
                selected: {
                  backgroundColor: 'var(--color-dusk-glow-200)',
                  color: 'var(--color-white-water)',
                  borderRadius: '9999px',
                },
                range_start: {
                  backgroundColor: 'var(--color-dusk-glow-200)',
                  color: 'var(--color-white-water)',
                  borderRadius: '9999px',
                },
                range_end: {
                  backgroundColor: 'var(--color-dusk-glow-200)',
                  color: 'var(--color-white-water)',
                  borderRadius: '9999px',
                },
                range_middle: {
                  backgroundColor: 'var(--color-dusk-glow-200)',
                  color: 'var(--color-white-water)',
                  borderRadius: '9999px',
                },
              }}
            />
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

      <div className="mt-4 grid gap-3 rounded-md border border-dusk-glow-300/40 bg-rainy-day p-4 md:grid-cols-[1fr_auto] md:items-center">
        <ul className="space-y-1 text-sm">
          {estimate && days > 0 ? (
            <>
              <li>{`Period: ${days} day${days > 1 ? 's' : ''}`}</li>
              {estimate.lines.map((line) => (
                <li key={line.tierName}>
                  {`${line.quantity}× ${line.tierName} — IDR ${formatPriceNumberAsK(line.totalIdr)}`}
                </li>
              ))}
              <li>{`Average: IDR ${formatPriceNumberAsK(estimate.dailyRateIdr)}/day`}</li>
              <li className="font-semibold">{`Total: IDR ${formatCompactPrice(estimate.totalIdr)}`}</li>
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
            className="cta before:bg-dusk-glow-100 inline-flex min-h-14 min-w-56 cursor-pointer items-center justify-center rounded-md bg-dusk-glow-200 px-5 py-2 font-medium text-white-water"
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
