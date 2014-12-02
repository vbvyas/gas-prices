var request = require('request');
var cheerio = require('cheerio');
var Path = require('path');
var url = 'http://www.gaspricewatch.com/WA-washington/Seattle/gas-prices/page-1/2.htm';
var file = Path.join(__dirname, '../data/prices.json');
var prices = {};

exports.scrape = function() {
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
