import type { PrayerKey, SunnahItem, NawafilItem } from './types';

export const PRAYER_KEYS: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export const PRAYER_INFO: Record<PrayerKey, { name: string; time: string; icon: string }> = {
  fajr: { name: 'Fajr', time: 'Dawn', icon: 'Sunrise' },
  dhuhr: { name: 'Dhuhr', time: 'Noon', icon: 'Sun' },
  asr: { name: 'Asr', time: 'Afternoon', icon: 'CloudSun' },
  maghrib: { name: 'Maghrib', time: 'Sunset', icon: 'Sunset' },
  isha: { name: 'Isha', time: 'Night', icon: 'Moon' },
};

export const SUNNAH_ITEMS: SunnahItem[] = [
  { id: 'fajr-sunnah', name: '2 Sunnah of Fajr', description: 'Pray before the obligatory Fajr prayer', icon: 'Sunrise', category: 'daily' },
  { id: 'ishraq', name: 'Ishraq (2 rakats)', description: 'Prayed 15-20 min after sunrise', icon: 'Sun', category: 'morning' },
  { id: 'duha', name: 'Duha / Chasht (4 rakats)', description: 'Mid-morning voluntary prayer', icon: 'Sun', category: 'morning' },
  { id: 'tahajjud', name: 'Tahajjud (Night Prayer)', description: 'Prayed in the last third of the night', icon: 'Moon', category: 'daily' },
  { id: 'witr', name: 'Witr (1-3 rakats)', description: 'Prayed after Isha', icon: 'Moon', category: 'evening' },
  { id: 'salawat-prophet', name: 'Salawat on Prophet ﷺ (100x)', description: 'Send blessings 100 times', icon: 'Heart', category: 'daily' },
  { id: 'morning-adhkar', name: 'Morning Adhkar', description: 'Recite morning remembrances after Fajr', icon: 'BookOpen', category: 'morning' },
  { id: 'evening-adhkar', name: 'Evening Adhkar', description: 'Recite evening remembrances after Asr', icon: 'BookOpen', category: 'evening' },
  { id: 'quran', name: 'Quran Reading', description: 'Read at least 1 page of Quran', icon: 'BookOpen', category: 'daily' },
  { id: 'fasting-monday-thursday', name: 'Fast (Mon/Thu)', description: 'Sunnah fasting on Mondays & Thursdays', icon: 'Utensils', category: 'weekly' },
  { id: 'istighfar-100', name: 'Istighfar (100x)', description: 'Seek forgiveness 100 times', icon: 'Heart', category: 'daily' },
  { id: 'tasbih-fatima', name: 'Tasbih Fatima (33x3)', description: 'SubhanAllah 33x, Alhamdulillah 33x, Allahu Akbar 34x', icon: 'Hand', category: 'daily' },
];

export const NAWAFIL_ITEMS: NawafilItem[] = [
  { id: 'nafl-general', name: 'General Nafl Prayers', description: 'Any voluntary 2-rakat prayer', icon: 'Heart', target: 4 },
  { id: 'salat-ul-hajah', name: 'Salat-ul-Hajah', description: 'Prayer of need', icon: 'HandHelping', target: 1 },
  { id: 'salat-istikharah', name: 'Salat-ul-Istikhara', description: 'Prayer for guidance', icon: 'Compass', target: 1 },
  { id: 'salat-tawbah', name: 'Salat-ul-Tawbah', description: 'Prayer of repentance', icon: 'RefreshCw', target: 1 },
  { id: 'extra-quran', name: 'Extra Quran (pages)', description: 'Read beyond your daily minimum', icon: 'BookOpen', target: 5 },
];

export function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function dateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getEmptyPrayerStatus() {
  return {
    fajr: { prayed: false, inJamaat: false, onTime: false },
    dhuhr: { prayed: false, inJamaat: false, onTime: false },
    asr: { prayed: false, inJamaat: false, onTime: false },
    maghrib: { prayed: false, inJamaat: false, onTime: false },
    isha: { prayed: false, inJamaat: false, onTime: false },
  };
}
