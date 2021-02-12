const jwt = require('jsonwebtoken');
const config = require('config');

function admin(req,res,next){
 
    const token = req.header(config.get('tokenPath'));
    if(!token) return res.status(401).send("Access denied...");

    try{
        const decoded = jwt.decode(token, config.get("jwtPrivateKey"));
        req.user = decoded;
       
        const {admin} = req.user;
        if(!admin) return  res.status(500).send("access denied...");

        next();
    } catch(e){
        req.status(404).send('Invalid Token');
    }

}

module.exports = admin;