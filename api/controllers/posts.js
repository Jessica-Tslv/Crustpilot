const Post = require("../models/post");
const { generateToken } = require("../lib/token");
const User = require("../models/user");

async function getAllPosts(req, res) {
  try {
    const posts = await Post.find();

    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
}

async function getPostById(req, res) {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ ok: false, message: "Place not found" });
    }

    res.status(200).json({ ok: true, message: "Place found!", place: post });
  } catch (error) {
    console.error("Error occured while trying to get place");
    console.log(error, error.stack);
    res.status(500).json({
      ok: false,
      message: "Sorry this service is down, please try again later",
    });
  }
}

const INTERNAL_SERVER_ERROR_RESPONSE = {
  ok: false,
  message: "This service is down, please try again later",
};

/**
 * Route: GET /posts/api/favourites
 * */
async function getFavouritesData(req, res) {
  const userId = req.user_id;
  if (!userId) {
    console.log("[info] could not find userId in request body");
    res.status(400).json({ message: "UserID not provided", ok: false });
    return;
  }

  console.log("[info] received requests, favouriteRestaurants");
  try {
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      console.log("[warn] could not find user with Id of", userId, userExists);
      res.status(401).json({ ok: false, message: "User not found" });
      return;
    }

    const queryResults = await User.findById(userId).populate(
      "profile.favouriteRestaurants",
      "name location  message rating image",
    );

    const favouriteRestaurants = queryResults.profile.favouriteRestaurants;
    if (!favouriteRestaurants || favouriteRestaurants.length == 0) {
      res.status(200).json({
        ok: true,
        message: "No favourite restaurants",
        data: { favouriteRestaurants: [] },
      });
      return;
    }

    res.status(200).json({
      ok: true,
      message: "OK",
      data: { favouriteRestaurants: favouriteRestaurants },
    });
    return;
  } catch (err) {
    console.error("Could not getFavouritesData");
    console.error(err);
    res.status(500).json(INTERNAL_SERVER_ERROR_RESPONSE);
  }
}

/**
 * Route: GET /posts/api/favourites/remove/:id
 * */
async function removeFavouriteRestaurant(req, res) {
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

// Function to create a new place
const createPost = async (req, res) => {
  try {
    // We extract the data sent from the frontend form
    const { name, message, cuisine, rating, location } = req.body;

    const image = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : "";

    // Create a new post. We also attach the user's ID (assuming your tokenChecker
    // middleware adds req.user_id to the request).
    const newPost = new Post({
      name,
      message,
      cuisine,
      image,
      location,
      author: req.user_id,
      ratings: rating
        ? [{ user: req.user_id, value: Number(rating) }]
        : [],
    });

    await newPost.save();

    const token = generateToken(req.user_id);

    res.status(201).json({
      message: "Place added successfully!",
      post: newPost,
      token,
    });
  } catch (error) {
    console.error("Error adding place:", error);
    res.status(400).json({ message: "Failed to add place" });
  }
};

async function ratePost(req, res) {
  try {
    const { rating } = req.body;
    const postId = req.params.id;
    const userId = req.user_id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingRating = post.ratings.find(
      (r) => r.user.toString() === userId,
    );

    if (existingRating) {
      existingRating.value = rating;
    } else {
      post.ratings.push({ user: userId, value: rating });
    }

    await post.save();

    res.status(200).json({ post });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error rating post" });
  }
}

const PostsController = {
  getAllPosts: getAllPosts,
  getPostById: getPostById,
  createPost: createPost,
  ratePost: ratePost,
  getFavouritesData: getFavouritesData,
  removeFavouriteRestaurant: removeFavouriteRestaurant,
};

module.exports = PostsController;
