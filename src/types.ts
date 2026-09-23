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

export interface ChallaEntry {
  dayNumber: number;
  date: string;
  weekday: string;
  /** Prayed in jamaat (باجماعت) */
  prayers: {
    fajr: boolean;
    zuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  /** Prayed alone / without jamaat (بغیر جماعت) */
  prayersAlone: {
    fajr: boolean;
    zuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  takbeerEUla: {
    fajr: boolean;
    zuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  miswak: boolean;
  quran: {
    yaseen: boolean;
    waqiah: boolean;
    mulk: boolean;
    parasRead: number;
    parasTarget: number;
  };
  zikrSubah: {
    istighfar: boolean;
    durood: boolean;
    kalimaThird: boolean;
    kalimaFirst: boolean;
  };
  zikrSham: {
    istighfar: boolean;
    durood: boolean;
    kalimaThird: boolean;
    kalimaFirst: boolean;
  };
  nawafil: {
    tahajjud: boolean;
    ishraq: boolean;
    chasht: boolean;
    awabeen: boolean;
  };
  duaAfterTahajjud: boolean;
  hifazat: {
    nazar: boolean;
    zaban: boolean;
    kaan: boolean;
  };
  sleepTime: string;
  wakeTime: string;
}

export type ChallaLogs = Record<string, ChallaEntry>; // date -> entry

export interface RoutineItem {
  id: string;
  category: 'morning' | 'evening' | 'dua';
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  reference: string;
  benefit?: string;
}

export interface RoutineProgress {
  count: number;
  done: boolean;
}

/** date -> itemId -> progress */
export type RoutineLogs = Record<string, Record<string, RoutineProgress>>;

export interface AppData {
  prayers: Record<string, DailyPrayers>; // date -> prayers
  sunnahs: SunnahLogs;
  nawafil: NawafilLogs;
  dhikr: Record<string, number>; // date -> total count
  challa: ChallaLogs;
  routine: RoutineLogs;
}

export type TabKey = 'prayers' | 'sunnahs' | 'nawafil' | 'challa' | 'routine' | 'stats';
