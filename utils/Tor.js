//this file handles requests sent through tor, as well as controlling tor using their signal protocol

var shttps = require('socks5-https-client'),
    shttp = require('socks5-http-client'),
    fs = require('fs'),
    spawn = require('child_process').spawn;
    net = require('net');

TOR_AUTH_SIGNAL = 'AUTHENTICATE\n',
TOR_RANDOM_IP_SIGNAL = 'SIGNAL NEWNYM\r\n'
TOR_TERMINATE_SIGNAL = 'SIGNAL TERM\r\n'
TOR_GETIP_SIGNAL = 'GETINFO address\n'

function _controlListening (circuitOutput) {
  return circuitOutput.toString().indexOf('Opening Control listener on') >= 0 ? true : false;
}

function _addressData (circuitOutput) {
  return circuitOutput.toString().indexOf('250-address=') >=0 ? true : false;
}

function _parseIp (circuitOutput) {
  //example circuitOutput == '250-address=208.66.27.18';
  return circuitOutput.toString().slice(12);
}

TorFactory = {
  circuits : [],
  makeCircuits : function (number_of_instances, base_socks_port, base_control_port) {
    //spawn a bunch of isntances, save their pid, socks port, and control port information.  
    for(var i=0; i<number_of_instances; i++){
      var controlPort = base_control_port + i;
      var socksPort = base_socks_port + i;
      
      //EACH tor circuit needs its own data directory.
      try{
        fs.mkdirSync('data/tor' + controlPort);
      }catch(error){
        //ignore EEXIST
      }
      
      var newCircuit = new Tor(socksPort, controlPort);
      newCircuit.init(function(error, circuit){
        if(!error){
          TorFactory.circuits.push(circuit);
          if(TorFactory.circuits.length == number_of_instances) {
            //all circuits started up.  start randomizing.
            TorFactory.startRandomizer(10000);
          }
        }
      });
    }
  },
  closeCircuits : function () {
    while(TorFactory.circuits.length > 0){
      var circuit = TorFactory.circuits.pop();
      console.log('closing circuit on ', circuit.controlPort);
      circuit.terminate();
    }
  },
  startRandomizer : function (interval_in_ms) {
    //minimum randomization interval is 10s, limited by Tor networks.  
    if(interval_in_ms < 10000) interval_in_ms = 10000;
    
    console.log(TorFactory.circuits.length + " circuits found, randomizing ...")

    for(var i=0; i<TorFactory.circuits.length; i++) {
      TorFactory.circuits[i].changeIp();
    }

    setTimeout(TorFactory.startRandomizer, interval_in_ms, interval_in_ms);
  },
  getCircuit : function () {
    var min = 0;
    var max = TorFactory.circuits.length - 1;
    var randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log('returned circuit number ', randomIndex, 'on port,', TorFactory.circuits[randomIndex].controlPort);
    return TorFactory.circuits[randomIndex];
  }
}

Tor = function(socksPort, controlPort){
  this.socksPort = socksPort;
  this.controlPort = controlPort;
  this.inUse = false;
  this.circuit = spawn('tor', [
    '--RunAsDaemon', 1,
    '--CookieAuthentication', 0,
    '--ControlPort', controlPort, 
    '--SocksPort', socksPort,
    '--DataDirectory', 'data/tor' + controlPort,
    '--PidFile', 'tor' + controlPort + '.pid'
    ], {
      uid: process.getuid(),
      gid: process.getgid(),
      detached: true
    });;
  this.ip = undefined;
  this.socket = new net.Socket();
}
  
Tor.prototype.init = function($callback) {
  var self = this;  //allows reference to this inside callbacks.  
  
  self.active = false;

  self.circuit.stdout.on('data', function (data) {
    // triggered when the tor starts listening on its control port.  
    if (_controlListening(data)){
      console.log('Connect to Tor control via socket ', self.controlPort);
      
      self.socket.connect(self.controlPort);
      
      self.socket.on('connect', function(){
        self.socket.write(TOR_AUTH_SIGNAL);

        if(!self.active){
          self.active = true;
          $callback(undefined, self);
        }

      });
      self.socket.on('data', function(data) {
        if(_addressData(data)){
          self.ip = _parseIp(data);
        }
        console.log('socket data.  port: ', self.controlPort, "\ndata: ",  data.toString());
      });
      self.socket.on('error', function(error) {
        console.log('socket error', error);
        // $callback(error.toString(), undefined);
      });
    }
  });

  self.circuit.stderr.on('data', function (data) {
    console.log('circuit error', error);
    // $callback(data.toString, undefined);
  });
  self.circuit.on('close', function (code) {
    if(code == 0){
      //running just fine
    }else{
      console.log('circuit closed!! ', code);  
    }    
    // $callback(undefined, code);
  });
}

Tor.prototype.terminate = function() {
  this.socket.write(TOR_TERMINATE_SIGNAL);
}

Tor.prototype.changeIp = function() {
  this.socket.write(TOR_RANDOM_IP_SIGNAL);
}

//expects a callback with function(error, result) 
Tor.prototype.request = function (options, $callback){
  var agent = options.protocol === 'https:' ? shttps : shttp;
  return agent.get(options, $callback);
}

//get is basically requests but it handles the chunking and parsing and socksport adjusting for you!
Tor.prototype.get = function (options, $callback) {
  var agent = options.protocol === 'https:' ? shttps : shttp;
  options.socksPort = this.socksPort;

  console.log('CIRCUIT.GET options, ', options);

  agent.get(options, function(response){
    var data = '';
    response.on('data', function (chunk) {
      data += chunk;
    });
    response.on('end', function() {
      $callback(undefined, JSON.parse(data));
    });
    response.on('error', function(error) {
      $callback(error, undefined);
    });
  });
}

//export a factory function which creates many tor circuits.  
module.exports = TorFactory;



