const config = require("../config/auth.config");
const mongoose = require("mongoose");
const moment = require('moment')
const db = require("../models");
const Event = db.event
const Class = db.class


exports.createEvent = (req, res) => {
    console.log(req.body)

    const start = moment(req.body.start, 'DD/MM/YYYY');
    const end = moment(req.body.end, 'DD/MM/YYYY');
    const deadline = moment(req.body.deadline, 'DD/MM/YYYY');

    const event = new Event({
        name: req.body.name,
        start: Date.parse(moment(start).format('YYYY-MM-DD')),
        end: Date.parse(moment(end).format('YYYY-MM-DD')),
        deadline: Date.parse(moment(deadline).format('YYYY-MM-DD')),
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
                    try {
                        Event.deleteOne({ 'class' : mongoose.Types.ObjectId(classe._id)}).exec()
                    } catch(e) {
                        console.log(e)
                    }

                    event.class = classe._id;
                    event.save(err => {
                        if (err) {
                            res.status(500).send({message: err});
                            return;
                        }
                        res.redirect('/admin/accueil')
                    })
                })
        }
    }))
};

exports.adminBoard = (req, res) => {
    Event.find(function(err , docs){
        if (err) return console.log(err)
        const classesId = [];
        docs.forEach(function(doc) {
            classesId.push(doc.class)
        })
        Class.find({
            '_id': { $in : classesId }
        }, function (err, classes){
            if (err) return console.log(err)

            res.render('AccueilAdmin.html',{events: docs, classes: classes})
        }).sort({ '_id' : 1 })
    }).sort({ 'class' : 1 })
};

exports.adminPlanning = (req, res) => {


    Event.findOne({ '_id' : mongoose.Types.ObjectId(req.query.eventID)}, function(err , event) {
        if (err) return console.log(err)

        Event.find({'_id' : {$nin : [event._id]}}, function (err, events) {
            if (err) return console.log(err)

            const classesId = [];
            events.forEach(function (doc) {
                classesId.push(doc.class)
            })
            Class.find({
                '_id': {$in: classesId}
            }, function (err, classes) {
                if (err) return console.log(err)

                Class.findOne({
                    '_id': event.class
                }, function (err, classe) {
                    if (err) return console.log(err)

                    res.render("PlanningAdmin.html", {event: event, classe: classe, events: events, classes: classes})

                })
            }).sort({ '_id' : 1 })
        }).sort({ 'class' : 1 })
    })

};