if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsEngine = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
const ExpressError = require('./helpers/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const {
	scriptSrcUrls,
	styleSrcUrls,
	connectSrcUrls,
	fontSrcUrls,
} = require('./helmetConfig');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const dbUrl = process.env.DB_URL;
const localDBUrl = 'mongodb://localhost:27017/camp-critic';
const connectUrl = dbUrl || localDBUrl;
const secret = process.env.SECRET || 'thisisnotaproductionsecret';
const PORT = process.env.PORT || 3000;

mongoose.connect(connectUrl, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
	console.log('Connected to database');
});

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsEngine);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
	secret: secret,
	resave: false,
	saveUninitialized: false,
	store: MongoStore.create({
		mongoUrl: connectUrl,
		touchAfter: 24 * 3600,
	}),
};
app.use(session(sessionConfig));
app.use(flash());
app.use(mongoSanitize());
app.use(helmet());
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [],
			connectSrc: [ "'self'", ...connectSrcUrls ],
			scriptSrc: [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
			styleSrc: [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
			workerSrc: [ "'self'", 'blob:' ],
			childSrc: [ 'blob:' ],
			objectSrc: [],
			imgSrc: [
				"'self'",
				'blob:',
				'data:',
				'https://res.cloudinary.com/dwaenqgi7/',
				'https://images.unsplash.com',
			],
			fontSrc: [ "'self'", ...fontSrcUrls ],
		},
	}),
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.signedInUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

app.use('/', userRoutes);
app.use('/campground', campgroundRoutes);
app.use('/campground/:id/review', reviewRoutes);

app.get('/home', (req, res) => {
	res.render('home');
});

app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'We Found An Error';
	res
		.status(statusCode)
		.render('error', { err, pageTitle: statusCode.toString() });
});

app.listen(PORT, () => {
	console.log(`Serving on port ${PORT}`);
});
