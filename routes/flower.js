const express = require('express');
const router = express.Router();
const { validateFlower, Flower} = require('../model/flower');
const auth = require('../midleware/auth');
const admin = require('../midleware/admin');
const {jsendError, jsendSuccess} = require('../thirdparty/jsend');

/*
create flower new admin permision
need admin permisio
*/
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

/*
delete flower by id
need admin permision
*/
router.delete('/',admin ,async(req,res)=>{
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

/*
 update flower by id
need admin permision
*/
 router.put('/:id', admin, async(req, res)=>{
    const {id} = req.params;
    const {body} = req;
    const {name, desc, img} = req.body;
    //check for iid
    if(!id) return res.status(500).send(jsendError("", "id is requiried"));
    // validate object
    const {error} = validateFlower(body);
    if(error) return res.status(500).send(jsendError(body, error.details[0].message));

    try{
        //check object in db
        let flower = await Flower.findById(id);
        // if we have this object, udate
        if(!flower) return res.status(400).send(jsendError(req.params, "no data.")); 
            flower.name = name;
            flower.img = img;
            flower.desc = desc;
        const result = await flower.save();

        return res.send(jsendSuccess(result));
    }catch(error){
        return res.status(500).send(jsendError("", error.message));
    }
});
/*
get a flower by id
dont need admin permision 
*/
router.get('/:id',auth, async(req,res)=>{
    const {id} = req.params;
    try{
        // do we have it in db ?
        const flower = Flower.findById(id);
        if(!flower) return res.status(404).send(jsendError(id, "not found."));
        // return flower 
        return res.send(jsendSuccess(flower));
    } catch{
        return res.status(500).send(jsendError(id, error.details[0].message));
    }
});



module.exports = router;