import React from 'react';
import { 
  BookOpen, 
  Terminal, 
  Cpu, 
  Skull, 
  Trophy, 
  Smile, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  WifiOff, 
  Flame 
} from 'lucide-react';
import { ViewMode, UserStats } from '../types';
import { sound } from '../utils/soundEffects';

interface NavbarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  stats: UserStats;
  onToggleSound: () => void;
  onOpenCheatSheet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  stats,
  onToggleSound,
  onOpenCheatSheet
}) => {
  const getLevelTitle = (xp: number) => {
    if (xp >= 500) return 'C++ Gurusi 👑';
    if (xp >= 300) return 'Pointer Afsungari 🧙‍♂️';
    if (xp >= 150) return 'Junior Kodchi 💻';
    return 'Choynak (Boshlovchi) ☕';
  };

  const navItems: { mode: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { mode: 'lessons', label: '0 dan Darslar', icon: <BookOpen className="w-4 h-4" /> },
    { mode: 'simulator', label: 'Kod Simulyatori', icon: <Terminal className="w-4 h-4" /> },
    { mode: 'memory', label: 'Xotira & Pointer', icon: <Cpu className="w-4 h-4" /> },
    { mode: 'chaos', label: 'Kutilmagan Vaziyatlar', icon: <Skull className="w-4 h-4 text-rose-400" />, badge: 'Xavfli' },
    { mode: 'challenges', label: 'Vazifalar & Quests', icon: <Trophy className="w-4 h-4 text-amber-400" /> },
    { mode: 'jokes', label: 'Dasturchi Hazillari', icon: <Smile className="w-4 h-4 text-emerald-400" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Offline badge */}
          <div className="flex items-center gap-3">
            <button 
              id="nav-brand-btn"
              onClick={() => { sound.playClick(); onSelectView('lessons'); }}
              className="flex items-center gap-2.5 text-left group transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center font-mono font-bold text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition">
                C++
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100 text-base sm:text-lg tracking-tight group-hover:text-cyan-400 transition">
                    C++ Uzbekcha
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                    <WifiOff className="w-3 h-3" />
                    100% Offline
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">0 dan o'rganish & C++ simulyatori</p>
              </div>
            </button>
          </div>

          {/* XP and Level info */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-lg shadow-inner">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Flame className="w-4 h-4 fill-amber-400/20" />
                <span className="font-mono font-bold text-sm">{stats.xp}</span>
                <span className="text-xs text-slate-400 font-medium">XP</span>
              </div>
              <div className="h-4 w-px bg-slate-700 hidden sm:block" />
              <span className="text-xs font-semibold text-slate-300 hidden sm:block">
                {getLevelTitle(stats.xp)}
              </span>
            </div>

            {/* Quick cheat sheet */}
            <button
              id="cheat-sheet-btn"
              onClick={() => { sound.playClick(); onOpenCheatSheet(); }}
              title="C++ Tezkor Qo'llanma"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline">Qo'llanma</span>
            </button>

            {/* Sound toggle */}
            <button
              id="sound-toggle-btn"
              onClick={onToggleSound}
              title={stats.soundEnabled ? "Ovozni o'chirish" : "Ovozni yoqish"}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              {stats.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
          {navItems.map((item) => {
            const isActive = currentView === item.mode;
            return (
              <button
                key={item.mode}
                id={`tab-${item.mode}`}
                onClick={() => {
                  sound.playClick();
                  onSelectView(item.mode);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
