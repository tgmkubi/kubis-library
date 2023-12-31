const express = require('express');
const router = express.Router();

const {getAccessToRoute} = require('../middlewares/authorization/auth');
const {register, login, logout, getLoggedInUser, imageUpload, forgotpassword, resetPassword, editDetails} = require('../controllers/auth');
const profileImageUpload = require('../middlewares/libraries/profileImageUpload');

router.post('/register', register);
router.get('/login', login);
router.get('/logout', getAccessToRoute, logout);
router.get('/profile',getAccessToRoute, getLoggedInUser);
router.post('/upload', [getAccessToRoute, profileImageUpload.single('profile_image')], imageUpload);
router.post('/forgotpassword', forgotpassword);
router.post('/resetpassword', resetPassword);
router.put('/edit', getAccessToRoute, editDetails);

module.exports = router;