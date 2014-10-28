//api and db calls for Issues

var UTIL = require('../utils/Utility.js');
var _ = require('underscore');
var Q = require('q');
var TorFactory = require('../utils/TorFactory.js');

var FIRST_PAGE = 1;

Issues = {}

Issues.getAllForRepository = function (owner, repository) {

}

Issues.getClosedForRepository = function (owner, repository) {
  return Issues.getForParams(owner, repository, 'closed');
}

Issues.getOpenForRepository = function (owner, repository) {
  return Issues.getForParams(owner, repository, 'open');
}

/*
*   owner is string ie 'Famous' or 'xiamike'
*   repository is string ie 'famous-internal' or 'git-scan'
*   state is string either 'open' or 'closed'
*   page_num is int from 1 to last page
*   returns a promise which resolves to an array [] of issue objects.  
*/
Issues.getForParams = function (owner, repository, state) {
  //return a promise which recursively makes requests then resolves.
  return Q.Promise(function(resolve, reject, notify) {

    var params = {
      state: state, 
      per_page: 100, 
      page: FIRST_PAGE
    };

    function _recursivelyRequestAndBuildIssues(owner, repository, params, issues, $resolveFn, $rejectFn) {
      var endpoint = UTIL.buildUrlWithPath('repos', owner, repository, 'issues');
      var paramString = UTIL.buildUrlEncodedParameters(params);
      
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
            _recursivelyRequestAndBuildIssues(owner, repository, params, 
              issues.concat(result), $resolveFn, $rejectFn);
          }else{
            $resolveFn(issues);
          }
        });
        response.on('error', function(error) {
          $rejectFn(error);
        });
      });
    }

    _recursivelyRequestAndBuildIssues(owner, repository, params, [], resolve, reject);
  });
}

Issues.save = function (issuesList) {

}

module.exports = Issues;

