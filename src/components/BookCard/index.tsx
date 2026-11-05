import type { Book } from "../../types";

type BookCardProps = {
  book: Book;
  onToggleRead: () => void;
  onRemove: () => void;
};

export default function BookCard({
  book,
  onToggleRead,
  onRemove,
}: BookCardProps) {
  return (
    <li className={book.isRead ? "book read" : "book"}>
      <div>
        <h3>{book.title}</h3>
        <p>
          {book.author} · {book.genre}
        </p>
        <p
          aria-label={
            book.rating > 0 ? `Rating: ${book.rating} of 5` : "Not rated"
          }
        >
          {book.rating > 0 ? "★".repeat(book.rating) : "not rated"}
        </p>
      </div>
      <div className="actions">
        <button type="button" onClick={onToggleRead}>
          {book.isRead
            ? `Mark ${book.title} as unread`
            : `Mark ${book.title} as read`}
        </button>
        <button type="button" onClick={onRemove}>
          Remove {book.title}
        </button>
      </div>
    </li>
  );
}
