const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = mongoose.Schema({
    login:{
        type:String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    flowers:[],
    admin:{
        type: Boolean,
        default: false
    }
});
//generation jwt token for user
userSchema.methods.genereteAuthToken = function(){
    return jwt.sign({_id: this._id, username: this.login, admin: this.admin},  config.get('jwtPrivateKey'));
}

const User = mongoose.model('user', userSchema);

function userValidation(user){
    const schema = Joi.object({
        login: Joi.string().required().min(6).max(25).pattern(new RegExp('^[a-zA-Z0-9-.-_]{3,30}$')),
        password: Joi.string().required(),
        repeat_password: Joi.string().required(),
        admin: Joi.boolean().default(false)
    });
    return schema.validate(user);
}

module.exports.User = User;
module.exports.userValidation = userValidation;