const express = require('express');
const router = express.Router();
const Joi = require('joi');
const {User} = require('../model/user');
const bcrypt = require('bcrypt');
const config = require('config');
const {jsendSuccess, jsendError} = require('../thirdparty/jsend');

function loginValidation(auth){

    const schema = Joi.object({
        login: Joi.string().max(50).min(5).required(),
        password: Joi.string().max(50).min(5).required()
    });

    return schema.validate(auth);
}

router.get('/login', async(req,res)=>{
    const {login,password} = req.body;
    //validating login and password
    const {error} = loginValidation(req.body);
    if(error) return res
                        .status(400)
                        .send(jsendError(error,error.details[0].message));

    try{    
        //check user 
        const user =  await User.findOne({login:login});
        if(!user) return res
                            .status(400)
                            .send(jsendError(req.body,"somthing is wrong."));
        // if we have it generate token and save to header
        if(await bcrypt.compare(password, user.password)){
            return res
                    .header(config.get('tokenPath'), user.genereteAuthToken())
                    .send(jsendSuccess(user,"wellcome..."));
        } else{
            return res
                    .status(400)
                    .send(jsendError("","somthing is wrong"));
        } 
    }catch(e){
        return res
                .status(500)
                .send(jsendError(e, e.message));
    }

});



module.exports = router;