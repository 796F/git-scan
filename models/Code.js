//used to search for code within a repository and saving it to the database.  

var Data = require('../utils/Data.js');
    Util = require('../utils/Utility.js'),
    _ = require('underscore').
    TorFactory = require('../utils/Tor.js'),
    Q = require('q');


Code = {
  searchInRepo: function(repository, codeString) {
    return Code.searchForParams(undefined, repository, codeString, 100, 1, false)
    .then(function(response){
      if(response.items == undefined){
        console.log('UNDEFINED RESP', response, 'SEARCHING', repository);
      }
      return Data.markRepoNameAsScanned(repository)
      .then(function(marked){
        return response.items;
      });      
    });
  },
  searchInUser: function(userLogin, codeString) {
    return Code.searchForParams(userLogin, undefined, codeString, 100, 1, false)
    .then(function(response){
      if(response.items == undefined){
        console.log('UNDEFINED RESP', response);
      }
      return response.items;
    });
  },
  searchForParams: function(user, repo, codeString, per_page, page_num, fork) {
    var endpoint = Util.buildUrlWithPath('search', 'code');
    var qualifiers = Util.buildGithubSearchQualifiers({
      fork: fork,
      user: user,
      repo: repo
    });

    var params = Util.buildUrlEncodedParameters({
      q : encodeURIComponent(codeString) + qualifiers,
      per_page: per_page,
      page: page_num
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
  },
  getUserLogin: function(userId) {
    return Data.getFullNameForId(userId);
  },
  saveAll : function(codeMatches) {
    debugger;
    var promises = [];
    for(var key in codeMatches){
      promises.push(Data.insertCode(codeMatches[key]));
    }
    return Q.all(promises);
  }
}

module.exports = Code;
