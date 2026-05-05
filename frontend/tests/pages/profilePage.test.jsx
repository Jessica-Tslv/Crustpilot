import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { ProfilePage } from "../../src/pages/Profile/ProfilePage.jsx";
import { getMyProfile } from "../../src/services/user.js";
//import { useNavigate } from "react-router-dom";

// Mocking the getPosts service
vi.mock("../../src/services/user", () => {
  const getMyProfileMock = vi.fn();
  return { getMyProfile: getMyProfileMock };
});

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

describe("Profile Page", () => {
  beforeEach(() => {
    window.localStorage.removeItem("token");
  });

  test("It displays email from the backend", async () => {
    window.localStorage.setItem("token", "testToken");

    const user = {
      email: "hunortest1@gmail.com",
      password: "12345678!A",
      profile: {
        firstName: "TestHunor",
        lastName: "One",
        profilePic: "No pic",
        bio: "I am the first Hunor test",
      },
    };

    getMyProfile.mockResolvedValue(user);

    render(<ProfilePage />);

    const resultUser = await screen.findByText("hunortest1@gmail.com");
    expect(resultUser.textContent).toBe("Email: hunortest1@gmail.com");
  });
  test("It displays firstName from the backend", async () => {
    window.localStorage.setItem("token", "testToken");

    const user = {
      email: "hunortest1@gmail.com",
      password: "12345678!A",
      profile: {
        firstName: "TestHunor",
        lastName: "One",
        profilePic: "No pic",
        bio: "I am the first Hunor test",
      },
    };

    getMyProfile.mockResolvedValue(user);

    render(<ProfilePage />);

    const resultUser = await screen.findByText("TestHunor");
    expect(resultUser.textContent).toBe("First name: TestHunor");
    //Edit slightly********^
  });
  test("It displays lastName from the backend", async () => {
    window.localStorage.setItem("token", "testToken");

    const user = {
      email: "hunortest1@gmail.com",
      password: "12345678!A",
      profile: {
        firstName: "TestHunor",
        lastName: "One",
        profilePic: "No pic",
        bio: "I am the first Hunor test",
      },
    };

    getMyProfile.mockResolvedValue(user);

    render(<ProfilePage />);

    const resultUser = await screen.findByText("One");
    expect(resultUser.textContent).toBe("Last name: One");
  });
  test.skip("It displays Profile pic from the backend", async () => {
    window.localStorage.setItem("token", "testToken");

    const user = {
      email: "hunortest1@gmail.com",
      password: "12345678!A",
      profile: {
        firstName: "TestHunor",
        lastName: "One",
        profilePic: "No pic",
        bio: "I am the first Hunor test",
      },
    };

    getMyProfile.mockResolvedValue(user);

    render(<ProfilePage />);

    const resultUser = await screen.findByText("profile pic: No pic");
    expect(resultUser.textContent).toBe("profile pic: No pic");
  });
  test("It displays Bio from the backend", async () => {
    window.localStorage.setItem("token", "testToken");

    const user = {
      email: "hunortest1@gmail.com",
      password: "12345678!A",
      profile: {
        firstName: "TestHunor",
        lastName: "One",
        profilePic: "No pic",
        bio: "I am the first Hunor test",
      },
    };

    getMyProfile.mockResolvedValue(user);

    render(<ProfilePage />);

    const resultUser = await screen.findByText("I am the first Hunor test");
    expect(resultUser.textContent).toBe("Bio: I am the first Hunor test");
  });

  // T_EST("It navigates to login if no token is present", async () => {
  //   render(<FeedPage />);
  //   const navigateMock = useNavigate();
  //   expect(navigateMock).toHaveBeenCalledWith("/login");
  // });
});
