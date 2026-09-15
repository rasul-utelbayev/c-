import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Lightbulb, 
  AlertTriangle, 
  Smile, 
  Copy, 
  Check, 
  Terminal,
  Sparkles
} from 'lucide-react';
import { Lesson, UserStats } from '../types';
import { LESSONS } from '../data/lessons';
import { sound } from '../utils/soundEffects';

interface LessonViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  onOpenInSimulator: (code: string) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  stats,
  onUpdateStats,
  onOpenInSimulator
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(LESSONS[0].id);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const currentLesson = LESSONS.find(l => l.id === selectedLessonId) || LESSONS[0];
  const currentIndex = LESSONS.findIndex(l => l.id === selectedLessonId);

  const isCompleted = stats.completedLessons.includes(currentLesson.id);

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    sound.playClick();
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSelectLesson = (id: string) => {
    sound.playClick();
    setSelectedLessonId(id);
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleQuizSubmit = () => {
    if (quizAnswer === null) return;
    setQuizSubmitted(true);
    if (quizAnswer === currentLesson.content.quiz.correctIndex) {
      sound.playSuccess();
      if (!isCompleted) {
        const updated = [...stats.completedLessons, currentLesson.id];
        onUpdateStats({
          completedLessons: updated,
          xp: stats.xp + 40,
        });
      }
    } else {
      sound.playError();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left sidebar: Course Syllabus */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-100 text-sm tracking-wide uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                C++ O'quv Rejasi (0 dan)
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {stats.completedLessons.length}/{LESSONS.length} tugatildi
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(stats.completedLessons.length / LESSONS.length) * 100}%` }}
              />
            </div>

            {/* Lesson list */}
            <div className="space-y-1.5">
              {LESSONS.map((lesson, idx) => {
                const isActive = lesson.id === currentLesson.id;
                const done = stats.completedLessons.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    id={`lesson-item-${lesson.id}`}
                    onClick={() => handleSelectLesson(lesson.id)}
                    className={`w-full text-left p-3 rounded-lg border transition flex items-start gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-100'
                        : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="mt-0.5">
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-mono ${
                          isActive ? 'border-cyan-400 text-cyan-400' : 'border-slate-600 text-slate-500'
                        }`}>
                          {idx}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold truncate">{lesson.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{lesson.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Offline reminder box */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 flex items-start gap-2.5">
            <span className="text-lg">💡</span>
            <p>
              Ushbu o'quv qo'llanma va simulyator <strong>to'liq offline</strong> ishlaydi. Istalgan vaqtda internet bo'lmasa ham C++ ni mashq qilishingiz mumkin!
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-7 shadow-sm">
            
            {/* Header info */}
            <div className="border-b border-slate-800 pb-5 mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-cyan-950 text-cyan-400 border border-cyan-800/80 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {currentLesson.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ⏱️ {currentLesson.duration}
                </span>
                {isCompleted && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> O'zlashtirildi (+40 XP)
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                {currentLesson.title}
              </h1>
              <p className="text-slate-300 mt-2 text-sm sm:text-base leading-relaxed">
                {currentLesson.content.intro}
              </p>
            </div>

            {/* Lesson Sections */}
            <div className="space-y-6">
              {currentLesson.content.sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-lg font-bold text-cyan-300">
                    {section.heading}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {section.text}
                  </p>

                  {/* Code Example block */}
                  {section.codeExample && (
                    <div className="relative my-3 rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/60 border-b border-slate-800 text-xs text-slate-400">
                        <span className="font-mono text-cyan-400">main.cpp</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(section.codeExample!, idx)}
                            className="flex items-center gap-1 hover:text-slate-200 transition cursor-pointer"
                          >
                            {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedIndex === idx ? 'Nusxalandi' : 'Nusxa olish'}</span>
                          </button>
                          <button
                            onClick={() => {
                              sound.playClick();
                              onOpenInSimulator(section.codeExample!);
                            }}
                            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition cursor-pointer bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60"
                          >
                            <Terminal className="w-3.5 h-3.5" />
                            <span>Simulyatorda Sinash</span>
                          </button>
                        </div>
                      </div>
                      <pre className="p-4 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
                        <code>{section.codeExample}</code>
                      </pre>
                    </div>
                  )}

                  {/* Explanation */}
                  {section.explanation && (
                    <p className="text-xs sm:text-sm text-slate-400 italic">
                      {section.explanation}
                    </p>
                  )}

                  {/* Analogy Box */}
                  {section.analogy && (
                    <div className="p-3.5 rounded-lg bg-indigo-950/40 border border-indigo-800/60 text-indigo-200 text-xs sm:text-sm flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-indigo-300 block mb-0.5">Hayotiy o'xshatish:</strong>
                        <span>{section.analogy}</span>
                      </div>
                    </div>
                  )}

                  {/* Warning Box */}
                  {section.warning && (
                    <div className="p-3.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs sm:text-sm flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-300 block mb-0.5">Ehtiyot bo'ling (Tuzoq):</strong>
                        <span>{section.warning}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Humor Tip */}
              {currentLesson.content.humorTip && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-800/50 text-emerald-200 text-xs sm:text-sm flex items-start gap-3">
                  <Smile className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-300 block mb-0.5 font-semibold">C++ Dasturchi Kuladi:</strong>
                    <p className="italic">{currentLesson.content.humorTip}</p>
                  </div>
                </div>
              )}

              {/* Practice Code CTA */}
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">Amaliyot vaqti keldi!</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Ushbu darsning amaliy kodini C++ simulyatorimizda sinab ko'ring.</p>
                </div>
                <button
                  id="lesson-run-simulator-btn"
                  onClick={() => {
                    sound.playClick();
                    onOpenInSimulator(currentLesson.content.practiceCode);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-4 py-2.5 rounded-lg shadow-md transition cursor-pointer text-xs sm:text-sm"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Simulyatorda Ishga Tushirish
                </button>
              </div>

              {/* Interactive Mini-Quiz */}
              <div className="border-t border-slate-800 pt-6 mt-6">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Bilimingizni Sinang (+40 XP)
                    </span>
                    {quizSubmitted && quizAnswer === currentLesson.content.quiz.correctIndex && (
                      <span className="text-xs text-emerald-400 font-bold">To'g'ri javob! 🎉</span>
                    )}
                  </div>

                  <p className="font-semibold text-slate-100 text-sm sm:text-base mb-4">
                    {currentLesson.content.quiz.question}
                  </p>

                  <div className="space-y-2 mb-4">
                    {currentLesson.content.quiz.options.map((option, optIdx) => {
                      const isSelected = quizAnswer === optIdx;
                      let optionClasses = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80';

                      if (quizSubmitted) {
                        if (optIdx === currentLesson.content.quiz.correctIndex) {
                          optionClasses = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                        } else if (isSelected) {
                          optionClasses = 'bg-rose-950/80 border-rose-500 text-rose-200';
                        }
                      } else if (isSelected) {
                        optionClasses = 'bg-cyan-950/80 border-cyan-400 text-cyan-200';
                      }

                      return (
                        <button
                          key={optIdx}
                          id={`quiz-opt-${optIdx}`}
                          disabled={quizSubmitted}
                          onClick={() => {
                            sound.playClick();
                            setQuizAnswer(optIdx);
                          }}
                          className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm font-medium transition flex items-center justify-between cursor-pointer ${optionClasses}`}
                        >
                          <span>{option}</span>
                          {quizSubmitted && optIdx === currentLesson.content.quiz.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      id="quiz-submit-btn"
                      disabled={quizAnswer === null}
                      onClick={handleQuizSubmit}
                      className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 rounded-lg text-xs sm:text-sm transition cursor-pointer"
                    >
                      Javobni Tekshirish
                    </button>
                  ) : (
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                      <strong>Izoh:</strong> {currentLesson.content.quiz.explanation}
                    </div>
                  )}
                </div>
              </div>

              {/* Prev / Next navigation */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-5">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => handleSelectLesson(LESSONS[currentIndex - 1].id)}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Oldingi Dars
                </button>

                <button
                  disabled={currentIndex === LESSONS.length - 1}
                  onClick={() => handleSelectLesson(LESSONS[currentIndex + 1].id)}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-cyan-400 hover:text-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Keyingi Dars
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
