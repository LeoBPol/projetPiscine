const express = require('express');
const bodyParser= require('body-parser')
const cors = require("cors");

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


// simple route
app.get("/api/auth/role", (req, res) => {
    res.render('PremierePage.html')
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
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
/*MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('test-quotes')
        const quotesCollection = db.collection('quotes')

        app.listen(3000, () => {
            console.log('listening on 3000')
        })

        app.set('view engine', 'ejs')

        //Middlewares
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(express.static('public'))
        app.use(bodyParser.json())

        // All your handlers here...
        app.get('/', (req, res) => {
            //res.sendFile(__dirname + '/index.html')
            //console.log(__dirname)
            // Note: __dirname is the current directory you're in.

            db.collection('quotes').find().toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results })
                })
                .catch(error => console.error(error))
        })

        app.post('/quotes', (req, res) => {
            console.log(req.body)
            quotesCollection.insertOne(req.body)
                .then(result => {
                    console.log('post')
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                { name: 'leo' },
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: false
                }
            )
                .then(result => res.json('Success'))
                .catch(error => console.error(error))
        })

        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                { name: req.body.name }
            )
                .then(result => {
                    if (result.deletedCount === 0) {
                        return res.json('No quote to delete')
                    }
                    res.json('Deleted Theo\'s quote')
                })
                .catch(error => console.error(error))
        })

    })
    .catch(error => console.error(error))*/

/*MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('test-quotes')
        const quotesCollection = db.collection('quotes')

        app.listen(3000, () => {
            console.log('listening on 3000')
        })

        app.set('view engine', 'ejs')

        //Middlewares
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(express.static('public'))
        app.use(bodyParser.json())

        // All your handlers here...
        app.get('/', (req, res) => {
            //res.sendFile(__dirname + '/index.html')
            //console.log(__dirname)
            // Note: __dirname is the current directory you're in.

            db.collection('quotes').find().toArray()
                .then(results => {
                    res.render('piscineconnexion.html', {quotes: results})
                })
                .catch(error => console.error(error))
        })

        app.post('/connexion', (req, res) => {
            console.log(req.body)
            res.redirect('/')
            quotesCollection.insertOne(req.body)
                .then(result => {
                    console.log('post')
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

    })
    .catch(error => console.error(error))*/