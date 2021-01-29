const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../helpers/warpAsync');
const { validateReview, isLoggedIn, verifyReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');


router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.addReview));

router.delete('/:reviewId', isLoggedIn, verifyReviewAuthor, wrapAsync(reviews.deleteReview));

module.exports = router;