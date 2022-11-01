const Users = require("../models/User");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
    console.log(req.body)
    const { firstName, password, email } = req.body;

    try {
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
                        firstName: user.firstName,
                        id: user.id,
                        email: user.email,
                        profilePicture: user.profilePicture,
                    },
                },
                "importantsecret",
                { expiresIn: 100 }
            );
            res.json({
                success: true,
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
        console.log("testing the err", err);
        res.json({
            success: false,
            message: err,
        });
    }
}