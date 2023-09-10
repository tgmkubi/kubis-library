const express = require('express');
const router = express.Router();

const {getAccessToRoute} = require('../middlewares/authorization/auth');
const {register, login, logout, getLoggedInUser} = require('../controllers/auth');

router.post('/register', register);
router.get('/login', login);
router.get('/logout', getAccessToRoute, logout);
router.get('/profile',getAccessToRoute, getLoggedInUser);

module.exports = router;