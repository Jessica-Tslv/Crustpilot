import { getPosts, getPostById, addPlace } from "../../src/services/posts";
import { vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import { describe, expect } from "vitest";

describe("posts_service", () => {
  test("getPosts returns data when status is 200", async () => {
    const mockData = { posts: [] };

    vi.stubGlobal("fetch", () =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(mockData),
      }),
    );

    const result = await getPosts("test-token");
    expect(result).toEqual(mockData);
  });

  test("getPosts throws error when status is not 200", async () => {
    vi.stubGlobal("fetch", () =>
      Promise.resolve({
        status: 500,
        json: () => Promise.resolve({}),
      }),
    );

    let error;
    try {
      await getPosts("test-token");
    } catch (err) {
      error = err;
    }

    expect(error).toBeTruthy();
  });

  test("getPostById returns data when status is 200", async () => {
    const mockData = { _id: "1", message: "hello" };

    vi.stubGlobal("fetch", () =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(mockData),
      }),
    );

    const result = await getPostById("1");
    expect(result).toEqual(mockData);
  });

  test("getPostById returns fallback object on failure", async () => {
    vi.stubGlobal("fetch", () =>
      Promise.resolve({
        status: 500,
        json: () => Promise.resolve({}),
      }),
    );

    const result = await getPostById("1");
    expect(result.ok).toBe(false);
  });

  test("addPlace returns data on success", async () => {
    const mockData = { message: "created" };

    vi.stubGlobal("fetch", () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    );

    const result = await addPlace({ name: "test" }, "token");
    expect(result).toEqual(mockData);
  });

  test("addPlace throws error when request fails", async () => {
    vi.stubGlobal("fetch", () =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "fail" }),
      }),
    );

    let error;
    try {
      await addPlace({ name: "test" }, "token");
    } catch (err) {
      error = err;
    }

    expect(error).toBeTruthy();
  });
});

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch function
createFetchMock(vi).enableMocks();

describe("posts service", () => {
  describe("getPosts", () => {
    test("includes a token with its request", async () => {
      fetch.mockResponseOnce(JSON.stringify({ posts: [] }), {
        status: 200,
      });

      await getPosts();

      // This is an array of the arguments that were last passed to fetch
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/posts`);
      expect(options.method).toEqual("GET");
    });

    test("rejects with an error if the status is not 200", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ message: "Something went wrong" }),
        { status: 400 },
      );

      try {
        await getPosts("testToken");
      } catch (err) {
        expect(err.message).toEqual("Unable to fetch posts");
      }
    });
  });

  describe("getPostById", () => {
    test("sends request to the correct URL with the id", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({
          post: { _id: "12345", name: "Sushi Central" },
          ok: true,
        }),
        { status: 200 },
      );

      await getPostById("12345");

      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/posts/12345`);
      expect(options.method).toEqual("GET");
    });

    test("returns post data on success", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({
          ok: true,
          post: { _id: "12345", name: "Sushi Central", cuisine: "Japanese" },
        }),
        { status: 200 },
      );

      const response = await getPostById("12345");

      expect(response.post.name).toEqual("Sushi Central");
      expect(response.post.cuisine).toEqual("Japanese");
    });

    test("rejects with an error if status is not 200", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ message: "Unable to fetch post by id" }),
        { status: 400 },
      );

      try {
        await getPostById("12345");
      } catch (err) {
        expect(err.message).toEqual("Unable to fetch post by id");
      }
    });

    test("returns ok false when network error occurs", async () => {
      fetch.mockRejectOnce(new Error("Network error"));

      const response = await getPostById("12345");

      expect(response.ok).toEqual(false);
      expect(response.message).toEqual(
        "Service is down please try again later",
      );
    });
  });
});
