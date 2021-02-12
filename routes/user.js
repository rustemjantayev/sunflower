// Autentification from instagram
// Auth from web site using password

const express = require('express');
const router = express.Router();
const {User, userValidation} = require('../model/user');
const bcrypt = require('bcrypt');
const config = require('config');
const auth = require('../midleware/auth');

router.get('/me',auth ,async (req,res)=>{
    try{
        const user = await User.findById(req.user._id).select('-password');
        if(!user) return res.status(500).send("something went wrong...");
        return res.send(user);
    }
    catch(err){
       return  res.status(500).send(err);
    }
});

// dwe dont store tokens, logout on client side
// router.get('/logout', (req,res)=>{
//     res.header(config.get('tokenPath'), "")
// });

router.post('/', async (req, res)=>{
    const {password,repeat_password,login} = req.body;
    const {error} = userValidation(req.body);
    
    if(error) return res.status(500).send(error.details[0].message);

    if(password!==repeat_password) return res.status(500).send("pw is not match");
    
    let user = await User.findOne({login:login}) 
    console.log(user);
    if(user!=null) return res.status(500).send('we alredy have this user');

    
    user = new User(req.body);
    try{
        const salt = await bcrypt.genSalt(1); //TODO put to config
        user.password = await bcrypt.hash(user.password, salt);
        const result = await user.save();
        if(config.get('tokenPath')) res.header(config.get('tokenPath'), user.genereteAuthToken()).send(result);
    }catch(err){
            res.status(500).send(err.message);
    }
});

module.exports = router;