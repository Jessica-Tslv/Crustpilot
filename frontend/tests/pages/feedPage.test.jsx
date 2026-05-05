import { render } from "@testing-library/react";
import { vi } from "vitest";
import { FeedPage } from "../../src/pages/Feed/FeedPage";

vi.mock("../../src/components/Post", () => ({
  default: () => <div>Mocked Post Component</div>,
}));

describe("FeedPage", () => {
  test("renders the Post component", () => {
    const { getByText } = render(<FeedPage />);
    const element = getByText("Mocked Post Component");
    expect(element).toBeTruthy();
  });
});
