var Repositories = require('../models/Repositories.js');
var TorFactory = require('../utils/Tor.js');
var Issues = require('../models/Issues.js');
var strftime = require('strftime');

Test = {
  testTorRequest : function() {
    
  },
  testGetRepos : function () {
    
  },
  testParamGenerator : function() {
    
  },
  testIssuesGetParam : function() {
    
  },
  testTorFactory : function() {
    TorFactory.makeCircuits(10, 9050, 15000);

    setTimeout(function(){
      TorFactory.startRandomizer(10000);
      TorFactory.circuits.forEach(function(circuit){
        circuit.request('/rate_limit', function(error, respJson){
          if(!error){
            console.log(respJson);
          }
          
        });
      });
    }, 1000);
    // setTimeout(TorFactory.closeCircuits, 10000);
  }
}

module.exports = Test;
