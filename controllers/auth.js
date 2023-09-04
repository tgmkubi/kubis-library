const express = require('express');
const router = express.Router();
const User = require('../models/User');

const getAccessToRoute = (req, res, next) => {

    res.json({
        success: true,
        message: 'Auth Home Page'
    });
};

const register = async(req, res, next) => {

    const {name, email, password, role} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    await user.save();

    res.status(200).json({
        success: true,
        data: user
    })
}

module.exports = {getAccessToRoute, register};