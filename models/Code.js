//used to search for code within a repository and saving it to the database.  

var Data = require('../utils/Data.js');
    Util = require('../utils/Utility.js'),
    _ = require('underscore').
    TorFactory = require('../utils/Tor.js'),
    Q = require('q');


Code = {
  searchUserForString: function(user, searchString) {
    var endpoint = Util.buildUrlWithPath('search', 'code');
    var qualifiers = Util.buildGithubSearchQualifiers({
      fork: false,
      user: user
    });

    var params = Util.buildUrlEncodedParameters({
      q : encodeURIComponent(searchString) + qualifiers,
      per_page: 100
    });

    var options = {
      protocol: 'https:',
      hostname: 'api.github.com',
      port: 443,
      headers: {
        'user-agent': 'node.js',
        'Accept': 'application/vnd.github.v3.text-match+json' //this tells github to give us the code fragment
      },
      path: endpoint + params
    }

    return Util.retryPromiseForTor(options, 1000, 5);
  }
}

module.exports = Code;
