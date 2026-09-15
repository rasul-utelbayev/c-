import React from 'react';
import { X, BookOpen, Cpu, AlertTriangle, Code2 } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                C++ Tezkor Qo'llanma (Cheat Sheet)
              </h2>
              <p className="text-xs text-slate-400">Asosiy sintaksis va qoidalar o'zbek tilida</p>
            </div>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300">
          
          {/* Section 1: Types & Memory */}
          <div>
            <h3 className="text-sm font-bold text-cyan-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              1. Ma'lumot Turlari va Xotira Hajmlari
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="text-cyan-300 font-bold block">int</span>
                <span className="text-slate-400 text-xs">4 bayt (butun son)</span>
                <span className="text-[11px] text-slate-500 block mt-1">-2 mlrd ... +2 mlrd</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="text-cyan-300 font-bold block">double / float</span>
                <span className="text-slate-400 text-xs">8 / 4 bayt (o'nlik kasr)</span>
                <span className="text-[11px] text-slate-500 block mt-1">3.14159...</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="text-cyan-300 font-bold block">char</span>
                <span className="text-slate-400 text-xs">1 bayt (yagona belgi)</span>
                <span className="text-[11px] text-slate-500 block mt-1">'A', '9', '#'</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="text-cyan-300 font-bold block">int* (Pointer)</span>
                <span className="text-slate-400 text-xs">8 bayt (RAM manzili)</span>
                <span className="text-[11px] text-slate-500 block mt-1">0x7ffd1000</span>
              </div>
            </div>
          </div>

          {/* Section 2: Input / Output */}
          <div>
            <h3 className="text-sm font-bold text-cyan-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <Code2 className="w-4 h-4" />
              2. Kiritish va Chiqarish (cin &amp; cout)
            </h3>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs space-y-1.5">
              <p><span className="text-purple-400">#include</span> <span className="text-emerald-300">&lt;iostream&gt;</span></p>
              <p><span className="text-blue-400">using namespace</span> std;</p>
              <div className="pt-2 text-slate-300">
                <p><span className="text-slate-500">// Ekranga chiqarish:</span></p>
                <p>cout &lt;&lt; <span className="text-amber-300">"Salom!"</span> &lt;&lt; endl;</p>
                <p><span className="text-slate-500">// Klaviaturadan o'qish:</span></p>
                <p>cin &gt;&gt; yosh;</p>
              </div>
            </div>
          </div>

          {/* Section 3: Pointers & References */}
          <div>
            <h3 className="text-sm font-bold text-indigo-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              3. Ko'rsatkichlar (Pointers) Sehri
            </h3>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs space-y-2">
              <p className="text-slate-300"><span className="text-blue-400">int</span> x = <span className="text-amber-400">10</span>;</p>
              <p className="text-slate-300"><span className="text-blue-400">int</span>* p = &amp;x; <span className="text-slate-500">// p endi x ning xotira manzilini saqlaydi</span></p>
              <p className="text-slate-300">*p = <span className="text-amber-400">25</span>; <span className="text-slate-500">// x ham 25 ga aylanadi!</span></p>
              <p className="text-slate-300">cout &lt;&lt; &amp;x; <span className="text-slate-500">// Hex formatdagi manzil (masalan, 0x7ffd1000)</span></p>
            </div>
          </div>

          {/* Section 4: Golden Rules to avoid bugs */}
          <div>
            <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              4. C++ da 3 Ta Oltin Qoida
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300 text-xs sm:text-sm">
              <li><strong>Har bir qatorda nuqta-vergul (;):</strong> Uni unutsangiz, kompilyator 50 ta xato chiqaradi.</li>
              <li><strong>Solishtirish uchun == ishlating:</strong> <code>if (x = 5)</code> yozmang, aks holda bu xatoni topishga soatlab vaqtingiz ketadi!</li>
              <li><strong>Xotirani delete qiling:</strong> Agar <code>new</code> ishlatsangiz, dastur oxirida <code>delete</code> qilishni unutmang.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
};
