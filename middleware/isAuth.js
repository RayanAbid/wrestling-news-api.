
const { verify } = require("jsonwebtoken");
const USER = require("../models/User");

module.exports = async (req, res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).send({
            error: true,
            message: "Authorization Header Missing!"
        })
    }


    const token = authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).send({
            error: true,
            message: "Token must be not null"
        })
    }

    const isVerified = verify(token, process.env.JWTSCERETE);

    const user = await USER.findById(isVerified?.data?.id);

    if (!user) {
        return res.status(400).send({ error: true, message: "User is not Authorized" })
    }
    req.user = user;
    next()
}