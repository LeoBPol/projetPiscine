const express = require('express');
const methodOverride = require('method-override');
const bodyParser= require('body-parser')
const cors = require("cors");
const cookieParser = require('cookie-parser')

const app = express();

const corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use('/', express.static(__dirname + '/public'));
//app.use('/', express.static(path.join(__dirname, 'public')));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

app.locals.moment = require('moment')

app.use(cookieParser())

app.engine('html', require('ejs').renderFile);
app.set('view engine','html');
app.set('views', __dirname+'/public/views');

// connexion with mongodb
const db = require("./app/models");
const dbConfig = require("./app/config/db.config");
const Role = db.role;
const Class = db.class;
const User = db.user;

db.mongoose
    .connect(`mongodb+srv://${dbConfig.HOST}@${dbConfig.PORT}/${dbConfig.DB}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/admin.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    console.log(`http://localhost:8080/`);
});

//const MongoClient = require('mongodb').MongoClient

//const connectionString = 'mongodb+srv://leo:test@cluster0.rmahg.mongodb.net/test?retryWrites=true&w=majority'

function initial() {

    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'user' to roles collection");
            });

            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");
            });
        }
    });

    Class.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Class({
                name: "IG2023"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'IG2023' to class collection");
            });

            new Class({
                name: "IG2022"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'IG2022' to class collection");
            });

            new Class({
                name: "IG2021"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'IG2021' to class collection");
            });
        }
    });
}