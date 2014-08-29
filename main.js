var _ = require('underscore');

_.extend(GLOBAL, {
  GITHUB_API_ROOT_URL : 'https://api.github.com',
  TOR_SOCKS_PORT : 9050,
  TOR_CONTROL_PORT : 9051,
  TOR_AUTH_SIGNAL : 'AUTHENTICATE\n',
  TOR_RANDOM_IP_SIGNAL : 'SIGNAL NEWNYM\r\n',
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
  path: '/'
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

//get models
var Scraper = require("./Scraper");
var Users = require('./models/Repositories.js');
var strftime = require('strftime');

Tor.init();                   //initializes the tor control socket
Tor.startRandomizer(10000);   //start randomizing our exit ip

Tor.request({ 
  protocol: 'https:',
  hostname: 'api.github.com',
  socksPort: 9050,
  port: 443,
  path: '/repos/Famous/famous/issues?state=closed&per_page=100&page=1',
  headers: { 'User-Agent' : 'xiamike' }
},
function(response) {
  console.log('STATUS: ' + response.statusCode);
  console.log('HEADERS: ' + JSON.stringify(response.headers));
  response.setEncoding('utf8');
  response.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
  response.on('end', function(data) {
    console.log('END: ', data);
  });
});

var today = new Date();
    
var date = new Date(2014, 0, 1);
while(true) {
  if(date === today) break;

  var dateString = strftime('%F', date);
  Scraper.getRepositoriesForDay(dateString);
  date.setDate(date.getDate()+1);    
  break;
}
