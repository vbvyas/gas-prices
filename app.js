var Hapi = require('hapi');
var scraper = require('./lib/scraper.js');

var server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: process.env.PORT || 3000
});

server.route({
  method: 'GET',
  path: '/v1/{state}/{city}',
  handler: function (req, res) {
    var state = req.params.state;
    var city = req.params.city;

    if (!state || !city) {
      res({ message: "Error: null or empty state or city" });
    }
    
    if (state.length != 2) {
      res({ message: "Error: Invalid state code - " + state });
    }
  
    var prices = scraper.scrape(state, city, function (prices) {
      res(prices);
    });
  }
});

server.start(function () {
  console.log('Hapi server started @', server.info.uri);
})
