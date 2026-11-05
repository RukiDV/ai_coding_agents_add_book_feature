import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddBookForm from "./index";

describe("AddBookForm", () => {
  test("renders the fields with all genres and ratings", () => {
    render(<AddBookForm onAdd={() => null} />);
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Author")).toBeInTheDocument();
    expect(screen.getAllByRole("option", { name: /Fantasy|Sci-Fi|Mystery|Non-fiction/ })).toHaveLength(4);
    expect(screen.getByLabelText("Rating")).toHaveValue("0");
    expect(screen.getAllByRole("option", { name: /Not rated|^[1-5]$/ })).toHaveLength(6);
  });

  test("passes the entered values to onAdd and clears the form", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn(() => null);
    render(<AddBookForm onAdd={onAdd} />);
    await user.type(screen.getByLabelText("Title"), "Emma");
    await user.type(screen.getByLabelText("Author"), "Jane Austen");
    await user.selectOptions(screen.getByLabelText("Book genre"), "mystery");
    await user.selectOptions(screen.getByLabelText("Rating"), "4");
    await user.click(screen.getByRole("button", { name: "Add book" }));
    expect(onAdd).toHaveBeenCalledWith({
      title: "Emma",
      author: "Jane Austen",
      genre: "mystery",
      rating: 4,
    });
    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Rating")).toHaveValue("0");
  });

  test("shows the error in an alert and keeps the input", async () => {
    const user = userEvent.setup();
    render(<AddBookForm onAdd={() => "Nope"} />);
    await user.type(screen.getByLabelText("Title"), "Emma");
    await user.click(screen.getByRole("button", { name: "Add book" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Nope");
    expect(screen.getByLabelText("Title")).toHaveValue("Emma");
  });
});
