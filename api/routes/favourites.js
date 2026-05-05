const express = require("express");
const router = express.Router();
const {
  getFavouritesData,
  addToFavourites,
  removeFromFavourites,
} = require("../controllers/favourites");

// TODO: also remove other implementations for favourites from the post
// controllers and routers
router.get("/", getFavouritesData);
router.post("/:restaurantId", addToFavourites);
router.patch("/:restaurantId", removeFromFavourites);

module.exports = router;
