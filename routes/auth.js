const express = require("express");

const {
  login,
  logout,
  getLoggedInUser,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getLoggedInUser);
router.put("/updatedetails", protect, updateDetails);
router.post("/updatepassword", protect, updatePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

module.exports = router;
