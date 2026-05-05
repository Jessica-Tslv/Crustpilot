import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { AddPlacePage } from "../../src/pages/AddPlace/AddPlacePage";
import { addPlace } from "../../src/services/posts";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../src/services/posts", () => {
  return {
    addPlace: vi.fn(),
  };
});

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

vi.stubGlobal("localStorage", localStorageMock);

function renderAddPlacePage() {
  return render(
    <MemoryRouter>
      <AddPlacePage />
    </MemoryRouter>
  );
}

function getFormFields(container) {
  const inputs = container.querySelectorAll("input");

  return {
    form: container.querySelector("form"),
    nameInput: inputs[0],
    locationInput: inputs[1],
    imageInput: inputs[2],
    descriptionInput: container.querySelector("textarea"),
    cuisineInput: inputs[3],
    ratingSelect: container.querySelector("select"),
  };
}

function fillForm(container) {
  const {
    nameInput,
    locationInput,
    imageInput,
    descriptionInput,
    cuisineInput,
    ratingSelect,
  } = getFormFields(container);

  const file = new File(["test image"], "pizza.png", {
    type: "image/png",
  });

  fireEvent.change(nameInput, {
    target: { value: "Pizza Palace" },
  });

  fireEvent.change(locationInput, {
    target: { value: "42 Albemarle St, London" },
  });

  fireEvent.change(imageInput, {
    target: { files: [file] },
  });

  fireEvent.change(descriptionInput, {
    target: { value: "Really nice pizza and friendly staff" },
  });

  fireEvent.change(cuisineInput, {
    target: { value: "Italian" },
  });

  fireEvent.change(ratingSelect, {
    target: { value: "4" },
  });

  return file;
}

describe("AddPlacePage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.getItem.mockReturnValue("fake-token");
  });

  test("renders the add place page", () => {
    const { container } = renderAddPlacePage();

    expect(
      screen.getByRole("heading", { name: /add a place/i })
    ).toBeInTheDocument();

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText("Image")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Cuisine")).toBeInTheDocument();
    expect(screen.getByText("First rating")).toBeInTheDocument();

    expect(container.querySelector("form")).toBeInTheDocument();
    expect(container.querySelector('input[type="file"]')).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add place/i })).toBeInTheDocument();
  });

  test("allows a user to fill out the form", async () => {
    const user = userEvent.setup();
    const { container } = renderAddPlacePage();

    const {
      nameInput,
      locationInput,
      imageInput,
      descriptionInput,
      cuisineInput,
      ratingSelect,
    } = getFormFields(container);

    const file = new File(["test image"], "pizza.png", {
      type: "image/png",
    });

    await user.type(nameInput, "Pizza Palace");
    await user.type(locationInput, "42 Albemarle St, London");
    await user.upload(imageInput, file);
    await user.type(descriptionInput, "Really nice pizza and friendly staff");
    await user.type(cuisineInput, "Italian");
    await user.selectOptions(ratingSelect, "4");

    expect(nameInput).toHaveValue("Pizza Palace");
    expect(locationInput).toHaveValue("42 Albemarle St, London");
    expect(imageInput.files[0]).toBe(file);
    expect(descriptionInput).toHaveValue("Really nice pizza and friendly staff");
    expect(cuisineInput).toHaveValue("Italian");
    expect(ratingSelect).toHaveValue("4");
  });

  test("submits the form with FormData and token", async () => {
    addPlace.mockResolvedValue({
      id: "123",
      name: "Pizza Palace",
    });

    const { container } = renderAddPlacePage();

    const file = fillForm(container);
    const { form } = getFormFields(container);

    fireEvent.submit(form);

    await waitFor(() => {
      expect(addPlace).toHaveBeenCalledTimes(1);
    });

    const [formData, token] = addPlace.mock.calls[0];

    expect(token).toBe("fake-token");
    expect(formData).toBeInstanceOf(FormData);
    expect(formData.get("name")).toBe("Pizza Palace");
    expect(formData.get("location")).toBe("42 Albemarle St, London");
    expect(formData.get("message")).toBe("Really nice pizza and friendly staff");
    expect(formData.get("cuisine")).toBe("Italian");
    expect(formData.get("rating")).toBe("4");
    expect(formData.get("image")).toBe(file);
  });

  test("navigates to homepage after successfully adding a place", async () => {
    addPlace.mockResolvedValue({
      id: "123",
      name: "Pizza Palace",
    });

    const { container } = renderAddPlacePage();

    fillForm(container);
    fireEvent.submit(getFormFields(container).form);

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/");
    });
  });

  test("shows an error message if adding a place fails", async () => {
    addPlace.mockRejectedValue(new Error("Could not add place"));

    const { container } = renderAddPlacePage();

    fillForm(container);
    fireEvent.submit(getFormFields(container).form);

    expect(await screen.findByText("Could not add place")).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalledWith("/");
  });

  test("removes token and navigates to login if user is unauthorized", async () => {
    addPlace.mockRejectedValue(new Error("Unauthorized"));

    const { container } = renderAddPlacePage();

    fillForm(container);
    fireEvent.submit(getFormFields(container).form);

    await waitFor(() => {
      expect(localStorage.removeItem).toHaveBeenCalledWith("token");
      expect(navigateMock).toHaveBeenCalledWith("/login");
    });
  });

  test("removes token and navigates to login if there is a token error", async () => {
    addPlace.mockRejectedValue(new Error("Invalid token"));

    const { container } = renderAddPlacePage();

    fillForm(container);
    fireEvent.submit(getFormFields(container).form);

    await waitFor(() => {
      expect(localStorage.removeItem).toHaveBeenCalledWith("token");
      expect(navigateMock).toHaveBeenCalledWith("/login");
    });
  });
});