const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        firstName : String,
        lastName : String,
        email: String,
        password: String,
        class:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Class"
            }
        ,
        role:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
    })
);

module.exports = User;