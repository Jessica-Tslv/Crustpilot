const Post = require("../models/post");
const { generateToken } = require("../lib/token");

async function searchPlaces(req, res) {
  try {
    const { searchQuery } = req.query;

    if (!searchQuery) {
      return res
        .status(400)
        .json({ ok: false, message: "Search query is required" });
    }

    const results = await Post.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { cuisine: { $regex: searchQuery, $options: "i" } },
      ],
    }).select("name cuisine");

    if (results.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "No place found",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Results found",
      places: results,
    });
  } catch (error) {
    console.error("Error occured while trying to get search results");
    console.log(error, error.stack);
    res.status(500).json({
      ok: false,
      message: "Sorry this service is down, please try again later",
    });
  }
}

const SearchController = {
  search: searchPlaces,
};

module.exports = SearchController;
