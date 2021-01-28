const { campgroundSchema } = require('./validations');
const ExpressError = require('./helpers/ExpressError');
const Campground = require('./models/campground');
const { reviewSchema } = require('./validations');

const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnUrl = req.originalUrl;
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login')
    }
    return next();
};

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    return next();
  }
};

const verifyAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if(!campground.author.equals(req.user._id)){
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

module.exports = { isLoggedIn, validateCampground, verifyAuthor, validateReview };