const express = require('express');
const router = express.Router({ mergeParams: true });
const ExpressError = require('../helpers/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/reviews');
const wrapAsync = require('../helpers/warpAsync');
const { reviewSchema } = require('../validations');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post('/', wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review successfully added!');
    res.redirect(`/campground/${campground._id}`);
}));

router.delete('/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndRemove(reviewId);
    req.flash('success', 'Review successfully deleted!');
    res.redirect(`/campground/${id}`);
}));

module.exports = router;