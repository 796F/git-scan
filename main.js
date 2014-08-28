//get utils
var Tor = require('./utils/Tor.js');
var Scraper = require('./Scraper.js');

Tor.init();                   //initializes the tor control socket
Tor.startRandomizer(10000);   //start randomizing our exit ip

Scraper.run();
