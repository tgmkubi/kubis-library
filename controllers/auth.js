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

const logout = asyncErrorWrapper(async (req,res,next) =>{
   
    const {NODE_ENV} = process.env;
    
    // Send To Client With Res
    
    return res
    .status(200)
    .cookie("access_token",null, {
        httpOnly : true,
        expires : new Date(Date.now()),
        secure : NODE_ENV === "development" ? false : true
    })
    .json({
        success : true,
        message : "Logout Successfull"
    });
    
});

const getLoggedInUser = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

const imageUpload = asyncErrorWrapper(async (req,res,next) => {
  const user = await User.findByIdAndUpdate(req.user.id, {
    "profile_image": req.savedProfiledImage
  }, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: "Image Upload Successful",
    data: user
  });
});

const forgotpassword = asyncErrorWrapper(async (req,res,next) => {
  const {email} = req.body;

  const user = await User.findOne({email: email});

  if(!checkUserExist(user)) {
    return next(new CustomError("There is no user with that email", 400));
  };

  const resetPasswordToken = user.getResetPasswordFromUser();

  await user.save();

  res.status(200).json({
    success: true,
    token: resetPasswordToken
  });
});

module.exports = { register, login, logout, getLoggedInUser, imageUpload, forgotpassword};
