const { preImageCampgroundSchema } = require('./validations');
const ExpressError = require('./helpers/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/reviews');
const { reviewSchema } = require('./validations');

const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnUrl = req.originalUrl;
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login')
    }
    return next();
};

const preImageValidateCampground = (req, res, next) => {
  const { error } = preImageCampgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    return next();
  }
};

// const postImageValidateCampground = (req, res, next) => {
//   console.log(req.body, 'Next UP', req.files);
//   const { error } = postImageCampgroundSchema.validate(req.files); 
//   if (error) {
//     const msg = error.details.map((el) => el.message).join(',');
//     throw new ExpressError(msg, 400);
//   } else {
//     return next();
//   }
// };

const verifyAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if(!campground.author.equals(req.user._id)){
    req.flash('error', 'Not Authorized')
    return res.redirect(`/campground/${id}`)
  }
  return next();
};

const verifyReviewAuthor = async (req, res, next) => {
  const { id ,reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if(!review.author.equals(req.user._id)){
    req.flash('error', 'Not Authorized')
    return res.redirect(`/campground/${id}`)
  }
  return next();
};

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// const debug = (req, res, next) => {
//   console.log(req.body);
//   console.log(req.files);
//   console.log(res.req.files);
//   console.log(req.header);
//   console.log(req)
//   return next();
// }

module.exports = { isLoggedIn, preImageValidateCampground, verifyAuthor, validateReview, verifyReviewAuthor };