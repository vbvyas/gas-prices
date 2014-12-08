#!/usr/bin/env node
var scraper = require('../lib/scraper');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var Path = require('path');
var url = 'http://www.gaspricewatch.com/WA-washington/Seattle/gas-prices/page-1/2.htm';
var file = Path.join(__dirname, '../data/prices.json');
var prices = {};

var prices = scraper.scrape('WA', 'Seattle');
fs.writeFile(file, JSON.stringify(prices, null, 2), function(err) {
  if (err) console.log(err);
  else console.log('Prices file created');
});
