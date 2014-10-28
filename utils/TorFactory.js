var Tor = require('./Tor.js');

TorFactory = {
  circuits: []
}

TorFactory.makeCircuits = function (options) {
  //spawn a bunch of isntances, save their pid, socks port, and control port information.
  for(var i=0; i<options.circuit_count; i++){
    var controlPort = options.base_control_port + i;
    var socksPort = options.base_socks_port + i;

    var newCircuit = new Tor(socksPort, controlPort);
    newCircuit.init()
    .then(function(circuit){
      TorFactory.circuits.push(circuit);
    });
  }
}

TorFactory.closeCircuits = function () {
  while(TorFactory.circuits.length > 0){
    var circuit = TorFactory.circuits.pop();
    debug('closing circuit on ', circuit.controlPort);
    circuit.terminate();
  }
}

TorFactory.startRandomizer = function (interval_in_ms) {
  //minimum randomization interval is 10s, limited by Tor networks.  
  if(interval_in_ms < 10000) interval_in_ms = 10000;
  
  // debug(TorFactory.circuits.length + " circuits found, randomizing ...")

  for(var i=0; i<TorFactory.circuits.length; i++) {
    TorFactory.circuits[i].changeIp();
  }

  setTimeout(TorFactory.startRandomizer, interval_in_ms, interval_in_ms);
}

TorFactory.getCircuit = function () {
  var min = 0;
  var max = TorFactory.circuits.length - 1;
  var randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
  debug('returned circuit number ', randomIndex, 'on port,', TorFactory.circuits[randomIndex].controlPort);
  return TorFactory.circuits[randomIndex];
}

TorFactory.activeCircuitCount = function (){
  return TorFactory.circuits.length;
}

module.exports = TorFactory;
