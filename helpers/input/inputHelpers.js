const CustomError = require('../error/CustomError');
const bcrypt = require('bcryptjs');

const validateUserInput = (email, password) => {
    return email && password;
}
const comparePassword = async(password, hashed_password) => {
    const response = await bcrypt.compare(password, hashed_password);
    return response;
};

module.exports = {validateUserInput, comparePassword};