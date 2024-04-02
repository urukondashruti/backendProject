const express = require("express")
const mongoose = require("mongoose")
const app = express();
app.use(express.json());
const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); 

const username = "urukonda";
const password = "urukondashruti";
const database = "moviesList"
const db = `mongodb+srv://${username}:${password}@cluster0.rvbuzyn.mongodb.net/${database}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(db).then(() => {
    console.log("connection successful");
}).catch((err) => console.log("no connection"));

const moviesSchema = new mongoose.Schema({
    _id:String,
    name:String,
    director:String,
    producer:String,
    hero:String,
    heroine:String
})

const moviesModel = mongoose.model("movies",moviesSchema)

app.get("/get-all",(req,res) => {
    moviesModel.find({}).then(function(movies) {
        res.json(movies)
    }).catch(function(err) {
        console.log(err)
        res.json({ error: 'Internal server error' }); 
    })
})

app.get("/get-single/:id", (req, res) => {
    const movieId = req.params.id;
    moviesModel.findById(movieId).then(function(movie) { 
        res.json(movie);
    }).catch(function(err) {
        console.log(err);
        res.json({ error: 'Internal server error' }); 
    });
});

app.get("/get-paginated", (req, res) => {
    const page = parseInt(req.query.page) 
    const size = parseInt(req.query.size) 

    const skip = (page - 1) * size; 
    const limit = size; 

    moviesModel.find({})
        .skip(skip) 
        .limit(limit) 
        .then(function(movies) {
            res.json(movies); 
        })
        .catch(function(err) {
            console.log(err);
            res.json({ error: 'Internal server error' }); 
        });
});

app.post("/add-movie", (req, res) => {
    const { _id,name, director, producer, hero, heroine } = req.body; 

    moviesModel.create({
        _id:_id,
        name:name,
        director:director,
        producer:producer,
        hero:hero,
        heroine:heroine
    }).then(function (newMovie) {
        res.json(newMovie); // Respond with the details of the newly created movie
    }).catch(function (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' }); // Respond with an error message
    });
});

app.listen(3002, () => {
    console.log("server is running");
});
