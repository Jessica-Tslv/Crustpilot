import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { Navbar } from "../../src/components/Navbar/Navbar";
import { search } from "../../src/services/search";

//Mock the full local storage object
const localStorageMock = {
  getItem: vi.fn(() => "testToken"),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
};

global.localStorage = localStorageMock;

// Mocking the search service
vi.mock("../../src/services/search", () => {
  const searchMock = vi.fn();
  return { search: searchMock };
});

const mockPlace = {
  _id: "64a1b2c3d4e5f6a7b8c9d0e4",
  name: "Sushi Central",
  cuisine: "Japanese",
};

// Helper to simulate logged in/out by mocking localStorage token
function setLoginState(loggedIn) {
  localStorageMock.getItem.mockReturnValue(loggedIn ? "fake-token" : null);
}

// Reusable render function
function renderNavbar() {
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>,
  );
}

describe("Navbar", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    //Default to log out after each tests
    localStorageMock.getItem.mockReturnValue(null);
  });

  //Logo should always be visible
  test("displays the logo when logged out", () => {
    setLoginState(false);
    renderNavbar();
    const logo = screen.getByAltText("Crust pilot home");
    expect(logo).toBeInTheDocument();
  });

  test("displays the logo when logged in", () => {
    setLoginState(true);
    renderNavbar();
    const logo = screen.getByAltText("Crust pilot home");
    expect(logo).toBeInTheDocument();
  });

  // Search bar should always be visible
  test("displays the search bar when logged out", () => {
    setLoginState(false);
    renderNavbar();
    const searchInput = screen.getByPlaceholderText("Search places...");
    expect(searchInput).toBeInTheDocument();
  });

  test("displays the search bar when logged in", () => {
    setLoginState(true);
    renderNavbar();
    const searchInput = screen.getByPlaceholderText("Search places...");
    expect(searchInput).toBeInTheDocument();
  });

  test("displays search results when user types", async () => {
    const user = userEvent.setup();
    search.mockResolvedValue({ ok: true, places: [mockPlace] });
    renderNavbar();
    await user.type(screen.getByPlaceholderText("Search places..."), "Sushi");
    expect(await screen.findByText("Sushi Central")).toBeInTheDocument();
  });

  test("hides search results when input is cleared", async () => {
    const user = userEvent.setup();
    search.mockResolvedValue({ ok: true, places: [mockPlace] });
    renderNavbar();
    await user.type(screen.getByPlaceholderText("Search places..."), "Sushi");
    await screen.findByText("Sushi Central");

    await user.clear(screen.getByPlaceholderText("Search places..."));

    expect(screen.queryByText("Sushi Central")).not.toBeInTheDocument();
  });

  test("hides search results when Escape is pressed", async () => {
    const user = userEvent.setup();
    search.mockResolvedValue({ ok: true, places: [mockPlace] });
    renderNavbar();
    await user.type(screen.getByPlaceholderText("Search places..."), "Sushi");
    await screen.findByText("Sushi Central");

    await user.keyboard("{Escape}");

    expect(screen.queryByText("Sushi Central")).not.toBeInTheDocument();
  });

  test("does not show results when search returns ok false", async () => {
    const user = userEvent.setup();
    search.mockResolvedValue({ ok: false, places: [] });
    renderNavbar();
    await user.type(screen.getByPlaceholderText("Search places..."), "Sushi");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  test("does not show results when search returns empty array", async () => {
    const user = userEvent.setup();
    search.mockResolvedValue({ ok: true, places: [] });
    renderNavbar();

    await user.type(screen.getByPlaceholderText("Search places..."), "xyz");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  // Logged out users see Home, Sign Up, Login
  test("displays logged out nav items when logged out", () => {
    setLoginState(false);
    renderNavbar();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  // Logged in users see Home, Favourites, Add a place, Log out
  test("displays logged in nav items when logged in", () => {
    setLoginState(true);
    renderNavbar();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Favourites")).toBeInTheDocument();
    expect(screen.getByText("Add a place")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  // Profile icon only shows when logged in
  test("displays profile icon when logged in", () => {
    setLoginState(true);
    renderNavbar();
    const profileLink = screen.getByRole("link", { name: /profile/i });
    expect(profileLink).toBeInTheDocument();
  });

  test("does not displays profile icon when logged out", () => {
    setLoginState(false);
    renderNavbar();
    const profileLink = screen.queryByRole("link", { name: /profile/i });
    expect(profileLink).not.toBeInTheDocument();
  });

  test("logged out links go to the right pages", () => {
    setLoginState(false);
    renderNavbar();

    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
    expect(screen.getByText("Sign Up").closest("a")).toHaveAttribute(
      "href",
      "/signup",
    );
    expect(screen.getByText("Login").closest("a")).toHaveAttribute(
      "href",
      "/login",
    );
  });

  test("logged in links go to the right pages", () => {
    setLoginState(true);
    renderNavbar();

    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
    expect(screen.getByText("Favourites").closest("a")).toHaveAttribute(
      "href",
      "/favourites",
    );
    expect(screen.getByText("Add a place").closest("a")).toHaveAttribute(
      "href",
      "/add-place",
    );
  });

  // Profile icon links to profile page
  test("profile icon links to the profile page", () => {
    setLoginState(true);
    renderNavbar();

    const profileLink = screen.getByRole("link", { name: /profile/i });
    expect(profileLink).toHaveAttribute("href", "/profile");
  });
});
