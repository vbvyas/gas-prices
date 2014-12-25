var redis = require('redis');

exports.redisClient = function () {
  var client = null;
  var redisUrl = process.env.REDISTOGO_URL || process.env.REDISCLOUD_URL;
  console.log('REDIS URL:', redisUrl);
  if (redisUrl) {
    var rtg = URL.parse(redisUrl);
    client = redis.createClient(rtg.port, rtg.hostname, { no_ready_check: true });
    client.auth(rtg.auth.split(':')[1]);
  } else {
    client = redis.createClient();
  }

  if (client) {
    client.on('error', function (err) {
      console.log(err);
    });
  }

  return client;
}
