import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom"; //Needs install -> npm install --save-dev @testing-library/jest-dom
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// import { login } from "../../src/services/authentication";

// import { LoginPage } from "../../src/pages/Login/LoginPage";

// Mocking React Router
const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// Mocking the login service
vi.mock("../../src/services/authentication", () => ({
  login: vi.fn(),
}));

import { login } from "../../src/services/authentication";

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

import { LoginPage } from "../../src/pages/Login/LoginPage";

// Reusable function for filling out login form
async function completeLoginForm() {
  const user = userEvent.setup();

  const emailInputEl = screen.getByLabelText(/email/i);
  const passwordInputEl = screen.getByLabelText(/password/i);
  const submitButtonEl = screen.getByRole("button", { name: /Log In/i });

  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "1234");
  await user.click(submitButtonEl);
}

describe("Login Page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("allows a user to login", async () => {
    login.mockResolvedValue({
      token: "secrettoken123",
    });
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await completeLoginForm();

    expect(login).toHaveBeenCalledWith("test@email.com", "1234");
  });

  test("navigates to / on successful login and stores token", async () => {
    login.mockResolvedValue({
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMifQ.signature",
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await completeLoginForm();

    expect(login).toHaveBeenCalledWith("test@email.com", "1234");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "token",
      "secrettoken123",
    );
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  test("failed login shows error and stays on page", async () => {
    login.mockRejectedValue(new Error("Error logging in"));
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );
    await completeLoginForm();

    // expect(navigateMock).not.toHaveBeenCalled();
    expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
  });
});
