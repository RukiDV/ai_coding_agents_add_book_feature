import type { Book } from "../../types";
import { averageRating, countRead } from "../../books";

type StatsProps = {
  books: Book[];
};

export default function Stats({ books }: StatsProps) {
  const average = averageRating(books);
  return (
    <p className="stats">
      {countRead(books)} of {books.length} read · Average rating:{" "}
      {average ?? "–"}
    </p>
  );
}
