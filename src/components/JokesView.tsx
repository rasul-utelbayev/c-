import React, { useState } from 'react';
import { 
  Smile, 
  Heart, 
  Shuffle, 
  Sparkles, 
  BookMarked, 
  MessageSquareQuote,
  Share2
} from 'lucide-react';
import { ProgrammerJoke } from '../types';
import { PROGRAMMER_JOKES } from '../data/jokes';
import { sound } from '../utils/soundEffects';

export const JokesView: React.FC = () => {
  const [jokes, setJokes] = useState<ProgrammerJoke[]>(PROGRAMMER_JOKES);
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');
  const [randomJoke, setRandomJoke] = useState<ProgrammerJoke | null>(null);

  const categories = ['Barchasi', 'Xotira', 'Sintaksis', 'C++ vs Boshqalar', 'Hayotiy'];

  const filteredJokes = selectedCategory === 'Barchasi'
    ? jokes
    : jokes.filter(j => j.category === selectedCategory);

  const handleLike = (id: string) => {
    sound.playClick();
    setJokes(jokes.map(j => j.id === id ? { ...j, likes: j.likes + 1 } : j));
  };

  const handleRandom = () => {
    sound.playClick();
    const idx = Math.floor(Math.random() * jokes.length);
    setRandomJoke(jokes[idx]);
  };

  const dictionary = [
    { term: 'Segmentation Fault', def: 'Birovning xovlisiga devordan oshib tushganingiz uchun operatsion tizimdan shapaloq yeyish.' },
    { term: 'Pointer (*)', def: 'Do\'stingizga soat nechi ekanini aytmay, ko\'chadagi soat minorasini barmog\'i bilan ko\'rsatadigan qaysar.' },
    { term: 'Nuqta-vergul (;)', def: 'Bitta nuqtani unutganingiz uchun butun nasl-nasabingizdan xato qidiradigan g++ kompilyatori.' },
    { term: 'Garbage Value', def: 'Massivdan adashib 50-xonani so\'raganingizda C++ taqdim etadigan antiqa sirli son (-858993460).' },
    { term: 'Memory Leak', def: 'Kompyuter xotirasidan 100 metr joy olib, "raxmat" ham demay, delete qilmasdan qochib ketish.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800 flex items-center gap-1">
                <Smile className="w-3.5 h-3.5" />
                Dasturchi Kulgusi &amp; Memlar
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
              C++ Dasturchi Hazillari va Qiziqarli Hikmatlar
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Dasturlash jiddiy soha, lekin C++ da yig'lagandan ko'ra birgalikda kulgan yaxshi! 😂
            </p>
          </div>

          <button
            id="btn-random-joke"
            onClick={handleRandom}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer text-xs sm:text-sm"
          >
            <Shuffle className="w-4 h-4" />
            <span>Tasodifiy Hazil</span>
          </button>
        </div>
      </div>

      {/* Random Joke Spotlight if triggered */}
      {randomJoke && (
        <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/60 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-300">
            <span className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Tasodifiy Tanlangan Hazil:
            </span>
            <span className="font-mono">{randomJoke.category}</span>
          </div>
          <p className="font-semibold text-slate-100 text-sm sm:text-base">
            {randomJoke.setup}
          </p>
          <p className="text-emerald-300 text-sm sm:text-base font-bold whitespace-pre-line">
            {randomJoke.punchline}
          </p>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { sound.playClick(); setSelectedCategory(cat); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Jokes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJokes.map((joke) => (
          <div 
            key={joke.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between hover:border-emerald-500/30 transition"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {joke.category}
                </span>
                {joke.authorOrContext && (
                  <span className="text-[11px] text-slate-500 italic">
                    {joke.authorOrContext}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {joke.setup}
              </p>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-emerald-300 text-xs sm:text-sm font-semibold whitespace-pre-line leading-relaxed">
                {joke.punchline}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-800/80 text-xs text-slate-400">
              <span className="italic text-[11px]">C++ Folklore</span>
              <button
                onClick={() => handleLike(joke.id)}
                className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition cursor-pointer py-1 px-2 rounded hover:bg-rose-950/30"
              >
                <Heart className="w-4 h-4 fill-rose-500/30" />
                <span className="font-mono font-bold">{joke.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* C++ Kulguli Lug'at (Humorous C++ Glossary) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookMarked className="w-5 h-5 text-emerald-400" />
          <h2 className="font-bold text-slate-100 text-base">
            C++ Dasturchining Kulguli Lug'ati
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {dictionary.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-mono font-bold text-cyan-400 text-xs sm:text-sm block">
                {item.term}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.def}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
