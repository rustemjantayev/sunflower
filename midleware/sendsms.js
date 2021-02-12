const Nexmo = require('nexmo');

//TODO put them in env variables
const nexmo = new Nexmo({
  apiKey: 'ea9d4274',
  apiSecret: 'U6wbFDMsCGl4JEuZ',
});


function send(to="16194140093", code){
    const from = '19528004707';
    const text = 'Sunflower: '+ code
    nexmo.message.sendSms(from, to, text);
};

module.exports.sendSms = send;
