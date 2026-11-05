import { describe, expect, test } from "vitest";
import {
  addBook,
  averageRating,
  countRead,
  filterBooks,
  loadBooks,
  removeBook,
  saveBooks,
  STORAGE_KEY,
  toggleRead,
  validateNewBook,
} from "./books";
import { initialBooks } from "./data";

describe("filterBooks", () => {
  test("filters by genre", () => {
    const result = filterBooks(initialBooks, { genre: "sci-fi", query: "" });
    expect(result.map((book) => book.title)).toEqual(["Dune", "Neuromancer"]);
  });

  test("returns all books for the genre 'all'", () => {
    expect(filterBooks(initialBooks, { genre: "all", query: "" })).toHaveLength(
      5
    );
  });

  test("finds a title regardless of upper and lower case", () => {
    const result = filterBooks(initialBooks, { genre: "all", query: "dune" });
    expect(result.map((book) => book.title)).toEqual(["Dune"]);
  });

  test("ignores spaces around the search text", () => {
    const result = filterBooks(initialBooks, { genre: "all", query: " Dune " });
    expect(result).toHaveLength(1);
  });
});

describe("toggleRead", () => {
  test("toggles the read status of one book", () => {
    const result = toggleRead(structuredClone(initialBooks), "b3");
    expect(result.find((book) => book.id === "b3")?.isRead).toBe(true);
    expect(result.find((book) => book.id === "b1")?.isRead).toBe(true);
  });

  test("does not change the original list", () => {
    const books = structuredClone(initialBooks);
    const result = toggleRead(books, "b3");
    expect(books.find((book) => book.id === "b3")?.isRead).toBe(false);
    expect(result).not.toBe(books);
  });
});

describe("removeBook", () => {
  test("removes the book with the given id", () => {
    const result = removeBook(initialBooks, "b2");
    expect(result.map((book) => book.id)).toEqual(["b1", "b3", "b4", "b5"]);
  });
});

describe("countRead", () => {
  test("counts the read books", () => {
    expect(countRead(initialBooks)).toBe(2);
  });
});

describe("averageRating", () => {
  test("averages only the rated books", () => {
    expect(averageRating(initialBooks)).toBe(4);
  });

  test("returns null when no book is rated", () => {
    expect(averageRating([initialBooks[2], initialBooks[4]])).toBeNull();
  });

  test("returns null for an empty list", () => {
    expect(averageRating([])).toBeNull();
  });
});

describe("validateNewBook", () => {
  test("trims title and author", () => {
    expect(
      validateNewBook(initialBooks, { title: "  Emma ", author: " Jane Austen  " })
    ).toEqual({ ok: true, title: "Emma", author: "Jane Austen" });
  });

  test("requires title and author", () => {
    expect(validateNewBook(initialBooks, { title: "   ", author: "A" }).ok).toBe(
      false
    );
    expect(validateNewBook(initialBooks, { title: "A", author: "" }).ok).toBe(
      false
    );
  });

  test("rejects a duplicate ignoring case and spaces", () => {
    expect(
      validateNewBook(initialBooks, { title: " dune ", author: "FRANK HERBERT" })
    ).toEqual({ ok: false, error: "This book is already on your shelf." });
  });

  test("allows the same title by another author", () => {
    expect(
      validateNewBook(initialBooks, { title: "Dune", author: "Someone Else" }).ok
    ).toBe(true);
  });
});

describe("addBook", () => {
  test("appends the book without changing the original array", () => {
    const book = {
      id: "x",
      title: "Emma",
      author: "Jane Austen",
      genre: "mystery" as const,
      rating: 0,
      isRead: false,
    };
    const result = addBook(initialBooks, book);
    expect(result).toHaveLength(6);
    expect(result[5]).toEqual(book);
    expect(initialBooks).toHaveLength(5);
  });
});

function createStorage(initial?: string): Storage {
  const data = new Map<string, string>();
  if (initial !== undefined) {
    data.set(STORAGE_KEY, initial);
  }
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  } as Storage;
}

describe("loadBooks / saveBooks", () => {
  const fallback = initialBooks.slice(0, 1);

  test("round-trips saved books", () => {
    const storage = createStorage();
    saveBooks(storage, initialBooks);
    expect(loadBooks(storage, fallback)).toEqual(initialBooks);
  });

  test("falls back when nothing is stored", () => {
    expect(loadBooks(createStorage(), fallback)).toBe(fallback);
  });

  test("falls back on invalid JSON", () => {
    expect(loadBooks(createStorage("{nope"), fallback)).toBe(fallback);
  });

  test("falls back when the data is not an array of books", () => {
    expect(loadBooks(createStorage('{"a":1}'), fallback)).toBe(fallback);
    expect(loadBooks(createStorage('[{"id":"1"}]'), fallback)).toBe(fallback);
  });

  test("does not throw if storage fails", () => {
    const broken = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("full");
      },
    } as unknown as Storage;
    expect(loadBooks(broken, fallback)).toBe(fallback);
    expect(() => saveBooks(broken, initialBooks)).not.toThrow();
  });
});
