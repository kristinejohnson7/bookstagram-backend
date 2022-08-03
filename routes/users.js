const express = require("express");
const router = express.Router();
const filteredResults = require("../middleware/filteredResults");
const User = require("../models/User");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("upload called");
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    console.log("file name called");
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

router.use(protect);

router
  .route("/")
  .get(filteredResults(User), getUsers)
  .post(upload.single("photo"), createUser);

router.route("/:id").get(getUser).put(updateUser).delete(protect, deleteUser);

module.exports = router;
