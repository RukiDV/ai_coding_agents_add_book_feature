import type { Book, Genre, GenreFilter } from "./types";

export const STORAGE_KEY = "bookshelf:books";
export const DUPLICATE_ERROR = "This book is already on your shelf.";
export const REQUIRED_ERROR = "Title and author are required.";

const GENRES: Genre[] = ["fantasy", "sci-fi", "mystery", "non-fiction"];

type Filter = {
  genre: GenreFilter;
  query: string;
};

export function filterBooks(books: Book[], { genre, query }: Filter): Book[] {
  const normalizedQuery = query.trim().toLowerCase();
  return books.filter(
    (book) =>
      (genre === "all" || book.genre === genre) &&
      book.title.toLowerCase().includes(normalizedQuery)
  );
}

export function toggleRead(books: Book[], id: string): Book[] {
  return books.map((book) =>
    book.id === id ? { ...book, isRead: !book.isRead } : book
  );
}

export function removeBook(books: Book[], id: string): Book[] {
  return books.filter((book) => book.id !== id);
}

export function countRead(books: Book[]): number {
  return books.filter((book) => book.isRead).length;
}

/** Average of all rated books, rounded to one decimal. `null` if no book is rated. */
export function averageRating(books: Book[]): number | null {
  const rated = books.filter((book) => book.rating > 0);
  if (rated.length === 0) {
    return null;
  }
  const sum = rated.reduce((total, book) => total + book.rating, 0);
  return Math.round((sum / rated.length) * 10) / 10;
}

type ValidationResult =
  | { ok: true; title: string; author: string }
  | { ok: false; error: string };

/** Trims title and author, requires both and rejects duplicates (ignoring case). */
export function validateNewBook(
  books: Book[],
  input: { title: string; author: string }
): ValidationResult {
  const title = input.title.trim();
  const author = input.author.trim();
  if (title === "" || author === "") {
    return { ok: false, error: REQUIRED_ERROR };
  }
  const isDuplicate = books.some(
    (book) =>
      book.title.trim().toLowerCase() === title.toLowerCase() &&
      book.author.trim().toLowerCase() === author.toLowerCase()
  );
  if (isDuplicate) {
    return { ok: false, error: DUPLICATE_ERROR };
  }
  return { ok: true, title, author };
}

export function addBook(books: Book[], book: Book): Book[] {
  return [...books, book];
}

function isBook(value: unknown): value is Book {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const book = value as Record<string, unknown>;
  return (
    typeof book.id === "string" &&
    typeof book.title === "string" &&
    typeof book.author === "string" &&
    GENRES.includes(book.genre as Genre) &&
    Number.isInteger(book.rating) &&
    (book.rating as number) >= 0 &&
    (book.rating as number) <= 5 &&
    typeof book.isRead === "boolean"
  );
}

/** Reads the saved books. Returns `fallback` if nothing valid is stored. */
export function loadBooks(storage: Storage, fallback: Book[]): Book[] {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) {
      return fallback;
    }
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(isBook)) {
      return parsed;
    }
  } catch {
    // unreadable storage or invalid JSON: use the fallback
  }
  return fallback;
}

export function saveBooks(storage: Storage, books: Book[]): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch {
    // storage full or unavailable: keep working without persistence
  }
}
