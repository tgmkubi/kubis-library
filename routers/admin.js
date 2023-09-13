const express = require('express');
const router = express.Router();

const {getAccessToRoute, getAdminAccess} = require('../middlewares/authorization/auth');
const {blockUser, unblockUser} = require('../controllers/admin');
const {checkUserExist} = require('../middlewares/database/databaseErrorHelpers');

router.use([getAccessToRoute, getAdminAccess]);

router.get('/block/:id',checkUserExist, blockUser);
router.get('/unblock/:id', checkUserExist, unblockUser);

module.exports = router;