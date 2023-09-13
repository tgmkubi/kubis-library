const {isTokenIncluded, getAccessTokenFromHeader} = require('../../helpers/authorization/tokenHelpers');
const CustomError = require('../../helpers/error/CustomError');
const jwt = require('jsonwebtoken');
const asyncErrorWrapper = require("express-async-handler");
const User = require('../../models/User');

const getAccessToRoute = (req, res, next) => {

    if(!isTokenIncluded(req)) {
        return next(new CustomError("You are not authorizd to access this route", 401));
    };

    const access_token = getAccessTokenFromHeader(req); 
    
    //jwt.verify(token, secretOrPublicKey, [options, callback])
    const {JWT_SECRET_KEY} = process.env;
    jwt.verify(access_token, JWT_SECRET_KEY,  function(err, decoded) {
        if(err) {
            return next(new CustomError("You are not authorizd to access this route", 401));
        }
        req.user = {
            id: decoded.id,
            name: decoded.name
        }
    })

    next();
};

const getAdminAccess = asyncErrorWrapper(async(req, res, next) => {
    const {id} = req.user;
    
    const user = await User.findById(id);

    if(user.role !== "admin") {
        return next(new CustomError("Only admin can access this route", 401));
    };

    next();
});

module.exports = {getAccessToRoute, getAdminAccess};