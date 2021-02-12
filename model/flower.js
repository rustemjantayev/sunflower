const Joi = require("joi");
const mongoose = require("mongoose");

const flower = mongoose.Schema({
    name:{
        type: String,
        reqire: true,
        maxlength:255
    },
    desc:{
        type: String,
        reqire: true,
        maxlength:255       
    },
    price:{
        type: String,
        maxlength:12
    },
    img:{
        type: String,
        require:true,
        maxlength: 255
    },
    comment:{
        type: String,
        maxlength: 255
    }
});

const Flower = mongoose.model('flower', flower);

function validateFlower(flower){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        desc: Joi.string().min(25).max(255).required(),
        price: Joi.string().min(1).max(10),
        img: Joi.string().max(500).required(),
        comment: Joi.string().min(10).max(255)
   });

    return schema.validate(flower);
}

module.exports.validateFlower = validateFlower;
module.exports.Flower = Flower;
