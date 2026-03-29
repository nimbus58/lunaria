import { useAppStore } from '@/store/useAppStore';
import type { MoonPhaseName } from '@/utils/moon';

export type Language = 'en' | 'fr';

interface DateFormatOptions {
  month: 'long' | 'short';
  day: 'numeric';
  year?: 'numeric';
}

export interface Translations {
  appTitle: string;
  phases: Record<MoonPhaseName, string>;
  illuminated: string;
  moonrise: string;
  moonset: string;
  fullMoonTonight: string;
  newMoonTonight: string;
  daysUntilFull: (days: number) => string;
  daysUntilNew: (days: number) => string;
  months: string[];
  dayLabels: string[];
  dayNamesShort: string[];
  notifications: string;
  fullMoon: string;
  newMoon: string;
  notifyMeAt: string;
  upcomingMoons: string;
  infoWeb: string;
  infoMobile: string;
  language: string;
  english: string;
  french: string;
  dateLocale: string;
  dateFormatOptions: DateFormatOptions;
  shortDateOptions: DateFormatOptions;
  forecast: string;
  tenDayForecast: string;
  today: string;
  tomorrow: string;
  illuminationLabel: string;
  riseSet: string;
  noData: string;
}

const en: Translations = {
  appTitle: 'Moon Time',

  phases: {
    'New Moon': 'New Moon',
    'Waxing Crescent': 'Waxing Crescent',
    'First Quarter': 'First Quarter',
    'Waxing Gibbous': 'Waxing Gibbous',
    'Full Moon': 'Full Moon',
    'Waning Gibbous': 'Waning Gibbous',
    'Third Quarter': 'Third Quarter',
    'Waning Crescent': 'Waning Crescent',
  },

  illuminated: 'illuminated',
  moonrise: 'Moonrise:',
  moonset: 'Moonset:',
  fullMoonTonight: 'Full Moon tonight!',
  newMoonTonight: 'New Moon tonight!',
  daysUntilFull: (days: number) =>
    `${days} ${days === 1 ? 'day' : 'days'} until Full Moon`,
  daysUntilNew: (days: number) =>
    `${days} ${days === 1 ? 'day' : 'days'} until New Moon`,

  months: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
  dayLabels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

  notifications: 'Notifications',
  fullMoon: 'Full Moon',
  newMoon: 'New Moon',
  notifyMeAt: 'Notify me at:',
  upcomingMoons: 'Upcoming Moons',
  infoWeb: 'Notifications are available on mobile devices. Your preferences are saved.',
  infoMobile: 'You will receive a notification on the morning of each event at your selected time.',

  language: 'Language',
  english: 'English',
  french: 'French',

  dateLocale: 'en-US',
  dateFormatOptions: { month: 'long', day: 'numeric', year: 'numeric' },
  shortDateOptions: { month: 'short', day: 'numeric' },

  forecast: 'Forecast',
  tenDayForecast: '10-Day Lunar Forecast',
  today: 'Today',
  tomorrow: 'Tomorrow',
  illuminationLabel: 'Illumination',
  riseSet: 'Rise / Set',
  noData: 'No forecast data available',
};

const fr: Translations = {
  appTitle: 'Heure Lunaire',

  phases: {
    'New Moon': 'Nouvelle Lune',
    'Waxing Crescent': 'Premier Croissant',
    'First Quarter': 'Premier Quartier',
    'Waxing Gibbous': 'Gibbeuse Croissante',
    'Full Moon': 'Pleine Lune',
    'Waning Gibbous': 'Gibbeuse D\u00e9croissante',
    'Third Quarter': 'Dernier Quartier',
    'Waning Crescent': 'Dernier Croissant',
  },

  illuminated: 'illumin\u00e9',
  moonrise: 'Lever\u00a0:',
  moonset: 'Coucher\u00a0:',
  fullMoonTonight: 'Pleine Lune ce soir\u00a0!',
  newMoonTonight: 'Nouvelle Lune ce soir\u00a0!',
  daysUntilFull: (days: number) =>
    `${days} ${days === 1 ? 'jour' : 'jours'} avant la Pleine Lune`,
  daysUntilNew: (days: number) =>
    `${days} ${days === 1 ? 'jour' : 'jours'} avant la Nouvelle Lune`,

  months: [
    'Janvier', 'F\u00e9vrier', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Ao\u00fbt', 'Septembre', 'Octobre', 'Novembre', 'D\u00e9cembre',
  ],
  dayLabels: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
  dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],

  notifications: 'Notifications',
  fullMoon: 'Pleine Lune',
  newMoon: 'Nouvelle Lune',
  notifyMeAt: 'Me notifier \u00e0\u00a0:',
  upcomingMoons: 'Prochaines Lunes',
  infoWeb: 'Les notifications sont disponibles sur appareils mobiles. Vos pr\u00e9f\u00e9rences sont enregistr\u00e9es.',
  infoMobile: 'Vous recevrez une notification le matin de chaque \u00e9v\u00e9nement \u00e0 l\u2019heure choisie.',

  language: 'Langue',
  english: 'Anglais',
  french: 'Fran\u00e7ais',

  dateLocale: 'fr-FR',
  dateFormatOptions: { month: 'long', day: 'numeric', year: 'numeric' },
  shortDateOptions: { month: 'short', day: 'numeric' },

  forecast: 'Pr\u00e9visions',
  tenDayForecast: 'Pr\u00e9visions lunaires sur 10 jours',
  today: "Aujourd'hui",
  tomorrow: 'Demain',
  illuminationLabel: '\u00c9clairement',
  riseSet: 'Lever / Coucher',
  noData: 'Aucune donn\u00e9e de pr\u00e9vision disponible',
};

const translations: Record<Language, Translations> = { en, fr };

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}

export function useTranslation() {
  const language = useAppStore((s) => s.language);
  const t = translations[language];
  return { t, language };
}
