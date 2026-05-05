const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const searchRouter = require("./routes/search");
const authenticationRouter = require("./routes/authentication");
const favouritesRouter = require("./routes/favourites");
const tokenChecker = require("./middleware/tokenChecker");

const app = express();

// Allow requests from any client
// docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
// docs: https://expressjs.com/en/resources/middleware/cors.html
app.use(cors());

// Multer Image upload
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Parse JSON request bodies, made available on `req.body`
app.use(bodyParser.json());

// API Routes
// app.use("/users", tokenChecker, usersRouter);
app.use("/users", usersRouter); //tokenChecker removed - breaks sign up
app.use("/posts", postsRouter);
app.use("/tokens", authenticationRouter);
app.use("/profile", tokenChecker, usersRouter);
app.use("/favourites", tokenChecker, favouritesRouter);
app.use("/search", searchRouter);

// 404 Handler
app.use((_req, res) => {
  console.log("User made req to?", _req.url);
  res.status(404).json({ err: "Error 404: Not Found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  if (process.env.NODE_ENV === "development") {
    res.status(500).send(err.message);
  } else {
    res.status(500).json({ err: "Something went wrong" });
  }
});

module.exports = app;
