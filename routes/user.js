const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const User = require("../models/User");
const controller = require("../controllers/users");
const isAuth = require("../middleware/isAuth");

const limiter = rateLimit({
  windowMs: 3 * 1000, // Every 30 seconds
  max: 20,
  message: `Too many requests to this end-point, please try again after ${30} seconds`,
});

const regular_handler = (params, req, res, next) => {
  return res.status(params?.code).send(params);
};

router.post("/register", limiter, controller.signup, regular_handler);
router.post("/login", limiter, controller.login, regular_handler);
router.post(
  "/change-password",
  limiter,
  isAuth,
  controller.changePassword,
  regular_handler
);

module.exports = router;
