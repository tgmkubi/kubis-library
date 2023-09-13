const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const User = require("../models/User");

const blockUser = asyncErrorWrapper(async (req, res, next) => {
  const user = req.user;

  // admin can not block another admin
  if(user.role === "admin") {
    return next(new CustomError("You are not authorized to block admin user", 401));
  };

  //checkUserBlockStatus databaseErrorHelpers Middleware
  if(user.blocked) {
    return next(new CustomError("User is already blocked", 400));
  };

  user.blocked = true;
  await user.save();

  res.status(200).json({
    status: "success",
    data: `${user.name} block successful`
  });
});

const unblockUser = asyncErrorWrapper(async (req, res, next) => {
    const user = req.user;

  //checkUserBlockStatus databaseErrorHelpers Middleware
  if(!user.blocked) {
    return next(new CustomError("User is not blocked", 400));
  };

  user.blocked = false;
  await user.save();

  res.status(200).json({
    status: "success",
    data: `${user.name} unblock successful`
  });
});

module.exports = { blockUser, unblockUser};
