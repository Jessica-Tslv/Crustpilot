const { generateToken } = require("../lib/token");
const User = require("../models/user");
const bcrypt = require("bcrypt");

function create(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const user = new User({ email, password });
  user
    .save()
    .then((user) => {
      console.log("User created, id:", user._id.toString());
      res.status(201).json({ message: "OK" });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({ message: "Something went wrong" });
    });
}

const MIN_EMAIL_LENGTH = 8;
const MIN_PASSWORD_LENGTH = 8;
const DEFAULT_SALT_ROUNDS = 10;
const INTERNAL_SERVER_ERR_RESPONSE = {
  message: "Service is down, please try again later",
  ok: false,
};

/**
 * Route: POST /users
 * */
async function createUser(req, res) {
  try {
    const { firstName, surname, email, password } = req.body;
    if (!email) {
      console.log("User did not provide email in request body");
      res.status(400).json({ message: "Please provide email", ok: false });
      return;
    } else if (!password) {
      console.log("User did not provide password in request body");
      res.status(400).json({ message: "Please provide password", ok: false });
      return;
    }

    if (!emailIsValid(email)) {
      console.log("invalid email", email);
      res
        .status(400)
        .json({ message: "Email provided is not valid", ok: false });
      return;
    }
    if (!passwordIsValid(password)) {
      console.log("invalid password", password);
      res.status(400).json({
        message: `Password too short, must be at least ${MIN_PASSWORD_LENGTH} characters`,
        ok: false,
      });
      return;
    }

    const emailExists = await User.exists({ email: email });
    if (emailExists) {
      console.log("Email already exists");
      res
        .status(409)
        .json({ message: `User with ${email} already exists`, ok: false });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, DEFAULT_SALT_ROUNDS);
    const newUser = await User.create({
      email: email,
      password: hashedPassword,
      profile: {
        firstName: firstName,
        lastName: surname,
        bio: "",
      },
    });

    console.log("Successfully created new user", newUser.id);
    res.status(201).json({ message: "OK", ok: true });
  } catch (err) {
    console.error("Could not createUser");
    console.error(err);
    res.status(500).json(INTERNAL_SERVER_ERR_RESPONSE);
  }
}

function emailIsValid(email) {
  let formattedEmail = email.trim().toLowerCase();
  if (
    formattedEmail.length >= MIN_EMAIL_LENGTH &&
    formattedEmail.includes("@")
  ) {
    return true;
  }

  return false;
}

function passwordIsValid(password) {
  // remove all whitespaces
  if (password.trim().replaceAll(" ", "").length >= MIN_PASSWORD_LENGTH) {
    return true;
  }

  return false;
}

async function getUserProfile(req, res) {
  const userId = req.user_id;
  const newToken = generateToken(userId);
  const user = await User.findById(userId);

  res
    .status(200)
    .json({ message: "Found user profile", token: newToken, user: user });
}

async function editUserProfile(req, res) {
  try {
    const userId = req.user_id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { email, firstName, lastName, bio } = req.body;

    if (email) {
      user.email = email;
    }

    if (firstName) {
      user.profile.firstName = firstName;
    }

    if (lastName) {
      user.profile.lastName = lastName;
    }

    if (bio) {
      user.profile.bio = bio;
    }

    if (req.file) {
      user.profile.profilePic = `/uploads/${req.file.filename}`;
    }

    await user.save();

    const newToken = generateToken(userId);

    res.status(200).json({
      message: "User updated8",
      token: newToken,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
}

// async function editUserPassword(req, res) {
// ... keep your commented-out password code exactly as it is ...
// }

async function editUserPassword(req, res) {
  try {
    const userId = req.user_id;
    const user = await User.findById(userId);
    const { new_password, current_password } = req.body;

    // 1. Verify current password matches what's in DB
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password incorrect" });
    }

    // 2. NEW: Validate the new password length/format
    if (!passwordIsValid(new_password)) {
      return res.status(400).json({
        message: `New password is too short (min ${MIN_PASSWORD_LENGTH} characters)`,
      });
    }

    // 3. Hash and update
    const hashedNewPassword = await bcrypt.hash(
      new_password,
      DEFAULT_SALT_ROUNDS
    );
    user.password = hashedNewPassword;
    await user.save();

    res
      .status(200)
      .json({ message: "Password updated successfully", ok: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

const UsersController = {
  getUserProfile: getUserProfile,
  create: create,
  createUser: createUser,
  editUserProfile: editUserProfile,
  editUserPassword: editUserPassword,
};

module.exports = UsersController;