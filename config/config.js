//this file houses all configuration for database, tor, api endpoints, etc.  

Config = {}

Config.Mysql = {
  user : 'root',
  host : 'localhost',
  port : 3306,
  password : '',
  database : 'git_scan_db',
  debug : false
}

Config.Tor = {
  controlPort : 9051,
  socksPort : 9050,
  authSignal : 'AUTHENTICATE\n',
  randomIpSignal : 'SIGNAL NEWNYM\r\n'
}

Config.Github = {
  protocol: 'https:',
  hostname: 'api.github.com',
  socksPort: Config.Tor.socksPort,
  port: this.protocol === 'https:' ? 443 : 80
}

module.exports = Config;
