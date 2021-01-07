const mongoose = require("mongoose");

const Teacher = mongoose.model(
    "Teacher",
    new mongoose.Schema({
        teacherFirstName: String,
        teacherLastName: String
    })
);

module.exports = Teacher;