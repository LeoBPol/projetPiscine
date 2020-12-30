const mongoose = require("mongoose");

const Class = mongoose.model(
    "Class",
    new mongoose.Schema({
        name: String
    })
);

module.exports = Class;