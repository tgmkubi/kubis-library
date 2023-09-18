const express = require("express");
const router = express.Router();
const {register} = require('../controllers/book');

router.post('/register', register);

module.exports = router;