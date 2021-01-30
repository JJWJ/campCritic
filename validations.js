const Joi = require('joi');

const preImageCampgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

const postImageCampgroundSchema = Joi.array().items(Joi.object({
            url: String,
            filename: String
        })).required();

const reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required()
    }).required()
})


module.exports = { preImageCampgroundSchema,  postImageCampgroundSchema, reviewSchema };