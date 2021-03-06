var cheerio = require('cheerio');
var request = require('request');
var URL = require('url');
var util = require('util');
require('sugar');
var states = require('../data/states.json');
var redisConfig = require('../config/redisConfig');

var baseurl = 'http://www.gaspricewatch.com/%s/%s/gas-prices/page-1/2.htm';

function createUrl(state, city) {
  // convert to a format accepted by gaspricewatch
  state = state.toUpperCase();
  var stateName = states[state];
  stateName = stateName.toLowerCase();
  state = state + ' ' + stateName;
  state = state.replace(/\s+/g, '-');
  
  // converts fort worth => Fort-Worth
  city = city.capitalize(true);
  city = city.split(' ').join('-');
  
  var url = util.format(baseurl, state, city);
  return url;
}

function requestPrices(url, prices, cacheKey, redisClient, fn) {
  request (url, function(err, res, body) {
    if (err) {
      prices.message = err;
      console.log(err);
    } else {
      // load page
      $ = cheerio.load(body);
      
      // get required data using cheerio
      var scraped = $('.fs16.fcred');
      if (scraped.length > 4) {
        prices.message = "Success";
        prices.average = parseFloat(scraped[2].children[0].data.substring(1));
        prices.lowest = parseFloat(scraped[3].children[0].data.substring(1));
        prices.highest = parseFloat(scraped[4].children[0].data.substring(1));
        prices.datecreated = new Date();
      } else {
        prices.message = "Error retrieving gas prices";
      }
    }
    
    // cache result that expires in 24 hours
    redisClient.set(cacheKey, JSON.stringify(prices));
    redisClient.expire(cacheKey, 24 * 3600);
    
    fn(prices);
  });
}

exports.scrape = function (state, city, fn) {
  var prices = { state: state, city: city };
  var url = createUrl(state, city);
  var date = Date.create().format('{yyyy}{MM}{dd}');
  var cacheKey = URL.parse(url).pathname + date;
  var redisClient = redisConfig.redisClient();
  
  redisClient.get(cacheKey, function (err, res) {
    if (res) { // if cached return cached result
      fn(res);
    } else {
      requestPrices(url, prices, cacheKey, redisClient, fn);
    }
  });
}
