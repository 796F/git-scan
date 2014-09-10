GLOBAL.MYSQL_CONFIG = {
  user : 'scraper',
  host : '10.2.8.95',
  port : 3306,
  password : 'hey-ho-scrape-oh',
  database : 'git_scan_db',
  debug : false
}

GLOBAL.SCRAPER_CONFIG = {
  
}

GLOBAL.DEBUG = true;
GLOBAL.debug = function(){
  if(DEBUG) {
    console.log.apply(this, arguments);
  }
}

var _ = require('underscore');
var TorFactory = require('./utils/Tor.js');
var Test = require('./test/Test.js');

TorFactory.makeCircuits(5, 9500, 15000);

setTimeout(function(){
  // Test.testUsersJsGetReposForName();
  // Test.testUsersJsGetStarredForName();
  // Test.testIssuesGetParam();
  // Test.testGetReposParam();
  Test.searchUserForString();
}, 1000);

