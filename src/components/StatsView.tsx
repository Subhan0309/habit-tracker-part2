import { Flame, TrendingUp, Award, Calendar, Moon, CheckCircle2, BookOpen, Hand } from 'lucide-react';
import type { AppData } from '../types';
import { PRAYER_KEYS, SUNNAH_ITEMS, NAWAFIL_ITEMS, dateKey } from '../data';

interface Props {
  data: AppData;
}

export default function StatsView({ data }: Props) {
  const today = dateKey(new Date());

  // Calculate prayer streak
  const calcPrayerStreak = (): number => {
    let streak = 0;
    const d = new Date();
    // Don't count today if incomplete
    const todayAll = PRAYER_KEYS.every((k) => data.prayers[today]?.[k]?.prayed);
    if (!todayAll) d.setDate(d.getDate() - 1);

    for (let i = 0; i < 365; i++) {
      const key = dateKey(d);
      const dayData = data.prayers[key];
      if (dayData && PRAYER_KEYS.every((k) => dayData[k]?.prayed)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  // Calculate sunnah streak
  const calcSunnahStreak = (): number => {
    let streak = 0;
    const d = new Date();
    for (let i = 0; i < 365; i++) {
      const key = dateKey(d);
      const doneCount = SUNNAH_ITEMS.filter((s) => data.sunnahs[s.id]?.date === key && data.sunnahs[s.id]?.done).length;
      if (doneCount >= 6) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        if (i === 0) {
          d.setDate(d.getDate() - 1);
          continue;
        }
        break;
      }
    }
    return streak;
  };

  // Last 7 days prayer completion
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = dateKey(d);
    const dayData = data.prayers[key];
    const prayed = dayData ? PRAYER_KEYS.filter((k) => dayData[k]?.prayed).length : 0;
    return {
      date: d,
      prayed,
      label: d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
      dayLabel: d.toLocaleDateString('en-US', { weekday: 'short' }),
    };
  });

  // Last 7 days sunnah completion
  const last7Sunnahs = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = dateKey(d);
    const doneCount = SUNNAH_ITEMS.filter((s) => data.sunnahs[s.id]?.date === key && data.sunnahs[s.id]?.done).length;
    return {
      label: d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
      dayLabel: d.toLocaleDateString('en-US', { weekday: 'short' }),
      done: doneCount,
      pct: Math.round((doneCount / SUNNAH_ITEMS.length) * 100),
    };
  });

  // Total nawafil this week
  const weekNawafil = NAWAFIL_ITEMS.reduce((sum, item) => {
    const entries = data.nawafil[item.id] ?? [];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekCount = entries
      .filter((e) => new Date(e.date) >= weekAgo)
      .reduce((s, e) => s + e.count, 0);
    return sum + weekCount;
  }, 0);

  const prayerStreak = calcPrayerStreak();
  const sunnahStreak = calcSunnahStreak();

  // Total prayers all time
  const totalPrayers = Object.values(data.prayers).reduce(
    (sum, day) => sum + PRAYER_KEYS.filter((k) => day[k]?.prayed).length,
    0
  );

  // Total jamaat
  const totalJamaat = Object.values(data.prayers).reduce(
    (sum, day) => sum + PRAYER_KEYS.filter((k) => day[k]?.inJamaat).length,
    0
  );

  // Total sunnahs all time
  const totalSunnahs = SUNNAH_ITEMS.reduce((sum, item) => {
    return sum + (data.sunnahs[item.id]?.done ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Streak cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-4 text-white shadow-lg">
          <Flame size={24} className="mb-2" />
          <p className="text-3xl font-bold">{prayerStreak}</p>
          <p className="text-xs text-orange-100">Prayer Streak (days)</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white shadow-lg">
          <Award size={24} className="mb-2" />
          <p className="text-3xl font-bold">{sunnahStreak}</p>
          <p className="text-xs text-emerald-100">Sunnah Streak (days)</p>
        </div>
      </div>

      {/* All-time stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <span className="text-xs text-gray-400 font-medium">Total Prayers</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalPrayers}</p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={18} className="text-teal-500" />
            <span className="text-xs text-gray-400 font-medium">In Jamaat</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalJamaat}</p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={18} className="text-amber-500" />
            <span className="text-xs text-gray-400 font-medium">Sunnahs Today</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {SUNNAH_ITEMS.filter((s) => data.sunnahs[s.id]?.date === today && data.sunnahs[s.id]?.done).length}
          </p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Hand size={18} className="text-cyan-500" />
            <span className="text-xs text-gray-400 font-medium">Nawafil (7 days)</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{weekNawafil}</p>
        </div>
      </div>

      {/* 7-day prayer chart */}
      <div className="rounded-2xl bg-white border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-emerald-600" />
          <h3 className="font-bold text-gray-800">Last 7 Days — Prayers</h3>
        </div>
        <div className="flex items-end justify-between gap-2 h-32">
          {last7Days.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-gray-600">{day.prayed}/5</span>
              <div className="w-full bg-gray-100 rounded-lg overflow-hidden flex flex-col justify-end" style={{ height: '80px' }}>
                <div
                  className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-lg transition-all duration-500"
                  style={{ height: `${(day.prayed / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7-day sunnah chart */}
      <div className="rounded-2xl bg-white border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Moon size={18} className="text-indigo-600" />
          <h3 className="font-bold text-gray-800">Last 7 Days — Sunnahs</h3>
        </div>
        <div className="flex items-end justify-between gap-2 h-32">
          {last7Sunnahs.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-gray-600">{day.pct}%</span>
              <div className="w-full bg-gray-100 rounded-lg overflow-hidden flex flex-col justify-end" style={{ height: '80px' }}>
                <div
                  className="w-full bg-gradient-to-t from-indigo-500 to-purple-400 rounded-lg transition-all duration-500"
                  style={{ height: `${day.pct}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Encouragement */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-center text-white">
        <p className="text-sm font-semibold">
          {prayerStreak > 0
            ? `Mashallah! ${prayerStreak} day${prayerStreak > 1 ? 's' : ''} of consistent prayer. Keep it up!`
            : 'Start your streak today — pray all 5 daily prayers!'}
        </p>
      </div>
    </div>
  );
}
