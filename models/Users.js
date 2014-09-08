var Util = require('../utils/Utility.js');
var _ = require('underscore');

Users = {
  getFollowersForName: function(name) {        
    var options = {
      protocol: 'https:',
      hostname: 'api.github.com',
      port: 443,
      headers: {'user-agent': 'node.js'},
      path: Util.buildUrlWithPath('users', name, 'followers')
    }
    return Util.promiseForTor(options);
  },
  getFollowingForName: function(name) {
    var options = {
      protocol: 'https:',
      hostname: 'api.github.com',
      port: 443,
      headers: {'user-agent': 'node.js'},
      path: Util.buildUrlWithPath('users', name, 'following')
    }
    return Util.promiseForTor(options);
  },
  getStarredForName: function(name) {
    var options = {
      protocol: 'https:',
      hostname: 'api.github.com',
      port: 443,
      headers: {'user-agent': 'node.js'},
      path: Util.buildUrlWithPath('users', name, 'starred')
    }
    return Util.promiseForTor(options);
  },
  getOrganizationsForName: function(name) {
    var options = {
      protocol: 'https:',
      hostname: 'api.github.com',
      port: 443,
      headers: {'user-agent': 'node.js'},
      path: Util.buildUrlWithPath('users', name, 'orgs')
    }
    return Util.promiseForTor(options);
  },
  getReposForName: function(name) {
    var options = {
      protocol: 'https:',
      hostname: 'api.github.com',
      port: 443,
      headers: {'user-agent': 'node.js'},
      path: Util.buildUrlWithPath('users', name, 'repos')
    }
    return Util.promiseForTor(options);
  }
}

module.exports = Users;
