import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { updateUserPassword, getMyProfile } from "../../src/services/user.js";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { ProfilePage } from "../../src/pages/Profile/ProfilePage.jsx";

vi.mock("../../src/services/user", () => ({
    updateUserPassword: vi.fn(),
    getMyProfile: vi.fn(),
}));
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));
describe("Updating user password", () => {
  test.skip("current password matches saved, new password is sufficiently, long, password updates correctly", async () => {
  const userEv = userEvent.setup();
  const mockUser = {
    _id: "123",
    email: "hunortest1@gmail.com",
    profile: {
      firstName: "TestHunor",
      lastName: "One",
      bio: "I am the first Hunor test",
    },
    password: 'passwordtest' //(non-hashed password)
  }
  getMyProfile.mockResolvedValue(mockUser);

  //render the profile page:
    render(<ProfilePage />);
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });

    // 4. Act: Trigger Change Password Mode
    const passwordBtn = screen.getByRole("button", { name: /change password/i });
    await userEv.click(passwordBtn);
    // 5.1 Act: Find the input and simulate typing the correct current password
    const currentInput = screen.getByLabelText(/currentPassword/i);
    await userEv.clear(currentInput);
    await userEv.type(currentInput, "passwordtest");
    // 5.2 Act: Find the input and simulate typing a sufficiently long new password
    const newInput = screen.getByLabelText(/newPassword/i);
    await userEv.clear(newInput);
    await userEv.type(newInput, "newpasswordtest");
    // 6. Act: Submit (using the save-button role you defined)
    const saveBtn = screen.getByRole("save-button");
    await userEv.click(saveBtn);
    // 7. Assert: Check API call
  expect(updateUserPassword).toHaveBeenCalledWith(
      "123",
      expect.objectContaining({
      current_password: "passwordtest",
      new_password: "newpasswordtest",
      }),
    );

    // 8. Assert: Check UI update
    //Note: your component re-renders and says new password saved
    const updatedmessageDisplay = await screen.findByText(/Password updated successfully!/);
    expect(updatedmessageDisplay).toBeInTheDocument();

  










    

  })
  test.skip("current password does not match saved, new password is sufficiently long, password gives relevant error", async () => {
  const userEv = userEvent.setup();
  const mockUser = {
    _id: "123",
    email: "hunortest1@gmail.com",
    profile: {
      firstName: "TestHunor",
      lastName: "One",
      bio: "I am the first Hunor test",
    },
    password: 'passwordtest' //(non-hashed password)
  }
  getMyProfile.mockResolvedValue(mockUser);
  updateUserPassword.mockRejectedValue(new Error("Current password incorrect"));
  //render the profile page:
    render(<ProfilePage />);
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });

    // 4. Act: Trigger Change Password Mode
    const passwordBtn = screen.getByRole("button", { name: /change password/i });
    await userEv.click(passwordBtn);
    // 5.1 Act: Find the input and simulate typing the incorrect current password
    const currentInput = screen.getByLabelText(/currentPassword/i);
    await userEv.clear(currentInput);
    await userEv.type(currentInput, "notpasswordtest");
    // 5.2 Act: Find the input and simulate typing a sufficiently long new password
    const newInput = screen.getByLabelText(/newPassword/i);
    await userEv.clear(newInput);
    await userEv.type(newInput, "newpasswordtest");
    // 6. Act: Submit (using the save-button role you defined)
    const saveBtn = screen.getByRole("save-button");
    await userEv.click(saveBtn);
    // 7. Assert: Check API call
  expect(updateUserPassword).toHaveBeenCalledWith(
      "123",
      expect.objectContaining({
      current_password: "notpasswordtest",
      new_password: "newpasswordtest",
      }),
    );

    // 8. Assert: Check UI update
    //Note: your component re-renders and says current password incorrect
    const updatedmessageDisplay = await screen.findByText(/Current password incorrect/);
    expect(updatedmessageDisplay).toBeInTheDocument();

    

  })

  test("current password matches saved, new password is too short, gives relevant error", async () => {
  const userEv = userEvent.setup();
  const mockUser = {
    _id: "123",
    email: "hunortest1@gmail.com",
    profile: {
      firstName: "TestHunor",
      lastName: "One",
      bio: "I am the first Hunor test",
    },
    password: 'passwordtest' //(non-hashed password)
  }
  getMyProfile.mockResolvedValue(mockUser);
  updateUserPassword.mockRejectedValue(new Error("New password is too short (min 8 characters)"));
  //render the profile page:
    render(<ProfilePage />);
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });

    // 4. Act: Trigger Change Password Mode
    const passwordBtn = screen.getByRole("button", { name: /change password/i });
    await userEv.click(passwordBtn);
    // 5.1 Act: Find the input and simulate typing the correct current password
    const currentInput = screen.getByLabelText(/currentPassword/i);
    await userEv.clear(currentInput);
    await userEv.type(currentInput, "passwordtest");
    // 5.2 Act: Find the input and simulate typing a password that is too short
    const newInput = screen.getByLabelText(/newPassword/i);
    await userEv.clear(newInput);
    await userEv.type(newInput, "short");
    // 6. Act: Submit (using the save-button role you defined)
    const saveBtn = screen.getByRole("save-button");
    await userEv.click(saveBtn);
    // 7. Assert: Check API call
  expect(updateUserPassword).toHaveBeenCalledWith(
      "123",
      expect.objectContaining({
      current_password: "passwordtest",
      new_password: "short",
      }),
    );

    // 8. Assert: Check UI update
    //Note: your component re-renders and says new password too short
    const updatedmessageDisplay = await screen.findByText(/New password is too short \(min 8 characters\)/);
    expect(updatedmessageDisplay).toBeInTheDocument();

    

  })
})



