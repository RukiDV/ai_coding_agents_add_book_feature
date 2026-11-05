import type { Book } from "./types";

export const initialBooks: Book[] = [
  {
    id: "b1",
    title: "Dune",
    author: "Frank Herbert",
    genre: "sci-fi",
    rating: 5,
    isRead: true,
  },
  {
    id: "b2",
    title: "The Hobbit",
    author: "J. R. R. Tolkien",
    genre: "fantasy",
    rating: 4,
    isRead: true,
  },
  {
    id: "b3",
    title: "Gone Girl",
    author: "Gillian Flynn",
    genre: "mystery",
    rating: 0,
    isRead: false,
  },
  {
    id: "b4",
    title: "Neuromancer",
    author: "William Gibson",
    genre: "sci-fi",
    rating: 3,
    isRead: false,
  },
  {
    id: "b5",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "non-fiction",
    rating: 0,
    isRead: false,
  },
];
