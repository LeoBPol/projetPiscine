const mongoose = require("mongoose");

const Group = mongoose.model(
    "Group",
    new mongoose.Schema({
        tutorFirstName: String,
        tutorLastName: String,
        companyName: String,
        supervisorTeacher:
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher"
            },
        students:
            [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
            }]
    })
);

module.exports = Group;