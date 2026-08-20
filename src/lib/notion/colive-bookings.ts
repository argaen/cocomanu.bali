import type { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { notion } from './client';
import { DATABASES } from './constants';

const TOTAL_ROOMS = 4;

type ColiveBooking = {
  room: string;
  /** Check-in day (inclusive), ISO YYYY-MM-DD */
  start: string;
  /** Check-out day (exclusive for nights), ISO YYYY-MM-DD */
  end: string;
};

function todayIsoLocal(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDaysIso(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d + days);
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function eachNightIso(start: string, end: string): string[] {
  const nights: string[] = [];
  let cursor = start;
  while (cursor < end) {
    nights.push(cursor);
    cursor = addDaysIso(cursor, 1);
  }
  return nights;
}

async function queryFutureBookings(): Promise<ColiveBooking[]> {
  const databaseId = (DATABASES as Record<string, string>)['colive-bookings'];
  if (!databaseId) {
    console.warn('[getUnavailableColiveNights] Missing `DATABASES.colive-bookings` id.');
    return [];
  }

  const today = todayIsoLocal();
  // Look back so stays that started earlier but still overlap the future are included.
  const lookback = addDaysIso(today, -730);
  const bookings: ColiveBooking[] = [];
  let cursor: string | undefined;

  try {
    do {
      const response = await notion.databases.query({
        database_id: databaseId,
        start_cursor: cursor,
        page_size: 100,
        filter: {
          property: 'Period',
          date: { on_or_after: lookback },
        },
      });

      for (const page of response.results as DatabaseObjectResponse[]) {
        const room = (page.properties.Room as { select?: { name?: string } | null })?.select?.name;
        const period = (page.properties.Period as {
          date?: { start?: string; end?: string | null } | null;
        })?.date;

        if (!room || !period?.start) continue;

        const start = period.start.slice(0, 10);
        const end = (period.end ?? period.start).slice(0, 10);

        // Only keep bookings whose check-out is still in the future.
        if (end <= today) continue;

        bookings.push({ room, start, end });
      }

      cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (cursor);
  } catch (error) {
    const e = error as { code?: string; message?: string };
    console.warn(
      `[getUnavailableColiveNights] Failed query for database ${databaseId}: ${e.code ?? 'unknown'} - ${e.message ?? 'unknown error'}`,
    );
    return [];
  }

  return bookings;
}

/**
 * Nights (ISO YYYY-MM-DD) when all rooms are occupied.
 * A booking Period [check-in, check-out] occupies nights [check-in, check-out).
 */
export async function getUnavailableColiveNights(): Promise<string[]> {
  const bookings = await queryFutureBookings();
  if (bookings.length === 0) return [];

  const roomsByNight = new Map<string, Set<string>>();

  for (const booking of bookings) {
    for (const night of eachNightIso(booking.start, booking.end)) {
      let rooms = roomsByNight.get(night);
      if (!rooms) {
        rooms = new Set();
        roomsByNight.set(night, rooms);
      }
      rooms.add(booking.room);
    }
  }

  const today = todayIsoLocal();
  return [...roomsByNight.entries()]
    .filter(([night, rooms]) => night >= today && rooms.size >= TOTAL_ROOMS)
    .map(([night]) => night)
    .sort();
}
