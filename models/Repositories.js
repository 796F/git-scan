var _ = require('underscore');
var TorFactory = require('../utils/Tor.js');
var Data = require('../utils/Data.js');
var Util = require('../utils/Utility.js');
var Q = require('q');
var strftime = require('strftime');

MAX_PAGES = 20;
REPOS_PER_PAGE = 100;

var language = 'javascript';

Repositories = {
  getFromGithubForDay : function (date) {
    var dateString = strftime('%F', date);

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
  *   fork is boolean
  *   per_page is how many results, must be less than 100
  *   sort is a string, stars, forks, or updated
  *   order is string, asc or desc
  *   returns a promise which will be resolved when api request finishes.  
  */
  getFromGithubForParams : function(dateString, language, fork, page_num, per_page, sort, order) {
    var endpoint = Util.buildUrlWithPath('search', 'repositories');
    var qualifiers = Util.buildGithubSearchQualifiers({
      created: dateString,
      language: language,
      fork: fork
    });

    var params = Util.buildUrlEncodedParameters({
      q : qualifiers,
      page: page_num,
      per_page: per_page,
      sort: sort,
      order : order
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
  
  /*
  functions for storing into the database.  
  */
  saveAll: function(repos) {
    var promises = [];
    for(var key in repos) {
      promises.push(Data.insertRepository(repo[key]));
    }
    return Q.all(promises);
  },
  save : function(repo) {
    return Data.insertRepository(repo);
  }
}

module.exports = Repositories;
