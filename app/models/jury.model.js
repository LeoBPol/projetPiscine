const mongoose = require("mongoose");

const Jury = mongoose.model(
    "Jury",
    new mongoose.Schema({
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

module.exports = Jury;