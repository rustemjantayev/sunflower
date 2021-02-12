const mongoose = require("mongoose");
const Joi = require("joi");
const config = require('config');
const bcrypt = require('bcrypt');



const smsModel = mongoose.Schema({
    userid: {
        type: String,
        require: true,
        maxlength: 50,
        minlength: 5,
    },
    code:{
        type: String,
        require: true,
        maxlength: 100
    },
    action:{
        type: String,
        maxlength: 10
    },
    activated:{
        type: String,
        maxlength: 1,
        default: '0'
    }
});


const Sms = mongoose.model('sms', smsModel);

function smsModelValidation(sms){

    const schema = Joi.object({
        userid: Joi.string().max(50).required().min(5),
        code: Joi.string().required(),
        action: Joi.string().max(10),
        activated: Joi.string().max(1)
    });

    return schema.validate(sms);

}

module.exports.Sms = Sms;
module.exports.smsModelValidation = smsModelValidation;