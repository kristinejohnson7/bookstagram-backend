const express = require("express");
const router = express.Router();
const filteredResults = require("../middleware/filteredResults");
const User = require("../models/User");
const multer = require("multer");
const { storage } = require("../s3");

const upload = multer({
  storage: storage,
});

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const { protect } = require("../middleware/auth");

// router.use(protect);

router
  .route("/")
  .get(filteredResults(User), getUsers)
  .post(upload.single("photo"), createUser);

router
  .route("/:id")
  .get(getUser)
  .put(upload.single("photo"), updateUser)
  .delete(protect, deleteUser);

module.exports = router;
