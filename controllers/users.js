const User = require('../models/user');

module.exports.renderRegistrationForm = (req, res) => {
    res.render('users/register', { pageTitle: 'Register'});
}

module.exports.createUser = async (req, res, next) => {
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
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login', { pageTitle: 'Login' });
}

module.exports.loginUser = (req, res) => {
    req.flash('success','Welcome Back!');
    const redirectUrl = req.session.returnUrl  || '/campground'
    delete req.session.returnUrl;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye');
    res.redirect('/campground');
}