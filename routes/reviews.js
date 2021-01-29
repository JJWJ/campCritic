const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require('../models/reviews');
const wrapAsync = require('../helpers/warpAsync');
const { validateReview, isLoggedIn, verifyReviewAuthor } = require('../middleware');


router.post('/', isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review successfully added!');
    res.redirect(`/campground/${campground._id}`);
}));

router.delete('/:reviewId', isLoggedIn, verifyReviewAuthor, wrapAsync(async (req, res) => {
    const { id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndRemove(reviewId);
    req.flash('success', 'Review successfully deleted!');
    res.redirect(`/campground/${id}`);
}));

module.exports = router;