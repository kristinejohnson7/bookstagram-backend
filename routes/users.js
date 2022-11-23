const express = require("express");
const router = express.Router();
const filteredResults = require("../middleware/filteredResults");
const User = require("../models/User");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./temp/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

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
