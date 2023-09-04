const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {sendJwtToClient} = require('../helpers/authorization/tokenHelpers');

const getAccessToRoute = (req, res, next) => {

    res.json({
        success: true,
        message: 'Auth Home Page'
    });
};

const register = async(req, res, next) => {

    const {name, email, password, role, phonenumber} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role,
        phonenumber
    });

    sendJwtToClient(user, res);
}

module.exports = {getAccessToRoute, register};