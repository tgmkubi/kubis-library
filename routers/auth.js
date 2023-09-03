const express = require('express');
const router = express.Router();

const {getAccessToRoute} = require('../controllers/auth');

router.get('/', getAccessToRoute);

module.exports = router;