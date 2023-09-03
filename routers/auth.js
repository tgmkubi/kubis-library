const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {

    // console.log(req.body);

    res.json({
        success: true,
        message: 'Auth Home Page'
    });
});

module.exports = router;