/**
 * Astronomical moon phase calculations.
 * Based on the synodic month period and a known new moon reference date.
 */

const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z').getTime();
const SYNODIC_MONTH = 29.53059;
const MS_PER_DAY = 86400000;

export type MoonPhaseName =
  | 'New Moon'
  | 'Waxing Crescent'
  | 'First Quarter'
  | 'Waxing Gibbous'
  | 'Full Moon'
  | 'Waning Gibbous'
  | 'Third Quarter'
  | 'Waning Crescent';

export interface MoonData {
  phase: MoonPhaseName;
  illumination: number;
  age: number;
  isWaxing: boolean;
  phaseFraction: number;
}

export interface MoonTimes {
  moonrise: string;
  moonset: string;
}

export interface MoonEvent {
  type: 'full' | 'new';
  date: Date;
}

export function getMoonAge(date: Date): number {
  const diff = date.getTime() - KNOWN_NEW_MOON;
  const daysSince = diff / MS_PER_DAY;
  return ((daysSince % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
}

export function getMoonData(date: Date): MoonData {
  const age = getMoonAge(date);
  const phaseFraction = age / SYNODIC_MONTH;
  const illumination = (1 - Math.cos((phaseFraction) * 2 * Math.PI)) / 2;
  const isWaxing = phaseFraction < 0.5;

  let phase: MoonPhaseName;
  if (phaseFraction < 0.025 || phaseFraction >= 0.975) {
    phase = 'New Moon';
  } else if (phaseFraction < 0.225) {
    phase = 'Waxing Crescent';
  } else if (phaseFraction < 0.275) {
    phase = 'First Quarter';
  } else if (phaseFraction < 0.475) {
    phase = 'Waxing Gibbous';
  } else if (phaseFraction < 0.525) {
    phase = 'Full Moon';
  } else if (phaseFraction < 0.725) {
    phase = 'Waning Gibbous';
  } else if (phaseFraction < 0.775) {
    phase = 'Third Quarter';
  } else {
    phase = 'Waning Crescent';
  }

  return { phase, illumination, age, isWaxing, phaseFraction };
}

export function getMoonTimes(date: Date, lat: number, _lon: number): MoonTimes {
  const age = getMoonAge(date);
  const phaseFraction = age / SYNODIC_MONTH;

  // Approximate transit time: new moon transits at noon, full moon at midnight
  const transitHour = (12 + phaseFraction * 24) % 24;

  // Adjust duration above horizon based on latitude (simplified)
  const latFactor = Math.abs(lat) / 90;
  const halfDuration = 6 + (1 - latFactor) * 0.5;

  const riseHour = (transitHour - halfDuration + 24) % 24;
  const setHour = (transitHour + halfDuration) % 24;

  return {
    moonrise: formatHour(riseHour),
    moonset: formatHour(setHour),
  };
}

function formatHour(hour: number): string {
  const h = Math.floor(hour);
  const m = Math.floor((hour - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function getDaysUntilFullMoon(date: Date): number {
  const phaseFraction = getMoonAge(date) / SYNODIC_MONTH;
  const days =
    phaseFraction < 0.5
      ? (0.5 - phaseFraction) * SYNODIC_MONTH
      : (1.5 - phaseFraction) * SYNODIC_MONTH;
  return Math.round(days);
}

export function getDaysUntilNewMoon(date: Date): number {
  const phaseFraction = getMoonAge(date) / SYNODIC_MONTH;
  const days = (1 - phaseFraction) * SYNODIC_MONTH;
  return days < 1 ? Math.round(SYNODIC_MONTH) : Math.round(days);
}

export function getNextMoonEvent(date: Date): { type: 'full' | 'new'; daysUntil: number } {
  const dFull = getDaysUntilFullMoon(date);
  const dNew = getDaysUntilNewMoon(date);
  return dFull <= dNew
    ? { type: 'full', daysUntil: dFull }
    : { type: 'new', daysUntil: dNew };
}

export function getUpcomingMoonEvents(fromDate: Date, count: number): MoonEvent[] {
  const events: MoonEvent[] = [];
  const age = getMoonAge(fromDate);
  const phaseFraction = age / SYNODIC_MONTH;

  // Find days until next new and full moons
  let daysToNew = (1 - phaseFraction) * SYNODIC_MONTH;
  if (daysToNew < 0.5) daysToNew += SYNODIC_MONTH;

  let daysToFull = phaseFraction < 0.5
    ? (0.5 - phaseFraction) * SYNODIC_MONTH
    : (1.5 - phaseFraction) * SYNODIC_MONTH;
  if (daysToFull < 0.5) daysToFull += SYNODIC_MONTH;

  let nextNewMs = fromDate.getTime() + daysToNew * MS_PER_DAY;
  let nextFullMs = fromDate.getTime() + daysToFull * MS_PER_DAY;

  while (events.length < count) {
    if (nextNewMs < nextFullMs) {
      events.push({ type: 'new', date: new Date(nextNewMs) });
      nextNewMs += SYNODIC_MONTH * MS_PER_DAY;
    } else {
      events.push({ type: 'full', date: new Date(nextFullMs) });
      nextFullMs += SYNODIC_MONTH * MS_PER_DAY;
    }
  }

  return events;
}

export function getCalendarMoonData(year: number, month: number): Map<number, MoonData> {
  const map = new Map<number, MoonData>();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day, 12, 0, 0);
    map.set(day, getMoonData(date));
  }
  return map;
}

export function isFullMoon(data: MoonData): boolean {
  return data.phase === 'Full Moon';
}

export function isNewMoon(data: MoonData): boolean {
  return data.phase === 'New Moon';
}
