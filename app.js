const express = require('express')
const app = express();

//rendering views 
app.set('view engine', 'ejs');
app.use(express.static('public'));

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


app.get('/', (req, res) => {
    res.render('index');
});





app.use((req, res) => {

    res.send('Not found')

});
