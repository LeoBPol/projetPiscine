const mongoose = require("mongoose");

const TimeSlot = mongoose.model(
    "TimeSlot",
    new mongoose.Schema({
        date: Date,
        startingTime: Number,
        rooms:
            [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Room"
            }],
        groups:
            [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Group"
            }],
        event:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
            },
        juries:
            [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Jury"
            }]

    })
);

module.exports = TimeSlot;