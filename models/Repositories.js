var _ = require('underscore');
var TorFactory = require('../utils/Tor.js');
var Data = require('../utils/Data.js');
var Util = require('../utils/Utility.js');
var Q = require('q');
var strftime = require('strftime');

MAX_PAGES = 20;
REPOS_PER_PAGE = 100;

Repositories = {
  getFromGithubForDateAndLanguage : function (date, language) {
    var dateString = strftime('%F', date);
    return Q.promise(function(resolve, reject, notify) {
      var order = 'asc';
      Repositories.getFromGithubForParams(dateString, language, false, 1, REPOS_PER_PAGE, 'updated', order)
      .then(function(data) {
        var promises = [];
        var numRepos = data.total_count;
        debug('TOTAL REPOS: ', numRepos);
        var numPages = Math.ceil(numRepos / REPOS_PER_PAGE) + 1;

        if(numPages > MAX_PAGES) numPages = MAX_PAGES;

        for (var i = 2; i <= numPages; i++) {
          if (i > 10 && order === 'asc') order = 'desc';
          var promise = Repositories.getFromGithubForParams(dateString, language, false, i % 10, REPOS_PER_PAGE, 'updated', order);
          promises.push(promise);
        }
        
        Q.all(promises)
        .then(function(objects) {
          var repos = [];
          //each object in objects is a page, so go through and return only the repos.  
          for(var i=0; i< objects.length; i++){
            // repos.push.apply(this.repos, objects[i].items);
            repos = repos.concat(objects[i].items);
          }
          resolve(repos);
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
    return Util.retryPromiseForTor(options, 1000, 10);
  },
  
  /*
  functions for storing into the database.  
  */
  saveAll: function(userIds, repos) {
    debugger;
    if(userIds.length == repos.length){
      var promises = [];
      for(var i=0; i< userIds.length; i++) {
        promises.push(
          Data.insertRepository(userIds[i], repos[i])
        );
      }
      debug('promises LENGTH: ', promises.length);
      debugger;
      return Q.all(promises);
    }else{
      throw Error('USERID ARRAY NOT SAME SIZE AS REPO ARRAY');
    }
  },
  save : function(repo) {
    return Data.insertRepository(repo);
  }
}

module.exports = Repositories;
