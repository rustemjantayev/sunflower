const Joi = require('joi');

function objectIdValidation(obj){
    const schema = Joi.object({
        _id: Joi.objectId().required()
    });
    return schema.validate(obj);
}

module.exports.objectIdValidation = objectIdValidation;
