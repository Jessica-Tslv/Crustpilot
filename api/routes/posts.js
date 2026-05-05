const express = require("express");
const router = express.Router();
const tokenChecker = require("../middleware/tokenChecker");
const PostsController = require("../controllers/posts");
const upload = require("../middleware/upload");

router.get("/", PostsController.getAllPosts);
router.get("/:id", PostsController.getPostById);
router.post("/:id/rate", tokenChecker, PostsController.ratePost);
router.get("/api/favourites", tokenChecker, PostsController.getFavouritesData);
router.get(
  "/api/favourites/remove/:restaurantId",
  tokenChecker,
  PostsController.removeFavouriteRestaurant,
);
router.post("/", tokenChecker, upload.single("image"), PostsController.createPost);

module.exports = router;
