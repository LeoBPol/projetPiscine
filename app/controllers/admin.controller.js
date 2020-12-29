const config = require("../config/auth.config");
const db = require("../models");
const Event = db.event

exports.createEvent = (req, res) => {
    console.log(req.body)

    const event = new Event({
        name: req.body.name,
        start: req.body.start,
        duration: req.body.duration,
        deadline: req.body.deadline,
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