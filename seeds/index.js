const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

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

const seedName = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++ ) {
        const randomNum = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            title: `${seedName(descriptors)} ${seedName(places)}`
        })
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});