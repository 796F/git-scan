//used to search for code within a repository and saving it to the database.  

var Data = require('../utils/Data.js');
var UTIL = require('../utils/Utility.js');
var _ = require('underscore');
var TorFactory = require('../utils/TorFactory.js');
var Q = require('q');

Code = {}

Code.searchInRepo = function(repository, codeString) {
  return Code.searchForParams(undefined, repository, codeString, 100, 1, false)
  .then(function(response){
    if(response == undefined){
      console.log(repository);
      
    }
    if(response.items == undefined){
      console.log('UNDEFINED RESP', response, 'SEARCHING', repository);
    }
    return Data.markRepoNameAsScanned(repository)
    .then(function(marked){
      return response.items;
    });      
  });
}

Code.searchInUser = function(userLogin, codeString) {
  return Code.searchForParams(userLogin, undefined, codeString, 100, 1, false)
  .then(function(response){
    if(response.items == undefined){
      console.log('UNDEFINED RESP', response);
    }
    return response.items;
  });
}

Code.searchForParams = function(user, repo, codeString, per_page, page_num, fork) {

  var endpoint = UTIL.buildUrlWithPath('search', 'code');
  var qualifiers = UTIL.buildGithubSearchQualifiers({
    fork: fork,
    user: user,
    repo: repo
  });

  var params = UTIL.buildUrlEncodedParameters({
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

  return UTIL.retriedTorRequest(options);
}

Code.getUserLogin = function(userId) {
  return Data.getFullNameForId(userId);
}

Code.saveAll = function(codeMatches) {
  
  var promises = [];
  for(var key in codeMatches){
    promises.push(Data.insertCode(codeMatches[key]));
  }
  return Q.all(promises);
}

module.exports = Code;
