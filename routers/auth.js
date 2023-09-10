const express = require('express');
const router = express.Router();

const {getAccessToRoute} = require('../middlewares/authorization/auth');
const {register, login} = require('../controllers/auth');

router.get('/login', login);
router.post('/register', register);

module.exports = router;