const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../helpers/warpAsync');
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register', { pageTitle: 'Register'});
});
router.post('/register', wrapAsync(async (req, res, next) => {
try { 
    const { username, email, password} = req.body.user;
    const newUser = await new User({username, email});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, err => {
        if(err) return next();
        req.flash('success', 'Welcome to Camp Critic!');
        res.redirect('/campground');
    })
 } catch(e) {
     req.flash('error', e.message);
     res.redirect('/register');
 }
}));

router.get('/login', (req, res) => {
    res.render('users/login', { pageTitle: 'Login' });
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success','Welcome Back!');
    res.redirect('/campground');
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye');
    res.redirect('/campground');
})

module.exports = router;