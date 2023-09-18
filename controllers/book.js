const express = require("express");
const asyncErrorWrapper = require('express-async-handler');
const Book = require('../models/Book');

const register = asyncErrorWrapper(async(req, res, next) => {
    const newBook = req.body;

    const book = await Book.create(newBook);

    res.status(200).json({
        success: true,
        data: book
    })
})

module.exports = {register};