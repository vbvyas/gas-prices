var request = require('request');
var cheerio = require('cheerio');
var Path = require('path');
var baseurl = 'http://www.gaspricewatch.com/%s/%s/gas-prices/page-1/2.htm';
var file = Path.join(__dirname, '../data/prices.json');
var util = require('util');
var prices = {};

exports.scrape = function(state, city) {
  if (typeof state == '' || typeof city == '' || state == null || city == null) {
    return { message: "Error null or empty state or city" };
  }
  var url = util.format(baseurl, state, city);
  request(url, function(err, res, body) {
    if (err) console.log(err);
    else {
      // load page
      $ = cheerio.load(body);
      
      // get required data using cheerio
      var scraped = $('.fs16.fcred');
      prices.average = parseFloat(scraped[2].children[0].data.substring(1));
      prices.lowest = parseFloat(scraped[3].children[0].data.substring(1));
      prices.highest = parseFloat(scraped[4].children[0].data.substring(1));
      prices.datecreated = new Date();
    }
    
    return prices;
  });
}
