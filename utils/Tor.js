var shttps = require('socks5-https-client');

var options = {
  socksPort: 9050, // Tor
  port: 443,
  hostname: 'en.wikipedia.org',
  protocol: 'https:',
  path: '/wiki/SOCKS'
};

Tor = {
  request : function () {
    console.log(shttps);
    var request = shttps.request(options, function(response) {
      console.log(response);
      console.log('STATUS: ' + response.statusCode);
      console.log('HEADERS: ' + JSON.stringify(response.headers));
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
          console.log('BODY: ' + chunk);
      });
    });

    request.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    request.end();

    //end request
  }
}

module.exports = Tor;
