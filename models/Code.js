var Data = require('../utils/Data.js');
var Util = require('../utils/Utility.js');
var _ = require('underscore');

//used to search for code within a repository and saving it to the database.  

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
      headers: {'user-agent': 'node.js'},
      path: endpoint + params
    }
    return Util.promiseForTor(options);
  }
}

module.exports = Code;
