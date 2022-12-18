const Users = require("../models/User");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const USER = require("../models/User");

exports.signup = async (req, res, next) => {
  try {
    const { fullName, password, email } = req.body;
    console.log(!email);
    if (!email) {
      res.send({
        code: 409,
        error: true,
        message: "Email is required",
      });
    }

    if (!fullName) {
      res.send({
        code: 409,
        error: true,
        message: "Username is required",
      });
    }

    const existingUser = await USER.findOne({ email, fullName });

    if (existingUser?.email === email && existingUser?.fullName === fullName) {
      res.send({
        code: 409,
        error: true,
        message: "User already exists try to register with new email",
      });
    }

    await bcrypt.hash(password, 10).then(async (hash) => {
      const newUser = new Users({
        fullName: fullName,
        email: email,
        password: hash,
      });
      const user = await newUser.save();
      const accessToken = sign(
        {
          success: true,
          id: user.id,
        },
        process.env.JWTSECRET,
        { expiresIn: 1800 }
      );
      res.send({
        success: true,
        code: 200,
        data: {
          fullName: user.fullName,
          id: user.id,
          email: user.email,
          profilePicture: user.profilePicture,
          accessToken,
        },
      });
    });
  } catch (err) {
    res.send({
      code: 500,
      success: false,
      message: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await USER.findOne({ email }).exec();

    if (!user) {
      res.send({ code: 401, error: true, message: "User not found" });
      return;
    }

    const decodedPassword = await bcrypt.compare(password, user.password);

    if (!decodedPassword) {
      res.send({
        code: 401,
        error: true,
        message: "Wrong email or password",
      });
      return;
    }
    const accessToken = sign(
      {
        success: true,
        id: user?.id,
      },
      process.env.JWTSECRET,
      { expiresIn: 1800 }
    );

    res.send({
      success: true,
      code: 200,
      data: {
        fullName: user.fullName,
        id: user.id,
        email: user.email,
        profilePicture: user.profilePicture,
        accessToken,
      },
    });
    return;
  } catch (err) {
    res.send({
      code: 500,
      success: false,
      message: err.message,
    });
    return;
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { email } = req.user;
    const { password, newPassword } = req.body;

    if (password === newPassword) {
      res.send({
        code: 400,
        success: false,
        message:
          "Current password and new pssword are same try different password",
      });
    }

    const existingUser = await USER.findOne({ email })
      .select("password")
      .exec();
    const decodedPassword = await bcryptjs.compare(
      password,
      existingUser.password
    );

    if (!decodedPassword) {
      res.send({
        code: 400,
        success: false,
        message: "Current password is incorrect",
      });
    }

    await bcrypt.hash(newPassword, 10).then(async (hash) => {
      existingUser.password = hash;
      await existingUser.save();

      res.send({
        code: 200,
        success: true,
        message: "Password changed successfully!",
      });
    });
  } catch (error) {
    res.send({ code: 401, error: true, message: error.message });
  }
};
