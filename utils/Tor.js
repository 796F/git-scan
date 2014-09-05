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

  },
  spawnInstances : function(number_of_instances) {
    //spawn a bunch of isntances, save their pid, socks port, and control port information.  

    var spawn = require('child_process').spawn;
    var ls = spawn('ls', ['-lh', '/usr']);

    ls.stdout.on('data', function (data) {
      console.log('stdout: ' + data.toString());
    });

    ls.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    ls.on('close', function (code) {
      console.log('child process exited with code ' + code);
    });

    
  },
  getOpenCircuit : function() {
    //search our circuits for one that is available to send a request through, 
    //return options for using that circuit.  
  }
}

module.exports = Tor;
