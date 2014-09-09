var Repositories = require('../models/Repositories.js');
var TorFactory = require('../utils/Tor.js');
var Issues = require('../models/Issues.js');
var Users = require('../models/Users.js');

var strftime = require('strftime');

Test = {
  testTorRequest : function() {
    
  },
  testGetReposParam : function () {
    Repositories.getForParams('2014-08-08', 2, 'javascript', 'head')
    .then(function(repos){
      console.log('get repos for params returned total count', repos.total_count);
      console.log('inc results', repos.incomplete_results);
      console.log('this batch had length', repos.items.length);
      console.log('first one is ', repos.items[0]);
    });
  },
  testParamGenerator : function() {
    
  },
  testIssuesGetParam : function() {
    Issues.getForParams('Famous', 'famous', 'open')
    .then(function(issues){
      console.log('get issues for params returned', issues.length);
      console.log('first one is ', issues[0]);
    });
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

