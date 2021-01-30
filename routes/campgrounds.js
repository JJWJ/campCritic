const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const wrapAsync = require('../helpers/warpAsync');
const { isLoggedIn, preImageValidateCampground,verifyAuthor, } = require('../middleware');
const multer  = require('multer');
const { storage } = require('../cloudinary/config');
const upload = multer({ storage });

router.route('/')
    .get( wrapAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('images'), preImageValidateCampground, wrapAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get( wrapAsync(campgrounds.showCampground))
    .put( isLoggedIn, verifyAuthor, wrapAsync( campgrounds.editCampground ))
    .delete( isLoggedIn, verifyAuthor, wrapAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, verifyAuthor, wrapAsync(campgrounds.renderEditForm));

module.exports = router;
