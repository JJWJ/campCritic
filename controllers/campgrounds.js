const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const camps = await Campground.find({});
    res.render('campground/index', { camps, pageTitle: 'Campgrounds' });
}

module.exports.renderNewForm = (req, res) => {
  res.render('campground/new', { pageTitle: 'Add A Campground' });
}

module.exports.createCampground = async (req, res) => {
    const { title, location, price, image, description } = req.body.campground;
    const newCampground = new Campground({
      title,
      location,
      price,
      image,
      description,
    });
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Campground successfully added!');
    res.redirect(`/campground/${newCampground._id}`);
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
      req.flash('error', 'No campground found!');
      return res.redirect('/campground');
    }
    return res.render('campground/edit', { camp, pageTitle: 'Edit A Campground' });
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'author'
        }
      })
      .populate('author');
    if (!camp) {
      req.flash('error', 'No campground found!');
      return res.redirect('/campground');
    }
    res.render('campground/show', { camp, pageTitle: camp.title });
}

 module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const { title, location, description, price, image } = req.body.campground;
    const updatedCamp = await Campground.findByIdAndUpdate(id, {
      title,
      location,
      description,
      price,
      image,
    });
    req.flash('success', 'Campground successfully updated!');
    return res.redirect(`/campground/${updatedCamp._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndRemove(id);
    return res.redirect('/campground');
}