const mongoose = require("mongoose");

const TimeSlot = mongoose.model(
    "TimeSlot",
    new mongoose.Schema({
        date: Date,
        startingTime: Number,
        room:
            [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Room"
            }],
        group:
            [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Group"
            }],
        event:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
            },
        jury:
            [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Jury"
            }]

    })
);

module.exports = TimeSlot;