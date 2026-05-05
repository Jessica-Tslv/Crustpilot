const PostsController = require("../../controllers/posts");
const Post = require("../../models/post");

jest.mock("../../models/post");

describe("PostsController", () => {
  function mockRes() {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  }

  test("getAllPosts returns posts", async () => {
    const req = {};
    const res = mockRes();

    Post.find.mockResolvedValue([{ message: "test" }]);

    await PostsController.getAllPosts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test("getPostById returns 404 if not found", async () => {
    const req = { params: { id: "1" } };
    const res = mockRes();

    Post.findById.mockResolvedValue(null);

    await PostsController.getPostById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("createPost returns 201 on success", async () => {
    const req = {
      body: {
        name: "Test",
        message: "Hello",
        cuisine: "Indian",
        rating: 5,
        image: "img.jpg",
      },
      user_id: "user123",
    };

    const res = mockRes();

    const saveMock = jest.fn();
    Post.mockImplementation(() => ({
      save: saveMock,
    }));

    saveMock.mockResolvedValue();

    await PostsController.createPost(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("ratePost returns 404 if post not found", async () => {
    const req = {
      params: { id: "1" },
      body: { rating: 5 },
      user_id: "user123",
    };

    const res = mockRes();

    Post.findById.mockResolvedValue(null);

    await PostsController.ratePost(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
