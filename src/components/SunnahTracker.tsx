import {
  Sunrise, Sun, Moon, Heart, BookOpen, Utensils, Hand, HandHelping, Compass, RefreshCw,
  Check, type LucideIcon,
} from 'lucide-react';
import type { SunnahLogs, SunnahItem } from '../types';
import { SUNNAH_ITEMS, todayKey } from '../data';

const ICON_MAP: Record<string, LucideIcon> = {
  Sunrise, Sun, Moon, Heart, BookOpen, Utensils, Hand, HandHelping, Compass, RefreshCw,
};

interface Props {
  sunnahs: SunnahLogs;
  setSunnahs: (val: SunnahLogs | ((prev: SunnahLogs) => SunnahLogs)) => void;
}

const CATEGORY_LABELS: Record<SunnahItem['category'], string> = {
  morning: 'Morning',
  evening: 'Evening',
  daily: 'Daily',
  weekly: 'Weekly',
};

const CATEGORY_COLORS: Record<SunnahItem['category'], string> = {
  morning: 'bg-amber-100 text-amber-700',
  evening: 'bg-indigo-100 text-indigo-700',
  daily: 'bg-emerald-100 text-emerald-700',
  weekly: 'bg-purple-100 text-purple-700',
};

export default function SunnahTracker({ sunnahs, setSunnahs }: Props) {
  const today = todayKey();

  const isDone = (id: string) => {
    return sunnahs[id]?.date === today && sunnahs[id]?.done;
  };

  const toggle = (id: string) => {
    setSunnahs((prev) => {
      const copy = { ...prev };
      const wasDone = copy[id]?.date === today && copy[id]?.done;
      copy[id] = { date: today, done: !wasDone };
      return copy;
    });
  };

  const doneCount = SUNNAH_ITEMS.filter((s) => isDone(s.id)).length;
  const completionPct = Math.round((doneCount / SUNNAH_ITEMS.length) * 100);

  // Group by category
  const grouped = SUNNAH_ITEMS.reduce((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {} as Record<string, SunnahItem[]>);

  const categoryOrder: SunnahItem['category'][] = ['morning', 'evening', 'daily', 'weekly'];

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-emerald-100">Today's Sunnahs</p>
            <p className="text-2xl font-bold">{doneCount} / {SUNNAH_ITEMS.length}</p>
          </div>
          <div className="text-4xl font-bold">{completionPct}%</div>
        </div>
        <div className="h-2 bg-emerald-400/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* Sunnah items by category */}
      {categoryOrder.map((cat) => {
        const items = grouped[cat];
        if (!items?.length) return null;
        return (
          <div key={cat}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
              {CATEGORY_LABELS[cat]}
            </h3>
            <div className="space-y-2">
              {items.map((item) => {
                const Icon = ICON_MAP[item.icon] ?? Heart;
                const done = isDone(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`w-full flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-300 active:scale-[0.98] ${
                      done
                        ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                        : 'bg-white border-gray-200 hover:border-emerald-200'
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                        done ? 'bg-emerald-500 text-white' : `bg-gray-50 text-gray-400`
                      }`}
                    >
                      {done ? <Check size={22} strokeWidth={3} /> : <Icon size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${done ? 'text-emerald-800' : 'text-gray-700'}`}>
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{item.description}</p>
                    </div>
                    <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[item.category]}`}>
                      {CATEGORY_LABELS[item.category]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
