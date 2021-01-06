const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsEngine = require('ejs-mate');
const wrapAsync = require('./helpers/warpAsync');
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

app.engine('ejs', ejsEngine);

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campground', wrapAsync(async (req, res) => {
    const camps = await Campground.find({});
    res.render('campground/index', { camps, pageTitle: 'Campgrounds' });
}));

app.get('/campground/new', (req, res) => {
    res.render('campground/new', {pageTitle: 'Add A Campground'});
});

app.post('/campground', wrapAsync(async (req, res) => {
    const {title, location, price, image, description} = req.body.campground;
    const newCampground = new Campground({
        title, location, price, image, description 
    });
    await newCampground.save();
    res.redirect(`/campground/${newCampground._id}`);
}));

app.get('/campground/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campground/edit', { camp, pageTitle: 'Edit A Campground' });
}));

app.get('/campground/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campground/show', { camp, pageTitle: camp.title });
}));

app.put('/campground/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    const { title, location, description, price, image } = req.body.campground;
    const updatedCamp = await Campground.findByIdAndUpdate(id, { title, location, description, price, image });
    res.redirect(`/campground/${updatedCamp._id}`);
}));

app.delete('/campground/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campground');
}));

app.use((err, req, res, next) => {
    res.send('We found an error!');
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});