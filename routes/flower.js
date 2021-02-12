const express = require('express');
const router = express.Router();
const { validateFlower, Flower} = require('../model/flower');
const auth = require('../midleware/auth');
const admin = require('../midleware/admin');
const {jsendError, jsendSuccess} = require('../thirdparty/jsend');

router.post('/', auth, admin, async (req,res)=>{    
    const {_id, admin} = req.user;
    const {body} = req;
    // validation flower
    const {error} = validateFlower(body);
    if(error) return res.status(500).send(jsendError({},error.details[0].message));
    //create flower
    const flower =  new Flower(body);    
    try{
        // save flower    
        const result = await flower.save();
        return res.send(jsendSuccess(result));
    }catch(error){
        return res.send(jsendError("",error.message));
    }
});

router.delete('/',auth,async(req,res)=>{
    const {id} = req.body;
    // id is ruquired!!
    if(!id) return res.status(400).send(jsendError("","id is required.."));

    try{
        const flower = await Flower.findById(id);
        if(!flower) return res.status(404).send(jsendError("","not found the document"));

        const result = await Flower.deleteOne({_id: id});
        res.send(jsendSuccess(result));
    }catch(e){
        return res.status(500).send(jsendError("",e.error));

    } 
});

router.put('/:id', async(req, res)=>{
    const

});

module.exports = router;