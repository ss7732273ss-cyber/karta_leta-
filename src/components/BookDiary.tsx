import React, { useState, useEffect } from 'react';
import { Book, DiaryEntry, BookStatus } from '../types/reading';
import StarRating from './StarRating';
import MoodPicker from './MoodPicker';
import CharacterInput from './CharacterInput';
import MemoryQuiz from './MemoryQuiz';
import { Save, CheckCircle, ArrowLeft, BookOpen, Star, Sparkles, MessageCircle } from 'lucide-react';

interface BookDiaryProps {
  book: Book;
  savedEntry?: DiaryEntry;
  onSave: (entry: DiaryEntry, nextStatus?: BookStatus) => void;
  onClose: () => void;
}

export default function BookDiary({ book, savedEntry, onSave, onClose }: BookDiaryProps) {
  // Setup fields with default fallback values
  const [about, setAbout] = useState(savedEntry?.about || '');
  const [characters, setCharacters] = useState<string[]>(savedEntry?.characters || []);
  const [beginning, setBeginning] = useState(savedEntry?.beginning || '');
  const [important, setImportant] = useState(savedEntry?.important || '');
  const [ending, setEnding] = useState(savedEntry?.ending || '');
  const [favoriteMoment, setFavoriteMoment] = useState(savedEntry?.favoriteMoment || '');
  const [rating, setRating] = useState(savedEntry?.rating || 0);
  const [mood, setMood] = useState(savedEntry?.mood || '');
  const [memoryAnswers, setMemoryAnswers] = useState<Record<string, string | string[]>>(savedEntry?.memoryAnswers || {});
  const [status, setStatus] = useState<BookStatus>(savedEntry?.status || 'reading');

  // Automatically transition status from 'not_started' to 'reading' on initial open
  useEffect(() => {
    if (!savedEntry || savedEntry.status === 'not_started') {
      setStatus('reading');
    }
  }, [savedEntry]);

  const handleSaveOnly = () => {
    const entry: DiaryEntry = {
      bookId: book.id,
      status: status, // Keep current status ('reading' or 'done')
      about,
      characters,
      beginning,
      important,
      ending,
      favoriteMoment,
      rating,
      mood,
      memoryAnswers,
      updatedAt: new Date().toISOString(),
    };
    onSave(entry);
  };

  const handleCompleteAndSave = () => {
    const entry: DiaryEntry = {
      bookId: book.id,
      status: 'done', // Force 'done' status
      about,
      characters,
      beginning,
      important,
      ending,
      favoriteMoment,
      rating,
      mood,
      memoryAnswers,
      updatedAt: new Date().toISOString(),
    };
    onSave(entry, 'done');
  };

  return (
    <div id="book-diary-editor" className="bg-white rounded-[32px] border-2 border-slate-700/5 shadow-sm overflow-hidden animate-in slide-in-from-bottom duration-300 mb-10">
      {/* Whimsical Header with Illustration Motif */}
      <div className="relative bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50 p-6 sm:p-8 border-b-2 border-slate-200">
        <button
          type="button"
          id="diary-back-btn"
          onClick={onClose}
          className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/80 hover:bg-white text-slate-600 hover:text-slate-800 text-xs font-bold font-display px-3 py-1.5 rounded-xl border border-slate-200 transition-all hover:scale-105 active:scale-95 cursor-pointer no-print"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Назад к карте
        </button>

        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-4 items-center">
            <span className="text-5xl p-2.5 bg-white rounded-2xl shadow-sm border border-emerald-100/50 select-none">
              {book.icon}
            </span>
            <div>
              <span className="inline-block bg-emerald-100 text-emerald-800 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-display mb-1.5">
                {book.zone} • {book.type}
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-display text-slate-800 leading-tight">
                {book.title}
              </h2>
              <p className="text-xs sm:text-sm font-semibold font-sans text-slate-500">
                {book.author}
              </p>
            </div>
          </div>
          {status === 'done' && (
            <div className="bg-emerald-100 text-emerald-800 font-extrabold font-display text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Станция Пройдена!
            </div>
          )}
        </div>

        {/* Visual Illustration Motif Plaquet */}
        <div className="mt-5 p-3.5 bg-white/60 border border-emerald-100/40 rounded-xl">
          <span className="block text-[10px] font-black font-display text-emerald-700 uppercase tracking-widest mb-1.5">
            🎨 Акварельная зарисовка станции:
          </span>
          <p className="text-xs text-slate-600 font-display italic leading-relaxed">
            {book.illustration}
          </p>
        </div>
      </div>

      {/* Main Journal Fields */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* Section A: Мои впечатления */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-black font-display text-slate-800">Мои общие впечатления</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rating Stars */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-black font-display text-slate-700">
                Моя оценка книге
              </label>
              <div className="p-3 bg-slate-50 border border-slate-100/60 rounded-2xl w-max">
                <StarRating rating={rating} onChange={setRating} />
              </div>
            </div>

            {/* Mood picker */}
            <div className="space-y-2 lg:col-span-2">
              <label className="block text-xs sm:text-sm font-black font-display text-slate-700">
                Моё настроение после чтения
              </label>
              <MoodPicker selectedMood={mood} onChange={setMood} />
            </div>

            {/* About book summary */}
            <div className="space-y-2 lg:col-span-2">
              <label className="block text-xs sm:text-sm font-black font-display text-slate-700">
                О чём книга? (Запиши кратко сюжет своими словами)
              </label>
              <textarea
                id="diary-about-textarea"
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Например: Эта удивительная история рассказывает о..."
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-300 text-slate-700 placeholder-slate-400 text-xs sm:text-sm font-sans transition-colors resize-y"
              />
            </div>
          </div>
        </div>

        {/* Section B: Хроника событий & Персонажи */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-black font-display text-slate-800">Хроника сюжета и главные герои</h3>
          </div>

          <div className="space-y-6">
            {/* Characters Input */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-black font-display text-slate-700">
                Кто главные герои произведения?
              </label>
              <CharacterInput characters={characters} onChange={setCharacters} />
            </div>

            {/* Three Acts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-black font-display text-slate-700">
                  Что случилось сначала?
                </label>
                <textarea
                  id="diary-beginning-textarea"
                  rows={3}
                  value={beginning}
                  onChange={(e) => setBeginning(e.target.value)}
                  placeholder="В начале книги..."
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 focus:outline-none focus:border-emerald-300 text-slate-700 placeholder-slate-400 text-xs font-sans transition-colors resize-y"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black font-display text-slate-700">
                  Что было самым важным?
                </label>
                <textarea
                  id="diary-important-textarea"
                  rows={3}
                  value={important}
                  onChange={(e) => setImportant(e.target.value)}
                  placeholder="Затем произошло главное событие..."
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 focus:outline-none focus:border-emerald-300 text-slate-700 placeholder-slate-400 text-xs font-sans transition-colors resize-y"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black font-display text-slate-700">
                  Чем закончилась история?
                </label>
                <textarea
                  id="diary-ending-textarea"
                  rows={3}
                  value={ending}
                  onChange={(e) => setEnding(e.target.value)}
                  placeholder="В конце истории мы узнаём..."
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 focus:outline-none focus:border-emerald-300 text-slate-700 placeholder-slate-400 text-xs font-sans transition-colors resize-y"
                />
              </div>
            </div>

            {/* Favorite Moment */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-black font-display text-slate-700">
                Мой любимый момент в книге (Что тебе запомнилось больше всего?)
              </label>
              <textarea
                id="diary-fav-moment-textarea"
                rows={2}
                value={favoriteMoment}
                onChange={(e) => setFavoriteMoment(e.target.value)}
                placeholder="Мой самый любимый момент, когда..."
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-300 text-slate-700 placeholder-slate-400 text-xs sm:text-sm font-sans transition-colors resize-y"
              />
            </div>
          </div>
        </div>

        {/* Section C: Проверка памяти (Quiz) */}
        {book.memoryQuestions && book.memoryQuestions.length > 0 && (
          <MemoryQuiz
            questions={book.memoryQuestions}
            savedAnswers={memoryAnswers}
            onAnswersChange={setMemoryAnswers}
            isCompleted={status === 'done'}
          />
        )}

        {/* Form Action Buttons Footer */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-end items-center gap-3 no-print">
          <button
            type="button"
            id="diary-save-only-btn"
            onClick={handleSaveOnly}
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold font-display px-6 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
          >
            <Save className="w-4 h-4" />
            Сохранить черновик
          </button>
          <button
            type="button"
            id="diary-mark-completed-btn"
            onClick={handleCompleteAndSave}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-black font-display px-8 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Отметить как прочитанную!
          </button>
        </div>
      </div>
    </div>
  );
}
