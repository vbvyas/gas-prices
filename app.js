var Hapi = require('hapi');
var scraper = require('./lib/scraper.js');

var server = new Hapi.Server(3000);

server.route({
  method: 'GET',
  path: '/{state}/{city}',
  handler: function (req, res) {
    var state = req.params.state;
    var city = req.params.city;
    var prices = scraper.scrape(state, city);
    res(prices);
  }
});

server.start(function () {
  console.log('Hapi server started @', server.info.uri);
})
