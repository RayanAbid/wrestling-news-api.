const router = require("express").Router();
const rateLimit = require('express-rate-limit');
const User = require("../models/User");
const controller = require('../controllers');


const limiter = rateLimit({
    windowMs: 3 * 1000, // Every 30 seconds
    max: 20,
    message: `Too many requests to this end-point, please try again after ${3} seconds`,
});

router.post('/register', limiter, controller.signup)




module.exports = router;