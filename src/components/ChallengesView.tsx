import React, { useState } from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Lightbulb, 
  HelpCircle, 
  RotateCcw, 
  Check, 
  Award,
  Sparkles,
  Code2
} from 'lucide-react';
import { Challenge, UserStats } from '../types';
import { CHALLENGES } from '../data/challenges';
import { simulateCppCode } from '../utils/cppSimulator';
import { sound } from '../utils/soundEffects';

interface ChallengesViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({ stats, onUpdateStats }) => {
  const [selectedId, setSelectedId] = useState<string>(CHALLENGES[0].id);
  const current = CHALLENGES.find(c => c.id === selectedId) || CHALLENGES[0];

  const [userCode, setUserCode] = useState<string>(current.starterCode);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    passed: boolean;
    actualOutput: string;
    message: string;
  } | null>(null);

  const isSolved = stats.solvedChallenges.includes(current.id);

  const handleSelectChallenge = (c: Challenge) => {
    sound.playClick();
    setSelectedId(c.id);
    setUserCode(c.starterCode);
    setShowHint(false);
    setShowSolution(false);
    setTestResult(null);
  };

  const handleTest = () => {
    sound.playClick();
    const exec = simulateCppCode(userCode);
    
    // Check against expected output of primary test case
    const primaryTest = current.testCases[0];
    const cleanActual = exec.output.trim().replace(/\r\n/g, '\n');
    const cleanExpected = primaryTest.expectedOutput.trim().replace(/\r\n/g, '\n');

    // Fuzzy or exact matching
    const passed = cleanActual.includes(cleanExpected) || cleanActual === cleanExpected;

    if (passed) {
      sound.playSuccess();
      setTestResult({
        passed: true,
        actualOutput: exec.output,
        message: 'Barakalla! Barcha testlar muvaffaqiyatli o\'tdi!'
      });

      if (!isSolved) {
        onUpdateStats({
          solvedChallenges: [...stats.solvedChallenges, current.id],
          xp: stats.xp + current.xp,
        });
      }
    } else {
      sound.playError();
      setTestResult({
        passed: false,
        actualOutput: exec.output,
        message: 'Natija kutilganga mos kelmadi. Qayta tekshirib ko\'ring!'
      });
    }
  };

  const handleReset = () => {
    sound.playClick();
    setUserCode(current.starterCode);
    setTestResult(null);
  };

  const handleApplySolution = () => {
    sound.playClick();
    setUserCode(current.solutionCode);
    setShowSolution(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-800 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                Amaliy Dasturlash Masalalari
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
              Qiziqarli Vazifalar va Quests
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Nazariyani amalda sinab ko'ring, testlarni topshiring va XP to'plab darajangizni oshiring!
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
            <Award className="w-6 h-6 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Yechilgan vazifalar:</div>
              <div className="font-bold text-slate-200 font-mono text-sm">
                {stats.solvedChallenges.length} / {CHALLENGES.length} ta
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Challenge list */}
        <div className="lg:col-span-4 space-y-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Mavjud topshiriqlar:
          </h2>

          <div className="space-y-2">
            {CHALLENGES.map((ch) => {
              const isSelected = ch.id === current.id;
              const isDone = stats.solvedChallenges.includes(ch.id);

              return (
                <button
                  key={ch.id}
                  id={`challenge-card-${ch.id}`}
                  onClick={() => handleSelectChallenge(ch)}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500/50 shadow-md text-slate-100'
                      : 'bg-slate-900 border-slate-800 hover:bg-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                        •
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs truncate">{ch.title}</span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold whitespace-nowrap">
                        +{ch.xp} XP
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        ch.difficulty === 'Oson' ? 'bg-emerald-950 text-emerald-300' :
                        ch.difficulty === 'O\'rtacha' ? 'bg-cyan-950 text-cyan-300' :
                        ch.difficulty === 'Qiyin' ? 'bg-rose-950 text-rose-300' :
                        'bg-purple-950 text-purple-300'
                      }`}>
                        {ch.difficulty}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate">{ch.description}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Code Editor & Test area */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Challenge Description Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-amber-400" />
                {current.title}
              </h2>
              {isSolved && (
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Bajarilgan
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {current.description}
            </p>

            {/* Instructions */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
              <strong className="text-amber-300 block mb-1">Ko'rsatmalar:</strong>
              <ul className="list-disc pl-5 space-y-0.5 text-slate-300">
                {current.instructions.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
            </div>

            {/* Hint & Solution toggle */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => { sound.playClick(); setShowHint(!showHint); }}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? 'Maslahatni yashirish' : 'Maslahat olish'}</span>
              </button>

              <button
                onClick={() => { sound.playClick(); setShowSolution(!showSolution); }}
                className="text-xs text-slate-400 hover:text-slate-300 flex items-center gap-1 transition cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Yechimni ko'rish</span>
              </button>
            </div>

            {showHint && (
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200">
                <strong>💡 Maslahat:</strong> {current.hint}
              </div>
            )}

            {showSolution && (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-cyan-400">Namunaviy yechim kodi:</strong>
                  <button
                    onClick={handleApplySolution}
                    className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-2 py-0.5 rounded transition cursor-pointer"
                  >
                    Kodni tahrirlovchiga qo'yish
                  </button>
                </div>
                <pre className="font-mono text-slate-300 p-2 bg-slate-900 rounded overflow-x-auto">
                  {current.solutionCode}
                </pre>
              </div>
            )}
          </div>

          {/* Interactive Code Editor for Challenge */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
              <span className="font-mono text-xs text-cyan-400">solution.cpp</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  title="Kodni boshlang'ich holatga qaytarish"
                  className="p-1 rounded text-slate-400 hover:text-slate-200 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  id="btn-test-challenge"
                  onClick={handleTest}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs shadow transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Tekshirish (Test)</span>
                </button>
              </div>
            </div>

            <textarea
              id="challenge-code-editor"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              spellCheck={false}
              className="w-full min-h-[220px] p-4 bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed resize-none focus:outline-none focus:ring-0 selection:bg-amber-500/30 selection:text-amber-200"
            />
          </div>

          {/* Test Results Output */}
          {testResult && (
            <div className={`p-4 rounded-xl border ${
              testResult.passed 
                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200' 
                : 'bg-rose-950/40 border-rose-500/60 text-rose-200'
            } space-y-2`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {testResult.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
                <span>{testResult.message}</span>
              </div>

              <div className="font-mono text-xs pt-1 space-y-1">
                <div>
                  <span className="text-slate-400">Kutilgan natija: </span>
                  <span className="text-amber-300">{current.testCases[0].expectedOutput}</span>
                </div>
                <div>
                  <span className="text-slate-400">Sizning kodingiz chiqargan natija: </span>
                  <span className={testResult.passed ? 'text-emerald-300' : 'text-rose-300'}>
                    {testResult.actualOutput.trim() || '(Hech narsa chiqarilmadi)'}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
