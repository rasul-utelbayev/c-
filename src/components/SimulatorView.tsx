import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Terminal, 
  Cpu, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Code2, 
  Flame,
  ArrowRight,
  Info
} from 'lucide-react';
import { ExecutionResult } from '../types';
import { simulateCppCode } from '../utils/cppSimulator';
import { sound } from '../utils/soundEffects';

interface SimulatorViewProps {
  initialCode?: string;
  onSelectUnexpected?: (situationId: string) => void;
}

const SAMPLE_CODES = [
  {
    name: '1. Salom Dunyo',
    code: `#include <iostream>
using namespace std;

int main() {
    cout << "Salom, O'zbekiston!" << endl;
    cout << "C++ tilini o'rganish juda qiziq!" << endl;
    return 0;
}`
  },
  {
    name: '2. Yosh va Ma\'lumot (cin)',
    code: `#include <iostream>
using namespace std;

int main() {
    int tugilganYil = 2004;
    int hozirgiYil = 2026;
    int yosh = hozirgiYil - tugilganYil;
    
    cout << "Tug'ilgan yil: " << tugilganYil << endl;
    cout << "Hozirgi yil: " << hozirgiYil << endl;
    cout << "Sizning yoshingiz: " << yosh << " da!" << endl;
    return 0;
}`
  },
  {
    name: '3. Shartlar (if/else)',
    code: `#include <iostream>
using namespace std;

int main() {
    int ball = 88;
    
    if (ball >= 90) {
        cout << "Baho: A'lo (Grand yutdingiz!)" << endl;
    } else if (ball >= 70) {
        cout << "Baho: Yaxshi (Shartnoma)" << endl;
    } else {
        cout << "Baho: Yana tayyorlaning" << endl;
    }
    return 0;
}`
  },
  {
    name: '4. Sikllar (for loop)',
    code: `#include <iostream>
using namespace std;

int main() {
    cout << "--- 7 ning karra jadvali ---" << endl;
    for (int i = 1; i <= 5; i++) {
        cout << "7 * " << i << " = " << 7 * i << endl;
    }
    return 0;
}`
  },
  {
    name: '5. Ko\'rsatkichlar (Pointer)',
    code: `#include <iostream>
using namespace std;

int main() {
    int boylik = 1000;
    int* ptr = &boylik; // ptr boylikning manzilini oladi
    
    cout << "Boshlang'ich boylik: " << boylik << "$" << endl;
    cout << "Xotiradagi manzili: " << ptr << endl;
    
    // Pointer orqali xotiradagi qiymatni o'zgartiramiz:
    *ptr = 5000;
    
    cout << "Pointer orqali yangilandi: " << boylik << "$" << endl;
    return 0;
}`
  },
  {
    name: '6. Massiv (Array)',
    code: `#include <iostream>
using namespace std;

int main() {
    int sonlar[4] = {12, 45, 7, 89};
    
    cout << "0-indeksdagi son: " << sonlar[0] << endl;
    cout << "3-indeksdagi son: " << sonlar[3] << endl;
    
    int yigindi = sonlar[0] + sonlar[1] + sonlar[2] + sonlar[3];
    cout << "Jami yig'indi: " << yigindi << endl;
    return 0;
}`
  },
  {
    name: '💥 SegFault Testi (Xavfli)',
    code: `#include <iostream>
using namespace std;

int main() {
    // Diqqat! Bo'sh xotiraga murojaat:
    int* ptr = nullptr;
    *ptr = 1234; // 💥 Segmentation fault!
    
    cout << "Bu qator ishlamaydi!" << endl;
    return 0;
}`
  },
  {
    name: '🔥 Cheksiz Sikl Testi',
    code: `#include <iostream>
using namespace std;

int main() {
    int x = 1;
    // Cheksiz sikl: to'xtash sharti yo'q!
    while (x > 0) {
        cout << "Qizimoqda... ";
    }
    return 0;
}`
  }
];

export const SimulatorView: React.FC<SimulatorViewProps> = ({ initialCode }) => {
  const [code, setCode] = useState<string>(initialCode || SAMPLE_CODES[0].code);
  const [stdinInput, setStdinInput] = useState<string>('25');
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'console' | 'memory'>('console');

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      handleRun(initialCode);
    } else {
      handleRun(SAMPLE_CODES[0].code);
    }
  }, [initialCode]);

  const handleRun = (codeToRun: string = code) => {
    setIsRunning(true);
    sound.playClick();

    // Small delay to simulate compilation / running feel
    setTimeout(() => {
      const inputs = stdinInput.split(/\s+/).filter(Boolean);
      const res = simulateCppCode(codeToRun, inputs);
      setResult(res);
      setIsRunning(false);

      if (res.isSegFault) {
        sound.playChaosExplosion();
      } else if (res.isInfiniteLoop) {
        sound.playAlarm();
      } else if (res.errors.length > 0) {
        sound.playError();
      } else {
        sound.playSuccess();
      }
    }, 150);
  };

  const handleReset = () => {
    sound.playClick();
    setCode(SAMPLE_CODES[0].code);
    setResult(null);
  };

  const lineNumbers = code.split('\n').map((_, i) => i + 1);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Top bar: Preset selectors */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="font-bold text-slate-100 text-base flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            C++ Interaktiv Kod Simulyatori
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kodni yozing, C++ ning xotira va buyruqlarini brauzerda to'liq offline ishlatib ko'ring!
          </p>
        </div>

        {/* Preset dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">Namuna kodlar:</span>
          <select
            id="code-template-select"
            onChange={(e) => {
              const sample = SAMPLE_CODES.find(s => s.name === e.target.value);
              if (sample) {
                setCode(sample.code);
                handleRun(sample.code);
              }
            }}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer flex-1 md:w-56"
          >
            {SAMPLE_CODES.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor and Terminal grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Code Editor (Col 7) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          
          {/* Editor Header */}
          <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="font-mono text-xs text-slate-400 ml-2">main.cpp</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="reset-code-btn"
                onClick={handleReset}
                title="Qayta tiklash"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                id="run-code-btn"
                onClick={() => handleRun()}
                disabled={isRunning}
                className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs shadow-md transition cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunning ? 'Bajarilmoqda...' : 'Ishga Tushirish (Run)'}</span>
              </button>
            </div>
          </div>

          {/* Editor Body */}
          <div className="relative flex-1 flex bg-slate-950 min-h-[380px] text-xs sm:text-sm font-mono">
            {/* Line numbers */}
            <div className="select-none py-4 px-3 bg-slate-950/80 border-r border-slate-800/80 text-slate-600 text-right font-mono min-w-[40px]">
              {lineNumbers.map((num) => (
                <div key={num} className="leading-6">{num}</div>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              id="cpp-code-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full p-4 bg-transparent text-slate-100 font-mono leading-6 resize-none focus:outline-none focus:ring-0 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-auto whitespace-pre"
              placeholder="// C++ kodingizni bu yerda yozing..."
            />
          </div>

          {/* Optional cin input banner */}
          <div className="bg-slate-950/90 px-4 py-2 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 font-mono flex items-center gap-1">
              <span>cin &gt;&gt;</span> kiritish qiymatlari:
            </span>
            <input
              type="text"
              value={stdinInput}
              onChange={(e) => setStdinInput(e.target.value)}
              placeholder="Masalan: 18 2026"
              className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-slate-200 font-mono text-xs w-48 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Right side: Terminal & Memory inspector (Col 5) */}
        <div className="lg:col-span-5 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          
          {/* Header tabs */}
          <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                id="tab-terminal-btn"
                onClick={() => { sound.playClick(); setActiveTab('console'); }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'console'
                    ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Konsol Chiqishi</span>
              </button>

              <button
                id="tab-memory-btn"
                onClick={() => { sound.playClick(); setActiveTab('memory'); }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'memory'
                    ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Xotira (RAM)</span>
                {result && result.memory.length > 0 && (
                  <span className="bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] px-1.5 rounded-full">
                    {result.memory.length}
                  </span>
                )}
              </button>
            </div>

            {result && (
              <div className="text-[11px] font-mono flex items-center gap-1">
                {result.exitCode === 0 ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> exit: 0
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> exit: {result.exitCode}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Tab 1: Terminal Console */}
          {activeTab === 'console' && (
            <div className={`p-4 flex-1 flex flex-col font-mono text-xs bg-slate-950 text-slate-200 overflow-y-auto min-h-[360px] ${
              result?.isSegFault ? 'animate-shake' : ''
            }`}>
              <div className="text-slate-500 mb-2 select-none">
                $ g++ main.cpp -o dastur && ./dastur
              </div>

              {result ? (
                <div className="space-y-3 flex-1">
                  {/* Standard output */}
                  <pre className="whitespace-pre-wrap font-mono text-emerald-400 leading-relaxed">
                    {result.output}
                  </pre>

                  {/* Errors if any */}
                  {result.errors.length > 0 && (
                    <div className="mt-4 p-3 rounded bg-rose-950/50 border border-rose-800/80 text-rose-200 space-y-1.5">
                      <div className="font-bold flex items-center gap-1.5 text-rose-300">
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                        Xatolik yuz berdi:
                      </div>
                      {result.errors.map((err, idx) => (
                        <p key={idx} className="text-xs text-rose-200">{err}</p>
                      ))}
                    </div>
                  )}

                  {/* Infinite loop warning */}
                  {result.isInfiniteLoop && (
                    <div className="p-3 rounded bg-amber-950/60 border border-amber-800 text-amber-200 flex items-start gap-2">
                      <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <strong>Protsessor qizib ketishi oldi olindi!</strong>
                        <p className="text-[11px] mt-0.5">Sikl sharti doimo to'g'ri bo'lgani sababli dastur cheksiz aylanib ketdi.</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-slate-500 italic mt-6 text-center">
                  "Ishga Tushirish" tugmasini bosing yoki namunaviy kodni tanlang...
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Memory & Variable Inspection */}
          {activeTab === 'memory' && (
            <div className="p-4 flex-1 font-mono text-xs bg-slate-950 text-slate-200 overflow-y-auto min-h-[360px]">
              <div className="flex items-center justify-between mb-3 text-slate-400 pb-2 border-b border-slate-800">
                <span className="font-sans font-semibold text-slate-300">Operativ Xotira (Stack & Variables)</span>
                <span className="text-[10px] text-cyan-400">Avtomatik kuzatuv</span>
              </div>

              {result && result.memory.length > 0 ? (
                <div className="space-y-2">
                  {result.memory.map((cell, idx) => (
                    <div 
                      key={idx} 
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between hover:border-cyan-500/50 transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400 font-bold">{cell.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {cell.type}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Manzil: <span className="text-amber-400">{cell.address}</span> ({cell.bytes} bayt)
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-emerald-400 text-sm">
                          {String(cell.value)}
                        </div>
                        {cell.pointsTo && (
                          <div className="text-[10px] text-indigo-400 flex items-center gap-1 justify-end">
                            <ArrowRight className="w-3 h-3" />
                            <span>ko'rsatmoqda: {cell.pointsTo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-500 text-center py-10 space-y-2">
                  <Cpu className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>Hozircha xotirada faol o'zgaruvchilar yo'q.</p>
                  <p className="text-[11px] text-slate-600">Kodingizda o'zgaruvchi e'lon qilib (masalan: <code>int a = 50;</code>) qayta ishga tushiring.</p>
                </div>
              )}
            </div>
          )}

          {/* Quick tips footer */}
          <div className="bg-slate-950/80 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Har bir qatordan so'ng <strong>;</strong> qo'yishni unutmang!</span>
            </span>
            <span className="text-slate-500 hidden sm:inline">C++ 20 Standart</span>
          </div>

        </div>

      </div>
    </div>
  );
};
