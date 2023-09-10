const {isTokenIncluded, getAccessTokenFromHeader} = require('../../helpers/authorization/tokenHelpers');
const CustomError = require('../../helpers/error/CustomError');
const jwt = require('jsonwebtoken');

const getAccessToRoute = (req, res, next) => {

    if(!isTokenIncluded(req)) {
        return next(CustomError("You are not authorizd to access this route", 401));
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

module.exports = {getAccessToRoute};