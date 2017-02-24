// Initalizing
var DEBUG = true;
var intervalActive = true;
var doNotSend = true;

var tools = require('./pass');
var utils = require('./utils');

var _ = require('lodash');
var moment = require('moment');
var request = require('request');
var rp = require('request-promise');
var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: tools.env.TWITTER_CONSUMER_KEY,
  consumer_secret: tools.env.TWITTER_CONSUMER_SECRET,
  access_token_key: tools.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: tools.env.TWITTER_ACCESS_TOKEN_SECRET
});


var Stream = require('user-stream');
var stream = new Stream({
  consumer_key: tools.env.TWITTER_CONSUMER_KEY,
  consumer_secret: tools.env.TWITTER_CONSUMER_SECRET,
  access_token_key: tools.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: tools.env.TWITTER_ACCESS_TOKEN_SECRET
});


var lastTweet = null;

client.get('statuses/user_timeline', function(error, tweets, response) {
  if(error) throw error;
  lastTweet = new Date(_.head(tweets).created_at);
});

var params = {
  with: 'user'
}

stream.stream(params);


//stream JSON data
stream.on('data', function(data){
  console.log(data);
  if (data.text != undefined && data.retweeted_status == undefined) {
    lastTweet = new Date(data.created_at);
    startDecay();
  }
});

//connected
stream.on('connected', function(){
  console.log('Stream created');
});

//connection errors (request || response)
stream.on('error', function(error){
  console.error('Turning of interval');
  clearInterval(interval);
  console.log('Connection error:');
  console.log(error);
});

//stream close event
stream.on('close', function(error){
  console.error('Turning of interval');
  clearInterval(interval);
  console.log('Stream closed');
  console.log(error);
});

var blink = {
  method: 'PUT',
  uri: tools.hue.uri,
  body: { 
    alert: "lselect",
    xy: [utils.rgb.x, utils.rgb.y]
  },
  json:true
};

var decay = {
  method: 'PUT',
  uri: tools.hue.uri,
  body: { 
    xy: [utils.rgb.x, utils.rgb.y]
  },
  json:true
};

function startDecay() {
  utils.rgb.red = 0;
  utils.rgb.green = 0;
  utils.rgb.blue = 1;
  intervalActive = false;

  rp(blink)
  .then(function (result) {
    console.log('blink')
    setTimeout(function() {
      utils.calculateCurrentColor(function() {
        rp(decay)
        .then(function() {
          intervalActive = true;
          console.log('DONE');
        }) 
      })

    }, 3000);
  });
}

var MAX_TIME_SINCE_TWEET = 2*86400; // 48 hours


var interval = setInterval(function() {
  if (intervalActive) {
    var duration = moment.duration(moment().diff(moment(lastTweet)));

    console.log('Since last tweet', duration.asSeconds());

    var diff = duration.asSeconds() / MAX_TIME_SINCE_TWEET;
    
    if (diff > 1.0) {
      diff = 1.0;
      doNotSend = true;
    }

    utils.rgb.blue = 1.0 - diff;
    utils.rgb.red = diff;

    if (doNotSend) {
      utils.calculateCurrentColor(function() {
        var decay = {
          method: 'PUT',
          uri: tools.hue.uri,
          body: { 
            xy: [utils.rgb.x, utils.rgb.y]
          },
          json:true
        };
        rp(decay)
        .then(function(result) {
          if (DEBUG) {
            console.log('Decaying: ' , diff);
          }
        });  
      });
    }

  }  
}, 2000);