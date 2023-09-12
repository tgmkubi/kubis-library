const User = require('../models/User');
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require('../helpers/error/CustomError');

const getSingleUser = asyncErrorWrapper( async(req, res, next) => {
    const {id} = req.params;

    let user = await User.findById(id);

    console.log(user);

    if(!user) {
        return next(new CustomError("There is no user with that id", 400));
    };

    res.status(200).json({
        success: true,
        data: user
    });
});

module.exports = {getSingleUser}