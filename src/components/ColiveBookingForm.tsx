'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { DayPicker, type DateRange } from 'react-day-picker';

import { formatPriceNumberAsK } from '@/lib/notion';
import { whatsappContactHref } from '@/lib/whatsapp';
import type { ColivePricing } from '@/lib/notion';

type ColiveBookingFormProps = {
  pricing: ColivePricing[];
};

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function nightsBetweenDates(from?: Date, to?: Date): number {
  if (!from || !to) return 0;
  const start = startOfDay(from);
  const end = startOfDay(to);
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

function formatIsoDate(date?: Date): string {
  if (!date) return '';
  const d = startOfDay(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDisplayDate(date?: Date): string {
  if (!date) return 'Select date';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function estimateColiveTotalFromNights(nights: number): number {
  if (nights <= 0) return 0;
  const rawTotal =
    nights <= 7
      ? 700000 + (nights - 1) * ((4200000 - 700000) / 6)
      : 4200000 + (nights - 7) * ((13500000 - 4200000) / 23);

  return Math.round(rawTotal / 50000) * 50000;
}

function formatCompactPrice(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1).replace(/\.0$/, '')}M`;
  }
  return formatPriceNumberAsK(value);
}

export default function ColiveBookingForm({ pricing: _pricing }: ColiveBookingFormProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(undefined);
  const [resetOnNextPick, setResetOnNextPick] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const nights = nightsBetweenDates(startDate, endDate);
  const total = nights > 0 ? estimateColiveTotalFromNights(nights) : 0;
  const nightlyRate = nights > 0 ? Math.round(total / nights) : 0;

  const whatsappMessage = useMemo(() => {
    if (!startDate || !endDate || nights <= 0) return '';
    return [
      'Hi Cocomanu! I would like to book coliving.',
      '',
      `Start date: ${formatIsoDate(startDate)}`,
      `End date: ${formatIsoDate(endDate)}`,
      `Nights: ${nights}`,
      `Nightly rate: IDR ${formatPriceNumberAsK(nightlyRate)}/night`,
      `Calculated total: IDR ${formatCompactPrice(total)}`,
    ].join('\n');
  }, [startDate, endDate, nights, nightlyRate, total]);

  const canBook = Boolean(whatsappMessage);

  const bookingHref = canBook ? whatsappContactHref(whatsappMessage) : '#';
  const calendarTheme = {
    '--rdp-accent-color': 'var(--color-moss-green-200)',
    '--rdp-accent-background-color': 'var(--color-moss-green-300)',
    '--rdp-font-family': 'var(--font-josefin)',
  } as CSSProperties;
  const tomorrow = startOfDay(new Date(Date.now() + 86_400_000));
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
    // Show existing range, but the next click should restart from start.
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
    <div className="mx-auto mt-10 w-full max-w-3xl rounded-xl border border-moss-green-300/30 bg-white-water p-5 text-black-sand shadow-sm md:p-6">
      <h3 className="text-2xl font-bold text-moss-green-200">Check your stay price</h3>
      <p className="mt-1 text-sm text-black-sand/70">
        Select your dates and we will estimate the total for your stay.
      </p>

      <div ref={popoverRef} className="relative mt-4 rounded-xl border border-moss-green-300/50 bg-rainy-day/70 p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="relative">
            <button
              type="button"
              onClick={openCalendar}
              className={`flex w-full items-center justify-between rounded-lg border bg-white-water px-3 py-3 text-left shadow-sm transition-colors ${
                isCalendarOpen
                  ? 'border-moss-green-200 ring-2 ring-moss-green-200/25'
                  : 'border-moss-green-300 hover:border-moss-green-200'
              }`}
            >
              <span>
                <span className="block text-xs uppercase tracking-wide text-black-sand/60">Start date</span>
                <span className="block text-sm font-medium text-black-sand">{formatDisplayDate(startDate)}</span>
              </span>
              <CalendarDaysIcon className="size-5 text-moss-green-200" />
            </button>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={openCalendar}
              className={`flex w-full items-center justify-between rounded-lg border bg-white-water px-3 py-3 text-left shadow-sm transition-colors ${
                isCalendarOpen
                  ? 'border-moss-green-200 ring-2 ring-moss-green-200/25'
                  : 'border-moss-green-300 hover:border-moss-green-200'
              }`}
            >
              <span>
                <span className="block text-xs uppercase tracking-wide text-black-sand/60">End date</span>
                <span className="block text-sm font-medium text-black-sand">{formatDisplayDate(endDate)}</span>
              </span>
              <CalendarDaysIcon className="size-5 text-moss-green-200" />
            </button>
          </div>
        </div>
        {isCalendarOpen ? (
          <div className="absolute left-4 right-4 top-[calc(100%+0.5rem)] z-30 rounded-xl border border-moss-green-300/60 bg-white-water p-3 shadow-xl md:left-auto md:right-4 md:w-[44rem]">
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
              disabled={{ before: tomorrow }}
              className="booking-range-calendar mx-auto font-josefin text-black-sand"
              style={calendarTheme}
              classNames={{
                day: 'text-sm',
              }}
              modifiersStyles={{
                selected: {
                  backgroundColor: 'var(--color-moss-green-200)',
                  color: 'var(--color-white-water)',
                  borderRadius: '0px',
                },
                range_start: {
                  backgroundColor: 'var(--color-moss-green-200)',
                  color: 'var(--color-white-water)',
                  borderTopLeftRadius: '9999px',
                  borderBottomLeftRadius: '9999px',
                  borderTopRightRadius: '0px',
                  borderBottomRightRadius: '0px',
                },
                range_end: {
                  backgroundColor: 'var(--color-moss-green-200)',
                  color: 'var(--color-white-water)',
                  borderTopRightRadius: '9999px',
                  borderBottomRightRadius: '9999px',
                  borderTopLeftRadius: '0px',
                  borderBottomLeftRadius: '0px',
                },
                range_middle: { backgroundColor: 'var(--color-moss-green-200)', color: 'var(--color-white-water)' },
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

      <div className="mt-4 grid gap-3 rounded-md border border-moss-green-300/40 bg-rainy-day p-4 md:grid-cols-[1fr_auto] md:items-center">
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
            className="cta before:bg-moss-green-100 inline-flex min-h-14 min-w-56 cursor-pointer items-center justify-center rounded-md bg-moss-green-200 px-5 py-2 font-medium text-white-water"
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
