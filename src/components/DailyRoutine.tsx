import { useState } from 'react';
import {
  Check,
  ChevronDown,
  BookOpen,
  Minus,
  Plus,
  Sunrise,
  Sunset,
  HeartHandshake,
} from 'lucide-react';
import type { RoutineItem, RoutineLogs } from '../types';
import { todayKey } from '../data';
import {
  MORNING_AZKAR,
  EVENING_AZKAR,
  DAILY_DUAS,
  ROUTINE_SECTION_META,
  type RoutineSection,
} from '../routineData';

interface Props {
  routine: RoutineLogs;
  setRoutine: (val: RoutineLogs | ((prev: RoutineLogs) => RoutineLogs)) => void;
}

function ItemCard({
  item,
  progress,
  onIncrement,
  onDecrement,
  onToggleDone,
}: {
  item: RoutineItem;
  progress: { count: number; done: boolean };
  onIncrement: () => void;
  onDecrement: () => void;
  onToggleDone: () => void;
}) {
  const [open, setOpen] = useState(false);
  const complete = progress.done || progress.count >= item.count;
  const displayCount = Math.min(progress.count, item.count);

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        complete
          ? 'bg-emerald-50 border-emerald-200 shadow-sm'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onToggleDone}
            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              complete ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-300'
            }`}
            aria-label={complete ? 'Mark incomplete' : 'Mark complete'}
          >
            {complete ? <Check size={18} strokeWidth={3} /> : null}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className={`font-semibold text-sm ${complete ? 'text-emerald-800' : 'text-gray-800'}`}>
                  {item.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {item.count > 1 ? `${displayCount} / ${item.count}×` : '1×'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
                aria-label="Show details"
              >
                <ChevronDown
                  size={18}
                  className={`transition-transform ${open ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            {item.count > 1 && (
              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={onDecrement}
                  className="w-9 h-9 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200"
                >
                  <Minus size={16} />
                </button>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (progress.count / item.count) * 100)}%` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={onIncrement}
                  className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center hover:bg-emerald-200"
                >
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {open && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            <p
              dir="rtl"
              className="text-lg leading-loose text-gray-900 text-right font-medium"
              style={{ fontFamily: 'serif' }}
            >
              {item.arabic}
            </p>
            <p className="text-xs text-gray-500 italic leading-relaxed">{item.transliteration}</p>
            <p className="text-sm text-gray-700 leading-relaxed">{item.translation}</p>
            {item.benefit && (
              <p className="text-xs text-teal-700 bg-teal-50 rounded-xl px-3 py-2 leading-relaxed">
                {item.benefit}
              </p>
            )}
            <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 rounded-xl px-3 py-2">
              <BookOpen size={14} className="flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{item.reference}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DailyRoutine({ routine, setRoutine }: Props) {
  const today = todayKey();
  const [section, setSection] = useState<RoutineSection>('morning');
  const todayLogs = routine[today] ?? {};

  const items =
    section === 'morning' ? MORNING_AZKAR : section === 'evening' ? EVENING_AZKAR : DAILY_DUAS;

  const getProgress = (id: string) => todayLogs[id] ?? { count: 0, done: false };

  const updateItem = (id: string, next: { count: number; done: boolean }) => {
    setRoutine((prev) => ({
      ...prev,
      [today]: {
        ...(prev[today] ?? {}),
        [id]: next,
      },
    }));
  };

  const increment = (item: RoutineItem) => {
    const cur = getProgress(item.id);
    const count = Math.min(item.count, cur.count + 1);
    updateItem(item.id, { count, done: count >= item.count });
  };

  const decrement = (item: RoutineItem) => {
    const cur = getProgress(item.id);
    const count = Math.max(0, cur.count - 1);
    updateItem(item.id, { count, done: count >= item.count && count > 0 });
  };

  const toggleDone = (item: RoutineItem) => {
    const cur = getProgress(item.id);
    if (cur.done || cur.count >= item.count) {
      updateItem(item.id, { count: 0, done: false });
    } else {
      updateItem(item.id, { count: item.count, done: true });
    }
  };

  const doneCount = items.filter((item) => {
    const p = getProgress(item.id);
    return p.done || p.count >= item.count;
  }).length;
  const pct = Math.round((doneCount / items.length) * 100);
  const meta = ROUTINE_SECTION_META[section];

  const sections: { key: RoutineSection; icon: typeof Sunrise; color: string }[] = [
    { key: 'morning', icon: Sunrise, color: 'from-amber-500 to-orange-500' },
    { key: 'evening', icon: Sunset, color: 'from-indigo-500 to-violet-600' },
    { key: 'duas', icon: HeartHandshake, color: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-2xl bg-gradient-to-r ${sections.find((s) => s.key === section)?.color} p-5 text-white`}>
        <p className="text-sm text-white/80">Daily Routine</p>
        <p className="text-2xl font-bold">{meta.label}</p>
        <p className="text-sm text-white/90 mt-0.5" dir="rtl">
          {meta.subtitle}
        </p>
        <p className="text-xs text-white/70 mt-2">{meta.timing}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium">
            {doneCount} / {items.length} done
          </span>
          <span className="text-xl font-bold">{pct}%</span>
        </div>
        <div className="mt-2 h-2 bg-white/25 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Section switcher */}
      <div className="grid grid-cols-3 gap-2">
        {sections.map(({ key, icon: Icon }) => {
          const active = section === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSection(key)}
              className={`flex flex-col items-center gap-1 rounded-2xl border p-3 transition-all ${
                active
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <Icon size={18} />
              <span className="text-[11px] font-semibold">
                {ROUTINE_SECTION_META[key].label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tip */}
      <p className="text-xs text-gray-400 text-center leading-relaxed px-2">
        Tap a card to expand Arabic text, translation, and hadith reference. Sources drawn from
        Hisnul Muslim / Qur&apos;an &amp; Sunnah.
      </p>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            progress={getProgress(item.id)}
            onIncrement={() => increment(item)}
            onDecrement={() => decrement(item)}
            onToggleDone={() => toggleDone(item)}
          />
        ))}
      </div>
    </div>
  );
}
