var _ = require('underscore');
var Tor = require('../utils/Tor.js');
var Data = require('../utils/Data.js');
var Util = require('../utils/Utility.js');
var Q = require('q');

MAX_PAGES = 20;
REPOS_PER_PAGE = 100;

var language = 'javascript';

Repositories = {
  
  getForDay : function (dateString) {
    return Q.promise(function(resolve, reject, notify) {
      var end = 'head';
      Repositories.getForParams(dateString, 1, language, end)
      .then(function(data) {
        var promises = [];
        var objects = [];
        objects.concat(data);
        
        var numRepos = data.total_count;
        var numPages = Math.ceil(numRepos / REPOS_PER_PAGE);

        if(numPages > MAX_PAGES) numPages = MAX_PAGES;

        for (var i = 2; i <= numPages; i++) {
          if (i > 10 && end === 'head') end = 'tail';
          var promise = Repositories.getForParams(dateString, i, language, end);
          promise.then(function(data) {
            objects.concat(data);
          });
          promises.push(promise);
        };
        Q.all(promises)
        .then(function(objects) {
          resolve(objects);
        });
      });
    });
  },
  /*
  *   dateString is a string in format '2014-08-08',
  *   page_num is integer from 1 to last page
  *   language is a string, ie 'javascript', 'ruby', 'css'
  *   end is a string either 'head' or 'tail'
  *
  *   returns a promise which will be resolved when api request finishes.  
  */
  getForParams : function(dateString, page_num, language, end) {
    var endpoint = Util.buildUrlWithPath('search', 'repositories');
    
    var qualifiers = Util.buildGithubSearchQualifiers({
      created: dateString,
      language: language,
      fork: false,
    });

    var params = Util.buildUrlEncodedParameters({
      q : qualifiers,
      page: page_num,
      per_page: 100,
      sort: 'updated',
      order : end === 'head' ? 'asc' : 'desc'
    });

    var options = _.extend({}, GITHUB_API_HTTPS);
    options.path = endpoint + params;

    return Q.promise(function(resolve, reject, notify) {
      Tor.request(options, function(response){
        var data = '';
        response.on('data', function (chunk) {
          data += chunk;
        });

        response.on('end', function() {
          resolve(JSON.parse(data));
        });
        response.on('error', function(error) {
          reject(error);
        });
      });
    });
  },
  addReposToDB: function(repos) {
    for (var i = 0; i < repos.length; i++) {
      //add repo to database
      Data.insertUser(repos[i].owner, function(result) {
        var test_repo_id = Data.insertRepository(result.insertId, repos[i], function(r) {
        });
      });
    };
  }
}

module.exports = Repositories;
