//this file handles requests sent through tor, as well as controlling tor using their signal protocol

var shttps = require('socks5-https-client');
var shttp = require('socks5-http-client');

Tor = {
  request : function (options, $callback) {
    var agent = options.protocol === 'https:' ? shttps : shttp;
    return agent.get(options, $callback);
  },
  init : function() {
    console.log('Connect to Tor control via socket ...');
    Tor.socket = require('net').Socket();
    Tor.socket.connect(TOR_CONTROL_PORT);
    Tor.socket.write(TOR_AUTH_SIGNAL);

    Tor.socket.on('data', function(data) {
      console.log('Tor data says', data.toString());
    });
    Tor.socket.on('error', function(error) {
      console.log('Tor error says:', error.toString());
    });
  },
  startRandomizer : function(interval_in_ms) {
    Tor.socket.write(TOR_RANDOM_IP_SIGNAL);
    setTimeout(Tor.startRandomizer, interval_in_ms, interval_in_ms);
  }
}

module.exports = Tor;
