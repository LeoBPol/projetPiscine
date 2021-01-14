const config = require("../config/auth.config");
const mongoose = require("mongoose");
const moment = require('moment')
const db = require("../models");
const User = db.user
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

            let originalDate = new Date()
            if (req.query.firstDay === undefined) {
                let today = new Date();
                let day = today.getDay()
                originalDate.setDate(originalDate.getDate() - day + (day === 0 ? -6 : 1))
                originalDate = new Date(originalDate.getFullYear(), originalDate.getUTCMonth(), originalDate.getDate(), 0, 0, 0, 0)
            }

            let allTimeSlot = Array(10).fill([])
            let allRooms = Array(10).fill([[]])

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
                //console.log(result)
                return result;
            }

            async function doIt(){
                for (let day = 0; day < 5; day++) {
                    for (let i = 0; i < 2; i++) {
                        allTimeSlot[(2 * day) + (i)] = await dbQuery(i, day, originalDate);
                    }
                }
                Class.findOne({_id: event.class}, function (err, classe){
                    Group.findOne({students : req.user.id}, function (err, group){
                        if (group === null){
                            res.render("PlanningEtudiant.html", {event: event, timeslots: allTimeSlot, classe: classe, group: group, students: null, rooms: allRooms})
                            return
                        }
                        User.find({_id: {$in: group.students}}, function (err, students){
                            res.render("PlanningEtudiant.html", {event: event, timeslots: allTimeSlot, classe: classe, group: group, students: students, rooms: allRooms})
                        })
                    })
                })
            }

            doIt()
        })
    } else {
        res.render('AccueilEtudiant.html')
    }
};

exports.userBooking = (req, res) => {

    Group.findOne({students : req.user.id}, function (err, group){
        TimeSlot.findOne({_id: req.query.timeslotID}, function (err, timeslot) {
            let copy = timeslot.groups
            copy.push(group._id)
            TimeSlot.updateOne({_id: req.query.timeslotID}, {groups: copy}, function (err){
                res.redirect('/planning?eventID='+req.query.eventID)
            })
        })
    })
}

exports.getGroupRegistration = (req, res) => {
    Teacher.find(function (err, teachers){
        User.findOne({_id: req.user._id}, function (err, user){
            Event.findOne({class: user.class}, function (err, event){
                res.render('FormulaireEtudiant.html', {teachers : teachers, event: event})
            })
        })
    })
}

exports.groupRegistration = (req, res) => {

    const group = new Group({
        supervisorTeacher: mongoose.Types.ObjectId(req.body.teacher)
    })

    if (!(req.body.type)) {
        group.tutorFirstName = req.body.tutorFirstName
        group.tutorLastName = req.body.tutorLastName
        group.companyName = req.body.companyName
    }

    let users = Array(req.body.sizegroup).fill([])

    async function dbQuery(email) {
        const user = await User.findOne({email: email});
        return user._id
    }

    async function doIt(){
        if (req.body.sizegroup > 1) {
            for (let i = 0; i < req.body.sizegroup; i++) {
                users[i] = await dbQuery(req.body.email[i]);
            }
        }
        else {
            users[0] = await dbQuery(req.body.email);
        }

        group.students = users

        group.save(function (err){
            User.findOne({_id: req.user._id}, function (err, user){
                Event.findOne({class: user.class }, function (err, event){
                    res.redirect('/planning?eventID='+event._id)
                })
            })
        })
    }

    doIt()


}
