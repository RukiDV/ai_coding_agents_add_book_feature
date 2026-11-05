import { describe, expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  test("renders all books", () => {
    render(<App />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(5);
  });

  test("shows only the books of the selected genre", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByLabelText("Genre"), "sci-fi");
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
  });

  test("marks a book as read", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      screen.getByRole("button", { name: "Mark Gone Girl as read" })
    );
    expect(
      screen.getByRole("button", { name: "Mark Gone Girl as unread" })
    ).toBeInTheDocument();
    expect(screen.getByText(/3 of 5 read/)).toBeInTheDocument();
  });

  test("removes the right book while a genre filter is active", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByLabelText("Genre"), "sci-fi");
    await user.click(
      screen.getByRole("button", { name: "Remove Neuromancer" })
    );
    await user.selectOptions(screen.getByLabelText("Genre"), "all");
    const titles = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(titles).toEqual(["Dune", "The Hobbit", "Gone Girl", "Sapiens"]);
  });

  test("shows 'Average rating: 4' for the sample books", () => {
    render(<App />);
    const stats = screen.getByText(/Average rating/);
    expect(within(stats).queryByText("NaN")).toBeNull();
    expect(stats).toHaveTextContent("Average rating: 4");
  });

  async function addBookViaForm(
    user: ReturnType<typeof userEvent.setup>,
    title: string,
    author: string
  ) {
    await user.type(screen.getByLabelText("Title"), title);
    await user.type(screen.getByLabelText("Author"), author);
    await user.click(screen.getByRole("button", { name: "Add book" }));
  }

  test("adds a new unread book, updates the stats and clears the form", async () => {
    const user = userEvent.setup();
    render(<App />);
    await addBookViaForm(user, "  Emma ", "Jane Austen");
    expect(screen.getByRole("heading", { name: "Emma" })).toBeInTheDocument();
    expect(screen.getByText(/2 of 6 read/)).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Author")).toHaveValue("");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  test("shows an error and adds nothing for empty fields", async () => {
    const user = userEvent.setup();
    render(<App />);
    await addBookViaForm(user, "   ", "Someone");
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(5);
  });

  test("rejects a duplicate but allows the same title by another author", async () => {
    const user = userEvent.setup();
    render(<App />);
    await addBookViaForm(user, "dune", "frank herbert");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "This book is already on your shelf."
    );
    await user.clear(screen.getByLabelText("Author"));
    await user.type(screen.getByLabelText("Author"), "Someone Else");
    await user.click(screen.getByRole("button", { name: "Add book" }));
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
  });

  test("keeps added books after a reload", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    await addBookViaForm(user, "Emma", "Jane Austen");
    unmount();
    render(<App />);
    expect(screen.getByRole("heading", { name: "Emma" })).toBeInTheDocument();
  });
});
