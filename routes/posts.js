const express = require("express");
const router = express.Router();
const filteredResults = require("../middleware/filteredResults");
const Post = require("../models/Post");
const multer = require("multer");

const storage = multer.diskStorage({
  // destination: require.main?.path + "/" + "public/uploads/",
  function(req, file, cb) {
    cb(null, "var/task/tmp/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getPostLikes,
  deletePostLike,
  updatePostLikes,
} = require("../controllers/posts");

const { protect } = require("../middleware/auth");

router
  .route("/")
  .get(filteredResults(Post), getPosts)
  .post(protect, upload.single("photo"), createPost);

router.route("/:id").get(getPost).put(updatePost).delete(protect, deletePost);

router.route("/likes/:id").get(getPostLikes).put(updatePostLikes);

router.route("/likes/:id/:userId").delete(deletePostLike);

module.exports = router;
