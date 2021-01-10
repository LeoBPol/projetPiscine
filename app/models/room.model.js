const mongoose = require("mongoose");

const Room = mongoose.model(
    "Room",
    new mongoose.Schema({
        name: String
    })
);

module.exports = Room;