const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/camp-critic', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Connected to database');
});

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campground', async (req, res) => {
    const camps = await Campground.find({});
    res.render('campground/index', { camps });
});

app.get('/campground/:id', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id)
    res.render('campground/show', { camp });
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
});