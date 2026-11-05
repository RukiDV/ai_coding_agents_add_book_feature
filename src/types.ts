export type Genre = "fantasy" | "sci-fi" | "mystery" | "non-fiction";

export type GenreFilter = Genre | "all";

export type Book = {
  id: string;
  title: string;
  author: string;
  genre: Genre;
  /** 1 to 5 stars, 0 means "not rated" */
  rating: number;
  isRead: boolean;
};
