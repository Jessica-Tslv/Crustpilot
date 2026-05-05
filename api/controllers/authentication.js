const User = require("../models/user");
const { generateToken } = require("../lib/token");
const bcrypt = require("bcrypt");

const INTERNAL_SERVER_ERR_RESPONSE = {
  ok: false,
  message: "Server is down, please try again later",
};

/**
 * createToken checks the incoming request's body for email and password
 * If authentication is successful, a `200` status code and `jwt-token` is sent along in
 * the response body in JSON encoding.
 *
 * Route: GET /tokens
 * */
async function createToken(req, res) {
  console.log("[info] GET /tokens endpoint hit");
  const email = req.body.email;
  const password = req.body.password;

  if (!email) {
    return res.status(400).json({ message: "Please provide email", ok: false });
  } else if (!password) {
    return res
      .status(400)
      .json({ message: "Please provide password", ok: false });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log("Auth Error: User not found for email with ", email);
      res.status(401).json({ message: "User not found", ok: false });
      return;
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (passwordsMatch) {
      console.log("User was authenticated succesfully");
      const userToken = generateToken(user.id);
      res.status(201).json({
        message: "User authenticated successfully",
        ok: true,
        token: userToken,
      });
      return;
    }

    console.log("Users password did not match");
    res.status(401).json({ message: "Invalid email or password", ok: false });
  } catch (err) {
    console.error("Error trying to createToken");
    console.error(err);
    res.status(500).json(INTERNAL_SERVER_ERR_RESPONSE);
  }
}

const AuthenticationController = {
  createToken: createToken,
};

module.exports = AuthenticationController;
