const User = require("../models/user");
const INTERNAL_SERVER_ERROR_RESPONSE = {
  ok: false,
  message: "This service is down, please try again later",
};

/**
 * Route: POST /favourites/:restautantId
 * */
async function addToFavourites(req, res) {
  const restaurantId = req.params.restaurantId;
  const userId = req.user_id;
  if (!restaurantId) {
    console.log(
      " [info] addToFavourites: restaurantId not present in request body",
    );
    res.status(400).json({ message: "No post id specified", ok: false });
    return;
  }

  try {
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      console.log(
        " [info] addToFavourites: user with id",
        userId,
        " cannot be found",
      );
      res
        .status(402)
        .json({ message: "Could not find user with such id", ok: false });
      return;
    }

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { "profile.favouriteRestaurants": restaurantId } },
      { new: true },
    );

    console.log(" [info] successfully addedToFavourites");

    res.status(200).json({ message: "OK", ok: true });
  } catch (err) {
    console.error(
      " [error] could not addToFavourites",
      "userId:",
      req.user_id,
      "restaurantId:",
      postId,
    );
    console.error(err);
    res.status(500).json(INTERNAL_SERVER_ERROR_RESPONSE);
  }
}

/**
 * Route: GET /favourites
 * */
async function getFavouritesData(req, res) {
  const userId = req.user_id;
  if (!userId) {
    console.log(" [info] could not find userId in request body");
    res.status(400).json({ message: "UserID not provided", ok: false });
    return;
  }

  console.log(" [info] received requests, favouriteRestaurants");
  try {
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      console.log("[warn] could not find user with Id of", userId, userExists);
      res.status(401).json({ ok: false, message: "User not found" });
      return;
    }

    const queryResults = await User.findById(userId)
      .populate(
        "profile.favouriteRestaurants",
        "name location  message ratings.value image cuisine",
      )
      .lean();

    const favouriteRestaurants = queryResults.profile.favouriteRestaurants;
    if (!favouriteRestaurants || favouriteRestaurants.length == 0) {
      res.status(200).json({
        ok: true,
        message: "No favourite restaurants",
        data: { favouriteRestaurants: [] },
      });
      return;
    }

    const updatedRestaurants = favouriteRestaurants.map((item) => {
      const ratings = item.ratings.map((r) => r.value);
      const avgRating = calcAvgRating(ratings);
      return {
        ...item,
        averageRating: avgRating,
      };
    });
    res.status(200).json({
      ok: true,
      message: "OK",
      data: { favouriteRestaurants: updatedRestaurants },
    });
    console.log(" [info] sent favourites data");
    return;
  } catch (err) {
    console.error("[error] Could not getFavouritesData");
    console.error(err);
    res.status(500).json(INTERNAL_SERVER_ERROR_RESPONSE);
  }
}

function calcAvgRating(ratings) {
  const avgRating =
    ratings.reduce((prev, next) => prev + next, 0) / ratings.length;
  return Math.floor(avgRating);
}

/**
 * Route: PATCH  /favourites/:restaurantId
 * */
async function removeFromFavourites(req, res) {
  const userId = req.user_id;
  const { restaurantId } = req.params;

  if (!userId) {
    console.log("[info] could not find userId in request params");
    return res.status(400).json({ message: "UserID not provided", ok: false });
  }

  if (!restaurantId) {
    return res
      .status(400)
      .json({ message: "restaurantId not provided", ok: false });
  }

  console.log("[info] received request, removeFavouriteRestaurant");

  try {
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      console.log("[warn] could not find user with Id of", userId);
      return res.status(401).json({ ok: false, message: "User not found" });
    }

    // Pull removes the ID from the array
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          "profile.favouriteRestaurants": restaurantId,
        },
      },
      { new: true },
    );

    return res.status(200).json({
      ok: true,
      message: "Restaurant removed from favourites",
    });
  } catch (err) {
    console.error("Could not removeFavouriteRestaurant");
    console.error(err);
    return res.status(500).json(INTERNAL_SERVER_ERROR_RESPONSE);
  }
}

module.exports = { addToFavourites, getFavouritesData, removeFromFavourites };
