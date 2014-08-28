//this file handles requests sent through tor, as well as controlling tor using their signal protocol

var shttps = require('socks5-https-client');
var shttp = require('socks5-http-client');
var Config = require('../config/config.js');

Tor = {
  request : function (options, $callback) {
    var agent = options.protocol === 'https:' ? shttps : shttp;
    return agent.request(options, $callback);
  },
  init : function() {
    console.log('Connect to Tor control via socket ...');
    Tor.socket = require('net').Socket();
    Tor.socket.connect(Config.Tor.controlPort);
    Tor.socket.write(Config.Tor.authSignal);

    Tor.socket.on('data', function(data) {
      console.log('Tor data says', data.toString());
    });
    Tor.socket.on('error', function(error) {
      console.log('Tor error says:', error.toString());
    });
  },
  startRandomizer : function(interval_in_ms) {
    Tor.socket.write(Config.Tor.randomIpSignal);
    setTimeout(Tor.startRandomizer, interval_in_ms, interval_in_ms);
  }
}

module.exports = Tor;
