const Post = require("../../models/post");

describe("Post model", () => {
  test("creates a post with basic fields", () => {
    const post = new Post({
      name: "Test Restaurant",
      message: "Great food",
      cuisine: "Indian",
      image: "img.jpg",
      location: "London",
    });

    expect(post.name).toBe("Test Restaurant");
    expect(post.message).toBe("Great food");
    expect(post.cuisine).toBe("Indian");
    expect(post.image).toBe("img.jpg");
    expect(post.location).toBe("London");
  });

  test("initialises ratings as empty array by default", () => {
    const post = new Post({});
    expect(Array.isArray(post.ratings)).toBe(true);
    expect(post.ratings.length).toBe(0);
  });

  test("allows adding a rating", () => {
    const post = new Post({});

    post.ratings.push({ user: "507f1f77bcf86cd799439011", value: 5 });

    expect(post.ratings.length).toBe(1);
    expect(post.ratings[0].value).toBe(5);
  });
});
