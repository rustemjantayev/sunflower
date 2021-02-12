const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req,res,next){
 
    const token = req.header(config.get('tokenPath'));
    if(!token) return res.status(401).send("Access denied...");

    try{
        const decoded = jwt.decode(token, config.get("jwtPrivateKey"));
        req.user = decoded;
        // DOTO if user was exist but user have old cookies
        // condition for that
        next();
    } catch(e){
        req.status(404).send('Invalid Token');
    }

}

module.exports = auth;