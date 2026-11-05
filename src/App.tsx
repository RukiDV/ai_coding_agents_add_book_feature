import { useEffect, useState } from "react";
import {
  addBook,
  filterBooks,
  loadBooks,
  removeBook,
  saveBooks,
  toggleRead,
  validateNewBook,
} from "./books";
import AddBookForm from "./components/AddBookForm";
import type { NewBookInput } from "./components/AddBookForm";
import BookList from "./components/BookList";
import Stats from "./components/Stats";
import { initialBooks } from "./data";
import type { Book, GenreFilter } from "./types";

export default function App() {
  const [books, setBooks] = useState<Book[]>(() =>
    loadBooks(localStorage, initialBooks)
  );
  const [genre, setGenre] = useState<GenreFilter>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    saveBooks(localStorage, books);
  }, [books]);

  const visibleBooks = filterBooks(books, { genre, query });

  function handleToggleRead(id: string) {
    setBooks(toggleRead(books, id));
  }

  function handleRemove(id: string) {
    setBooks(removeBook(books, id));
  }

  function handleAdd({ title, author, genre, rating }: NewBookInput) {
    const result = validateNewBook(books, { title, author });
    if (!result.ok) {
      return result.error;
    }
    setBooks(
      addBook(books, {
        id: crypto.randomUUID(),
        title: result.title,
        author: result.author,
        genre,
        rating,
        isRead: false,
      })
    );
    return null;
  }

  return (
    <main>
      <h1>Bookshelf</h1>
      <div className="controls">
        <label>
          Search
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label>
          Genre
          <select
            value={genre}
            onChange={(event) => setGenre(event.target.value as GenreFilter)}
          >
            <option value="all">All genres</option>
            <option value="fantasy">Fantasy</option>
            <option value="sci-fi">Sci-Fi</option>
            <option value="mystery">Mystery</option>
            <option value="non-fiction">Non-fiction</option>
          </select>
        </label>
      </div>
      <Stats books={books} />
      <AddBookForm onAdd={handleAdd} />
      <BookList
        books={visibleBooks}
        onToggleRead={handleToggleRead}
        onRemove={handleRemove}
      />
    </main>
  );
}
