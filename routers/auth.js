const express = require('express');
const router = express.Router();

const {getAccessToRoute, register} = require('../controllers/auth');

router.get('/', getAccessToRoute);
router.post('/register', register);

module.exports = router;