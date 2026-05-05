const request = require("supertest");

const app = require("../../app");
const Post = require("../../models/post");

require("../mongodb_helper");

describe("/search", () => {
  // Seed test data before each test
  beforeEach(async () => {
    await Post.create([
      { name: "Dishoom", cuisine: "Indian" },
      { name: "Nando's", cuisine: "Portuguese" },
      { name: "Burger & Lobster", cuisine: "American" },
    ]);
  });

  afterEach(async () => {
    await Post.deleteMany({});
  });

  describe("GET /(search places)", () => {
    test("responds with 200 and success message", async () => {
      const response = await request(app).get("/search?searchQuery=Dishoom");

      expect(response.status).toEqual(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.message).toEqual("Results found");
    });

    test("responds with results when searching by name", async () => {
      const response = await request(app).get("/search?searchQuery=Dishoom");

      expect(response.status).toEqual(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.places).toHaveLength(1);
      expect(response.body.places[0].name).toEqual("Dishoom");
    });

    test("responds with 200 and results when searching by cuisine", async () => {
      const response = await request(app).get("/search?searchQuery=Indian");

      expect(response.status).toEqual(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.places[0].cuisine).toEqual("Indian");
    });

    test("search is case insensitive", async () => {
      const response = await request(app).get("/search?searchQuery=dishoom");

      expect(response.status).toEqual(200);
      expect(response.body.places[0].name).toEqual("Dishoom");
    });

    test("responds with results when searching with 2 letters", async () => {
      const response = await request(app).get("/search?searchQuery=Di");
      expect(response.status).toEqual(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.places[0].name).toEqual("Dishoom");
    });

    test("responds with results when searching with 1 letter", async () => {
      const response = await request(app).get("/search?searchQuery=D");
      expect(response.status).toEqual(200);
      expect(response.body.places).not.toHaveLength(0);
    });

    test("returns multiple results when multiple places match", async () => {
      const response = await request(app).get("/search?searchQuery=an"); // matches "Nando's" and "Indian"
      expect(response.status).toEqual(200);
      expect(response.body.places.length).toBeGreaterThan(1);
    });

    test("handles special characters in search query", async () => {
      const response = await request(app).get("/search?searchQuery=Nando's");
      expect(response.status).toEqual(200);
      expect(response.body.places[0].name).toEqual("Nando's");
    });

    test("responds with 404 when searching with numbers", async () => {
      const response = await request(app).get("/search?searchQuery=123");
      expect(response.status).toEqual(404);
      expect(response.body.ok).toBe(false);
    });

    test("responds with 400 when search query is only whitespace", async () => {
      const response = await request(app).get("/search?searchQuery= ");
      expect(response.status).toEqual(400);
      expect(response.body.ok).toBe(false);
    });

    test("responds with 404 when no places found", async () => {
      const response = await request(app).get(
        "/search?searchQuery=xyz123notreal",
      );

      expect(response.status).toEqual(404);
      expect(response.body.ok).toBe(false);
      expect(response.body.message).toEqual("No place found");
    });

    test("responds with 400 when no search query provided", async () => {
      const response = await request(app).get("/search");

      expect(response.status).toEqual(400);
      expect(response.body.ok).toBe(false);
      expect(response.body.message).toEqual("Search query is required");
    });

    // Only returns name and cuisine
    test("only returns name and cuisine fields", async () => {
      const response = await request(app).get("/search?searchQuery=Dishoom");

      expect(response.body.places[0]).toHaveProperty("name");
      expect(response.body.places[0]).toHaveProperty("cuisine");
      expect(response.body.places[0]).not.toHaveProperty("message");
      expect(response.body.places[0]).not.toHaveProperty("rating");
      expect(response.body.places[0]).not.toHaveProperty("image");
      expect(response.body.places[0]).not.toHaveProperty("location");
    });
  });
});
