const config = require("../config/auth.config");
const mongoose = require("mongoose");
const moment = require('moment')
const db = require("../models");
const Event = db.event
const Class = db.class
const TimeSlot = db.timeSlot
const Teacher = db.teacher
const Room = db.room
const Jury = db.jury
const Group = db.group

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {

    if (req.query.eventID) {
        Event.findOne({'_id': mongoose.Types.ObjectId(req.query.eventID)}, function (err, event) {
            if (err) return console.log(err)

            console.log(event)

            let originalDate = new Date()
            if (req.query.firstDay === undefined) {
                let today = new Date();
                let day = today.getDay()
                originalDate.setDate(originalDate.getDate() - day + (day === 0 ? -6 : 1))
                originalDate = new Date(originalDate.getFullYear(), originalDate.getUTCMonth(), originalDate.getDate(), 0, 0, 0, 0)
            }

            let allTimeSlot = Array(10).fill([])

            async function dbQuery(i, day, originalDate) {
                let firstDate = new Date(originalDate.getTime() + (60 * 60 * 24) * 1000 * day)
                let lastDate = new Date(originalDate.getTime() + (60 * 60 * 24) * 1000 * (day + 1))
                const result = await TimeSlot.find(
                    {
                        startingTime:
                            {
                                $gte: 780 * i,
                                $lt: 780 * (i + 1)
                            },
                        date:
                            {
                                $gte: firstDate,
                                $lt: lastDate
                            }
                    })
                return result;
            }

            async function doIt(){
                for (let day = 0; day < 5; day++) {
                    for (let i = 0; i < 2; i++) {
                        allTimeSlot[(2 * day) + (i)] = await dbQuery(i, day, originalDate);
                    }
                }
                Class.findOne({_id: event.class}, function (err, classe){
                    res.render("PlanningEtudiant.html", {event: event, timeslots: allTimeSlot, classe: classe})
                })
            }

            doIt()

            /*for (let day = 0; day < 5; day++) {
                for (let i = 0; i < 2; i++) {

                    TimeSlot.find(
                        {
                            startingTime:
                                {
                                    $gte: 780 * i,
                                    $lt: 780 * (i + 1)
                                },
                            date:
                                {
                                    $gte: firstDate,
                                    $lt: lastDate
                                }
                        },
                        function (err, timeslots) {
                            allTimeSlot[(2 * day) + (i)] = timeslots
                            console.log(timeslots)
                        }).sort({date: 1, startingTime: 1})
                }
            }*/
        })
    } else {
        res.send('200', 'Pas d\'évent')
    }
};

exports.userBooking = (req, res) => {
    console.log(req.query)
    console.log(req.user)

    Group.findOne({student : {$elemMatch: req.user.id }}, function (err, group){
        console.log("group")
        console.log(group)
        res.redirect('/planning?eventID='+req.query.eventID)
    })
}
