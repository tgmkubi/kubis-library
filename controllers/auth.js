const express = require('express');
const router = express.Router();

const getAccessToRoute = (req, res, next) => {

    res.json({
        success: true,
        message: 'Auth Home Page'
    });
};

module.exports = {getAccessToRoute};