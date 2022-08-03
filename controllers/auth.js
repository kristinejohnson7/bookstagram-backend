const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//@desc Login user
//@route POST / api/v1/auth/login
//@access PUBLIC

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password"));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

//@desc Get logged in  user
//@route GET / api/v1/auth/me
//@access PRIVATE

exports.getLoggedInUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc Logout user
//@route GET / api/v1/auth/logout
//@access PUBLIC

exports.logout = asyncHandler(async (req, res, next) => {
  console.log(res);
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
});

//@desc Update user details
//@route PUT / api/v1/auth/updatedetails
//@access PRIVATE

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc Update user password
//@route PUT / api/v1/auth/updatepassword
//@access PRIVATE

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

//@desc Forgot password
//@route POST / api/v1/auth/forgotpassword
//@access PRIVATE

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.APP_URL}/reset/${resetToken}`;

  const message = `
  You are receiving this email because you (or someone else) has requested a password reset. Please reset your password at: ${resetUrl}
  `;

  const options = {
    email: user.email,
    subject: "Password reset",
    message,
  };

  try {
    await sendEmail(options);
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

//@desc Reset password
//@route PUT / api/v1/auth/resetpassword/:resettoken
//@access PUBLIC

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");
  console.log("line 172");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpired: { $gt: Date.now() },
  });
  console.log("user", user);
  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }
  console.log("182");

  user.password = req.body.password;
  console.log("185");
  user.resetPasswordToken = undefined;
  console.log("187");
  user.resetPasswordExpired = undefined;
  console.log(user.password);
  await user.save().catch(console.error);
  console.log("188");
  sendTokenResponse(user, 200, res);
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwt();
  console.log("194");
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  console.log("205");
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
