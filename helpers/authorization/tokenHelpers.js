const sendJwtToClient = (user, res) => {

    const token = user.generateJwtFromUser();

    const {JWT_COOKIE_EXPIRE, NODE_ENV} = process.env;

    return res
    .status(200)
    .cookie('access_token', token, 
    { 
        httpOnly: true,
        secure: NODE_ENV === "development" ? false : true,
        expires: new Date(Date.now() + parseInt(JWT_COOKIE_EXPIRE) * 1000 * 60) // JWT_COOKIE_EXPIRE * Minutes
    })
    .json({
        success: true,
        access_token: token,
        data: {
            name: user.name,
            email: user.email
        }
    })
};

const isTokenIncluded = (req) => {
    return req.headers.authorization && req.headers.authorization.startsWith("Bearer: ");
};

const getAccessTokenFromHeader = (req) => {
    return req.headers.authorization.split(" ")[1];
}

module.exports = {sendJwtToClient, isTokenIncluded, getAccessTokenFromHeader};