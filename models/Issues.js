//api and db calls for Issues

var Util = require('../utils/Utility.js');
var _ = require('underscore');

Issues = {
  getIssuesForRepository : function (owner, repository, state) {
    //https://api.github.com/repos/Famous/famous/issues?state=all&per_page=1000&page=1
    var url_params = Util.buildUrlEncodedParameters({
      state: state, 
      per_page: 100, 
      page: 1
    });
    var endpoint = Util.buildUrlWithPath('repos', owner, repository, 'issues');
    
    var githubUrlOptions = {
      protocol: 'https:',
      hostname: 'api.github.com',
      socksPort: TOR_SOCKS_PORT,
      port: 443,
      path: endpoint + url_params
    };
    console.log(githubUrlOptions)
    Tor.request(githubUrlOptions, function(result) {
      console.log(result);
    });
  },
  saveIssues : function (issuesList) {

  }
}


module.exports = Issues;
