const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers");
const {
  validateUserInput,
  comparePassword,
} = require("../helpers/input/inputHelpers");
const CustomError = require("../helpers/error/CustomError");
const checkUserExist = require("../helpers/database/checkUserExist");
const asyncErrorWrapper = require("express-async-handler");
const sendEmail = require("../helpers/libraries/sendEmail");

const register = asyncErrorWrapper(async (req, res, next) => {
  const { name, email, password, role, phonenumber } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
    phonenumber,
  });

  sendJwtToClient(user, res);
});

const login = asyncErrorWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!validateUserInput(email, password)) {
    return next(new CustomError("Please check your inputs", 400));
  }

  const user = await User.findOne({ email: email }).select("+password");

  if(user.blocked) {
    return next(new CustomError("You are not authorized to access. User Blocked.", 401));
  };

  if (!checkUserExist(user)) {
    return next(new CustomError("There is no user with that email", 400));
  }

  const result = await comparePassword(password, user.password);
  if (!result) {
    return next(new CustomError("Please check your credentials", 400));
  }

  sendJwtToClient(user, res);
});

// const logout = async (req, res, next) => {
//   res.status(200).clearCookie("access_token").json({
//     success: true,
//     message: "Logout Successful"
//   });
// };

const logout = asyncErrorWrapper(async (req, res, next) => {
  const { NODE_ENV } = process.env;

  // Send To Client With Res

  return res
    .status(200)
    .cookie("access_token", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      message: "Logout Successfull",
    });
});

const getLoggedInUser = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

const imageUpload = asyncErrorWrapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      profile_image: req.savedProfiledImage,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Image Upload Successful",
    data: user,
  });
});

const forgotpassword = asyncErrorWrapper(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });

  if (!checkUserExist(user)) {
    return next(new CustomError("There is no user with that email", 400));
  }

  const resetPasswordToken = user.getResetPasswordFromUser();

  await user.save();

  const { URL, PORT } = process.env;

  const resetPasswordUrl = `${URL}${PORT}/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

  const emailTemplate = `
    <h3>Reset Your Password</h3>
    <p>This <a href = '${resetPasswordUrl}' target = "_blank">link</a> will expire in 1 hour.</p>
  `
  try {
    await sendEmail({
      from: process.env.SMTP_HOST,
      to: email,
      subject: "Question Answer Api - Reset Password",
      html: emailTemplate
    });
    res.status(200).json({
      success: true,
      message: `Token sent to '${user.email}'`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return next(new CustomError("Email could not be sent", 500));
  }
});

const resetPassword = asyncErrorWrapper(async (req, res, next) => {

  const {resetPasswordToken} = req.query;
  const {password} = req.body;

  if(!resetPasswordToken || !password) {
    return next(new CustomError("Please provide reset password token and new password", 400));
  };

  let user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: {$gt: Date.now()}
  });

  if (!checkUserExist(user)) {
    return next(new CustomError("Invalid token or Session Expired", 404));
  };

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  user = await user.save();

  res.status(200).json({
    success: true,
    message: "Reset Password Successful"
  })
});

const editDetails = asyncErrorWrapper(async (req, res, next) => {

    const editInformation = req.body;
    
    const user = await User.findByIdAndUpdate(req.user.id, editInformation, {
      runValidators: true,
      new: true
    })
    res.status(200).json({
      success: true,
      data: user
    })
});

module.exports = {
  register,
  login,
  logout,
  getLoggedInUser,
  imageUpload,
  forgotpassword,
  resetPassword,
  editDetails
};
