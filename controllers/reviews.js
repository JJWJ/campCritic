const Campground = require('../models/campground');
const Review = require('../models/reviews');

module.exports.addReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review successfully added!');
    res.redirect(`/campground/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndRemove(reviewId);
    req.flash('success', 'Review successfully deleted!');
    res.redirect(`/campground/${id}`);
}