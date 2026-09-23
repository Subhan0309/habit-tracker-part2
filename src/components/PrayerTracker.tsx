import { Sunrise, Sun, CloudSun, Sunset, Moon, Check, Users, Clock } from 'lucide-react';
import type { PrayerKey, DailyPrayers } from '../types';
import { PRAYER_KEYS, PRAYER_INFO, todayKey, getEmptyPrayerStatus } from '../data';

const ICONS: Record<string, typeof Sunrise> = {
  Sunrise,
  Sun,
  CloudSun,
  Sunset,
  Moon,
};

interface Props {
  prayers: Record<string, DailyPrayers>;
  setPrayers: (val: Record<string, DailyPrayers> | ((prev: Record<string, DailyPrayers>) => Record<string, DailyPrayers>)) => void;
}

export default function PrayerTracker({ prayers, setPrayers }: Props) {
  const today = todayKey();
  const todayPrayers = prayers[today] ?? getEmptyPrayerStatus();

  const updatePrayer = (key: PrayerKey, field: 'prayed' | 'inJamaat' | 'onTime') => {
    setPrayers((prev) => {
      const copy = { ...prev };
      const dayData = { ...(copy[today] ?? getEmptyPrayerStatus()) };
      const prayerData = { ...dayData[key] };

      if (field === 'prayed') {
        prayerData.prayed = !prayerData.prayed;
        if (!prayerData.prayed) {
          prayerData.inJamaat = false;
          prayerData.onTime = false;
        }
      } else {
        prayerData.prayed = true;
        prayerData[field] = !prayerData[field];
      }

      dayData[key] = prayerData;
      copy[today] = dayData;
      return copy;
    });
  };

  const prayedCount = PRAYER_KEYS.filter((k) => todayPrayers[k].prayed).length;
  const jamaatCount = PRAYER_KEYS.filter((k) => todayPrayers[k].inJamaat).length;
  const onTimeCount = PRAYER_KEYS.filter((k) => todayPrayers[k].onTime).length;

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-center">
          <div className="text-3xl font-bold text-emerald-700">{prayedCount}<span className="text-lg text-emerald-400">/5</span></div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">Prayed</div>
        </div>
        <div className="rounded-2xl bg-teal-50 border border-teal-100 p-4 text-center">
          <div className="text-3xl font-bold text-teal-700">{jamaatCount}</div>
          <div className="text-xs text-teal-600 mt-1 font-medium">In Jamaat</div>
        </div>
        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 text-center">
          <div className="text-3xl font-bold text-amber-700">{onTimeCount}</div>
          <div className="text-xs text-amber-600 mt-1 font-medium">On Time</div>
        </div>
      </div>

      {/* Prayer cards */}
      <div className="space-y-3">
        {PRAYER_KEYS.map((key) => {
          const info = PRAYER_INFO[key];
          const Icon = ICONS[info.icon];
          const status = todayPrayers[key];
          const isPrayed = status.prayed;

          return (
            <div
              key={key}
              className={`rounded-2xl border p-4 transition-all duration-300 ${
                isPrayed
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-sm'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Toggle button */}
                <button
                  onClick={() => updatePrayer(key, 'prayed')}
                  className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-90 ${
                    isPrayed
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isPrayed ? <Check size={28} strokeWidth={3} /> : <Icon size={26} />}
                </button>

                {/* Prayer info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h3 className={`font-bold text-lg ${isPrayed ? 'text-emerald-800' : 'text-gray-800'}`}>
                      {info.name}
                    </h3>
                    <span className="text-xs text-gray-400">{info.time}</span>
                  </div>

                  {/* Sub-toggles */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => updatePrayer(key, 'inJamaat')}
                      disabled={!isPrayed}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        status.inJamaat
                          ? 'bg-teal-500 text-white'
                          : isPrayed
                          ? 'bg-teal-50 text-teal-600 border border-teal-200'
                          : 'bg-gray-50 text-gray-300 border border-gray-100'
                      }`}
                    >
                      <Users size={12} />
                      Jamaat
                    </button>
                    <button
                      onClick={() => updatePrayer(key, 'onTime')}
                      disabled={!isPrayed}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        status.onTime
                          ? 'bg-amber-500 text-white'
                          : isPrayed
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-gray-50 text-gray-300 border border-gray-100'
                      }`}
                    >
                      <Clock size={12} />
                      On Time
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Encouragement */}
      {prayedCount === 5 && (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-5 text-center text-white shadow-lg">
          <p className="text-lg font-bold">Alhamdulillah! All 5 prayers complete today.</p>
          <p className="text-sm text-emerald-50 mt-1">May Allah accept your prayers.</p>
        </div>
      )}
      {prayedCount > 0 && prayedCount < 5 && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-center">
          <p className="text-sm text-amber-700 font-medium">
            {5 - prayedCount} prayer{5 - prayedCount > 1 ? 's' : ''} remaining today. Keep going!
          </p>
        </div>
      )}
    </div>
  );
}
