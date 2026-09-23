import { useEffect, useState, type ReactNode } from 'react';
import { Check, ClipboardCopy, History, ScrollText } from 'lucide-react';
import type { ChallaEntry, ChallaLogs } from '../types';
import {
  todayKey,
  getEmptyChallaEntry,
  buildChallaMessage,
} from '../data';

interface Props {
  challa: ChallaLogs;
  setChalla: (val: ChallaLogs | ((prev: ChallaLogs) => ChallaLogs)) => void;
}

function ToggleRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center justify-between gap-3 rounded-xl border p-3 transition-all duration-200 ${
        checked
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <span
        className={`text-sm font-medium text-right flex-1 ${
          checked ? 'text-emerald-800' : 'text-gray-700'
        }`}
        dir="rtl"
      >
        {label}
      </span>
      <span
        className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
          checked ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-300'
        }`}
      >
        {checked ? <Check size={16} strokeWidth={3} /> : null}
      </span>
    </button>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-4 space-y-3">
      <h3 className="font-bold text-gray-800 text-sm" dir="rtl">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function ChallaReport({ challa, setChalla }: Props) {
  const today = todayKey();
  const [copied, setCopied] = useState(false);
  const [historyCopied, setHistoryCopied] = useState<string | null>(null);

  // Ensure today's blank entry exists (dayNumber auto-increments from yesterday)
  useEffect(() => {
    if (challa[today]) return;
    setChalla((prev) => {
      if (prev[today]) return prev;
      return { ...prev, [today]: getEmptyChallaEntry(prev, today) };
    });
  }, [today, challa, setChalla]);

  const entry = challa[today] ?? getEmptyChallaEntry(challa, today);
  const message = buildChallaMessage(entry);

  const updateEntry = (patch: Partial<ChallaEntry> | ((prev: ChallaEntry) => ChallaEntry)) => {
    setChalla((prev) => {
      const current = prev[today] ?? getEmptyChallaEntry(prev, today);
      const next = typeof patch === 'function' ? patch(current) : { ...current, ...patch };
      return { ...prev, [today]: next };
    });
  };

  const toggleTop = (key: 'miswak' | 'duaAfterTahajjud') => {
    updateEntry((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleNested = <
    G extends 'prayers' | 'takbeerEUla' | 'quran' | 'zikrSubah' | 'zikrSham' | 'nawafil' | 'hifazat',
  >(
    group: G,
    key: keyof ChallaEntry[G] & string,
  ) => {
    updateEntry((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: !(prev[group] as Record<string, boolean>)[key],
      },
    }));
  };

  const copyMessage = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) {
        setHistoryCopied(id);
        setTimeout(() => setHistoryCopied(null), 1500);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      // ignore clipboard errors
    }
  };

  const history = Object.entries(challa)
    .filter(([date]) => date !== today)
    .sort(([a], [b]) => b.localeCompare(a));

  const takbeerCount = [
    entry.takbeerEUla.fajr,
    entry.takbeerEUla.zuhr,
    entry.takbeerEUla.asr,
    entry.takbeerEUla.maghrib,
    entry.takbeerEUla.isha,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
            <ScrollText size={22} />
          </div>
          <div>
            <p className="text-sm text-emerald-100">Daily report for your ustad</p>
            <p className="text-2xl font-bold">Challa Report</p>
          </div>
        </div>
        <p className="text-xs text-emerald-100 mt-3" dir="rtl">
          یوم {String(entry.dayNumber).padStart(2, '0')}/40 — تکبیر اولی {takbeerCount}/5
        </p>
      </div>

      {/* Meta fields */}
      <Section title="چلہ کی تفصیل">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="block space-y-1">
            <span className="text-xs text-gray-400 font-medium">چلہ یوم ( /40 )</span>
            <input
              type="number"
              min={1}
              max={40}
              value={entry.dayNumber}
              onChange={(e) =>
                updateEntry({
                  dayNumber: Math.min(40, Math.max(1, Number(e.target.value) || 1)),
                })
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-gray-400 font-medium">تاریخ</span>
            <input
              type="text"
              dir="rtl"
              value={entry.date}
              onChange={(e) => updateEntry({ date: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-gray-400 font-medium">دن</span>
            <input
              type="text"
              dir="rtl"
              value={entry.weekday}
              onChange={(e) => updateEntry({ weekday: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </label>
        </div>
      </Section>

      {/* Prayers jamaat */}
      <Section title="نماز باجماعت">
        <div className="space-y-2">
          {(
            [
              ['fajr', 'فجر باجماعت'],
              ['zuhr', 'ظہر با جماعت'],
              ['asr', 'عصر باجماعت'],
              ['maghrib', 'مغرب با جماعت'],
              ['isha', 'عشاء باجماعت'],
            ] as const
          ).map(([key, label]) => (
            <ToggleRow
              key={key}
              label={label}
              checked={entry.prayers[key]}
              onToggle={() => toggleNested('prayers', key)}
            />
          ))}
        </div>
      </Section>

      {/* Takbeer-e-oola */}
      <Section title={`تکبیر اولی (${takbeerCount}/5)`}>
        <p className="text-xs text-gray-400 -mt-1 mb-1">
          Count is computed automatically from these checkboxes
        </p>
        <div className="space-y-2">
          {(
            [
              ['fajr', 'فجر — تکبیر اولی'],
              ['zuhr', 'ظہر — تکبیر اولی'],
              ['asr', 'عصر — تکبیر اولی'],
              ['maghrib', 'مغرب — تکبیر اولی'],
              ['isha', 'عشاء — تکبیر اولی'],
            ] as const
          ).map(([key, label]) => (
            <ToggleRow
              key={key}
              label={label}
              checked={entry.takbeerEUla[key]}
              onToggle={() => toggleNested('takbeerEUla', key)}
            />
          ))}
        </div>
      </Section>

      {/* Sunnahs */}
      <Section title="🟢 سنتوں پر عمل">
        <ToggleRow
          label="مسواک"
          checked={entry.miswak}
          onToggle={() => toggleTop('miswak')}
        />
      </Section>

      {/* Quran */}
      <Section title="🔵 قرآن تلاوت">
        <div className="space-y-2">
          <ToggleRow
            label="سورہ یاسین"
            checked={entry.quran.yaseen}
            onToggle={() => toggleNested('quran', 'yaseen')}
          />
          <ToggleRow
            label="سورہ واقعہ"
            checked={entry.quran.waqiah}
            onToggle={() => toggleNested('quran', 'waqiah')}
          />
          <ToggleRow
            label="سورہ ملک"
            checked={entry.quran.mulk}
            onToggle={() => toggleNested('quran', 'mulk')}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <label className="block space-y-1">
            <span className="text-xs text-gray-400 font-medium">تلاوت (پڑھے پارے)</span>
            <input
              type="number"
              min={0}
              step={0.5}
              value={entry.quran.parasRead}
              onChange={(e) =>
                updateEntry({
                  quran: {
                    ...entry.quran,
                    parasRead: Math.max(0, Number(e.target.value) || 0),
                  },
                })
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-gray-400 font-medium">ہدف (پارے)</span>
            <input
              type="number"
              min={1}
              step={0.5}
              value={entry.quran.parasTarget}
              onChange={(e) =>
                updateEntry({
                  quran: {
                    ...entry.quran,
                    parasTarget: Math.max(1, Number(e.target.value) || 1),
                  },
                })
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </label>
        </div>
      </Section>

      {/* Zikr Subah */}
      <Section title="🔴 ذکر صبح">
        <div className="space-y-2">
          {(
            [
              ['istighfar', 'استغفار 100'],
              ['durood', 'درود شریف 100'],
              ['kalimaThird', 'تیسرا کلمہ 100'],
              ['kalimaFirst', 'پہلا کلمہ 100'],
            ] as const
          ).map(([key, label]) => (
            <ToggleRow
              key={key}
              label={label}
              checked={entry.zikrSubah[key]}
              onToggle={() => toggleNested('zikrSubah', key)}
            />
          ))}
        </div>
      </Section>

      {/* Zikr Sham */}
      <Section title="🔴 ذکر شام">
        <div className="space-y-2">
          {(
            [
              ['istighfar', 'استغفار 100'],
              ['durood', 'درود شریف 100'],
              ['kalimaThird', 'تیسرا کلمہ 100'],
              ['kalimaFirst', 'پہلا کلمہ 100'],
            ] as const
          ).map(([key, label]) => (
            <ToggleRow
              key={key}
              label={label}
              checked={entry.zikrSham[key]}
              onToggle={() => toggleNested('zikrSham', key)}
            />
          ))}
        </div>
      </Section>

      {/* Nawafil */}
      <Section title="🟢 نوافل">
        <div className="space-y-2">
          {(
            [
              ['tahajjud', 'تہجد'],
              ['ishraq', 'اشراق'],
              ['chasht', 'چاشت'],
              ['awabeen', 'اوابین'],
            ] as const
          ).map(([key, label]) => (
            <ToggleRow
              key={key}
              label={label}
              checked={entry.nawafil[key]}
              onToggle={() => toggleNested('nawafil', key)}
            />
          ))}
        </div>
      </Section>

      {/* Dua */}
      <Section title="⚫ دعائیں">
        <ToggleRow
          label="تہجد کے بعد دعا"
          checked={entry.duaAfterTahajjud}
          onToggle={() => toggleTop('duaAfterTahajjud')}
        />
      </Section>

      {/* Hifazat */}
      <Section title="🟡 حفاظت کرنے کی چیزیں">
        <div className="space-y-2">
          {(
            [
              ['nazar', 'نظر کی حفاظت'],
              ['zaban', 'زبان کی حفاظت'],
              ['kaan', 'کان کی حفاظت'],
            ] as const
          ).map(([key, label]) => (
            <ToggleRow
              key={key}
              label={label}
              checked={entry.hifazat[key]}
              onToggle={() => toggleNested('hifazat', key)}
            />
          ))}
        </div>
      </Section>

      {/* Sleep / wake */}
      <Section title="🟤 سونے اور جاگنے کا وقت">
        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1">
            <span className="text-xs text-gray-400 font-medium">سونے کا وقت</span>
            <input
              type="text"
              dir="rtl"
              placeholder="مثلاً 12"
              value={entry.sleepTime}
              onChange={(e) => updateEntry({ sleepTime: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-gray-400 font-medium">جاگنے کا وقت</span>
            <input
              type="text"
              dir="rtl"
              placeholder="مثلاً 4:50"
              value={entry.wakeTime}
              onChange={(e) => updateEntry({ wakeTime: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </label>
        </div>
      </Section>

      {/* Live preview */}
      <div className="rounded-2xl bg-white border border-gray-200 p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-gray-800 text-sm">Message Preview</h3>
          <button
            type="button"
            onClick={() => copyMessage(message)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
              copied
                ? 'bg-emerald-500 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {copied ? <Check size={16} /> : <ClipboardCopy size={16} />}
            {copied ? 'Copied ✓' : 'Copy Message'}
          </button>
        </div>
        <pre
          dir="rtl"
          className="whitespace-pre-wrap break-words rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-800 leading-relaxed font-sans max-h-96 overflow-y-auto"
        >
          {message}
        </pre>
      </div>

      {/* History */}
      <div className="rounded-2xl bg-white border border-gray-200 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <History size={18} className="text-emerald-600" />
          <h3 className="font-bold text-gray-800 text-sm">Past Challa Reports</h3>
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-gray-400">No past reports yet. Fill today&apos;s form to start.</p>
        ) : (
          <div className="space-y-2">
            {history.map(([date, past]) => {
              const pastMsg = buildChallaMessage(past);
              const isCopied = historyCopied === date;
              return (
                <div
                  key={date}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{date}</p>
                    <p className="text-xs text-gray-400" dir="rtl">
                      یوم {String(past.dayNumber).padStart(2, '0')}/40 · {past.weekday}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyMessage(pastMsg, date)}
                    className={`flex-shrink-0 flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                      isCopied
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white border border-gray-200 text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    {isCopied ? <Check size={14} /> : <ClipboardCopy size={14} />}
                    {isCopied ? 'Copied ✓' : 'Copy again'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
