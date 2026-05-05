import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Post from "../../src/components/Post";

describe("Post", () => {
  test("shows loading state", () => {
    vi.stubGlobal("fetch", () => new Promise(() => {}));

    render(<Post />);

    const element = screen.getByText("Loading feed...");
    expect(element).toBeTruthy();
  });

  test("shows no posts when API returns empty", async () => {
    vi.stubGlobal("fetch", () =>
      Promise.resolve({
        ok: true,
        json: async () => ({ posts: [] }),
      }),
    );

    render(<Post />);

    const element = await screen.findByText("No posts found");
    expect(element).toBeTruthy();
  });
});
