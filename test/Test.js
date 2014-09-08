var Repositories = require('../models/Repositories.js');
var TorFactory = require('../utils/Tor.js');
var Issues = require('../models/Issues.js');
var Users = require('../models/Users.js');

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
  testUsersJsGetReposForName : function () {
    console.log('RUNNING TEST testUsersJsGetReposForName')
    Users.getReposForName('jaysingh')
    .then(function(repos) {
      console.log(repos);
    });
  },
  testTorFactory : function() {
    //make and terminate circuits.  
    TorFactory.makeCircuits(5, 9500, 15000);
    setTimeout(TorFactory.closeCircuits, 5000);
  }
}

module.exports = Test;

