const express = require('express');
const router = express.Router();
const {User, userValidation} = require('../model/user');
const bcrypt = require('bcrypt');
const config = require('config');
const auth = require('../midleware/auth');
const {jsendSuccess,jsendError} = require('../thirdparty/jsend');
// get current user
router.get('/me',auth ,async (req,res)=>{
    try{
        const user = await User.findById(req.user._id).select('-password');
        if(!user) return res.status(500).send(jsendError("","something went wrong..."));
        return res.send(jsendSuccess(user));
    }
    catch(err){
       return  res.status(500).send(jsendError(err,err.message));
    }
});

// dwe dont store tokens, logout on client side
// router.get('/logout', (req,res)=>{
//     res.header(config.get('tokenPath'), "")
// });
//create new user
router.post('/', async (req, res)=>{
    const {password,repeat_password,login} = req.body;
    const {body} = req;
    //validation new user data
    const {error} = userValidation(body);
    // validation user object
    if(error) return res.status(500).send(jsendError(error,error.details[0].message));
    //compare password
    if(password!==repeat_password) return res.status(500).send(jsendError("","pw is not match"));
    //check do we have same user name
    let user = await User.findOne({login:login}) 
    if(user!=null) return res.status(500).send(jsendError("",'we alredy have this user'));

    user = new User(body);
    try{
        //generate salt for hashing
        const salt = await bcrypt.genSalt(1); //TODO put to config
        user.password = await bcrypt.hash(user.password, salt);
        const result = await user.save();
        if(config.get('tokenPath')) res
                                        .header(config.get('tokenPath'), user.genereteAuthToken())
                                        .send(jsendSuccess(result));
    }catch(err){
            res.status(500).send(jsendError(err ,err.message));
    }
});

// add flower to current user
router.post('/flower', auth, async(req, res)=>{

});
// delete flower from current user
router.delete('/flower/:id', auth, async(req, res)=>{

});

module.exports = router;