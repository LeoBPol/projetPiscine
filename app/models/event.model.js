const mongoose = require("mongoose");

const Class = mongoose.model(
    "Event",
    new mongoose.Schema({
        name: String,
        start: Date,
        end: Date,
        deadline: Date,
        presentationDuration: Number,
        sizeJury: Number,
        class:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Class"
            }
    })
);

module.exports = Class;