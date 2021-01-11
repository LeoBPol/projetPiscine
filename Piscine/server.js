const express = require('express');
const mongoose = require('mongoose');
const route = require('./routes/route');
const app = express();
const bodyParser = require('body-parser');
app.listen(5000)
mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser : true, useUnifiedTopology : true
});

mongoose.connection
.on('open', () => {
    console.log('Mongoose connection open');
})
.on('error', (err) => {
    console.log(`Connection error : ${err.message}`);
});


app.use(express.urlencoded({extended : false}));


app.get('/', (req,res) => {
    //Pour afficher les pages que l'on va créer 
    res.render('index')
});

app.set('view engine', 'ejs')
app.use('/', route);


