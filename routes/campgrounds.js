const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const wrapAsync = require('../helpers/warpAsync');
const { isLoggedIn, validateCampground, verifyAuthor } = require('../middleware');


router.get(
  '/',
  wrapAsync(async (req, res) => {
    const camps = await Campground.find({});
    res.render('campground/index', { camps, pageTitle: 'Campgrounds' });
  }),
);

router.get('/new', isLoggedIn, (req, res) => {
  res.render('campground/new', { pageTitle: 'Add A Campground' });
});

router.post(
  '/',
  isLoggedIn,
  validateCampground,
  wrapAsync(async (req, res) => {
    const { title, location, price, image, description } = req.body.campground;
    const newCampground = new Campground({
      title,
      location,
      price,
      image,
      description,
    });
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Campground successfully added!');
    res.redirect(`/campground/${newCampground._id}`);
  }),
);

router.get(
  '/:id/edit',
  isLoggedIn,
  verifyAuthor,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
      req.flash('error', 'No campground found!');
      return res.redirect('/campground');
    }
    return res.render('campground/edit', { camp, pageTitle: 'Edit A Campground' });
  }),
);

router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'author'
        }
      })
      .populate('author');
    if (!camp) {
      req.flash('error', 'No campground found!');
      return res.redirect('/campground');
    }
    res.render('campground/show', { camp, pageTitle: camp.title });
  }),
);

router.put(
  '/:id',
  isLoggedIn,
  verifyAuthor,
  validateCampground,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { title, location, description, price, image } = req.body.campground;
    const updatedCamp = await Campground.findByIdAndUpdate(id, {
      title,
      location,
      description,
      price,
      image,
    });
    req.flash('success', 'Campground successfully updated!');
    return res.redirect(`/campground/${updatedCamp._id}`);
    }
  ),
);

router.delete(
  '/:id',
  isLoggedIn,
  verifyAuthor,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndRemove(id);
    return res.redirect('/campground');
  }),
);

module.exports = router;
