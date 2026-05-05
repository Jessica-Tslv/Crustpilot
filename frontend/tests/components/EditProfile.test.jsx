import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { updateUserProfile } from "../../src/services/user.js";
import { ProfilePage } from "../../src/pages/Profile/ProfilePage.jsx";
import { getMyProfile } from "../../src/services/user.js";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
//import { useNavigate } from "react-router-dom";

// 1. Unified Mock
vi.mock("../../src/services/user", () => ({
  updateUserProfile: vi.fn(),
  getMyProfile: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

describe("Updating profile page", () => {
  test("It changes the first name from 'TestHunor' to 'Jess'", async () => {
    const userEv = userEvent.setup();

    // 2. Arrange: Mock the initial data load
    const mockUser = {
      _id: "123",
      email: "hunortest1@gmail.com",
      profile: {
        firstName: "TestHunor",
        lastName: "One",
        bio: "I am the first Hunor test",
      },
    };
    getMyProfile.mockResolvedValue(mockUser);

    // Mock the successful update response
    const updatedUserResponse = {
      user: {
        ...mockUser,
        profile: { ...mockUser.profile, firstName: "Jess" },
      },
    };
    updateUserProfile.mockResolvedValue(updatedUserResponse);

    // 3. Act: Initial Render
    render(<ProfilePage />);

    // Wait for loading to disappear and check initial state
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
    expect(screen.getByText(/TestHunor/)).toBeInTheDocument();

    // 4. Act: Trigger Edit Mode
    const editBtn = screen.getByRole("button", { name: /edit profile/i });
    await userEv.click(editBtn);

    // 5. Act: Find the input and type (using the Label text from your JSX)
    const firstNameInput = screen.getByLabelText(/First name/i);
    await userEv.clear(firstNameInput);
    await userEv.type(firstNameInput, "Jess");

    // 6. Act: Submit (using the save-button role you defined)
    const saveBtn = screen.getByRole("save-button");
    await userEv.click(saveBtn);

    // 7. Assert: Check API call
    expect(updateUserProfile).toHaveBeenCalledWith(
      "123",
      expect.objectContaining({
        profile: expect.objectContaining({ firstName: "Jess" }),
      }),
    );

    // 8. Assert: Check UI update
    // Note: your component re-renders with "First name: Jess"
    const updatedNameDisplay = await screen.findByText(/Jess/);
    expect(updatedNameDisplay).toBeInTheDocument();
  });

  test("It changes the last name from one to two", async () => {
    const userEv = userEvent.setup();

    // 2. Arrange: Mock the initial data load
    const mockUser = {
      _id: "123",
      email: "hunortest1@gmail.com",
      profile: {
        firstName: "TestHunor",
        lastName: "One",
        bio: "I am the first Hunor test",
      },
    };
    getMyProfile.mockResolvedValue(mockUser);

    // Mock the successful update response
    const updatedUserResponse = {
      user: {
        ...mockUser,
        profile: { ...mockUser.profile, lastName: "Two" },
      },
    };
    updateUserProfile.mockResolvedValue(updatedUserResponse);

    // 3. Act: Initial Render
    render(<ProfilePage />);

    // Wait for loading to disappear and check initial state
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
    expect(screen.getByText(/One/)).toBeInTheDocument();

    // 4. Act: Trigger Edit Mode
    const editBtn = screen.getByRole("button", { name: /edit profile/i });
    await userEv.click(editBtn);

    // 5. Act: Find the input and type (using the Label text from your JSX)
    const lastNameInput = screen.getByLabelText(/Last name/i);
    await userEv.clear(lastNameInput);
    await userEv.type(lastNameInput, "Two");

    // 6. Act: Submit (using the save-button role you defined)
    const saveBtn = screen.getByRole("save-button");
    await userEv.click(saveBtn);

    // 7. Assert: Check API call
    expect(updateUserProfile).toHaveBeenCalledWith(
      "123",
      expect.objectContaining({
        profile: expect.objectContaining({ lastName: "Two" }),
      }),
    );

    // 8. Assert: Check UI update
    // Note: your component re-renders with "First name: Jess"
    const updatedNameDisplay = await screen.findByText(/Two/);
    expect(updatedNameDisplay).toBeInTheDocument();
  });

  test("It changes the email to a new email", async () => {
    const userEv = userEvent.setup();

    // 2. Arrange: Mock the initial data load
    const mockUser = {
      _id: "123",
      email: "hunortest1@gmail.com",
      profile: {
        firstName: "TestHunor",
        lastName: "One",
        bio: "I am the first Hunor test",
      },
    };
    getMyProfile.mockResolvedValue(mockUser);

    // Mock the successful update response
    const updatedUserResponse = {
      user: {
        ...mockUser,
        email: "hunor2@gmail.com",
      },
    };
    updateUserProfile.mockResolvedValue(updatedUserResponse);

    // 3. Act: Initial Render
    render(<ProfilePage />);

    // Wait for loading to disappear and check initial state
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
    expect(screen.getByText(/One/)).toBeInTheDocument();

    // 4. Act: Trigger Edit Mode
    const editBtn = screen.getByRole("button", { name: /edit profile/i });
    await userEv.click(editBtn);

    // 5. Act: Find the input and type (using the Label text from your JSX)
    const emailInput = screen.getByLabelText(/Email/i);
    await userEv.clear(emailInput);
    await userEv.type(emailInput, "hunor2@gmail.com");

    // 6. Act: Submit (using the save-button role you defined)
    const saveBtn = screen.getByRole("save-button");
    await userEv.click(saveBtn);

    // 7. Assert: Check API call
    expect(updateUserProfile).toHaveBeenCalledWith(
      "123",
      expect.objectContaining({
        email: "hunor2@gmail.com",
      }),
    );

    // 8. Assert: Check UI update
    // Note: your component re-renders with "First name: Jess"
    const updatedNameDisplay = await screen.findByText(/hunor2@gmail.com/);
    expect(updatedNameDisplay).toBeInTheDocument();
  });

  test("It changes the bio to a new bio", async () => {
    const userEv = userEvent.setup();

    // 2. Arrange: Mock the initial data load
    const mockUser = {
      _id: "123",
      email: "hunortest1@gmail.com",
      profile: {
        firstName: "TestHunor",
        lastName: "One",
        bio: "I am the first Hunor test",
      },
    };
    getMyProfile.mockResolvedValue(mockUser);

    // Mock the successful update response
    const updatedUserResponse = {
      user: {
        ...mockUser,
        profile: { ...mockUser.profile, bio: "update bio test" },
      },
    };
    updateUserProfile.mockResolvedValue(updatedUserResponse);

    // 3. Act: Initial Render
    render(<ProfilePage />);

    // Wait for loading to disappear and check initial state
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
    expect(screen.getByText(/One/)).toBeInTheDocument();

    // 4. Act: Trigger Edit Mode
    const editBtn = screen.getByRole("button", { name: /edit profile/i });
    await userEv.click(editBtn);

    // 5. Act: Find the input and type (using the Label text from your JSX)
    const bioInput = screen.getByLabelText(/bio/i);
    await userEv.clear(bioInput);
    await userEv.type(bioInput, "update bio test");

    // 6. Act: Submit (using the save-button role you defined)
    const saveBtn = screen.getByRole("save-button");
    await userEv.click(saveBtn);

    // 7. Assert: Check API call
    expect(updateUserProfile).toHaveBeenCalledWith(
      "123",
      expect.objectContaining({
        profile: expect.objectContaining({ bio: "update bio test" }),
      }),
    );

    // 8. Assert: Check UI update
    //Note: your component re-renders with the new bio text
    const updatedNameDisplay = await screen.findByText(/update bio test/);
    expect(updatedNameDisplay).toBeInTheDocument();
  });
});
