const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
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

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campground', async (req, res) => {
    const camps = await Campground.find({});
    res.render('campground/index', { camps });
});

app.get('/campground/new', (req, res) => {
    res.render('campground/new');
});

app.post('/campground', async (req, res) => {
    const {title, location} = req.body.campground;
    const newCampground = new Campground({
        title, location
    });
    await newCampground.save();
    res.redirect(`/campground/${newCampground._id}`);
});

app.get('/campground/:id/edit', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campground/edit', { camp });
})

app.get('/campground/:id', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campground/show', { camp });
});

app.put('/campground/:id', async (req, res) => {
    const { id } = req.params
    const { title, location } = req.body.campground;
    const updatedCamp = await Campground.findByIdAndUpdate(id, {title, location});
    res.redirect(`/campground/${updatedCamp._id}`);
});

app.delete('/campground/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campground');
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});