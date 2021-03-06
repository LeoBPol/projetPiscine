const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = async (req, res, next) => {
    try {
        let token = req.cookies['x-access-token'];
        if (token) {
            const decode = jwt.verify(token, config.secret)
            const user = await User.findOne({_id: decode.id})
            if (!user) {
                return res.redirect('/home');
            }
            req.token = token
            req.user = user
            next()
            return true
        } else {
            // cookie not found redirect to login
            return res.redirect('/home');
        }
    }
    catch {
        return res.redirect('/home');
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