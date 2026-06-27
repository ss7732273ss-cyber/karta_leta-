import React, { useState } from 'react';
import { Edit2, Check, Sparkles } from 'lucide-react';

interface HeaderHeroProps {
  childName: string;
  onNameChange: (name: string) => void;
}

export default function HeaderHero({ childName, onNameChange }: HeaderHeroProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(childName);

  const handleSave = () => {
    onNameChange(tempName.trim());
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="relative bg-white border-2 border-slate-700/5 rounded-[32px] p-6 sm:p-8 overflow-hidden shadow-sm mb-6 no-print">
      {/* Decorative stars / bubbles */}
      <div className="absolute top-4 right-4 text-emerald-500 opacity-60 animate-bounce">
        <Sparkles className="w-7 h-7" />
      </div>
      <div className="absolute bottom-4 left-4 text-emerald-500 opacity-20 text-4xl select-none">
        🎨
      </div>

      <div className="max-w-2xl">
        <span className="inline-block bg-emerald-500/10 text-emerald-700 font-extrabold text-xs font-display uppercase tracking-widest px-3 py-1.5 rounded-full mb-3">
          Книжное приключение
        </span>

        <h1 className="text-4xl sm:text-5xl font-black font-display text-slate-800 leading-tight tracking-tight mb-2">
          Карта лета
        </h1>
        <p className="text-sm sm:text-base font-bold font-display text-slate-500 mb-6">
          Интерактивный читательский дневник после 3 класса • 28 волшебных станций
        </p>

        {/* Kid's name block */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white/80 backdrop-blur-xs border border-emerald-100/50 p-4 rounded-2xl w-full sm:w-max">
          <span className="text-sm font-bold text-slate-600 font-display flex items-center gap-1.5">
            Привет, {childName || 'путешественник'}! 👋
          </span>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="kid-name-input"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Введи своё имя..."
                className="bg-slate-50 border-2 border-slate-100 rounded-xl px-3 py-1 text-xs font-display text-slate-700 focus:outline-none focus:border-emerald-300"
                maxLength={20}
              />
              <button
                type="button"
                id="save-kid-name-btn"
                onClick={handleSave}
                className="bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 rounded-lg transition-transform active:scale-95 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              id="edit-kid-name-trigger"
              onClick={() => {
                setTempName(childName);
                setIsEditing(true);
              }}
              className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-bold font-display underline underline-offset-2 decoration-dotted cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              {childName ? 'Изменить имя' : 'Записать моё имя'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
