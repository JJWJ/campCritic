const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const cloudinary = require('cloudinary').v2;

module.exports.index = async (req, res) => {
	let { page = 1 } = req.query;
	if (page < 1) page = 1;
	const limit = 10;
	let start = (page - 1) * limit;
	let end = page * limit;
	let last = false;
	const camps = await Campground.find({});
	const endOfCamps = camps.length;
	if (start > endOfCamps) {
		req.flash('error', 'No page found');
		const redirectUrl = req.session.returnUrl || '/campground';
		return res.redirect(redirectUrl);
	}
	if (end >= endOfCamps - 1) {
		last = true;
		end = endOfCamps - 1;
	}
	// if (page * limit >= endOfCamps) last = true;
	const campsToRender = camps.slice(start, end);

	res.render('campground/index', {
		camps,
		campsToRender,
		last,
		page,
		pageTitle: 'Campgrounds',
	});
};

module.exports.renderNewForm = (req, res) => {
	res.render('campground/new', { pageTitle: 'Add A Campground' });
};

module.exports.createCampground = async (req, res, next) => {
	const geoData = await geocoder
		.forwardGeocode({
			query: req.body.campground.location,
			limit: 1,
		})
		.send();
	const newCampground = new Campground(req.body.campground);
	newCampground.geometry = geoData.body.features[0].geometry;
	newCampground.images = req.files.map((f) => ({
		url: f.path,
		filename: f.filename,
	}));
	newCampground.author = req.user._id;
	await newCampground.save();
	req.flash('success', 'Campground successfully added!');
	res.redirect(`/campground/${newCampground._id}`);
};

module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params;
	const camp = await Campground.findById(id);
	if (!camp) {
		req.flash('error', 'No campground found!');
		return res.redirect('/campground');
	}
	return res.render('campground/edit', {
		camp,
		pageTitle: 'Edit A Campground',
	});
};

module.exports.showCampground = async (req, res) => {
	const { id } = req.params;
	const camp = await Campground.findById(id)
		.populate({
			path: 'reviews',
			populate: {
				path: 'author',
			},
		})
		.populate('author');
	if (!camp) {
		req.flash('error', 'No campground found!');
		return res.redirect('/campground');
	}
	res.render('campground/show', { camp, pageTitle: camp.title });
};

module.exports.editCampground = async (req, res) => {
	const { id } = req.params;
	const { title, location, description, price } = req.body.campground;
	const updatedCamp = await Campground.findByIdAndUpdate(id, {
		title,
		location,
		description,
		price,
	});
	const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	updatedCamp.images.push(...imgs);
	await updatedCamp.save();
	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await updatedCamp.updateOne({
			$pull: { images: { filename: { $in: req.body.deleteImages } } },
		});
	}
	req.flash('success', 'Campground successfully updated!');
	return res.redirect(`/campground/${updatedCamp._id}`);
};

module.exports.deleteCampground = async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndRemove(id);
	return res.redirect('/campground');
};
