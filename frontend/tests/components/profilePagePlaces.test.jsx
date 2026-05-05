import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ProfilePage } from "../../src/pages/Profile/ProfilePage";
import { getMyProfile } from "../../src/services/user";
import "@testing-library/jest-dom";

// Mock the user service
vi.mock("../../src/services/user", () => ({
  getMyProfile: vi.fn(),
}));
// Mock useNavigate (required for EditProfile component inside ProfilePage)
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});
const mockPostsResponse = {
  posts: [
    {
      _id: "abc123",
      name: "Test Bistro",
      message: "Great food!",
      location: "Newcastle",
      author: "123", // Must match the localStorage user_id
    },
    {
      _id: "abc123",
      name: "Test Nandos",
      message: "Great food!",
      location: "Newcastle",
      author: "456", // Must match the localStorage user_id
    },
  ],
};
describe("Showing added places", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();

    // Mock the global fetch for ProfilePagePlaces.jsx
    globalThis.fetch = vi.fn();
  });
  test("It displays place belonging to the user", async () => {
    const userId = "123";
    window.localStorage.setItem("token", "testToken");
    window.localStorage.setItem("user_id", userId); // Critical for the author filter

    const mockUser = {
      _id: userId,
      email: "hunortest1@gmail.com",
      profile: { firstName: "TestHunor", lastName: "One", bio: "Bio" },
    };

    // Setup service and fetch mocks
    getMyProfile.mockResolvedValue(mockUser);
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockPostsResponse,
    });

    // Render only the parent inside a Router
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    // findBy queries wait for the loading state to disappear

    const postTitle = await screen.findByRole("heading", {
      name: /Test Bistro/i,
    });
    expect(postTitle).toBeInTheDocument();
  });
  test("It only display's the first user's place, when loggged in, not the second user's place", async () => {
    const userId = "123";
    const mockUser = {
      _id: userId,
      email: "hunortest1@gmail.com",
      profile: { firstName: "TestHunor", lastName: "One", bio: "Bio" },
    };
    window.localStorage.setItem("token", "testToken");
    window.localStorage.setItem("user_id", userId); // Critical for the author filter

    // Setup service and fetch mocks
    getMyProfile.mockResolvedValue(mockUser);
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockPostsResponse,
    });

    // Render only the parent inside a Router
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    const postTitle = await screen.findByRole("heading", {
      name: /Test Bistro/i,
    });
    expect(postTitle).toBeInTheDocument();
    const postFakeTitle = screen.queryByText(/Nandos/i);
    expect(postFakeTitle).not.toBeInTheDocument();
  });
  test("It only display's the second user's place, when loggged in, not the first user's place", async () => {
    const userId = "456";

    const mockUser = {
      _id: userId,
      email: "otherest1@gmail.com",
      profile: { firstName: "OtherTets", lastName: "Two", bio: "BioTwo" },
    };

    window.localStorage.setItem("token", "testToken");
    window.localStorage.setItem("user_id", userId); // Critical for the author filter

    // Setup service and fetch mocks
    getMyProfile.mockResolvedValue(mockUser);
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockPostsResponse,
    });

    // Render only the parent inside a Router
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    const postTitle = await screen.findByRole("heading", {
      name: /Test Nandos/i,
    });
    expect(postTitle).toBeInTheDocument();
    const postFakeTitle = screen.queryByRole("heading", {
      name: /Test Bistro/i,
    });
    expect(postFakeTitle).not.toBeInTheDocument();
  });
});
