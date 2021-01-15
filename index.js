const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsEngine = require('ejs-mate');
const { reviewSchema } = require('./validations');
const wrapAsync = require('./helpers/warpAsync');
const ExpressError = require('./helpers/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/reviews');

const campgrounds = require('./routes/campgrounds');

mongoose.connect('mongodb://localhost:27017/camp-critic', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.use('/campground', campgrounds);

app.get('/', (req, res) => {
    res.render('home');
});


app.delete('/campground/:id/review/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndRemove(reviewId);
    res.redirect(`/campground/${id}`);
}));

app.post('/campground/:id/review', wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campground/${campground._id}`);
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'We Found An Error';
    res.status(statusCode).render('error', {err, pageTitle : statusCode.toString()});
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});