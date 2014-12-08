var cheerio = require('cheerio');
var request = require('request');
var util = require('util');
require('sugar');
var states = require('../data/states.json');

var baseurl = 'http://www.gaspricewatch.com/%s/%s/gas-prices/page-1/2.htm';
var prices = {};

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

exports.scrape = function (state, city) {
  if (typeof state == '' || typeof city == '' || state == null || city == null) {
    return { message: "Error: null or empty state or city" };
  }
  
  if (state.length != 2) {
    return { message: "Error: Invalid state code - " + state };
  }
  
  var url = createUrl(state, city);
  
  request (url, function(err, res, body) {
    if (err) {
      prices.message = err;
      console.log(err);
    } else {
      // load page
      $ = cheerio.load(body);
      
      // get required data using cheerio
      var scraped = $('.fs16.fcred');
      if (scraped.length > 5) {
        prices.message = "Success";
        prices.average = parseFloat(scraped[2].children[0].data.substring(1));
        prices.lowest = parseFloat(scraped[3].children[0].data.substring(1));
        prices.highest = parseFloat(scraped[4].children[0].data.substring(1));
        prices.datecreated = new Date();
      } else {
        prices.message = "Error retrieving gas prices";
      }
    }
    
    return prices;
  });
}