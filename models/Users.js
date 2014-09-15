var Util = require('../utils/Utility.js');
var _ = require('underscore');

Users = {
  //TODO despite the low chance users have over 100 repos or starred, we are not robust with per_page : 100.  
  //  we should be checking if results.length == 100, which case we need to download ?page=2 , 3 , ... , N
  getFollowersForName: function(name) {        
    var endpoint = Util.buildUrlWithPath('users', name, 'followers');
    var params = Util.buildUrlEncodedParameters({
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
  },
  getFollowingForName: function(name) {
    var endpoint = Util.buildUrlWithPath('users', name, 'following');
    var params = Util.buildUrlEncodedParameters({
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
  },
  getStarredForName: function(name) {
    var endpoint = Util.buildUrlWithPath('users', name, 'starred');
    var params = Util.buildUrlEncodedParameters({
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
  },
  getOrganizationsForName: function(name) {
    var endpoint = Util.buildUrlWithPath('users', name, 'orgs');
    var params = Util.buildUrlEncodedParameters({
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
  },
  getReposForName: function(name) {
    var endpoint = Util.buildUrlWithPath('users', name, 'repos');
    var params = Util.buildUrlEncodedParameters({
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
  },
  saveAllFromRepos: function(repos){
    debugger;
    debug('REPOS LENGTH:', repos.length);
    var promises = [];
    for(var repoKey in repos){
      promises.push(Data.insertUser(repos[repoKey].owner));
    }
    debug('INSERT USER PROMISES LENGTH:', promises.length);
    return Q.all(promises);
  }
}

module.exports = Users;
