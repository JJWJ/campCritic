const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const wrapAsync = require('../helpers/warpAsync');
const { isLoggedIn, validateCampground, verifyAuthor } = require('../middleware');


router.route('/')
    .get( wrapAsync(campgrounds.index))
    .post( isLoggedIn, validateCampground, wrapAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get( wrapAsync(campgrounds.showCampground))
    .put( isLoggedIn, verifyAuthor, validateCampground, wrapAsync( campgrounds.editCampground ))
    .delete( isLoggedIn, verifyAuthor, wrapAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, verifyAuthor, wrapAsync(campgrounds.renderEditForm));

module.exports = router;
