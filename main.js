GLOBAL.MYSQL_CONFIG = {
  user : 'scraper',
  host : '10.2.8.95',
  port : 3306,
  password : 'hey-ho-scrape-oh',
  database : 'git_scan_db',
  debug : false
}

GLOBAL.LOCAL_MYSQL_CONFIG = {
  user : 'root',
  host : 'localhost',
  port : 3306,
  password : '',
  database : 'git_scan_db',
  debug : false
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
var Scraper = require('./Scraper.js');

NUMBER_OF_TOR_CIRCUITS = 5
BASE_SOCKS_PORT = 9050
BASE_CONTROL_PORT = 15000

TorFactory.makeCircuits(NUMBER_OF_TOR_CIRCUITS, BASE_SOCKS_PORT, BASE_CONTROL_PORT);

TEN_SECONDS = 10000

setTimeout(function(){
  //give some time for TOR circuits to start up and connect.
  try{
    Scraper.start();  
  }catch(error){
    console.log(error);
  }
  // Test.testDataInsertRepository();
}, 1000);
