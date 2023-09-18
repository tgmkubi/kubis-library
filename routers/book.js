const express = require("express");
const router = express.Router();
const {register} = require('../controllers/book');
const {getAccessToRoute, getAdminAccess} = require('../middlewares/authorization/auth');

router.post('/register',[getAccessToRoute, getAdminAccess], register);

module.exports = router;