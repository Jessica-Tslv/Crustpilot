import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom"; //Needs install -> npm install --save-dev @testing-library/jest-dom
import { MemoryRouter } from "react-router-dom";

import { vi } from "vitest";

import { signup } from "../../src/services/authentication";

import { SignupPage } from "../../src/pages/Signup/SignupPage";

// Mocking React Router
const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// Mocking the signup service
vi.mock("../../src/services/authentication", () => {
  return {
    signup: vi.fn(),
  };
});

// Reusable function for filling out signup form
async function completeSignupForm() {
  const user = userEvent.setup();
  const firstNameEl = screen.getByLabelText("First Name");
  const surnameEl = screen.getByLabelText("Surname");
  const emailInputEl = screen.getByLabelText("Email");
  const passwordInputEl = screen.getByLabelText("Password");
  const confirmPasswordEl = screen.getByLabelText("Confirm Password");
  const submitButtonEl = screen.getByRole("button", { name: /sign up/i });

  await user.type(firstNameEl, "Jess");
  await user.type(surnameEl, "Test");
  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "1234");
  await user.type(confirmPasswordEl, "1234");
  await user.click(submitButtonEl);
}

describe("Signup Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("allows a user to signup", async () => {
    signup.mockResolvedValue({});

    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>,
    );

    await completeSignupForm();

    expect(signup).toHaveBeenCalledWith(
      "Jess",
      "Test",
      "test@email.com",
      "1234",
    );
  });

  test("navigates to /login on successful signup", async () => {
    signup.mockResolvedValue({});

    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>,
    );

    await completeSignupForm();

    expect(navigateMock).toHaveBeenCalledWith(
      "/login",
      expect.objectContaining({
        state: {
          message: "Account created successfully.",
        },
      }),
    );
  });

  test("shows error on unsuccessful signup", async () => {
    signup.mockRejectedValue(new Error("Error signing up"));

    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>,
    );

    await completeSignupForm();

    expect(screen.getByText("Error signing up")).toBeInTheDocument();
  });
});
