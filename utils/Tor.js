//this file handles requests sent through tor, as well as controlling tor using their signal protocol

var shttps = require('socks5-https-client');
var shttp = require('socks5-http-client');
var spawn = require('child_process').spawn;
var net = require('net');
var fs = require('fs');
var Q = require('q');

var TOR_AUTH_SIGNAL = 'AUTHENTICATE\n';
var TOR_RANDOM_IP_SIGNAL = 'SIGNAL NEWNYM\r\n';
var TOR_TERMINATE_SIGNAL = 'SIGNAL TERM\r\n';
var TOR_GETIP_SIGNAL = 'GETINFO address\n';

Tor = function(socksPort, controlPort){
  //EACH tor circuit needs its own data directory.
  try{
    fs.mkdirSync('data/tor' + controlPort);
  }catch(error){
    //ignore EEXIST
  }

  //assign this tor objects fields.  
  this.socksPort = socksPort;
  this.controlPort = controlPort;
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
    });
  this.ip = undefined;
  this.socket = new net.Socket();
}
  
Tor.prototype.init = function() {
  return Q.Promise((function(resolve, reject, notify){
    this.active = false;
    this.circuit.stdout.on('data', (function (data) {
      if (_controlListening(data)){
        debug('Connect to Tor control via socket ', this.controlPort);
        
        this.socket.connect(this.controlPort);
        this.socket.on('connect', (function(test){
          this.socket.write(TOR_AUTH_SIGNAL);

          if(!this.active){
            this.active = true;
            resolve(this);
          }

        }).bind(this));
        
        this.socket.on('data', (function(data) {
          if(_addressData(data)){
            this.ip = _parseIp(data);
          }
        }).bind(this));

        this.socket.on('error', function(error) {
          debug('socket error', error);
          reject(error);
        });
      }
    }).bind(this));

    this.circuit.stderr.on('data', function (data) {
      debug('circuit error', error);
      reject(error);
    });
    this.circuit.on('close', function (code) {
      if(code == 0){
        //running just fine
      }else{
        debug('circuit already exists!! ', code);  
      }
    });
  }).bind(this));
}

Tor.prototype.terminate = function() {
  this.socket.write(TOR_TERMINATE_SIGNAL);
}

Tor.prototype.changeIp = function() {
  this.socket.write(TOR_RANDOM_IP_SIGNAL);
}

//expects a callback with function(error, result) 
Tor.prototype.request = function (options, callback){
  var agent = options.protocol === 'https:' ? shttps : shttp;
  options.socksPort = this.socksPort;

  //required for node issue, https://github.com/joyent/node/issues/5360
  options.secureOptions = require('constants').SSL_OP_NO_TLSv1_2
  
  debug('CIRCUIT.REQUEST options path, ', options.path);

  return agent.get(options, callback);
}

//get is basically requests but it handles the chunking and parsing and socksport adjusting for you!
Tor.prototype.get = function (options) {
  return Q.Promise((function(resolve, reject, notify) {
    var agent = options.protocol === 'https:' ? shttps : shttp;
    options.socksPort = this.socksPort;
    //required for node issue, https://github.com/joyent/node/issues/5360
    options.secureOptions = require('constants').SSL_OP_NO_TLSv1_2
    
    debug('CIRCUIT.GET path, ', options.path);
    
    try{
      var request = agent.get(options, (function(response){
        
        var status = response.statusCode;
        var limit = response.headers['x-ratelimit-limit'];
        var remaining = response.headers['x-ratelimit-remaining'];

        if(remaining < 2){
          debug('limit remaining:', remaining, 'calling ', this.changeIp.toString());
          this.changeIp();
        } 

        debug('this ip has requests remaining: ', remaining);
        
        var start = Date.now();
        var data = '';
        response.on('data', function (chunk) {
          data += chunk;
        });
        response.on('end', function() {
          
          debug('request on port', options.socksPort, 'TOOK', Date.now() - start, 'ms to complete');
          try{
            JSON.parse(data)
          }catch(error){
            //soemtimes the json returned is bad?  
            console.log(error, data);
            reject(error);
          }
          resolve(JSON.parse(data));
        });
      }).bind(this));
    }catch(error){
      //socket hangup here?
      console.log(error);
      reject(error);
    }
    request.on('error', function(error) {
      reject(error);
    });
  }).bind(this));
}

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

//export a factory function which creates many tor circuits.  
module.exports = Tor;
