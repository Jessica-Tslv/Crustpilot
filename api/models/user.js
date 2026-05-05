const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    firstName: { type: String, required: false, default: "defaultFirstName" },
    lastName: { type: String, required: false, default: "defaultLastName" },
    profilePic: { type: String, default: "defaultProfilePic" },
    bio: { type: String, default: "defaultBio" },
    favouriteRestaurants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: false },
    ],
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
