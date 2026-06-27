export type BookStatus = 'not_started' | 'reading' | 'done';

export type BookType = 'сказка' | 'рассказ' | 'стихи' | 'повесть' | 'приключения';

export type MapZone =
  | 'Остров сказок'
  | 'Лес стихов'
  | 'Город приключений'
  | 'Замок героев';

export interface MemoryQuestion {
  id: string;
  type: 'choice' | 'text' | 'sequence' | 'match';
  question: string;
  options?: string[];
  answer?: string | string[]; // Correct answer(s)
  pairs?: Array<{
    left: string;
    right: string;
  }>;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  type: BookType;
  zone: MapZone;
  subtitle: string;
  icon: string;
  illustration: string; // Description of the visual motif for rendering/printing
  memoryQuestions: MemoryQuestion[];
}

export interface DiaryEntry {
  bookId: number;
  status: BookStatus;
  about: string;
  characters: string[];
  beginning: string;
  important: string;
  ending: string;
  favoriteMoment: string;
  rating: number;
  mood: string;
  memoryAnswers: Record<string, string | string[]>;
  updatedAt: string;
}

export interface AppState {
  entries: Record<number, DiaryEntry>;
  childName: string;
}
