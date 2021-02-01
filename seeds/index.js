const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/camp-critic', {
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
  for (let i = 0; i < 250; i++) {
    const randomNum = Math.floor(Math.random() * 1000);
    const randomPrice = Math.floor(Math.random() * 151);
    const camp = new Campground({
      author: '601232f929735e0b578b62d1',
      location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
      geometry: {
        type: 'Point',
        coordinates: [ cities[randomNum].longitude, cities[randomNum].latitude]
      },
      title: `${seedName(descriptors)} ${seedName(places)}`,
      description:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum reprehenderit accusantium, quam excepturi qui nesciunt quisquam fugiat consequatur, omnis nobis nihil, atque voluptas magni culpa recusandae! Eius harum et error.',
      price: randomPrice,
      images: [
    {
      url: 'https://res.cloudinary.com/dwaenqgi7/image/upload/v1612010541/CampCritic/jtyg1d1jookt79miorjo.jpg',
      filename: 'CampCritic/jtyg1d1jookt79miorjo'
    },
    {
      url: 'https://res.cloudinary.com/dwaenqgi7/image/upload/v1612010541/CampCritic/mp9mrys9ohvdn55hnl6z.jpg',
      filename: 'CampCritic/mp9mrys9ohvdn55hnl6z'
    }
  ]
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
