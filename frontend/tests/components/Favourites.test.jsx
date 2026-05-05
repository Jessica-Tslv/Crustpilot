import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FavouritesComponent } from "../../src/components/Favourite/Favourite2"; // adjust path as needed

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => vi.fn(),
}));

const mockRestaurant = {
  _id: "abc123",
  name: "Test Bistro",
  message: "Great food!",
  location: "Newcastle",
  rating: 4.5,
  image: "https://example.com/image.jpg",
};

const mockRestaurant2 = {
  _id: "xyz789",
  name: "Pizza Palace",
  message: "Best pizza in town!",
  location: "Gateshead",
  rating: 4.2,
  image: "https://example.com/pizza.jpg",
};

beforeEach(() => {
  localStorage.setItem("token", "fake-token");
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      ok: true,
      data: { favouriteRestaurants: [mockRestaurant, mockRestaurant2] },
    }),
  });
});

describe("FavouritesComponent", () => {
  it("renders restaurant data", async () => {
    render(
      <MemoryRouter>
        <FavouritesComponent />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText("Test Bistro")).toBeInTheDocument(),
    );
    expect(screen.getByText("Great food!")).toBeInTheDocument();
    expect(screen.getByText("Newcastle")).toBeInTheDocument();
    expect(screen.getByText(/4.5/)).toBeInTheDocument();
  });

  it("removes a restaurant from the list when Remove button is clicked", async () => {
    render(
      <MemoryRouter>
        <FavouritesComponent />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.queryByText("Test Bistro")).not.toBeNull(),
    );
    expect(screen.queryByText("Pizza Palace")).not.toBeNull();

    global.fetch = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({}) });

    const removeButtons = screen.getAllByText(/remove from favourites/i);
    fireEvent.click(removeButtons[0]);

    await waitFor(() => expect(screen.queryByText("Pizza Palace")).toBeNull());
    expect(screen.queryByText("Test Bistro")).not.toBeNull();
  });
});
