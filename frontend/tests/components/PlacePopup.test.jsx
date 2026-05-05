import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { PlacePopup } from "../../src/components/PlacePopup/PlacePopup";
import { getPostById } from "../../src/services/posts";

// Mock the full local storage object
const localStorageMock = {
  getItem: vi.fn(() => "testToken"),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
};
global.localStorage = localStorageMock;

// Helper to simulate logged in/out by mocking localStorage token
function setLoginState(loggedIn) {
  localStorageMock.getItem.mockReturnValue(loggedIn ? "fake-token" : null);
}

// Mocking the getPostById service
vi.mock("../../src/services/posts", () => {
  const getPostByIdMock = vi.fn();
  return { getPostById: getPostByIdMock };
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

// Reusable render function
function renderPlacePopup(placeId = mockPlace._id, onClose = vi.fn()) {
  render(
    <BrowserRouter>
      <PlacePopup placeId={placeId} onClose={onClose} />
    </BrowserRouter>,
  );
}

describe("Place pop up", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Default to logged out after each test
    localStorageMock.getItem.mockReturnValue(null);
    getPostById.mockResolvedValue({ ok: true, place: mockPlace });
  });

  test("does not render when no place is passed", async () => {
    render(
      <BrowserRouter>
        <PlacePopup placeId={null} onClose={vi.fn()} />
      </BrowserRouter>,
    );
    const popup = await screen.queryByText("Sushi Central");
    expect(popup).not.toBeInTheDocument();
    expect(
      await screen.queryByAltText("Image of Sushi Central"),
    ).not.toBeInTheDocument();
  });

  test("renders when a place is passed", async () => {
    renderPlacePopup();
    const popup = await screen.findByText("Sushi Central");
    expect(popup).toBeInTheDocument();
    expect(
      await screen.findByAltText("Image of Sushi Central"),
    ).toBeInTheDocument();
  });

  test("displays the popup when logged out", async () => {
    setLoginState(false);
    renderPlacePopup();
    const popup = await screen.findByText("Sushi Central");
    expect(popup).toBeInTheDocument();
    expect(
      await screen.findByAltText("Image of Sushi Central"),
    ).toBeInTheDocument();
  });

  test("displays the popup when logged in", async () => {
    setLoginState(true);
    renderPlacePopup();
    const popup = await screen.findByText("Sushi Central");
    expect(popup).toBeInTheDocument();
    expect(
      await screen.findByAltText("Image of Sushi Central"),
    ).toBeInTheDocument();
  });

  test("displays the place name", async () => {
    renderPlacePopup();
    expect(await screen.findByText("Sushi Central")).toBeInTheDocument();
  });

  test("displays the place image with correct alt text", async () => {
    renderPlacePopup();
    expect(
      await screen.findByAltText("Image of Sushi Central"),
    ).toBeInTheDocument();
  });

  test("displays the cuisine tag", async () => {
    renderPlacePopup();
    expect(await screen.findByText("Japanese")).toBeInTheDocument();
  });

  test("displays the place message", async () => {
    renderPlacePopup();
    expect(
      await screen.findByText("Fresh sushi every day."),
    ).toBeInTheDocument();
  });

  test("displays the location", async () => {
    renderPlacePopup();
    expect(
      await screen.findByText(/45 High St, Manchester/),
    ).toBeInTheDocument();
  });

  test("displays 5 rating stars", async () => {
    renderPlacePopup();
    await waitFor(() => {
      expect(document.querySelectorAll(".search-result-star")).toHaveLength(5);
    });
  });

  test("displays the correct number of filled stars based on average", async () => {
    // ratings [3,4,5,4] => avg 4 => 4 filled stars
    renderPlacePopup();
    await waitFor(() => {
      expect(
        document.querySelectorAll(".search-result-star.filled"),
      ).toHaveLength(4);
    });
  });

  test("displays the average rating value", async () => {
    // avg of [3,4,5,4] = 4
    renderPlacePopup();
    expect(await screen.findByText(/4\.0/)).toBeInTheDocument();
  });

  test("displays the total number of ratings", async () => {
    renderPlacePopup();
    expect(await screen.findByText(/\(4\)/)).toBeInTheDocument();
  });

  test("handles empty ratings without crashing", async () => {
    renderPlacePopup({ ...mockPlace, ratings: [] });
    await waitFor(() => {
      expect(
        document.querySelectorAll(".search-result-star.filled"),
      ).toHaveLength(0);
    });
  });

  test("renders the embedded Google Maps iframe", async () => {
    renderPlacePopup();
    await waitFor(() => {
      expect(document.querySelector("iframe")).toBeInTheDocument();
    });
  });

  test("iframe src contains the encoded place name and location", async () => {
    renderPlacePopup();
    await waitFor(() => {
      const iframe = document.querySelector("iframe");
      expect(iframe.src).toContain(encodeURIComponent("Sushi Central"));
      expect(iframe.src).toContain(
        encodeURIComponent("45 High St, Manchester"),
      );
    });
  });

  test("location link opens in a new tab with noreferrer", async () => {
    renderPlacePopup();
    await waitFor(() => {
      const links = document.querySelectorAll("a.location-link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noreferrer");
      });
    });
  });

  test("renders the close button", async () => {
    renderPlacePopup();
    expect(
      await screen.findByRole("button"),
    ).toBeInTheDocument();
  });

  test("calls onClose when X button is clicked", async () => {
    const user = userEvent.setup(); // Initialize user-event
    const onClose = vi.fn();
    renderPlacePopup(mockPlace, onClose);
    const button = await screen.findByRole('button');
    await user.click(button);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
