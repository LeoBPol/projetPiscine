const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.class = require("./class.model");
db.event = require("./event.model")
db.timeSlot = require("./timeSlot.model")
db.teacher = require("./teacher.model")

db.ROLES = ["user", "admin"];

module.exports = db;