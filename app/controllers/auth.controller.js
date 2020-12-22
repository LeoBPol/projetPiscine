const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Class = db.class;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

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
        .populate("roles", "-__v")
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

            let roleUser = "null";
            let classUser = "null";

            Role.findById(user.role, (err, role) => {
                if (err){
                    console.log(err);
                }
                else{
                    roleUser = role
                }
            }).then(Class.findById(user.class, (err, classUser) => {
                if (err){
                    console.log(err);
                }
                else{
                    classUser = classUser
                }
            })).then(res.status(200).send({
                id: user._id,
                firstName : user.firstName,
                lastName : user.lastName,
                email: user.email,
                role: roleUser,
                class: classUser,
                accessToken: token,
                message: "User was connected successfully!"
            })
            )
        });
};