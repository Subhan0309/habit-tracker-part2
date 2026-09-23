import { Clock, Sparkles, Hand, BarChart3, Moon, ScrollText, BookOpen } from 'lucide-react';
import type { AppData, TabKey } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { todayKey, getEmptyPrayerStatus, formatDate } from './data';
import PrayerTracker from './components/PrayerTracker';
import SunnahTracker from './components/SunnahTracker';
import NawafilTracker from './components/NawafilTracker';
import ChallaReport from './components/ChallaReport';
import DailyRoutine from './components/DailyRoutine';
import StatsView from './components/StatsView';

const EMPTY_DATA: AppData = {
  prayers: {},
  sunnahs: {},
  nawafil: {},
  dhikr: {},
  challa: {},
  routine: {},
};

const TABS: { key: TabKey; label: string; icon: typeof Clock }[] = [
  { key: 'prayers', label: 'Prayers', icon: Clock },
  { key: 'sunnahs', label: 'Sunnahs', icon: Sparkles },
  { key: 'nawafil', label: 'Nawafil', icon: Hand },
  { key: 'routine', label: 'Routine', icon: BookOpen },
  { key: 'challa', label: 'Challa', icon: ScrollText },
  { key: 'stats', label: 'Stats', icon: BarChart3 },
];

function App() {
  const [data, setData] = useLocalStorage<AppData>('islamic-tracker-data', EMPTY_DATA);
  const [activeTab, setActiveTab] = useLocalStorage<TabKey>('islamic-tracker-tab', 'prayers');

  const today = todayKey();
  const todayDate = new Date();

  // Migrate older saved data that predates challa / routine fields
  if (data.challa === undefined || data.routine === undefined) {
    setData((prev) => ({
      ...prev,
      challa: prev.challa ?? {},
      routine: prev.routine ?? {},
    }));
  }

  // Ensure today's prayer entry exists
  if (!data.prayers[today]) {
    setData((prev) => ({
      ...prev,
      prayers: { ...prev.prayers, [today]: getEmptyPrayerStatus() },
    }));
  }

  const setPrayers = (val: typeof data.prayers | ((prev: typeof data.prayers) => typeof data.prayers)) => {
    setData((prev) => ({
      ...prev,
      prayers: typeof val === 'function' ? val(prev.prayers) : val,
    }));
  };

  const setSunnahs = (val: typeof data.sunnahs | ((prev: typeof data.sunnahs) => typeof data.sunnahs)) => {
    setData((prev) => ({
      ...prev,
      sunnahs: typeof val === 'function' ? val(prev.sunnahs) : val,
    }));
  };

  const setNawafil = (val: typeof data.nawafil | ((prev: typeof data.nawafil) => typeof data.nawafil)) => {
    setData((prev) => ({
      ...prev,
      nawafil: typeof val === 'function' ? val(prev.nawafil) : val,
    }));
  };

  const setChalla = (val: NonNullable<AppData['challa']> | ((prev: NonNullable<AppData['challa']>) => NonNullable<AppData['challa']>)) => {
    setData((prev) => {
      const current = prev.challa ?? {};
      const next = typeof val === 'function' ? val(current) : val;
      if (next === current) return prev;
      return { ...prev, challa: next };
    });
  };

  const setRoutine = (val: NonNullable<AppData['routine']> | ((prev: NonNullable<AppData['routine']>) => NonNullable<AppData['routine']>)) => {
    setData((prev) => {
      const current = prev.routine ?? {};
      const next = typeof val === 'function' ? val(current) : val;
      if (next === current) return prev;
      return { ...prev, routine: next };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-gray-50 to-gray-100">
      {/* Decorative top pattern */}
      <div className="fixed top-0 left-0 right-0 h-48 bg-gradient-to-b from-emerald-100/40 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="relative pt-6 pb-4 px-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
              <Moon size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">Sunnah Tracker</h1>
              <p className="text-xs text-gray-400">{formatDate(todayDate)}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative max-w-2xl mx-auto px-4 pb-28">
        {activeTab === 'prayers' && <PrayerTracker prayers={data.prayers} setPrayers={setPrayers} />}
        {activeTab === 'sunnahs' && <SunnahTracker sunnahs={data.sunnahs} setSunnahs={setSunnahs} />}
        {activeTab === 'nawafil' && <NawafilTracker nawafil={data.nawafil} setNawafil={setNawafil} />}
        {activeTab === 'routine' && (
          <DailyRoutine routine={data.routine ?? {}} setRoutine={setRoutine} />
        )}
        {activeTab === 'challa' && <ChallaReport challa={data.challa ?? {}} setChalla={setChalla} />}
        {activeTab === 'stats' && (
          <StatsView data={{ ...data, challa: data.challa ?? {}, routine: data.routine ?? {} }} />
        )}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-2xl mx-auto px-2 pb-4">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center justify-around p-1 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex flex-col items-center gap-0.5 px-1.5 sm:px-2.5 py-2 rounded-xl transition-all duration-300 min-w-0 flex-1 ${
                    active ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 'text-gray-400'
                  }`}
                >
                  <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                  <span className="text-[9px] sm:text-[10px] font-medium truncate max-w-full">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default App;
