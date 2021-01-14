const config = require("../config/auth.config");
const db = require("../models");
const mongoose = require("mongoose");
const User = db.user;
const Role = db.role;
const Class = db.class;
const Event = db.event;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {

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
                                    res.redirect('/signin')
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
                console.log(err)
                res.redirect('/signin')
                return
            }

            if (!user) {
                res.redirect('/signin')
                return
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                res.redirect('/signin')
                return
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
            Role.findById({_id: user.role})
                .exec((err, role) => {
                    if(role.name === "admin"){
                        res.redirect('/admin/accueil')
                    }
                    else {
                        Event.findOne({class: mongoose.Types.ObjectId(user.class)}, function (err, event){
                            console.log(event)
                            res.redirect('/planning?eventID='+event._id)
                        })
                    }
            })
        });
};

exports.logout = (req, res) => {
    res.clearCookie("x-access-token")
    res.redirect('/home')
};