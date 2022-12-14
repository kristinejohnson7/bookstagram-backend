const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const generateUploadURL = require("../s3");

//@desc Get all users
//@route GET / api/v1/users
//@access PRIVATE/ADMIN

exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.filteredResults);
});

//@desc Get single user
//@route GET / api/v1/users/:id
//@access PRIVATE/ADMIN

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc Create user
//@route POST / api/v1/users
//@access PRIVATE/ADMIN

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create({ ...req.body, photo: req.file.location });
  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc Update user
//@route PUT / api/v1/users/:id
//@access PRIVATE/ADMIN

exports.updateUser = asyncHandler(async (req, res, next) => {
  const photo = req.file;
  const callback = async (location) => {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body, photo: location },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      data: user,
    });
  };
  generateUploadURL(`${Date.now()}`, photo?.path, callback);
});

//@desc Delete user
//@route DELETE / api/v1/users/:id
//@access PRIVATE/ADMIN

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});
