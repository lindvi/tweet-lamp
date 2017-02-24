var rp = require('request-promise');
var tools = require('./pass');

var blink_lounge = {
  method: 'PUT',
  uri: 'http://10.0.6.150/api/G558vOtyjwZtX2mL0P8AsUhqkLEKW1hssKN7Esys/groups/2/action',
  body: { 
    alert: "lselect"
  },
  json:true
};

var blink_kitchen = {
  method: 'PUT',
  uri: 'http://10.0.6.150/api/G558vOtyjwZtX2mL0P8AsUhqkLEKW1hssKN7Esys/groups/5/action',
  body: { 
    alert: "lselect"
  },
  json:true
};


var interval = setInterval(function() {
  console.log('call')
  rp(blink_lounge)
  .then(function(result) {
    console.log(result)
    console.log('DISCO LOUNGE');
  })

  rp(blink_kitchen)
  .then(function(result) {
    console.log(result)
    console.log('DISCO KITHCEN');
  })
}, 15000);