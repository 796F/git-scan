var config;

if(!process.env.ENVIRONMENT || process.env.ENVIRONMENT == 'LOCAL'){
  config = require('./local_config');  
}else if(ENVIRONMENT=='PRODUCTION') {
  config = require('./production_config');
}

GLOBAL.MYSQL_CONFIG = config.mysql;
GLOBAL.DEBUG = config.debug;

var _ = require('underscore');
var TorFactory = require('./utils/TorFactory.js');
var Test = require('./test/Test.js');
var Scraper = require('./Scraper.js');

TorFactory.makeCircuits(config.tor);

setTimeout(function(){
  //give some time for TOR circuits to start up and connect.
  Scraper.run();
}, 1000);

GLOBAL.debug = function(){
  if(DEBUG) {
    console.log.apply(this, arguments);
  }
}

GLOBAL.quit = function() {
  //shut down circuits
  TorFactory.closeCircuits();
  //turn off scraper
  process.exit(1);
}
