const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Class = db.class;

const { authJwt } = require("../middlewares");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    console.log(req.body)

    const user = new User({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }

        if (req.body.class) {
            Class.findOne(
                {
                    name: req.body.class
                },
                (err, classe) => {
                    if (err) {
                        res.status(500).send({message: err});
                        return;
                    }
                    user.class = classe._id;
                    user.save(err => {
                        if (err) {
                            res.status(500).send({message: err});
                            return;
                        }

                        Role.findOne(
                            {
                                name: "user"
                            },
                            (err, role) => {
                                if (err) {
                                    res.status(500).send({message: err});
                                    return;
                                }
                                user.role = role._id;
                                user.save(err => {
                                    if (err) {
                                        res.status(500).send({message: err});
                                        return;
                                    }

                                    res.send({message: "User was registered successfully!"});
                                });
                            });
                    });
                });
        }
    });
};

exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            let options = {
                path:"/",
                sameSite:true,
                maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
                httpOnly: true, // The cookie only accessible by the web server
            }

            res.cookie('x-access-token',token, options)
            if (authJwt.isAdmin(req, res)){
                res.redirect('/admin/accueil')
            } else {
                res.redirect('/planning')
            }
        });
};