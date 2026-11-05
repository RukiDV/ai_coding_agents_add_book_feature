import { useState } from "react";
import type { FormEvent } from "react";
import type { Genre } from "../../types";

export type NewBookInput = {
  title: string;
  author: string;
  genre: Genre;
  rating: number;
};

type AddBookFormProps = {
  /** Returns an error message, or `null` if the book was added. */
  onAdd: (input: NewBookInput) => string | null;
};

export default function AddBookForm({ onAdd }: AddBookFormProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState<Genre>("fantasy");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = onAdd({ title, author, genre, rating });
    setError(result);
    if (result === null) {
      setTitle("");
      setAuthor("");
      setGenre("fantasy");
      setRating(0);
    }
  }

  return (
    <form className="add-book" aria-label="Add a book" onSubmit={handleSubmit}>
      <h2>Add a book</h2>
      <div className="controls">
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Author
          <input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </label>
        <label>
          Book genre
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value as Genre)}
          >
            <option value="fantasy">Fantasy</option>
            <option value="sci-fi">Sci-Fi</option>
            <option value="mystery">Mystery</option>
            <option value="non-fiction">Non-fiction</option>
          </select>
        </label>
        <label>
          Rating
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value={0}>Not rated</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error && <p role="alert">{error}</p>}
      <button type="submit">Add book</button>
    </form>
  );
}
