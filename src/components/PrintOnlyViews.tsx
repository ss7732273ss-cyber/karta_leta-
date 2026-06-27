import React from 'react';
import { Book, DiaryEntry } from '../types/reading';
import { calculateStats } from '../utils/progress';

interface PrintOnlyViewsProps {
  printType: 'diary' | 'diploma' | null;
  booksList: Book[];
  entries: Record<number, DiaryEntry>;
  childName: string;
}

export default function PrintOnlyViews({ printType, booksList, entries, childName }: PrintOnlyViewsProps) {
  if (!printType) return null;

  const stats = calculateStats(entries);
  const printDateString = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const activeBooks = booksList.filter((b) => entries[b.id]);

  return (
    <div className="hidden print-only print-container">
      {/* 1. READER'S DIARY FULL VIEW */}
      {printType === 'diary' && (
        <div className="print-diary-flow">
          {/* Cover Title Page */}
          <div className="print-page flex flex-col justify-between items-center text-center border-4 border-emerald-600/30 p-12 min-h-[26cm] box-border">
            <div className="space-y-4 my-auto">
              <span className="text-[14pt] font-black uppercase tracking-widest text-emerald-700">
                Читательский дневник
              </span>
              <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight leading-tight mt-2">
                КАРТА ЛЕТА
              </h1>
              <p className="text-lg font-semibold text-slate-500 italic">
                Книжное приключение после 3 класса
              </p>

              <div className="w-24 h-1 bg-emerald-500 mx-auto my-6" />

              <div className="space-y-2 mt-8">
                <p className="text-[12pt] text-slate-500">Путешественник-искатель:</p>
                <h3 className="text-2xl font-black text-slate-800 underline decoration-emerald-500 decoration-wavy underline-offset-4">
                  {childName || 'Юный читатель'}
                </h3>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[12pt] font-bold text-slate-700 block">
                  Летний результат чтения:
                </span>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  Прочитано {stats.completedCount} из {stats.total} книг
                </p>
              </div>
              <p className="text-xs text-slate-400">Дата печати дневника: {printDateString}</p>
            </div>
          </div>

          {/* Book Checklist Grid Page */}
          <div className="print-page min-h-[26cm] p-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 pb-2 border-b border-slate-300">
              Список станций и успехи
            </h2>
            <div className="space-y-2">
              {booksList.map((book) => {
                const entry = entries[book.id];
                const statusLabel =
                  entry?.status === 'done'
                    ? '✓ Прочитано'
                    : entry?.status === 'reading'
                    ? '• Читаю'
                    : '  Не начато';
                return (
                  <div
                    key={book.id}
                    className="flex justify-between items-center py-2 border-b border-slate-100 text-[11pt]"
                  >
                    <span>
                      <strong className="font-mono text-slate-400 mr-2">{book.id}.</strong>
                      {book.title} ({book.author})
                    </span>
                    <span
                      className={`font-bold ${
                        entry?.status === 'done'
                          ? 'text-emerald-600'
                          : entry?.status === 'reading'
                          ? 'text-blue-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Entries Pages */}
          {activeBooks.map((book) => {
            const entry = entries[book.id];
            if (!entry) return null;

            return (
              <div key={book.id} className="print-page min-h-[26cm] p-8 space-y-6">
                <div className="flex justify-between items-start pb-4 border-b border-slate-300">
                  <div>
                    <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider block">
                      Станция {book.id} • {book.zone}
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-800">{book.title}</h2>
                    <p className="text-sm text-slate-500 font-medium">{book.author}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-bold text-slate-400">Оценка</span>
                    <span className="text-lg font-black text-amber-500">
                      {'★'.repeat(entry.rating) + '☆'.repeat(5 - entry.rating)}
                    </span>
                    <span className="block text-xl mt-1">{entry.mood}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Summary / About */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-500 uppercase">О чём книга:</h4>
                    <p className="text-[11pt] text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                      {entry.about || '—'}
                    </p>
                  </div>

                  {/* Characters */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-500 uppercase">Главные герои:</h4>
                    <p className="text-[11pt] text-slate-800 font-semibold">
                      {entry.characters && entry.characters.length > 0 ? entry.characters.join(', ') : '—'}
                    </p>
                  </div>

                  {/* Three Acts chronology */}
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Сначала:</span>
                      <p className="text-[10px] text-slate-700 leading-normal">{entry.beginning || '—'}</p>
                    </div>
                    <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Самое важное:</span>
                      <p className="text-[10px] text-slate-700 leading-normal">{entry.important || '—'}</p>
                    </div>
                    <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Конец истории:</span>
                      <p className="text-[10px] text-slate-700 leading-normal">{entry.ending || '—'}</p>
                    </div>
                  </div>

                  {/* Favorite moment */}
                  <div className="space-y-1 pt-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase">Любимый момент:</h4>
                    <p className="text-[11pt] text-slate-800 leading-relaxed bg-slate-50/20 p-3 rounded-lg border border-slate-100 italic">
                      {entry.favoriteMoment || '—'}
                    </p>
                  </div>

                  {/* Quiz answers if completed */}
                  {book.memoryQuestions && (
                    <div className="pt-4 border-t border-slate-200 space-y-2">
                      <span className="text-xs font-bold text-slate-500 uppercase block">Проверка памяти:</span>
                      <div className="space-y-1.5 pl-2">
                        {book.memoryQuestions.map((q, idx) => {
                          const ansVal = entry.memoryAnswers[q.id];
                          let answerText = '—';
                          if (q.type === 'sequence' && Array.isArray(ansVal)) {
                            answerText = ansVal.join(' → ');
                          } else if (q.type === 'match' && typeof ansVal === 'string') {
                            try {
                              const parsed = JSON.parse(ansVal);
                              answerText = Object.entries(parsed)
                                .map(([left, right]) => `${left} — ${right}`)
                                .join('; ');
                            } catch (e) {
                              answerText = ansVal;
                            }
                          } else if (typeof ansVal === 'string') {
                            answerText = ansVal;
                          }

                          return (
                            <div key={q.id} className="text-[10pt] leading-tight">
                              <span className="text-slate-500 font-bold mr-1">{idx + 1}. {q.question}</span>
                              <span className="text-slate-800 font-medium italic block ml-3">{answerText || 'Нет ответа'}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. DIPLOMA EXCLUSIVE VIEW */}
      {(printType === 'diploma' || printType === 'diary') && (
        <div className="print-page min-h-[26cm] p-8 flex flex-col justify-center items-center">
          <div className="diploma-print-container w-full h-full flex flex-col justify-between p-12 border-8 border-double border-amber-600 text-center bg-amber-50/10">
            <div className="space-y-3">
              <span className="text-lg font-black tracking-widest text-amber-700 block uppercase">
                ПОЧЁТНЫЙ ДИПЛОМ
              </span>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase leading-none mt-2">
                МАСТЕР ЛЕТНЕГО ЧТЕНИЯ
              </h1>
              <div className="w-48 h-1.5 bg-amber-500 mx-auto my-4" />
            </div>

            <div className="space-y-4 my-10">
              <span className="text-[12pt] text-slate-500 block">Награждается юный путешественник по Книжному лету:</span>
              <h2 className="text-3xl font-black text-slate-800 tracking-wide underline decoration-amber-500 decoration-wavy underline-offset-8">
                {childName || 'Храбрый Читатель'}
              </h2>
              <p className="text-[11pt] text-slate-600 max-w-lg mx-auto leading-relaxed pt-4">
                За великолепное прохождение всех станций интерактивного маршрута <strong>«Карта лета»</strong> после 3 класса, заведение читательского дневника, усердный труд и отличные ответы на проверках памяти!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 max-w-md mx-auto my-6 p-4 bg-white/60 border border-amber-200 rounded-xl text-center">
              <div>
                <span className="text-[11pt] font-bold text-slate-500 block">Пройдено станций:</span>
                <span className="text-2xl font-black text-emerald-600">{stats.completedCount} из 28</span>
              </div>
              <div>
                <span className="text-[11pt] font-bold text-slate-500 block">Наградные медали:</span>
                <span className="text-2xl font-black text-amber-600">
                  {Object.values(stats.medals).filter(Boolean).length} из 4
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-12 text-sm text-slate-500">
              <div className="text-left space-y-1">
                <span>Подпись Хранителя Карты: _________________</span>
                <span className="block text-[10px] text-slate-400">Родитель или Учитель</span>
              </div>
              <div className="text-right space-y-1">
                <span>Дата: {printDateString}</span>
                <span className="block text-[10px] text-slate-400">Летнее приключение</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
