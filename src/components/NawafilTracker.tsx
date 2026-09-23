import { Heart, HandHelping, Compass, RefreshCw, BookOpen, Plus, Minus, type LucideIcon } from 'lucide-react';
import type { NawafilLogs, NawafilItem } from '../types';
import { NAWAFIL_ITEMS, todayKey } from '../data';

const ICON_MAP: Record<string, LucideIcon> = {
  Heart, HandHelping, Compass, RefreshCw, BookOpen,
};

interface Props {
  nawafil: NawafilLogs;
  setNawafil: (val: NawafilLogs | ((prev: NawafilLogs) => NawafilLogs)) => void;
}

export default function NawafilTracker({ nawafil, setNawafil }: Props) {
  const today = todayKey();

  const getTodayCount = (id: string): number => {
    const entries = nawafil[id] ?? [];
    const todayEntries = entries.filter((e) => e.date === today);
    return todayEntries.reduce((sum, e) => sum + e.count, 0);
  };

  const adjustCount = (id: string, delta: number) => {
    setNawafil((prev) => {
      const copy = { ...prev };
      const entries = [...(copy[id] ?? [])];
      const todayIdx = entries.findIndex((e) => e.date === today);

      if (todayIdx >= 0) {
        const newCount = Math.max(0, entries[todayIdx].count + delta);
        if (newCount === 0) {
          entries.splice(todayIdx, 1);
        } else {
          entries[todayIdx] = { count: newCount, date: today };
        }
      } else if (delta > 0) {
        entries.push({ count: delta, date: today });
      }

      copy[id] = entries;
      return copy;
    });
  };

  const totalCount = NAWAFIL_ITEMS.reduce((sum, item) => sum + getTodayCount(item.id), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 p-5 text-white">
        <p className="text-sm text-teal-100">Today's Nawafil Total</p>
        <p className="text-3xl font-bold">{totalCount}</p>
        <p className="text-xs text-teal-100 mt-1">Voluntary prayers & extra good deeds</p>
      </div>

      {/* Nawafil items */}
      <div className="space-y-3">
        {NAWAFIL_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.icon] ?? Heart;
          const count = getTodayCount(item.id);
          const pct = Math.min(100, Math.round((count / item.target) * 100));
          const completed = count >= item.target;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 transition-all duration-300 ${
                completed ? 'bg-teal-50 border-teal-200 shadow-sm' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                    completed ? 'bg-teal-500 text-white' : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${completed ? 'text-teal-800' : 'text-gray-700'}`}>
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{item.description}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    completed ? 'bg-teal-500' : 'bg-cyan-400'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Counter controls */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Target: {item.target} • Done: <span className="font-bold text-gray-600">{count}</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustCount(item.id, -1)}
                    disabled={count === 0}
                    className="w-9 h-9 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center transition-all active:scale-90 disabled:opacity-30"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-10 text-center font-bold text-lg text-gray-700">{count}</span>
                  <button
                    onClick={() => adjustCount(item.id, 1)}
                    className="w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center transition-all active:scale-90 shadow-sm shadow-teal-200"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
