const mongoose = require("mongoose");

const TimeSlot = mongoose.model(
    "TimeSlot",
    new mongoose.Schema({
        date: Date,
        startingTimeHour: Number,
        startingTime: Number,
        room:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Room"
            },
        group:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Group"
            },
        event:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
            },
        teachers:
            [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Teacher"
            }]

    })
);

module.exports = TimeSlot;