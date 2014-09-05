var _ = require('underscore');

_.extend(GLOBAL, {
  GITHUB_API_ROOT_URL : 'https://api.github.com',
  TOR_SOCKS_PORT : 9050,
  TOR_CONTROL_PORT : 9051,
  TOR_AUTH_SIGNAL : 'AUTHENTICATE\n',
  TOR_RANDOM_IP_SIGNAL : 'SIGNAL NEWNYM\r\n'
});

GLOBAL.MYSQL_CONFIG = {
  user : 'root',
  host : 'localhost',
  port : 3306,
  password : '',
  database : 'git_scan_db',
  debug : false
}

GLOBAL.GITHUB_API_HTTPS = {
  protocol: 'https:',
  hostname: 'api.github.com',
  socksPort: TOR_SOCKS_PORT,
  port: 443,
  path: '/',
  headers: {'user-agent': 'node.js'}
}

GLOBAL.GITHUB_API_HTTP = {
  protocol: 'http',
  hostname: 'api.github.com',
  socksPort: TOR_SOCKS_PORT,
  port: 80,
  path: '/'
}

//get utils
var Tor = require('./utils/Tor.js');
var Data = require('./utils/Data.js');
var Q = require('q');
var Test = require('./test/test.js');

//get models
var Scraper = require("./Scraper");
var Users = require('./models/Repositories.js');
var strftime = require('strftime');

// Tor.init();                   //initializes the tor control socket
// Tor.startRandomizer(10000);   //start randomizing our exit ip 

// //TODO FIND OUT OF PACKETS GET DROPPED WHEN WE CHANGE IP MID-REQUEST.  

// Scraper.start();

// Test.testRecursePromise();
// Test.testTorRequest();
// Test.testGetRepos();
Tor.spawnInstances(5);

