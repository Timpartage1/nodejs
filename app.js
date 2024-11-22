const express = require('express')
const app = express();
const user = require('./models/user');
//rendering views 
app.set('view engine', 'ejs');
app.use(express.static('./public'));

//db
const moongoose = require('mongoose');
const dbUri = "mongodb+srv://root:8466%40tim@timongo.ydcds.mongodb.net/" +
    "?retryWrites=true&w=majority&appName=supermarket";

//149.82.54.21/32,15.114.158.56
moongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Database connected succesfully");
        app.listen(8080);
    }).catch((err) => {
        console.log(err);
    });

const Users = new user({
    firstname: "Timothee",
    lastname: "Katende",
    age: "24",
    password: "12345678"
});


app.get('/add-user', (req, res) => {

    Users.save().then(result => res.send(result));


});


app.get('/allUser', (req, res) => {
    User.find().then(result => res.send(result));
});

const blog = [{ 'title': 'Ruch Dad', 'content': 'lorem ipsum' },
{ 'title': 'Yanik Noad', 'content': 'Il est venu ce amtin ipsum' },
{ 'title': 'Yanke Boeh', 'content': 'lorem ipsum' }];

app.get('/', (req, res) => {
    res.render('index', { title: 'Home', blog });
});

app.get('/about', (req, res) => {
    res.sendFile('./about.html', { root: __dirname });
});

app.get('/about-us', (req, res) => {
    res.redirect('./about');
});



app.use((req, res) => {

    res.sendFile('error.html', { root: __dirname });

});
