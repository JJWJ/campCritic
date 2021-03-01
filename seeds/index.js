const mongoose = require('mongoose');
require('dotenv').config();
const Campground = require('../models/campground');
const cities = require('./cities');
const Details = require('./details');
const { places, descriptors } = require('./seedHelpers');
const dbUrl = process.env.DB_URL;
const seedUser = process.env.SEED_USER;

console.log(dbUrl);
console.log(seedUser);
mongoose.connect(dbUrl, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
	console.log('Connected to database');
});

const seedName = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 30; i++) {
		const randomNum = Math.floor(Math.random() * 1000);
		const randomPrice = Math.floor(Math.random() * 151);
		const detailNumber = Math.floor(Math.random() * 101);
		const detailObject = Details(
			detailNumber,
			`${seedName(descriptors)} ${seedName(places)}`,
			`${cities[randomNum].city}, ${cities[randomNum].state}`,
		);
		const camp = new Campground({
			author: seedUser,
			location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
			geometry: {
				type: 'Point',
				coordinates: [
					cities[randomNum].longitude,
					cities[randomNum].latitude,
				],
			},
			title: detailObject.title,
			description: detailObject.description,
			price: randomPrice,
			images: detailObject.images,
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
