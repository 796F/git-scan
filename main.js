var _ = require('underscore');

_.extend(GLOBAL, {});

GLOBAL.MYSQL_CONFIG = {
  user : 'root',
  host : 'localhost',
  port : 3306,
  password : '',
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

TorFactory.makeCircuits(5, 9500, 15000);



setTimeout(function(){
  Test.testUsersJsGetReposForName();
  Test.testUsersJsGetStarredForName();
}, 1000);

