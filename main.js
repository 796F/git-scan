var _ = require('underscore');

_.extend(GLOBAL, {});

GLOBAL.MYSQL_CONFIG = {
  user : 'scraper',
  host : '10.2.8.95',
  port : 3306,
  password : 'hey-ho-scrape-oh',
  database : 'git_scan_db',
  debug : false
}

//get utils
var TorFactory = require('./utils/Tor.js');
var Data = require('./utils/Data.js');
var Q = require('q');
var Test = require('./test/test.js');

//get models
var Scraper = require("./Scraper");
var Users = require('./models/Repositories.js');
var strftime = require('strftime');

// TorFactory.makeCircuits(5, 9500, 15000);

setTimeout(function(){
  // Test.testUsersJsGetReposForName();
  // Test.testUsersJsGetStarredForName();
  // Test.testIssuesGetParam();
  // Test.testGetReposParam();
  // Test.searchUserForString();
  Test.testCommitsForRepo();
}, 1000);

