var UTIL = require('../utils/Utility.js');
var _ = require('underscore');
var Q = require('q');

Users = {}

//TODO despite the low chance users have over 100 repos or starred, we are not robust with per_page : 100.  
//  we should be checking if results.length == 100, which case we need to download ?page=2 , 3 , ... , N
Users.getFollowersForName = function(name) {        
  var endpoint = UTIL.buildUrlWithPath('users', name, 'followers');
  var params = UTIL.buildUrlEncodedParameters({
    per_page: 100
  });
  var options = {
    protocol: 'https:',
    hostname: 'api.github.com',
    port: 443,
    headers: {'user-agent': 'node.js'},
    path: endpoint + params
  }
  return UTIL.retriedTorRequest(options);
}

Users.getFollowingForName = function(name) {
  var endpoint = UTIL.buildUrlWithPath('users', name, 'following');
  var params = UTIL.buildUrlEncodedParameters({
    per_page: 100
  });
  var options = {
    protocol: 'https:',
    hostname: 'api.github.com',
    port: 443,
    headers: {'user-agent': 'node.js'},
    path: endpoint + params
  }
  return UTIL.retriedTorRequest(options);
}

Users.getStarredForName = function(name) {
  var endpoint = UTIL.buildUrlWithPath('users', name, 'starred');
  var params = UTIL.buildUrlEncodedParameters({
    per_page: 100
  });
  var options = {
    protocol: 'https:',
    hostname: 'api.github.com',
    port: 443,
    headers: {'user-agent': 'node.js'},
    path: endpoint + params
  }
  return UTIL.retriedTorRequest(options);
}

Users.getOrganizationsForName = function(name) {
  var endpoint = UTIL.buildUrlWithPath('users', name, 'orgs');
  var params = UTIL.buildUrlEncodedParameters({
    per_page: 100
  });
  var options = {
    protocol: 'https:',
    hostname: 'api.github.com',
    port: 443,
    headers: {'user-agent': 'node.js'},
    path: endpoint + params
  }
  return UTIL.retriedTorRequest(options);
}

Users.getReposForName = function(name) {
  var endpoint = UTIL.buildUrlWithPath('users', name, 'repos');
  var params = UTIL.buildUrlEncodedParameters({
    per_page: 100
  });
  var options = {
    protocol: 'https:',
    hostname: 'api.github.com',
    port: 443,
    headers: {'user-agent': 'node.js'},
    path: endpoint + params
  }
  return UTIL.retriedTorRequest(options);
}

Users.saveAllFromRepos = function(repos){
  var promises = [];
  for(var repoKey in repos){
    promises.push(Data.insertUser(repos[repoKey].owner));
  }
  return Q.all(promises);
}

module.exports = Users;
