const mongoose = require("mongoose");

const Admin = mongoose.model(
    "Admin",
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

module.exports = Admin;