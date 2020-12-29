const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = async (req, res, next) => {
    try {
        let token = req.cookies['x-access-token'];
        if (token) {
            console.log(token);
            const decode = jwt.verify(token, config.secret)
            console.log(decode.id)
            const user = await User.findOne({_id: decode.id})
            if (!user) {
                return res.redirect('/signin');
            }
            req.token = token
            req.user = user
            next()
            return true
        } else {
            // cookie not found redirect to login
            return res.redirect('/signin');
        }
    }
    catch {
        return res.redirect('/signin');
    }
};

isAdmin = async (req, res, next) => {
    Role.findById(req.user.role).exec(
        (err, role) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            next()
            return role.name === "admin"
        }
    )
};

const authJwt = {
    verifyToken,
    isAdmin
};
module.exports = authJwt