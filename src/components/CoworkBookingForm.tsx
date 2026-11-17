'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { DayPicker } from 'react-day-picker';

import { formatCompactPrice, formatPriceNumberAsK } from '@/lib/notion';
import { trackPurchase } from '@/lib/analytics';
import {
  buildCoworkBookingWhatsappMessage,
  buildWhatsappBookingUrl,
  createCoworkBookingId,
} from '@/lib/booking-whatsapp';
import type { CoworkingPricing } from '@/lib/notion';
import PricingCard from '@/components/PricingCard';
import PricingTierPrice from '@/components/PricingTierPrice';

type CoworkBookingFormProps = {
  pricing: CoworkingPricing[];
};

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function passIncludedDays(pass: CoworkingPricing): number {
  return Math.max(1, Math.round(pass.includedDays || 1));
}

function passValidityDays(pass: CoworkingPricing): number {
  return Math.max(passIncludedDays(pass), Math.round(pass.validityDays || pass.includedDays || 1));
}

function passValidUntil(start: Date, pass: CoworkingPricing): Date {
  return addDays(startOfDay(start), passValidityDays(pass) - 1);
}

function passTotalIdr(pass: CoworkingPricing): number {
  return Math.round(pass.price * (1 - pass.discount));
}

function formatDisplayDate(date?: Date): string {
  if (!date) return 'Select date';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function isDailyEntry(name: string): boolean {
  const normalized = name.trim().toLowerCase();
  return normalized === 'daily' || normalized === 'daily pass' || normalized === 'day pass';
}

export default function CoworkBookingForm({ pricing }: CoworkBookingFormProps) {
  const [selectedPassId, setSelectedPassId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const selectedPass = pricing.find((pass) => pass.id === selectedPassId) ?? null;
  const includedDays = selectedPass ? passIncludedDays(selectedPass) : 0;
  const validityDays = selectedPass ? passValidityDays(selectedPass) : 0;
  const validUntil = startDate && selectedPass ? passValidUntil(startDate, selectedPass) : undefined;
  const totalIdr = selectedPass ? passTotalIdr(selectedPass) : 0;

  const bookingId = useMemo(() => {
    if (!selectedPass || !startDate) return '';
    return createCoworkBookingId();
  }, [selectedPass, startDate]);

  const whatsappMessage = useMemo(() => {
    if (!selectedPass || !startDate || !validUntil || includedDays <= 0 || totalIdr <= 0 || !bookingId) {
      return '';
    }
    return buildCoworkBookingWhatsappMessage({
      startDate,
      validUntil,
      includedDays,
      validityDays,
      lines: [
        {
          tierName: selectedPass.name,
          quantity: 1,
          totalIdr,
        },
      ],
      totalIdr,
      bookingId,
    });
  }, [selectedPass, startDate, validUntil, includedDays, validityDays, totalIdr, bookingId]);

  const canBook = Boolean(whatsappMessage);
  const bookingHref = canBook ? buildWhatsappBookingUrl(whatsappMessage) : '#';

  const calendarTheme = {
    '--rdp-accent-color': 'var(--color-dusk-glow-200)',
    '--rdp-accent-background-color': 'var(--color-dusk-glow-300)',
    '--rdp-font-family': 'var(--font-josefin)',
  } as CSSProperties;

  const today = useMemo(() => startOfDay(new Date()), []);

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
    <>
      <div className="mx-auto flex max-w-6xl flex-wrap items-stretch justify-center gap-x-6 gap-y-12 px-6 md:gap-x-10 lg:gap-x-12">
        {pricing.map((item) => (
          <div
            key={item.id}
            className="flex w-full md:w-[calc((100%-5rem)/3)] lg:w-[calc((100%-6rem)/3)]"
          >
            <PricingCard
              title={item.name}
              perks={item.includes}
              className="mx-0 h-full w-full max-w-none"
              selected={item.id === selectedPassId}
              onSelect={() => setSelectedPassId(item.id)}
              price={(
                <PricingTierPrice
                  price={item.price}
                  discount={item.discount}
                  periodRate={!isDailyEntry(item.name) && item.dailyPrice > 0 ? item.dailyPrice : undefined}
                  periodLabel="/day"
                />
              )}
            />
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 w-full max-w-3xl rounded-xl border border-dusk-glow-300/30 bg-white-water p-5 text-black-sand shadow-sm md:p-6">
        <h3 className="text-2xl font-bold text-dusk-glow-200">Book a cowork pass</h3>
        <p className="mt-1 text-sm text-black-sand/70">
          Choose a pass, then pick the day you want to start. We&apos;ll set the expiry date from how long that pass is valid.
        </p>

        <div ref={popoverRef} className="relative mt-4 rounded-xl border border-dusk-glow-300/50 bg-rainy-day/70 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCalendarOpen(true)}
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
              <div className="flex w-full items-center justify-between rounded-lg border border-dusk-glow-300/40 bg-white-water/70 px-3 py-3 text-left">
                <span>
                  <span className="block text-xs uppercase tracking-wide text-black-sand/60">Valid until</span>
                  <span className="block text-sm font-medium text-black-sand">
                    {validUntil ? formatDisplayDate(validUntil) : 'Set by pass validity'}
                  </span>
                </span>
              </div>
            </div>
          </div>
          {isCalendarOpen ? (
            <div className="absolute left-4 right-4 top-[calc(100%+0.5rem)] z-30 rounded-xl border border-dusk-glow-300/60 bg-white-water p-2 shadow-xl sm:p-3 md:left-auto md:right-4 md:w-[22rem]">
              <p className="mb-2 text-sm font-medium text-black-sand/80">Choose your first day</p>
              <DayPicker
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date ? startOfDay(date) : undefined);
                  if (date) setIsCalendarOpen(false);
                }}
                defaultMonth={startDate ?? today}
                disabled={{ before: today }}
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
            {selectedPass && startDate && validUntil ? (
              <>
                <li>{`Pass: ${selectedPass.name}`}</li>
                <li>{`Start date: ${formatDisplayDate(startDate)}`}</li>
                <li>{`Valid until: ${formatDisplayDate(validUntil)}`}</li>
                <li>{`Days included: ${includedDays}`}</li>
                <li>{`Validity: ${validityDays} day${validityDays > 1 ? 's' : ''}`}</li>
                <li className="font-semibold">{`Total: IDR ${formatCompactPrice(totalIdr)}`}</li>
              </>
            ) : selectedPass ? (
              <li className="text-black-sand/70">Pick your first day to complete the booking.</li>
            ) : (
              <li className="text-black-sand/70">Select a pass above to start your booking.</li>
            )}
          </ul>
          {canBook && selectedPass ? (
            <a
              href={bookingHref}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="cta before:bg-dusk-glow-100 inline-flex min-h-14 min-w-56 cursor-pointer items-center justify-center rounded-md bg-dusk-glow-200 px-5 py-2 font-medium text-white-water"
              onClick={() => {
                trackPurchase({
                  transactionId: bookingId,
                  value: totalIdr,
                  vertical: 'cowork',
                  items: [
                    {
                      item_id: selectedPass.id,
                      item_name: selectedPass.name,
                      price: totalIdr,
                      quantity: 1,
                    },
                  ],
                });
              }}
            >
              <span className="z-10 flex flex-col items-center leading-tight">
                <span>Book via WhatsApp</span>
                <span className="text-[11px] opacity-90">subject to availability</span>
              </span>
            </a>
          ) : null}
        </div>
      </div>
    </>
  );
}
