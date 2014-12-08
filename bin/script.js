#!/usr/bin/env node
var scraper = require('../lib/scraper');
var fs = require('fs');
var Path = require('path');
var file = Path.join(__dirname, '../data/prices.json');

var prices = scraper.scrape('WA', 'Seattle');
fs.writeFile(file, JSON.stringify(prices, null, 2), function(err) {
  if (err) console.log(err);
  else console.log('Prices file created');
});
