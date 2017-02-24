var rp = require('request-promise');
var tools = require('./pass');

console.log('DISCO LOUNGE');
console.log('DISCO KITHCEN');


var blink_lounge = {
  method: 'PUT',
  uri: 'http://10.0.6.150/api/G558vOtyjwZtX2mL0P8AsUhqkLEKW1hssKN7Esys/groups/2/action',
  body: { 
    hue: 65280,
    alert: "lselect",
    effect: "colorloop"
  },
  json:true
};

var blink_kitchen = {
  method: 'PUT',
  uri: 'http://10.0.6.150/api/G558vOtyjwZtX2mL0P8AsUhqkLEKW1hssKN7Esys/groups/5/action',
  body: { 
    hue: 65280,
    alert: "lselect",
    effect: "colorloop"
  },
  json:true
};


rp(blink_lounge)
.then(function(result) {
})

rp(blink_kitchen)
.then(function(result) {
})

var interval = setInterval(function() {
  rp(blink_lounge)
  .then(function(result) {
  })

  rp(blink_kitchen)
  .then(function(result) {
  })
}, 15000);