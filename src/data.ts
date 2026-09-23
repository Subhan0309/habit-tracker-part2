import type { PrayerKey, SunnahItem, NawafilItem, ChallaEntry, ChallaLogs } from './types';

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

const URDU_MONTHS = [
  'جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون',
  'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر',
];

export const URDU_WEEKDAYS = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];

export function formatUrduDate(date: Date): string {
  return `${date.getDate()} ${URDU_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatUrduWeekday(date: Date): string {
  return URDU_WEEKDAYS[date.getDay()];
}

export function parseDateKey(key: string): Date {
  return new Date(`${key}T12:00:00`);
}

/** HH:MM for <input type="time"> */
export function formatTimeHHMM(date: Date = new Date()): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/** Soften "04:50" → "4:50" for the WhatsApp message */
export function formatTimeForMessage(hhmm: string): string {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':');
  if (h === undefined || m === undefined) return hhmm;
  return `${Number(h)}:${m}`;
}

export function getDefaultChallaDayNumber(challa: ChallaLogs, forDate: string): number {
  const d = parseDateKey(forDate);
  d.setDate(d.getDate() - 1);
  const yesterday = dateKey(d);
  if (challa[yesterday]) {
    return Math.min(40, challa[yesterday].dayNumber + 1);
  }
  const prior = Object.keys(challa)
    .filter((k) => k < forDate)
    .sort()
    .pop();
  if (prior && challa[prior]) {
    return Math.min(40, challa[prior].dayNumber + 1);
  }
  return 1;
}

export function getEmptyChallaEntry(
  challa: ChallaLogs = {},
  forDate: string = todayKey(),
  now: Date = new Date(),
): ChallaEntry {
  const dayDate = parseDateKey(forDate);
  const currentTime = formatTimeHHMM(now);
  return {
    dayNumber: getDefaultChallaDayNumber(challa, forDate),
    date: formatUrduDate(dayDate),
    weekday: formatUrduWeekday(dayDate),
    prayers: { fajr: false, zuhr: false, asr: false, maghrib: false, isha: false },
    prayersAlone: { fajr: false, zuhr: false, asr: false, maghrib: false, isha: false },
    takbeerEUla: { fajr: false, zuhr: false, asr: false, maghrib: false, isha: false },
    miswak: false,
    quran: { yaseen: false, waqiah: false, mulk: false, parasRead: 0, parasTarget: 2 },
    zikrSubah: { istighfar: false, durood: false, kalimaThird: false, kalimaFirst: false },
    zikrSham: { istighfar: false, durood: false, kalimaThird: false, kalimaFirst: false },
    nawafil: { tahajjud: false, ishraq: false, chasht: false, awabeen: false },
    duaAfterTahajjud: false,
    hifazat: { nazar: false, zaban: false, kaan: false },
    sleepTime: currentTime,
    wakeTime: currentTime,
  };
}

const EMPTY_PRAYER_FLAGS = {
  fajr: false,
  zuhr: false,
  asr: false,
  maghrib: false,
  isha: false,
};

/** Normalize older saved entries (prayersAlone, HH:MM padding) */
export function normalizeChallaEntry(entry: ChallaEntry): ChallaEntry {
  const padTime = (value: string | undefined): string => {
    if (!value) return '';
    if (/^\d{1,2}:\d{2}$/.test(value)) {
      const [h, m] = value.split(':');
      return `${h.padStart(2, '0')}:${m}`;
    }
    if (/^\d{1,2}$/.test(value)) {
      return `${value.padStart(2, '0')}:00`;
    }
    return value;
  };

  return {
    ...entry,
    prayersAlone: entry.prayersAlone ?? { ...EMPTY_PRAYER_FLAGS },
    sleepTime: padTime(entry.sleepTime),
    wakeTime: padTime(entry.wakeTime),
  };
}

export function buildChallaMessage(raw: ChallaEntry): string {
  const entry = normalizeChallaEntry(raw);
  const mark = (v: boolean) => (v ? '✅' : '❌');
  const day = String(entry.dayNumber).padStart(2, '0');
  const alone = entry.prayersAlone;
  const takbeerCount = [
    entry.takbeerEUla.fajr,
    entry.takbeerEUla.zuhr,
    entry.takbeerEUla.asr,
    entry.takbeerEUla.maghrib,
    entry.takbeerEUla.isha,
  ].filter(Boolean).length;

  return [
    `*چلہ یوم:* ${day}/40`,
    `*تاریخ  | ${entry.date}`,
    `دن:  ${entry.weekday}`,
    ``,
    `🔸فجر باجماعت  ${mark(entry.prayers.fajr)}`,
    `🔸ظہر با جماعت ${mark(entry.prayers.zuhr)}`,
    `🔸عصر باجماعت ${mark(entry.prayers.asr)}`,
    `🔸مغرب با جماعت ${mark(entry.prayers.maghrib)}`,
    `🔸 عشاء باجماعت ${mark(entry.prayers.isha)}`,
    `🔸فجر بغیر جماعت  ${mark(alone.fajr)}`,
    `🔸ظہر بغیر جماعت ${mark(alone.zuhr)}`,
    `🔸عصر بغیر جماعت ${mark(alone.asr)}`,
    `🔸مغرب بغیر جماعت ${mark(alone.maghrib)}`,
    `🔸 عشاء بغیر جماعت ${mark(alone.isha)}`,
    `🔸تکبیر اولی ${takbeerCount}/5`,
    ``,
    `*🟢 سنتوں پر عمل*`,
    `🔸مسواک ${mark(entry.miswak)}`,
    ``,
    ``,
    `*🔵 قرآن تلاوت*`,
    `🔹سورہ یاسین ${mark(entry.quran.yaseen)}`,
    `🔹سورہ واقعہ ${mark(entry.quran.waqiah)}`,
    `🔹سورہ ملک ${mark(entry.quran.mulk)}`,
    `🔹تلاوت (${entry.quran.parasRead}/${entry.quran.parasTarget} پارہ) `,
    ``,
    `*🔴 ذکر صبح* `,
    `🔺 استغفار 100 ${mark(entry.zikrSubah.istighfar)}`,
    `🔺درود شریف 100 ${mark(entry.zikrSubah.durood)}`,
    `🔺تیسرا کلمہ 100 ${mark(entry.zikrSubah.kalimaThird)}`,
    `🔺پہلا کلمہ 100 ${mark(entry.zikrSubah.kalimaFirst)}`,
    ``,
    `*🔴 ذکر شام* `,
    `🔺 استغفار 100 ${mark(entry.zikrSham.istighfar)}`,
    `🔺درود شریف 100 ${mark(entry.zikrSham.durood)}`,
    `🔺تیسرا کلمہ 100 ${mark(entry.zikrSham.kalimaThird)}`,
    `🔺پہلا کلمہ 100 ${mark(entry.zikrSham.kalimaFirst)}`,
    ``,
    `*🟢نوافل*`,
    `🟩 تہجد ${mark(entry.nawafil.tahajjud)}`,
    `🟩 اشراق${mark(entry.nawafil.ishraq)}`,
    `🟩 چاشت ${mark(entry.nawafil.chasht)}`,
    `🟩 اوابین ${mark(entry.nawafil.awabeen)}`,
    ``,
    `*⚫ دعائیں*`,
    `◼️تہجد کے بعد دعا ${mark(entry.duaAfterTahajjud)}`,
    ``,
    `*🟡 حفاظت کرنے کی چیزیں*`,
    `🟨 نظر کی حفاظت ${mark(entry.hifazat.nazar)}`,
    `🟨 زبان کی حفاظت ${mark(entry.hifazat.zaban)}`,
    `🟨 کان کی حفاظت ${mark(entry.hifazat.kaan)}`,
    ``,
    `*🟤 سونے اور جاگنے کا وقت*`,
    `🟫 سونے کا وقت :  ${formatTimeForMessage(entry.sleepTime)} تقریباً `,
    `🟫 جاگنے کا وقت: ${formatTimeForMessage(entry.wakeTime)} تقریباً`,
  ].join('\n');
}
