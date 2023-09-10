const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {sendJwtToClient} = require('../helpers/authorization/tokenHelpers');

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

    const user = req.user;
    
    res.status(200).json({
        success: true,
        message: "Login Functionality",
        data: user
    })
};

module.exports = {register, login};