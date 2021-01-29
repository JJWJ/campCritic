const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../helpers/warpAsync');
const users = require('../controllers/users');

router.route('/')
    .get( users.renderRegistrationForm)
    .post( wrapAsync(users.createUser));

router.route('/login')
    .get( users.renderLogin)
    .post( passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), users.loginUser);

router.get('/logout', users.logoutUser);

module.exports = router;