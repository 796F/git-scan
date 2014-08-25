var Repositories = require('./models/Repositories.js');
var Tor = require('./utils/Tor.js');

var options = {
  protocol: 'http:',
  hostname: 'www.telize.com',
  socksPort: Tor.SOCKS_PORT,
  port: this.protocol === 'https:' ? 443 : 80,
  path: '/ip'
};

sendTestRequest = function() {
  var request = Tor.request(options, function(response){
    console.log('STATUS: ' + response.statusCode);
    console.log('HEADERS: ' + JSON.stringify(response.headers));
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
    response.on('end', function(data) {
      console.log('END: ', data);
    });

  });

  request.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  request.end();
}

Tor.init(); //initializes the tor control socket
Tor.startRandomizer(10000, sendTestRequest); //pass randomizer a request function which gets called every interval of time.  


Repositories.getUsers();
