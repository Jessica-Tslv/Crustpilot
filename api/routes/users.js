const express = require("express");
const tokenChecker = require("../middleware/tokenChecker");
const multer = require("multer");
const path = require("path");

const UsersController = require("../controllers/users");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// router.post("/", UsersController.create);
router.post("/", UsersController.createUser);
router.get("/me", tokenChecker, UsersController.getUserProfile);
router.patch("/:id", tokenChecker, upload.single("profilePic"), UsersController.editUserProfile);
router.patch("/pass/:id", tokenChecker, UsersController.editUserPassword);



module.exports = router;
