const express = require("express");
const router = express.Router();
const Book = require('../models/Book');
const asyncErrorWrapper = require('express-async-handler');

router.get('/', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Book Route successful"
    })
});

module.exports = router;