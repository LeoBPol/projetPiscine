const config = require("../config/auth.config");
const db = require("../models");
const Event = db.event
const Class = db.class

exports.createEvent = (req, res) => {
    console.log(req.body)

    const event = new Event({
        name: req.body.name,
        start: /*req.body.start*/Date.parse("2011-10-10"),
        end: /*req.body.end*/Date.parse("2011-10-10"),
        deadline: /*req.body.deadline*/Date.parse("2011-10-10"),
        presentationDuration: req.body.presentationDuration,
        sizeJury: req.body.sizeJury
    });

    event.save(((err, event) => {
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
                    event.class = classe._id;
                    event.save(err => {
                        if (err) {
                            res.status(500).send({message: err});
                            return;
                        }
                        console.log(event)
                        console.log("Successfully saved")
                        res.redirect('/admin/accueil')
                    })
                })
        }
    }))
};

exports.adminBoard = (req, res) => {
    res.render('AccueilAdmin.html')
};