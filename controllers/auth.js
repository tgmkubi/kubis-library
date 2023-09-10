const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {sendJwtToClient} = require('../helpers/authorization/tokenHelpers');
const {validateUserInput, comparePassword} = require('../helpers/input/inputHelpers');
const CustomError = require('../helpers/error/CustomError');
const checkUserExist = require('../helpers/database/checkUserExist');

const register = async(req, res, next) => {

    try {
        const {name, email, password, role, phonenumber} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role,
        phonenumber
    });
    
    sendJwtToClient(user, res);
    
    } catch (error) {
        return next(error); // Express wll catch the error with next
    } 
};

const login = async(req, res, next) => {

    const {email, password} = req.body;

    if(!validateUserInput(email, password)) {
        return next(new CustomError("Please check your inputs", 400));
    };

    const user = await User.findOne({email: email}).select("+password");
    
    if(!checkUserExist(user)) {
        return next(new CustomError("There is no user with that email", 400));
    };

    const result = await comparePassword(password, user.password);
    if(!result) {
        return next(new CustomError("Please check your credentials", 400));
    }

    sendJwtToClient(user, res);
};

const logout = async(req, res, next) => {

    res.status(200).clearCookie('access_token').json({
        success: true,
        message: "Logout Successful"
    });
};

module.exports = {register, login, logout};