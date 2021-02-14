const express = require('express');
const router = express.Router();
const {Sms, smsModelValidation} = require('../model/sms');
const Joi = require('joi');
const _ = require('lodash');
const auth = require('../midleware/auth');
const {sendSms} = require('../midleware/sendsms');
const bcrypt = require('bcrypt');
const {jsendError, jsendSuccess} = require('../thirdparty/jsend');


function phoneValidation(phone){
    const schema = Joi.object({
        phone: Joi.number().required()
    });
    return schema.validate(phone);
}

router.post('/validation', auth, async (req,res)=>{
    const {smsCode} = req.body;
    if(!smsCode) res.status(500).send(jsendError("","`smsCode` is required"));
    try{
        // find last sms did send
        const result =await Sms
                                .findOne({activated:"0",userid: req.user._id}) // not activated code 
                                .sort( [['_id', -1],] ); // sort DESC
        
        if(result) {
                // compare code with hashed code
                const code = await bcrypt.compare(smsCode, result.code);
                // idd success diactivate sms code, notl onger availiable 
                if(code) {
                    // activate sms code
                    await Sms.updateOne(result,{activated: "1"});
                    res.send(jsendSuccess({
                        activated: 1,
                        msg:"success"
                    }));
                } else {
                    res.send(jsendError({
                        activated: 0,
                        msg:"wrong sms code.."
                    }));
                }

        } else {
                res.send(jsendError({
                    activated: 0,
                    msg: "no data"
                }));
        }
    }catch(e){
        res.status(500).send(jsendError(e,e.message));
    }
});

router.post('/confirnmation',auth ,async (req,res)=>{
    console.log(req.body)
    const {phone} = req.body;
    const code = _.random(9999).toString();
    const sms = {
        userid:req.user._id,
        code: code,
        action: "conf"
    }
    //validate phonenumber
    const {error:e} = phoneValidation(req.body);
    if(e) return res.status(500).send(jsendError("", e.details[0].message));
    // sms code encription 
    try{
        const salt = await bcrypt.genSalt(1);
        //encrypt the code
        const smsencrypt = await bcrypt.hash(sms.code, salt);
        //rewrite the plaint code
        sms.code = smsencrypt;
    }catch(e){
        return res.status(500).send(jsendError("", e.message));
    }
  
    const {error} = smsModelValidation(sms);
    if(error) return res.status(500).send(jsendError(error, error.details[0].message));
  
    const user =  new Sms(sms);
    try{
        await user.save();
        //TODO add param to user phone number required
        //sendSms(phone,code);
        return res.send(jsendSuccess({phone:phone},""));
    }catch(e){
        res.status(500).send(jsendError(e.message));
    }
     
});


module.exports = router;
