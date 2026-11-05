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
});
