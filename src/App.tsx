/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewMode, UserStats } from './types';
import { Navbar } from './components/Navbar';
import { LessonView } from './components/LessonView';
import { SimulatorView } from './components/SimulatorView';
import { MemoryVisualizerView } from './components/MemoryVisualizerView';
import { ChaosLabView } from './components/ChaosLabView';
import { ChallengesView } from './components/ChallengesView';
import { JokesView } from './components/JokesView';
import { CheatSheetModal } from './components/CheatSheetModal';
import { sound } from './utils/soundEffects';
import { Heart, WifiOff, Terminal, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'cpp_uzbek_user_stats_v1';

const INITIAL_STATS: UserStats = {
  xp: 0,
  level: 'Choynak',
  completedLessons: [],
  solvedChallenges: [],
  unlockedChaos: [],
  soundEnabled: true,
};

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('lessons');
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return INITIAL_STATS;
  });

  const [simulatorCode, setSimulatorCode] = useState<string>('');
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState<boolean>(false);

  // Sync stats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {}
  }, [stats]);

  // Sync sound manager
  useEffect(() => {
    sound.enabled = stats.soundEnabled;
  }, [stats.soundEnabled]);

  const handleUpdateStats = (newStats: Partial<UserStats>) => {
    setStats((prev) => ({ ...prev, ...newStats }));
  };

  const handleToggleSound = () => {
    const nextSound = !stats.soundEnabled;
    handleUpdateStats({ soundEnabled: nextSound });
    sound.enabled = nextSound;
    if (nextSound) sound.playClick();
  };

  const handleOpenInSimulator = (code: string) => {
    setSimulatorCode(code);
    setCurrentView('simulator');
    sound.playClick();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onSelectView={(view) => setCurrentView(view)}
        stats={stats}
        onToggleSound={handleToggleSound}
        onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
      />

      {/* Main View Display */}
      <main className="flex-1">
        {currentView === 'lessons' && (
          <LessonView
            stats={stats}
            onUpdateStats={handleUpdateStats}
            onOpenInSimulator={handleOpenInSimulator}
          />
        )}

        {currentView === 'simulator' && (
          <SimulatorView
            initialCode={simulatorCode || undefined}
            onSelectUnexpected={(sitId) => {
              setCurrentView('chaos');
            }}
          />
        )}

        {currentView === 'memory' && (
          <MemoryVisualizerView />
        )}

        {currentView === 'chaos' && (
          <ChaosLabView
            onOpenInSimulator={handleOpenInSimulator}
          />
        )}

        {currentView === 'challenges' && (
          <ChallengesView
            stats={stats}
            onUpdateStats={handleUpdateStats}
          />
        )}

        {currentView === 'jokes' && (
          <JokesView />
        )}
      </main>

      {/* Quick Cheat Sheet Modal */}
      <CheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-cyan-400">C++ Uzbekcha</span>
            <span>— O'zbek tilida C++ dasturlash tilini 0 dan interaktiv o'rganish.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
              <WifiOff className="w-3 h-3" />
              To'liq Offline rejim
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span>Bjarne Stroustrup merosi 🚀</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
