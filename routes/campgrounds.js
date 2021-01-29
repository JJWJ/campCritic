const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const wrapAsync = require('../helpers/warpAsync');
const { isLoggedIn, validateCampground, verifyAuthor } = require('../middleware');


router.get( '/', wrapAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn, validateCampground, wrapAsync(campgrounds.createCampground));

router.get('/:id/edit', isLoggedIn, verifyAuthor, wrapAsync(campgrounds.renderEditForm));

router.get('/:id', wrapAsync(campgrounds.showCampground));

router.put('/:id', isLoggedIn, verifyAuthor, validateCampground, wrapAsync( campgrounds.editCampground ));

router.delete('/:id', isLoggedIn, verifyAuthor, wrapAsync(campgrounds.deleteCampground));

module.exports = router;
