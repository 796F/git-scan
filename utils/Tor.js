var shttps = require('socks5-https-client');
var shttp = require('socks5-http-client');

Tor = {
  CONTROL_PORT : 9051,
  SOCKS_PORT : 9050,
  AUTH : 'AUTHENTICATE\n',
  NEWNYM : 'SIGNAL NEWNYM\r\n',

  request : function (options, $callback) {
    var agent = options.protocol === 'https:' ? shttps : shttp;
    return agent.request(options, $callback);
  },
  init : function() {
    Tor.socket = require('net').Socket();
    Tor.socket.connect(Tor.CONTROL_PORT);

    Tor.socket.on('data', function(data) {
      console.log(data.toString());
    });
    Tor.socket.on('error', function(data) {
      console.log(data.toString());
    });

  },
  startRandomizer : function(interval_in_ms, $callback) {
    console.log('tell tor to change IP');
    Tor.socket.write(Tor.AUTH);
    Tor.socket.write(Tor.NEWNYM);
    if($callback){
      $callback();
    }
    setTimeout(function(){
      Tor.startRandomizer(interval_in_ms, $callback)
    }, interval_in_ms);
  }
}



module.exports = Tor;
