import React, { useState } from 'react';
import { 
  Cpu, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Sparkles, 
  HelpCircle, 
  Zap, 
  AlertOctagon,
  RefreshCw
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface VisualMemoryItem {
  id: string;
  name: string;
  type: 'int' | 'double' | 'char' | 'pointer';
  address: string;
  value: any;
  pointsToAddress?: string;
  bytes: number;
}

export const MemoryVisualizerView: React.FC = () => {
  const [items, setItems] = useState<VisualMemoryItem[]>([
    { id: '1', name: 'yosh', type: 'int', address: '0x7ffd1000', value: 20, bytes: 4 },
    { id: '2', name: 'baho', type: 'char', address: '0x7ffd1004', value: 'A', bytes: 1 },
    { id: '3', name: 'ptr', type: 'pointer', address: '0x7ffd1008', value: '0x7ffd1000', pointsToAddress: '0x7ffd1000', bytes: 8 },
  ]);

  const [newVarName, setNewVarName] = useState('x');
  const [newVarType, setNewVarType] = useState<'int' | 'double' | 'char' | 'pointer'>('int');
  const [newVarValue, setNewVarValue] = useState('100');
  const [targetVarName, setTargetVarName] = useState('yosh');
  const [derefValue, setDerefValue] = useState('999');

  const handleAddVariable = () => {
    sound.playClick();
    const nextHex = (0x7ffd1000 + items.length * 8).toString(16);
    const newAddress = `0x${nextHex}`;

    if (newVarType === 'pointer') {
      const target = items.find(i => i.name === targetVarName);
      const targetAddr = target ? target.address : '0x00000000';
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          name: newVarName || 'p',
          type: 'pointer',
          address: newAddress,
          value: targetAddr,
          pointsToAddress: targetAddr,
          bytes: 8
        }
      ]);
    } else {
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          name: newVarName || 'var',
          type: newVarType,
          address: newAddress,
          value: newVarType === 'int' ? parseInt(newVarValue, 10) || 0 : newVarValue,
          bytes: newVarType === 'double' ? 8 : newVarType === 'char' ? 1 : 4
        }
      ]);
    }
    sound.playSuccess();
  };

  const handleModifyDeref = (ptrItem: VisualMemoryItem) => {
    if (!ptrItem.pointsToAddress) return;
    sound.playClick();
    setItems(items.map(item => {
      if (item.address === ptrItem.pointsToAddress) {
        return {
          ...item,
          value: item.type === 'int' ? parseInt(derefValue, 10) || 999 : derefValue
        };
      }
      return item;
    }));
    sound.playSuccess();
  };

  const handleClear = () => {
    sound.playClick();
    setItems([
      { id: '1', name: 'son', type: 'int', address: '0x7ffd1000', value: 42, bytes: 4 },
      { id: '2', name: 'ptr', type: 'pointer', address: '0x7ffd1008', value: '0x7ffd1000', pointsToAddress: '0x7ffd1000', bytes: 8 },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-800">
                RAM & Pointers Simulyatori
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
              Operativ Xotira (RAM) va Ko'rsatkichlar Qanday Ishlaydi?
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              C++ da o'zgaruvchi yaratganda kompyuterning RAM xotirasidan unikal 16-lik (Hex) manzil ajratiladi. 
              <strong> Pointer (*)</strong> esa qiymatni emas, aynan boshqa o'zgaruvchining manzilini saqlaydi!
            </p>
          </div>

          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Xotirani Qayta Tiklash</span>
          </button>
        </div>
      </div>

      {/* Interactive visual canvas and controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: RAM Visual Representation */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Kompyuterning RAM Xotira Xujayralari
            </h3>
            <span className="text-xs text-slate-400 font-mono">Xotira turi: Stack</span>
          </div>

          {/* RAM Cells Grid */}
          <div className="space-y-3">
            {items.map((item) => {
              const isPointer = item.type === 'pointer';
              const targetItem = items.find(i => i.address === item.pointsToAddress);

              return (
                <div 
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isPointer
                      ? 'bg-gradient-to-r from-indigo-950/40 to-slate-900 border-indigo-500/50 shadow-md shadow-indigo-950/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Left details */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-cyan-400">
                        {item.type === 'pointer' ? '*' : item.type === 'char' ? '\'' : '#' }
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100 text-sm font-mono">{item.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                            {item.type} ({item.bytes} bayt)
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          Xotira manzili: <span className="text-amber-400 font-bold">{item.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Value & Pointer Link */}
                    <div className="flex items-center gap-4">
                      {isPointer ? (
                        <div className="flex items-center gap-2 bg-indigo-950/80 border border-indigo-700/60 px-3 py-1.5 rounded-lg">
                          <span className="text-xs text-indigo-300">Ko'rsatkich:</span>
                          <ArrowRight className="w-4 h-4 text-indigo-400 animate-pulse" />
                          <span className="font-mono font-bold text-amber-300 text-xs sm:text-sm">
                            {targetItem ? `${targetItem.name} (${targetItem.address})` : item.value}
                          </span>
                        </div>
                      ) : (
                        <div className="bg-slate-900 border border-slate-700 px-4 py-1.5 rounded-lg text-right">
                          <span className="text-[10px] text-slate-400 block">Qiymat</span>
                          <span className="font-mono font-bold text-emerald-400 text-sm sm:text-base">
                            {String(item.value)}
                          </span>
                        </div>
                      )}

                      {/* Dereference action button if it's a pointer */}
                      {isPointer && targetItem && (
                        <button
                          onClick={() => handleModifyDeref(item)}
                          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 shadow"
                          title="*ptr orqali qiymatni o'zgartirish"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>*ptr = {derefValue}</span>
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Educational Visual Explanation */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Xotira Qonuniyati:
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li><strong>&belgisi (Address-of):</strong> O'zgaruvchining xotiradagi manzilini qaytaradi (masalan, <code>&yosh</code>).</li>
              <li><strong>*belgisi (Dereference):</strong> Pointer turgan manzilning ichiga kirib, u yerdagi qiymatni o'qiydi yoki o'zgartiradi (masalan, <code>*ptr = 500</code>).</li>
              <li>Agar pointer orqali qiymatni o'zgartirsangiz, haqiqiy o'zgaruvchi ham o'zgaradi!</li>
            </ul>
          </div>
        </div>

        {/* Right: Variable Creator & Experiment controls */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Create new variable card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              Yangi O'zgaruvchi Yaratish
            </h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">O'zgaruvchi turi:</label>
              <select
                value={newVarType}
                onChange={(e: any) => setNewVarType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
              >
                <option value="int">int (Butun son - 4 bayt)</option>
                <option value="double">double (Haqiqiy son - 8 bayt)</option>
                <option value="char">char (Belgi - 1 bayt)</option>
                <option value="pointer">int* (Pointer - 8 bayt)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Nomi:</label>
              <input
                type="text"
                value={newVarName}
                onChange={(e) => setNewVarName(e.target.value)}
                placeholder="masalan: narx"
                className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 font-mono focus:outline-none focus:border-cyan-500"
              >
              </input>
            </div>

            {newVarType === 'pointer' ? (
              <div>
                <label className="text-xs text-slate-400 block mb-1">Qaysi o'zgaruvchini ko'rsatsin (&amp;manzil):</label>
                <select
                  value={targetVarName}
                  onChange={(e) => setTargetVarName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  {items.filter(i => i.type !== 'pointer').map(i => (
                    <option key={i.id} value={i.name}>
                      &amp;{i.name} ({i.address})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="text-xs text-slate-400 block mb-1">Boshlang'ich qiymati:</label>
                <input
                  type="text"
                  value={newVarValue}
                  onChange={(e) => setNewVarValue(e.target.value)}
                  placeholder="masalan: 25"
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

            <button
              onClick={handleAddVariable}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-2 rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Xotiradan Joy Ajratish</span>
            </button>
          </div>

          {/* Pointer Dereference customizer */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Pointer Orqali Qiymatni Yangilash
            </h4>
            <p className="text-xs text-slate-400">
              Pointer xotirani bevosita boshqaradi. Yangi qiymat kiriting va yuqoridagi <strong>*ptr = ...</strong> tugmasini bosing:
            </p>
            <input
              type="text"
              value={derefValue}
              onChange={(e) => setDerefValue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Warning card */}
          <div className="bg-rose-950/30 border border-rose-800/60 rounded-xl p-4 text-xs text-rose-200 flex items-start gap-2.5">
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-rose-300 block mb-0.5">Xotirani Tozalash (delete):</strong>
              Agar C++ da yangi xotira ajratsangiz (masalan <code>new int</code>), ishlatib bo'lgach albatta <code>delete</code> qilishingiz shart. Aks holda RAM to'lib ketadi (Memory Leak)!
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
