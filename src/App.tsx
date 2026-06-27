import React, { useState, useEffect } from 'react';
import { Book, DiaryEntry, AppState, BookStatus } from './types/reading';
import { books } from './data/books';
import { loadState, saveState, clearLocalStorageState } from './utils/storage';
import { calculateStats } from './utils/progress';

// Component imports
import HeaderHero from './components/HeaderHero';
import ProgressPanel from './components/ProgressPanel';
import AdventureMap from './components/AdventureMap';
import BookDiary from './components/BookDiary';
import AchievementBadges from './components/AchievementBadges';
import ParentModePanel from './components/ParentModePanel';
import ResetProgressButton from './components/ResetProgressButton';
import ConfettiBurst from './components/ConfettiBurst';
import PrintOnlyViews from './components/PrintOnlyViews';
import { Sparkles, Compass } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>({ entries: {}, childName: '' });
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Print mode trigger state
  const [printType, setPrintType] = useState<'diary' | 'diploma' | null>(null);

  // Load initial state on mount
  useEffect(() => {
    setState(loadState());
  }, []);

  // Sync state to localStorage when changed
  const updateState = (newState: AppState) => {
    setState(newState);
    saveState(newState);
  };

  // Handle Child Name Change
  const handleNameChange = (name: string) => {
    updateState({
      ...state,
      childName: name,
    });
    showToast('Имя путешественника успешно сохранено! ✨');
  };

  // Helper for popup toasts
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Reset Progress entirely
  const handleResetProgress = () => {
    clearLocalStorageState();
    setState({ entries: {}, childName: '' });
    setSelectedBook(null);
    showToast('Твой прогресс сброшен. Время начать новое книжное приключение! 🗺️');
  };

  // Handle saving an entry
  const handleSaveEntry = (entry: DiaryEntry, nextStatus?: BookStatus) => {
    const updatedEntries = { ...state.entries, [entry.bookId]: entry };

    // Trigger confetti if status changes from anything to 'done' for the FIRST time
    const prevStatus = state.entries[entry.bookId]?.status || 'not_started';
    const isNewDone = (nextStatus === 'done' || entry.status === 'done') && prevStatus !== 'done';

    if (isNewDone) {
      entry.status = 'done';
      setConfettiTrigger(true);
      setTimeout(() => setConfettiTrigger(false), 200);
      showToast(`Ура! Книга «${books.find((b) => b.id === entry.bookId)?.title}» прочитана! Ты получаешь новую звезду! ⭐`);
    } else {
      showToast('Твои записи сохранены в читательский дневник! 💾');
    }

    updateState({
      ...state,
      entries: updatedEntries,
    });

    // Go back to map view
    setSelectedBook(null);
  };

  // Print trigger helper
  const handleTriggerPrint = (type: 'diary' | 'diploma') => {
    setPrintType(type);
    // Let DOM render, then open dialog, then reset state
    setTimeout(() => {
      window.print();
      setPrintType(null);
    }, 400);
  };

  const stats = calculateStats(state.entries);

  return (
    <div className="min-h-screen bg-[#f7f9f6] text-slate-800 pb-16">
      {/* Printable Sheet View - invisible on screen, visible on print */}
      <PrintOnlyViews
        printType={printType}
        booksList={books}
        entries={state.entries}
        childName={state.childName}
      />

      {/* Confetti celebration effect */}
      <ConfettiBurst trigger={confettiTrigger} />

      {/* Standard Screen Layout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-6 no-print">
        {/* Floating Save Alert / Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-800 text-white font-extrabold font-display px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm">{toastMessage}</span>
          </div>
        )}

        {/* Top bar containing Reset and Version */}
        <div className="flex items-center justify-between px-2 text-xs">
          <ResetProgressButton onReset={handleResetProgress} />
          <span className="text-slate-400 font-sans">
            Интерактивный дневник «Карта лета» после 3 класса
          </span>
        </div>

        {/* Selected Diary View vs. General Dashboard Switch */}
        {selectedBook ? (
          <BookDiary
            book={selectedBook}
            savedEntry={state.entries[selectedBook.id]}
            onSave={handleSaveEntry}
            onClose={() => setSelectedBook(null)}
          />
        ) : (
          <div className="space-y-8">
            {/* Header / Introduction */}
            <HeaderHero childName={state.childName} onNameChange={handleNameChange} />

            {/* Combined progress tracking dashboard card */}
            <ProgressPanel
              entries={state.entries}
              booksList={books}
              onOpenBook={(book) => setSelectedBook(book)}
            />

            {/* Geographical Fairytale Map section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pl-2">
                <Compass className="w-5 h-5 text-emerald-600 animate-pulse" />
                <h2 className="text-xl font-black font-display text-slate-800">
                  Карта летних приключений
                </h2>
              </div>
              <AdventureMap
                booksList={books}
                entries={state.entries}
                onOpenBook={(book) => setSelectedBook(book)}
              />
            </div>

            {/* Detailed Medals Achievements Showcase */}
            <div className="space-y-4 bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-xs">
              <h3 className="text-base font-black font-display text-slate-800 pl-1 flex items-center gap-1.5 mb-2">
                🏆 Мои наградные медали
              </h3>
              <p className="text-xs text-slate-500 font-sans mb-5 pl-1">
                Продолжай читать книги из списка, чтобы открыть все четыре сказочные медали мастера!
              </p>
              <AchievementBadges completedCount={stats.completedCount} />
            </div>

            {/* Parent Mode Panel */}
            <ParentModePanel
              entries={state.entries}
              booksList={books}
              childName={state.childName}
              onTriggerPrint={handleTriggerPrint}
            />
          </div>
        )}
      </div>
    </div>
  );
}
