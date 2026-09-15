import React, { useState } from 'react';
import { 
  Skull, 
  Flame, 
  Trash2, 
  Ghost, 
  AlertTriangle, 
  Bug, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  Terminal, 
  Zap,
  HelpCircle
} from 'lucide-react';
import { UnexpectedSituation } from '../types';
import { UNEXPECTED_SITUATIONS } from '../data/unexpectedSituations';
import { sound } from '../utils/soundEffects';

interface ChaosLabViewProps {
  onOpenInSimulator: (code: string) => void;
}

export const ChaosLabView: React.FC<ChaosLabViewProps> = ({ onOpenInSimulator }) => {
  const [selectedId, setSelectedId] = useState<string>(UNEXPECTED_SITUATIONS[0].id);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [cpuTemp, setCpuTemp] = useState<number>(45);
  const [screenEffect, setScreenEffect] = useState<'shake' | 'fire' | 'garbage' | 'ghost' | 'compiler' | null>(null);

  const current = UNEXPECTED_SITUATIONS.find(s => s.id === selectedId) || UNEXPECTED_SITUATIONS[0];

  const getIcon = (name: string) => {
    switch (name) {
      case 'Skull': return <Skull className="w-5 h-5 text-rose-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-amber-400" />;
      case 'Trash2': return <Trash2 className="w-5 h-5 text-emerald-400" />;
      case 'Ghost': return <Ghost className="w-5 h-5 text-purple-400" />;
      case 'AlertTriangle': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default: return <Bug className="w-5 h-5 text-cyan-400" />;
    }
  };

  const handleSimulate = () => {
    sound.playClick();
    setIsSimulating(true);

    if (current.id === 'segfault') {
      sound.playChaosExplosion();
      setScreenEffect('shake');
      setTimeout(() => {
        setIsSimulating(false);
        setScreenEffect(null);
      }, 3500);
    } else if (current.id === 'infinite-loop') {
      sound.playAlarm();
      setScreenEffect('fire');
      setCpuTemp(99);
      setTimeout(() => {
        setIsSimulating(false);
        setScreenEffect(null);
        setCpuTemp(48);
      }, 4500);
    } else if (current.id === 'semicolon-rage') {
      sound.playError();
      setScreenEffect('compiler');
      setTimeout(() => {
        setIsSimulating(false);
        setScreenEffect(null);
      }, 3500);
    } else if (current.id === 'dangling-pointer') {
      sound.playAlarm();
      setScreenEffect('ghost');
      setTimeout(() => {
        setIsSimulating(false);
        setScreenEffect(null);
      }, 3500);
    } else {
      sound.playError();
      setScreenEffect('garbage');
      setTimeout(() => {
        setIsSimulating(false);
        setScreenEffect(null);
      }, 3000);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 ${screenEffect === 'shake' ? 'animate-shake' : ''}`}>
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/60 border border-rose-800/60 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              C++ Dahshatlari &amp; Sirlari
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
            Kutilmagan Vaziyatlar Laboratoriyasi (Chaos Lab)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            C++ dasturchilarining 99% ini kechalari uxlatmaydigan eng dahshatli, kulguli va xavfli xatoliklarni xavfsiz laboratoriyada sinab ko'ring!
          </p>
        </div>
      </div>

      {/* Grid: Situation List & Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Situation Cards */}
        <div className="lg:col-span-4 space-y-2.5">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Vaziyatni tanlang ({UNEXPECTED_SITUATIONS.length} ta):
          </h2>

          <div className="space-y-2">
            {UNEXPECTED_SITUATIONS.map((sit) => {
              const isSelected = sit.id === current.id;
              return (
                <button
                  key={sit.id}
                  id={`sit-card-${sit.id}`}
                  onClick={() => {
                    sound.playClick();
                    setSelectedId(sit.id);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500/50 shadow-md text-slate-100'
                      : 'bg-slate-900 border-slate-800 hover:bg-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 mt-0.5 shrink-0">
                    {getIcon(sit.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs truncate">{sit.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        sit.dangerLevel === 'Dahshatli' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        sit.dangerLevel === 'Apokalipsis' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {sit.dangerLevel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {sit.uzbekName}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Sandbox View */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl space-y-5">
            
            {/* Header info */}
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-cyan-400 font-mono">
                    {current.title}
                  </span>
                </div>
                <span className="text-xs text-rose-400 font-bold bg-rose-950/60 border border-rose-800 px-2.5 py-0.5 rounded-full">
                  Xavflilik: {current.dangerLevel}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-1">
                {current.uzbekName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {current.description}
              </p>
            </div>

            {/* Code Sample */}
            <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
              <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-cyan-400">falokat_kodi.cpp</span>
                <span className="text-rose-400 flex items-center gap-1 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" /> Ehtiyot bo'ling
                </span>
              </div>
              <pre className="p-4 font-mono text-xs sm:text-sm text-rose-200 overflow-x-auto leading-relaxed">
                <code>{current.sampleCode}</code>
              </pre>
            </div>

            {/* Simulate Action Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                id="btn-simulate-disaster"
                onClick={handleSimulate}
                disabled={isSimulating}
                className="w-full sm:w-auto flex-1 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold py-3 px-5 rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{isSimulating ? 'Falokat ro\'y bermoqda...' : 'Vaziyatni Boshlash (Simulate Disaster)'}</span>
              </button>

              <button
                id="btn-open-chaos-sim"
                onClick={() => {
                  sound.playClick();
                  onOpenInSimulator(current.sampleCode);
                }}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-xl border border-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5 text-xs sm:text-sm"
              >
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Simulyatorda Ishlatish</span>
              </button>
            </div>

            {/* Interactive Simulation Screen Effects Display */}
            {isSimulating && (
              <div className="p-5 rounded-xl border border-rose-500/80 bg-slate-950 space-y-3">
                {screenEffect === 'shake' && (
                  <div className="space-y-2 text-center py-4">
                    <div className="text-4xl animate-bounce">💥</div>
                    <h4 className="font-mono font-bold text-rose-400 text-lg">
                      Segmentation fault (core dumped)
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      Signal: SIGSEGV (11), Address: 0x00000000. Operatsion tizim dasturni qatl qildi!
                    </p>
                  </div>
                )}

                {screenEffect === 'fire' && (
                  <div className="space-y-3 text-center py-2">
                    <div className="flex items-center justify-center gap-2 text-amber-400">
                      <Flame className="w-6 h-6 animate-pulse" />
                      <span className="font-mono font-bold text-lg">CPU Harorati: {cpuTemp}°C</span>
                      <Flame className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 h-full w-[95%] animate-pulse" />
                    </div>
                    <p className="text-xs text-amber-300 font-mono">
                      🔥 Ventilyator: 7200 RPM! Protsessor 100% yuklanmoqda... Favqulodda to'xtatildi!
                    </p>
                  </div>
                )}

                {screenEffect === 'compiler' && (
                  <div className="bg-slate-950 p-3 rounded font-mono text-[11px] text-rose-400 space-y-1 overflow-x-auto max-h-40">
                    <p>main.cpp:5:5: error: expected ';' before 'int'</p>
                    <p>main.cpp:6:10: error: 'b' was not declared in this scope</p>
                    <p>{"main.cpp:7:1: error: expected '}' at end of input"}</p>
                    <p>compilation terminated due to -Wfatal-errors (54 warnings generated).</p>
                    <p className="text-yellow-400">g++: "Nuqta-vergulni qo'yish shunchalik qiyinmidi?!"</p>
                  </div>
                )}

                {screenEffect === 'ghost' && (
                  <div className="text-center py-4 space-y-2">
                    <div className="text-4xl animate-pulse">👻</div>
                    <h4 className="font-mono font-bold text-purple-400 text-base">
                      Arvoh Xotira Murojaati (Undefined Behavior)
                    </h4>
                    <p className="text-xs text-purple-200">
                      Siz `delete` qilingan xotiradan ma'lumot qidiryapsiz. U yerda endi sharpalar yashaydi!
                    </p>
                  </div>
                )}

                {screenEffect === 'garbage' && (
                  <div className="text-center py-4 space-y-2">
                    <h4 className="font-mono font-bold text-emerald-400 text-lg">
                      Axlat Qiymat: -858993460 (0xCCCCCCCC)
                    </h4>
                    <p className="text-xs text-slate-300">
                      Massiv chegarasidan chiqib ketdingiz! Bu son sizniki emas, qo'shni dastur qoldirgan axlat!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Explanation Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Nima yuz berdi?
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {current.whatHappened}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Qanday tuzatish kerak?
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {current.howToFix}
                </p>
              </div>
            </div>

            {/* Funny Quote */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-800/50 text-amber-200 text-xs sm:text-sm italic">
              <strong>Dasturchi donoligi: </strong>
              {current.funnyQuote}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
