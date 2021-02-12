/// 01.28.21 Debugging, create rest API

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const logger = require('./midleware/loger');
const config = require('config');
const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const user = require('./routes/user');
const sms = require('./routes/sms');
const mongoose = require('mongoose');
const auth =  require('./routes/auth');
const flower = require('./routes/flower');

// to GET access to app configuration props
// $env:NODE_ENV = "production" or "development" WinOS
// export NODE_ENV  = "production" or "development" MAcOS

// access to password and keys or init variables 
// check mapping custom-enviroment-variables.json
// $env:[maping_name] = value WinOS
// export [maping_name]  = value MacOS


// if DEV show http debug

if(!config.get('jwtPrivateKey')){
    console.log("FATAL ERROR...")
    process.exit(1);
}
const port = process.env.port || 80;

mongoose.connect(config.get("mongo.db_name"),{ useNewUrlParser: true , useUnifiedTopology: true })
    .then(()=>{
        console.log("Mongoo conected..");
    })
    .catch((err)=>{
        console.log(err.message);
    })

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({extended: false}));
console.log(config.get('jwtPrivateKey'))
console.log(config.get('tokenPath'))

app.use('/api/user', user);
app.use('/api/sms', sms);
app.use('/', auth);
app.use('/api/flower', flower)

app.listen(80, ()=>{
    console.log('Server is running');
})