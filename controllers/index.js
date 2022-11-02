const Users = require("../models/User");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const bcryptjs = require('bcryptjs');
const USER = require("../models/User")

exports.signup = async (req, res, next) => {
    try {
        const { firstName, password, email } = req.body;
        console.log(!email)
        if (!email) {
            return next({
                code: 409,
                error: true,
                message: "Email is required"
            })
        }

        if (!firstName) {
            return next({
                code: 409,
                error: true,
                message: "First Name is required"
            })
        }

        const existingUser = await USER.findOne({ email, firstName });

        if (existingUser?.email === email && existingUser?.firstName === firstName) {
            return next({
                code: 409,
                error: true,
                message: "User already exists try to register with new email"
            })
        }

        await bcrypt.hash(password, 10).then(async (hash) => {
            const newUser = new Users({
                firstName: firstName,
                email: email,
                password: hash,
            });
            const user = await newUser.save();
            const accessToken = sign(
                {
                    success: true,
                    data: {
                        id: user.id
                    },
                },
                process.env.JWTSCERETE,
                { expiresIn: 1800 }
            );
            return next({
                success: true,
                code: 200,
                data: {
                    firstName: user.firstName,
                    id: user.id,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    token: accessToken,
                },
            });
        });
    } catch (err) {
        return next({
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
            return next({ code: 401, error: true, message: "User not found" });
        }

        const decodedPassword = await bcrypt.compare(password, user.password);

        if (!decodedPassword) {
            return next({ code: 401, error: true, message: "Wrong email or password" });
        }
        const accessToken = sign({
            success: true,
            data: { id: user?.id }
        }, process.env.JWTSCERETE, { expiresIn: 1800 })

        return next({
            success: true,
            code: 200,
            data: {
                firstName: user.firstName,
                id: user.id,
                email: user.email,
                profilePicture: user.profilePicture,
                accessToken
            },
        });
    } catch (err) {
        return next({
            code: 500,
            success: false,
            message: err.message,
        });
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { email } = req.user;
        const { password, newPassword } = req.body;

        if (password === newPassword) {
            return next({
                code: 400,
                success: false,
                message: 'Current password and new pssword are same try different password',
            });
        }

        const existingUser = await USER.findOne({ email }).select("password").exec();
        const decodedPassword = await bcryptjs.compare(password, existingUser.password);

        if (!decodedPassword) {
            return next({
                code: 400,
                success: false,
                message: 'Current password is incorrect',
            });
        }


        await bcrypt.hash(newPassword, 10).then(async (hash) => {
            existingUser.password = hash;
            await existingUser.save();

            return next({
                code: 200,
                success: true,
                message: 'Password changed successfully!',
            });
        });
    } catch (error) {
        return next({ code: 401, error: true, message: error.message })
    }



};