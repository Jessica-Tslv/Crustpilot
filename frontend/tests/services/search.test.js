import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi } from "vitest";
import { search } from "../../src/services/search";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch function
createFetchMock(vi).enableMocks();

describe("Search service", () => {
  test("sends request to the correct URL with searchQuery", async () => {
    fetch.mockResponseOnce(JSON.stringify({ ok: true }), {
      status: 200,
    });

    await search("Dishoom");
    const fetchArguments = fetch.mock.lastCall;
    const url = fetchArguments[0];
    const options = fetchArguments[1];

    expect(url).toEqual(`${BACKEND_URL}/search?searchQuery=Dishoom`);
    expect(options.method).toEqual("GET");
  });

  // Returns data on success
  test("returns data on success", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        ok: true,
        places: [{ name: "Dishoom", cuisine: "Indian" }],
      }),
      { status: 200 },
    );

    const response = await search("Dishoom");
    expect(response.ok).toEqual(true);
    expect(response.places[0].name).toEqual("Dishoom");
  });

  test("rejects with an error if status is not 200", async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: "No place found" }), {
      status: 404,
    });

    try {
      await search("xyz123");
    } catch (err) {
      expect(err.message).toEqual("Unable to get search result");
    }
  });
  test("returns service down message if fetch throws error", async () => {
    fetch.mockRejectOnce(new Error("Network error"));

    const response = await search("Dishoom");
    expect(response.ok).toEqual(false);
    expect(response.message).toEqual("Service is down please try again later");
  });
});
