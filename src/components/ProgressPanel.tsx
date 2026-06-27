import React from 'react';
import { Book, DiaryEntry } from '../types/reading';
import { calculateStats, getNextBook } from '../utils/progress';
import { ChevronRight } from 'lucide-react';

interface ProgressPanelProps {
  entries: Record<number, DiaryEntry>;
  booksList: Book[];
  onOpenBook: (book: Book) => void;
}

export default function ProgressPanel({ entries, booksList, onOpenBook }: ProgressPanelProps) {
  const stats = calculateStats(entries);
  const nextBook = getNextBook(booksList, entries);

  // Quick medals milestones
  const milestones = [
    { target: 5, label: '5 книг', active: stats.completedCount >= 5 },
    { target: 10, label: '10 книг', active: stats.completedCount >= 10 },
    { target: 20, label: '20 книг', active: stats.completedCount >= 20 },
    { target: 28, label: '28 книг', active: stats.completedCount >= 28 },
  ];

  return (
    <div className="bg-white border-2 border-slate-700/5 rounded-[32px] p-6 shadow-sm mb-6 no-print">
      {/* Top title and ratio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-slate-800 font-extrabold font-display text-lg sm:text-xl">
            Прочитано {stats.completedCount} из {stats.total} книг
          </span>
        </div>
        {nextBook && (
          <span className="text-xs sm:text-sm text-slate-500 font-semibold font-display">
            Рекомендуем: <span className="text-emerald-500 font-bold">«{nextBook.title}»</span>
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative w-full h-3.5 bg-slate-200 rounded-full mb-6 overflow-hidden">
        <div
          id="main-progress-bar-fill"
          className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(93,130,51,0.4)] transition-all duration-500 ease-out"
          style={{ width: `${stats.percentage}%` }}
        />
      </div>

      {/* Mini Achievements Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {milestones.map((ms) => (
          <div
            key={ms.target}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border transition-all ${
              ms.active
                ? 'bg-amber-50 border-amber-200 text-amber-800 shadow-xs'
                : 'bg-slate-50 border-slate-100 text-slate-400'
            }`}
          >
            <span className={`text-lg ${ms.active ? 'opacity-100 scale-110 animate-bounce' : 'opacity-40 grayscale'}`}>
              🏅
            </span>
            <span className="text-xs font-black font-display">{ms.label}</span>
          </div>
        ))}
      </div>

      {/* Next Station block */}
      <div className="bg-emerald-50/40 border border-emerald-100/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="block text-[11px] uppercase tracking-wider font-extrabold text-emerald-700 font-display mb-1">
            Следующая станция
          </span>
          {nextBook ? (
            <>
              <h3 className="text-lg font-black font-display text-slate-800 mb-0.5">
                {nextBook.title}
              </h3>
              <p className="text-xs text-slate-500 font-semibold font-sans">
                {nextBook.author} • {nextBook.zone}
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-black font-display text-slate-800 mb-0.5">
                Путешествие завершено! 🎉
              </h3>
              <p className="text-xs text-slate-500 font-semibold font-sans">
                Ты прочитал все книги! Загляни в родительский раздел, чтобы распечатать свой дневник и диплом!
              </p>
            </>
          )}
        </div>

        {nextBook && (
          <button
            type="button"
            id="open-next-book-btn"
            onClick={() => onOpenBook(nextBook)}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold font-display px-8 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer text-sm"
          >
            Открыть
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
