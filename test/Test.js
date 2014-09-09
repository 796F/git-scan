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
      console.log('get repos for name returned', repos.length);
      console.log('first one is ', repos[0]);
    });
  },
  testUsersJsGetStarredForName : function() {
    console.log('RUNNING TEST testUsersJsGetStarredForName')
    Users.getStarredForName('jaysingh')
    .then(function(starred){
      console.log('get starred for name returned', starred.length);
      console.log('first one is ', starred[0]);
    });
  },
  testTorFactory : function() {
    //make and terminate circuits.  
    TorFactory.makeCircuits(5, 9500, 15000);
    setTimeout(TorFactory.closeCircuits, 5000);
  }
}

module.exports = Test;

