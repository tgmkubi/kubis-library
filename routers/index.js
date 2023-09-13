const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Api Index Home Page",
  });
});

const auth = require("./auth");
router.use("/auth", auth);
const user = require('./user');
router.use('/user', user);
const admin = require('./admin');
router.use('/admin', admin);

module.exports = router;
