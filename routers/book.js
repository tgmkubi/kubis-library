const express = require("express");
const router = express.Router();
const Book = require('../models/Book');
const asyncErrorWrapper = require('express-async-handler');

router.post('/register', asyncErrorWrapper(async(req, res, next) => {
    const newBook = req.body;

    const book = await Book.create(newBook);

    res.status(200).json({
        success: true,
        data: book
    })
}));

module.exports = router;