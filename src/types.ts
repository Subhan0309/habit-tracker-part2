export type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerStatus {
  prayed: boolean;
  inJamaat: boolean;
  onTime: boolean;
}

export type DailyPrayers = Record<PrayerKey, PrayerStatus>;

export interface SunnahLog {
  date: string; // YYYY-MM-DD
  done: boolean;
}

export type SunnahLogs = Record<string, SunnahLog>; // key: sunnahId -> { date: ... }

export interface SunnahItem {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  category: 'morning' | 'evening' | 'daily' | 'weekly';
}

export interface NawafilEntry {
  count: number;
  date: string;
}

export type NawafilLogs = Record<string, NawafilEntry[]>; // key: nawafilId -> entries

export interface NawafilItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  target: number; // target count per day
}

export interface AppData {
  prayers: Record<string, DailyPrayers>; // date -> prayers
  sunnahs: SunnahLogs;
  nawafil: NawafilLogs;
  dhikr: Record<string, number>; // date -> total count
}

export type TabKey = 'prayers' | 'sunnahs' | 'nawafil' | 'stats';
