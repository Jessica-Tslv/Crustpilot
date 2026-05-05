import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { Navbar } from "../../src/components/Navbar/Navbar";
// import { PlacePopup } from "../../src/components/PlacePopup/PlacePopup";
import { getPostById } from "../../src/services/posts";
import { search } from "../../src/services/search";

//Mock the full local storage object
const localStorageMock = {
  getItem: vi.fn(() => "testToken"),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
};

global.localStorage = localStorageMock;

// Mocking the getPostById service
vi.mock("../../src/services/posts", () => {
  const getPostByIdMock = vi.fn();
  return { getPostById: getPostByIdMock };
});

// Mocking the search service
vi.mock("../../src/services/search", () => {
  const searchMock = vi.fn();
  return { search: searchMock };
});

// Mock place data
const mockPlace = {
  _id: "64a1b2c3d4e5f6a7b8c9d0e4",
  name: "Sushi Central",
  ratings: [
    { user: "64a1b2c3d4e5f6a7b8c9d0e5", value: 3 },
    { user: "64a1b2c3d4e5f6a7b8c9d0e6", value: 4 },
    { user: "64a1b2c3d4e5f6a7b8c9d0e7", value: 5 },
    { user: "64a1b2c3d4e5f6a7b8c9d0e8", value: 4 },
  ],
  message: "Fresh sushi every day.",
  cuisine: "Japanese",
  image: "https://example.com/sushi.jpg",
  location: "45 High St, Manchester",
  author: "64a1b2c3d4e5f6a7b8c9d0e5",
};

// Reusable helper to open the popup
async function openPopup() {
  const user = userEvent.setup();
  search.mockResolvedValue({ ok: true, places: [mockPlace] });
  getPostById.mockResolvedValue({ ok: true, place: mockPlace });
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>,
  );

  const searchInput = screen.getByPlaceholderText("Search places...");
  await user.type(searchInput, "Sushi");
  const result = await screen.findByText(
    "Sushi Central",
    {},
    { timeout: 2000 },
  );
  await user.click(result);
  return user;
}


describe("Place pop up", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    //Default to log out after each tests
    localStorageMock.getItem.mockReturnValue(null);
  });

  test("popup appears when user clicks a search result", async () => {
    await openPopup();
    expect(document.querySelector(".place-popup-details")).toBeInTheDocument();
  });

  test("popup displays the correct place name after clicking result", async () => {
    await openPopup();
    expect(screen.getByText("Sushi Central")).toBeInTheDocument();
  });

  test("popup displays the correct image after clicking result", async () => {
    await openPopup();
    expect(screen.getByAltText("Image of Sushi Central")).toBeInTheDocument();
  });

  test("popup displays the correct cuisine after clicking result", async () => {
    await openPopup();
    expect(screen.getByText("Japanese")).toBeInTheDocument();
  });

  test("search results disappear after clicking a result", async () => {
    await openPopup();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  test("popup closes when X button is clicked", async () => {
    const user = await openPopup();
    const closeButton = screen.getByRole("button");
    await user.click(closeButton);
    expect(
      document.querySelector(".place-popup-details"),
    ).not.toBeInTheDocument();
  });
  test("popup closes when background is clicked", async () => {
    const user = await openPopup();
    const popupBackground = document.querySelector(".popup-background");
    await user.click(popupBackground);
    expect(
      document.querySelector(".place-popup-details"),
    ).not.toBeInTheDocument();
  });

  test("popup image is gone after closing", async () => {
    const user = await openPopup();
    const closeButton = screen.getByRole("button");
    await user.click(closeButton);
    expect(
      screen.queryByAltText("Image of Sushi Central"),
    ).not.toBeInTheDocument();
  });

  test("popup does not appear on initial render", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );
    expect(
      document.querySelector(".place-popup-details"),
    ).not.toBeInTheDocument();
  });
});
