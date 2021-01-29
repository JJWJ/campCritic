const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../helpers/warpAsync');
const users = require('../controllers/users');

router.get('/register', users.renderRegistrationForm);
router.post('/register', wrapAsync(users.createUser));

router.get('/login', users.renderLogin);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), users.loginUser);

router.get('/logout', users.logoutUser);

module.exports = router;