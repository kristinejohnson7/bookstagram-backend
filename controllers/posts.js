const path = require("path");
const Post = require("../models/Post");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const generateUploadURL = require("../s3");

//@desc Get all posts
//@route GET / api/v1/posts
//@access PUBLIC

exports.getPosts = asyncHandler(async (req, res, next) => {
  const posts = [...res.filteredResults.data];
  const mergedPosts = [];
  const users = await User.find({});
  posts.forEach(async (post) => {
    const user = users.find(
      (user) => user._id.toString() === post.user.toString()
    );
    mergedPosts.push({
      ...post.toObject(),
      userName: user.userName,
      name: user.name,
      avatar: user.photo,
    });
  });
  res.status(200).json(mergedPosts);
});

//@desc Get single post
//@route GET / api/v1/posts/:id
//@access PUBLIC

exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: post });
});

//@desc Get post likes
//@route GET / api/v1/posts/likes/:id
//@access PUBLIC

exports.getPostLikes = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }
  const postLikes = post.likes;
  res.status(200).json({ success: true, data: postLikes });
});

// @desc Create new post
// @route POST / api/v1/posts
// @access PRIVATE

exports.createPost = asyncHandler(async (req, res, next) => {
  const post = await Post.create({ ...req.body, photo: req.file.location });
  res.status(201).json({ success: true, data: post });
});

//@desc Update single post
//@route PUT / api/v1/posts/:id
//@access PRIVATE

exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.param.id}`, 400)
    );
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: post });
});

// @desc    Add post like
// @route   PUT /api/v1/posts/likes/:id
// @access  PRIVATE

exports.updatePostLikes = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likes: { $each: req.body.likes } },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!post) {
      console.log(post), res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: post.likes });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Delete post like
// @route   DELETE /api/v1/posts/likes/:id
// @access  PRIVATE

exports.deletePostLike = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: { $in: req.params.userId } },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!post) {
      res.status(400).json({ success: false });
    }
    res.status(200).send({ success: true, data: post.likes });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc Delete single post
//@route DELETE / api/v1/posts/:id
//@access PRIVATE

exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.param.id}`, 404)
    );
  }

  post.remove();

  res.status(200).json({ success: true, data: {} });
});
