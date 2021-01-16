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


exports.getEventCreation = (req, res) => {
    Teacher.find(function (err, teachers) {
        if (err) return console.log(err)

        res.render("FormulaireAdmin.html", {teachers: teachers})
    })
}


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
                        Event.deleteOne({'class': mongoose.Types.ObjectId(classe._id)}).exec()
                    } catch (e) {
                        console.log(e)
                    }

                    event.class = classe._id;

                    event.save((err, event) => {
                        if (err) {
                            res.status(500).send({message: err});
                            return;
                        }

                        if (req.body.withJury === "on") {

                            let juries = []
                            for (let i = 0; i < req.body.nbJury; i++) {
                                let teachers = []

                                for (let j = 0; j < req.body.sizeJury; j++) {
                                    console.log(req.body.jury[(i * req.body.sizeJury) + j])
                                    teachers.push(mongoose.Types.ObjectId(req.body.jury[(i * req.body.sizeJury) + j]))
                                }
                                const jury = new Jury({
                                    event: event._id,
                                    teachers: teachers
                                })
                                juries.push(jury)
                            }

                            Jury.insertMany(juries, function (err) {
                                if (err) return console.log(err)
                                res.redirect('/admin/accueil')
                            })


                        } else {
                            res.redirect('/admin/accueil')
                        }

                    })
                })
        }
    }))
};

exports.adminBoard = (req, res) => {
    Event.find(function (err, docs) {
        if (err) return console.log(err)
        const classesId = [];
        docs.forEach(function (doc) {
            classesId.push(doc.class)
        })
        Class.find({
            '_id': {$in: classesId}
        }, function (err, classes) {
            if (err) return console.log(err)

            res.render('AccueilAdmin.html', {events: docs, classes: classes})
        }).sort({'_id': 1})
    }).sort({'class': 1})
};

exports.adminPlanning = (req, res) => {

    async function getAllRooms(){
        return Room.find()
    }

    async function getAllJuries(eventID){
        return Jury.find({event : eventID})
    }

    async function getTeachersOfAllJuries(jury){
        return Teacher.find({_id : {$in : jury.teachers}})
    }

    async function findJuries(timeslot){
        return Jury.find({_id: {$in : timeslot.juries}})
    }

    async function findRooms(timeslot){
        return Room.find({_id: {$in : timeslot.rooms}})
    }

    async function findGroups(timeslot){
        return Group.find({_id: {$in : timeslot.groups}})
    }

    async function findTeachers(jury){
        return Teacher.find({_id: {$in : jury.teachers}})
    }

    async function doIt(){
        await Event.findOne({'_id': mongoose.Types.ObjectId(req.query.eventID)}, async function (err, event) {
            if (err) return console.log(err)

            let originalDate = new Date()
            if (req.query.firstDay === undefined) {
                let today = new Date();
                let day = today.getDay()
                originalDate.setDate(originalDate.getDate() - day + (day === 0 ? -6 : 1))
                originalDate = new Date(originalDate.getFullYear(), originalDate.getUTCMonth(), originalDate.getDate(), 0, 0, 0, 0)
            } else {
                originalDate = new Date(parseInt(req.query.firstDay))
            }

            let allTimeSlot = Array(10).fill([])
            let allJuries = Array(10).fill(Array(10).fill([]))
            let allRooms = Array(10).fill(Array(10).fill([]))
            let allGroups = Array(10).fill(Array(10).fill([]))
            let allTeachers = Array(10).fill(Array(10).fill([Array(10).fill([])]))

            for (let day = 0; day < 5; day++) {
                for (let i = 0; i < 2; i++) {
                    let firstDate = new Date(originalDate.getTime() + (60 * 60 * 24) * 1000 * day)
                    let lastDate = new Date(originalDate.getTime() + (60 * 60 * 24) * 1000 * (day + 1))
                    await TimeSlot.find(
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
                                },
                            event: event._id
                        },
                        async function (err, timeslots) {
                            console.log("timeslots size")
                            console.log(timeslots.length)

                            allTimeSlot[(2 * day) + (i)] = timeslots
                            allJuries[(2 * day) + (i)] = Array(timeslots.length).fill([])
                            allRooms[(2 * day) + (i)] = Array(timeslots.length).fill([])
                            allGroups[(2 * day) + (i)] = Array(timeslots.length).fill([])


                            for(let nbTimeSlots = 0; nbTimeSlots < timeslots.length; nbTimeSlots++){
                                allJuries[(2 * day) + (i)][nbTimeSlots] = await findJuries(timeslots[nbTimeSlots])
                                allRooms[(2 * day) + (i)][nbTimeSlots] = await findRooms(timeslots[nbTimeSlots])
                                allGroups[(2 * day) + (i)][nbTimeSlots] = await findGroups(timeslots[nbTimeSlots])

                                allTeachers[(2 * day) + (i)][allJuries[(2 * day) + (i)][nbTimeSlots].length] = Array(allJuries[(2 * day) + (i)][nbTimeSlots].length).fill([])

                                for(let nbJuries = 0; nbJuries < allJuries[(2 * day) + (i)][nbTimeSlots].length; nbJuries++) {
                                    allTeachers[(2 * day) + (i)][nbTimeSlots][nbJuries] = await findTeachers(allJuries[(2 * day) + (i)][nbTimeSlots][nbJuries])
                                }
                            }
                        }).sort({date: 1, startingTime: 1})
                }
            }

            await Event.find({'_id': {$nin: [event._id]}}, async function (err, events) {
                if (err) return console.log(err)

                const classesId = [];
                events.forEach(function (doc) {
                    classesId.push(doc.class)
                })
                await Class.find({
                    '_id': {$in: classesId}
                }, async function (err, classes) {
                    if (err) return console.log(err)

                    await Class.findOne({
                        '_id': event.class
                    }, async function (err, classe) {
                        if (err) return console.log(err)

                        const allJuriesOfEvent = await getAllJuries(event._id)
                        let teachersOfAllJuries = []
                        for(let nbALlJuries = 0; nbALlJuries < allJuriesOfEvent.length; nbALlJuries++){
                            teachersOfAllJuries[nbALlJuries] = await getTeachersOfAllJuries(allJuriesOfEvent[nbALlJuries])
                        }

                        await res.render("PlanningAdmin.html", {
                            event: event,
                            classe: classe,
                            events: events,
                            classes: classes,
                            timeslots: allTimeSlot,
                            originalDate: originalDate,
                            rooms: allRooms,
                            juries: allJuries,
                            groups: allGroups,
                            teachers: allTeachers,
                            allRooms: await getAllRooms(),
                            allJuries: allJuriesOfEvent,
                            teachersOfAllJuries: teachersOfAllJuries
                        })

                    })
                }).sort({'_id': 1})
            }).sort({'class': 1})
        })
    }

    doIt()

};

exports.proposeTimeSlot = (req, res) => {

    console.log(req.body)
    const date = moment(req.body.date, 'DD/MM/YYYY');
    const startingTime = parseInt(req.body.startingTime.substring(0, 2)) * 60 + parseInt(req.body.startingTime.substring(3, 5));

    const timeSlot = new TimeSlot({
        date: Date.parse(moment(date).format('YYYY-MM-DD')),
        startingTime: startingTime,
        event: mongoose.Types.ObjectId(req.params.eventID)
    });

    if (req.body.withJury === "on") {
        timeSlot.juries = req.body.jury
        timeSlot.rooms = req.body.room
    }

    timeSlot.save(function (err, timeSlot) {


        if (err) {
            res.status(500).send({message: err});
            return;
        }
        res.redirect("/admin/planning?eventID=" + req.params.eventID)
    });
}

exports.editTimeSlot = (req, res) => {

    console.log(req.query)
    console.log(req.body)

    const startingTime = parseInt(req.body.startingTime.substring(0, 2)) * 60 + parseInt(req.body.startingTime.substring(3, 5));

    let eventID = ""
    let date = new Date()

    TimeSlot.findOne({_id: req.query.timeslotID}, function (err, timeslot) {

        eventID = timeslot.event
        const diff = req.query.newDay - new Date(timeslot.date).getDate()
        date = new Date(timeslot.date.getTime() + (60 * 60 * 24) * 1000 * diff)

        console.log("new")
        console.log(date)
        console.log(startingTime)
        //diff jours calculs

        TimeSlot.updateOne({_id: req.query.timeslotID}, {
            startingTime: startingTime,
            date: date
        }, function (err, timeSlot) {
            if (err) {
                console.log(err)
                return;
            }
            res.redirect("/admin/planning?eventID=" + eventID+ "&firstDay=" + req.query.firstDay)
        })
    })

}

exports.getTimeSlotProposition = (req, res) => {

    Jury.find({event: req.query.eventID}, function (err, juries) {
        if (err) return console.log(err)
        let teachers = []

        async function dbQuery(teachers) {
            const teachersFind = await Teacher.find({_id: {$in: teachers}});
            return teachersFind
        }

        async function doIt(){
            for (let i = 0; i < juries.length; i++) {
                const teacher = await dbQuery(juries[i].teachers)
                teachers.push(teacher)
            }

            Room.find(function (err, rooms) {
                if (err) return console.log(err)

                res.render("ProposerCreneau.html", {
                    eventID: req.query.eventID,
                    rooms: rooms,
                    juries: juries,
                    teachers: teachers
                })
            }).sort({'name': 1});
        }

        doIt()
        /*Teacher.find({'$in' : teachersID}, function (err, teachers){

        })*/
    }).sort({'event': 1});
}

exports.manageTeachers = (req, res) => {

    Teacher.find(function (err, teachers) {
        if (err) return console.log(err)

        console.log(teachers)

        res.render("GestionProfesseur.html", {teachers: teachers})
    }).sort({'teacherLastName': 1});

}

exports.addTeacher = (req, res) => {

    const teacher = new Teacher({
        teacherFirstName: req.body.firstName,
        teacherLastName: req.body.lastName
    });

    teacher.save(function (err) {
        if (err) return console.log(err)
        res.redirect('/admin/manageTeachers/')
    });

}

exports.deleteTeacher = (req, res) => {

    Teacher.deleteOne({'_id': mongoose.Types.ObjectId(req.params.id)}, function (err) {
        if (err) return console.log(err)
        res.redirect('/admin/manageTeachers/')
    });

}

exports.manageRooms = (req, res) => {

    Room.find(function (err, rooms) {
        if (err) return console.log(err)

        console.log(rooms)

        res.render("GestionSalle.html", {rooms: rooms})
    }).sort({'name': 1});

}

exports.addRoom = (req, res) => {

    const room = new Room({
        name: req.body.name
    });

    room.save(function (err) {
        if (err) return console.log(err)
        res.redirect('/admin/manageRooms/')
    });

}

exports.deleteRoom = (req, res) => {

    Room.deleteOne({'_id': mongoose.Types.ObjectId(req.params.id)}, function (err) {
        if (err) return console.log(err)
        res.redirect('/admin/manageRooms/')
    });

}

exports.manageJuries = (req, res) => {

    Jury.find({event: req.query.eventID}, async function (err, juries) {
        if (err) return console.log(err)

        async function dbQuery(ids) {
            const result = await Teacher.find({_id: {$in: ids}})
            return result;
        }

        async function doIt() {
            let teachersInJuries = Array(juries.length).fill([])
            try {
                for (let i = 0; i < juries.length; i++) {
                    teachersInJuries[i] = await dbQuery(juries[i].teachers);
                }

                Teacher.find(function (err, teachers){
                    Event.findOne({_id: req.query.eventID}, function (error, event){
                        res.render("GestionJury.html", {juries: juries, teachersInJuries: teachersInJuries, teachers: teachers, event:event})
                    })
                }).sort({'teacherLastName': 1})
            } catch (error) {
                console.log(error);
            }
        }

        await doIt()

    })/*.sort({'teachers': 1})*/

}

exports.addJury = (req, res) => {

    let juries = []
    for (let i = 0; i < req.body.nbJury; i++) {
        let teachers = []

        for (let j = 0; j < req.body.sizeJury; j++) {
            console.log(req.body.jury[(i * req.body.sizeJury) + j])
            teachers.push(mongoose.Types.ObjectId(req.body.jury[(i * req.body.sizeJury) + j]))
        }
        const jury = new Jury({
            event: req.params.eventid,
            teachers: teachers
        })
        juries.push(jury)
        res.redirect('/admin/manageJuries?eventID='+req.params.eventid)
    }

    Jury.insertMany(juries)

}

exports.deleteJury = (req, res) => {

    Jury.deleteOne({'_id': mongoose.Types.ObjectId(req.params.id)}, function (err) {
        if (err) return console.log(err)
        res.redirect('/admin/manageJuries?eventID='+req.params.eventid)
    });

}