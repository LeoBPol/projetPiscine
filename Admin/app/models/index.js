const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.admin = require("./admin.model");
db.role = require("./role.model");
db.class = require("./class.model");

module.exports = db;