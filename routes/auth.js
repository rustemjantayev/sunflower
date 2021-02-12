const express = require('express');
const router = express.Router();
const Joi = require('joi');
const {User} = require('../model/user');
const bcrypt = require('bcrypt');
const config = require('config');

function loginValidation(auth){

    const schema = Joi.object({
        login: Joi.string().max(50).min(5).required(),
        password: Joi.string().max(50).min(5).required()
    });

    return schema.validate(auth);
}

router.get('/login', async(req,res)=>{

    const {login,password} = req.body;

    const {error} = loginValidation(req.body);
    if(error) res.status(400).send(error.details[0].message);

    try{    
        const user =  await User.findOne({login:login});
        
        if(!user) res.status(400).send("somthing is wrong.");

        if(await bcrypt.compare(password, user.password)){
           
            res.header(config.get('tokenPath'), user.genereteAuthToken()).send("wellcome...");

        } else{
            res.status(400).send("somthing is wrong");
        } 

    }catch(e){
        res.status(500).send(e.message);
    }

});



module.exports = router;