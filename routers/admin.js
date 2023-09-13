const express = require('express');
const router = express.Router();

const {getAccessToRoute, getAdminAccess} = require('../middlewares/authorization/auth');

router.use([getAccessToRoute, getAdminAccess]);

router.get('/', (req, res, next) => {
    res.status(200).json({
        status: "success",
        message: "Admin Home Page"
    })
});

module.exports = router;