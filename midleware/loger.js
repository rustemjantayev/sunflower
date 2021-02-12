function log(req, res, next){
    console.log('Authorization....')

    next(); 
}

module.exports = log;