const express = require("express");
const router = express.Router();
const filteredResults = require("../middleware/filteredResults");
const User = require("../models/User");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const { protect, authorize } = require("../middleware/auth");

router.use(protect);

router.route("/").get(filteredResults(User), getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(protect, deleteUser);

module.exports = router;
