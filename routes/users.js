const express = require('express');
const router = express.Router();
const wrapAsync = require('../helpers/warpAsync');
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register', { pageTitle: 'Register'});
});
router.post('/register', wrapAsync(async (req, res) => {
try { 
    const { username, email, password} = req.body.user;
    const newUser = await new User({username, email});
    const registeredUser = await User.register(newUser, password);
    req.flash('success', 'Welcome to Camp Critic!');
    res.redirect('/campground');
 } catch(e) {
     req.flash('error', e.message);
     res.redirect('/register');
 }
}));

module.exports = router;