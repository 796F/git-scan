var Util = require('../utils/Utility.js');
var _ = require('underscore');
var Q = require('q');
var TorFactory = require('../utils/Tor.js');
var https = require('https');

var FIRST_PAGE = 1;

Commits = {}

Commits.getForParams = function (owner, repository) {
  //return a promise which recursively makes requests then resolves.
  console.log("in commits");
  return Q.Promise(function(resolve, reject, notify) {

    var params = {
      per_page: 100,
      page: FIRST_PAGE
    };

    function _recursivelyRequestAndBuildCommits(owner, repository, params, commits, resolveFn, rejectFn) {
      var endpoint = Util.buildUrlWithPath('repos', owner, repository, 'commits');
      var paramString = Util.buildUrlEncodedParameters(params);
      
      var options = {
        protocol: 'https:',
        hostname: 'api.github.com',
        port: 443,
        headers: {'user-agent': 'node.js'},
        path: endpoint + paramString
      }

      TorFactory.getCircuit().request(options, function(response){
        data = '';
        response.on('data', function (chunk) {
          data += chunk;
        });
        response.on('end', function(){
          var result = JSON.parse(data);
          if(result.length > 0){
            params.page++;
            _recursivelyRequestAndBuildCommits(owner, repository, params, 
              commits.concat(result), resolveFn, rejectFn);
          } else {
            resolveFn(commits);
          }
        });
        response.on('error', function(error) {
          console.log('error!');
          rejectFn(error);
        });
      });
    }
    _recursivelyRequestAndBuildCommits(owner, repository, params, [], resolve, reject);
  });
}

module.exports = Commits;
