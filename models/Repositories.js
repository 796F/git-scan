var _ = require('underscore');
var TorFactory = require('../utils/TorFactory.js');
var Data = require('../utils/Data.js');
var UTIL = require('../utils/Utility.js');
var Q = require('q');
var strftime = require('strftime');

var MAX_PAGES = 20;
var REPOS_PER_PAGE = 100;

var Signature = {
  FAMOUS: 'famous/core/Engine'
}

Repositories = {}

Repositories.getFromGithubForDateAndLanguage = function (date, language) {
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
      .then(function(requestResponses) {
        var repos = [];
        //each object in objects is a page, so go through and return only the repos.  
        for(var i=0; i< requestResponses.length; i++){
          repos = repos.concat(requestResponses[i].items);
        }
        resolve(repos);
      });
    });
  });
}

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
Repositories.getFromGithubForParams = function(dateString, language, fork, page_num, per_page, sort, order) {
  var endpoint = UTIL.buildUrlWithPath('search', 'repositories');
  var qualifiers = UTIL.buildGithubSearchQualifiers({
    created: dateString,
    language: language,
    fork: fork
  });

  var params = UTIL.buildUrlEncodedParameters({
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
  return UTIL.retriedTorRequest(options, 1000, 10);
}


/*
functions for storing into the database.  
*/
Repositories.saveAll= function(userIds, repos) {
  if(userIds.length == repos.length){
    var promises = [];
    for(var i=0; i< userIds.length; i++) {
      promises.push(
        Data.insertRepository(userIds[i], repos[i])
      );
    }
    debug('promises LENGTH: ', promises.length);
    return Q.all(promises);
  }else{
    debugger;
    throw Error('USERID ARRAY NOT SAME SIZE AS REPO ARRAY');
  }
}

Repositories.save = function(repo) {
  return Data.insertRepository(repo);
}

Repositories.needScan = function() {
  //returns the top X repos that most needs to be scanned based on last_scanned date.
  //this should be limited by the number of circuits we have
  return Data.getReposNeedScan(TorFactory.activeCircuitCount() * 3);
}

Repositories.scanAll= function(repos) {
  //given a list of repos scan them for a signature.  
  var promises = [];
  for(var key in repos){
    promises.push(Code.searchInRepo(repos[key], Signature.FAMOUS));
  }
  return Q.all(promises)
  .then(function(requestResponses){
    var codeMatches = [];
    requestResponses.forEach(function(response){
      if(response){
        response.forEach(function(file){
          file.text_matches = file.text_matches.map(function(codeObject){
            codeObject.repository = file.repository;
            return codeObject;
          });
          codeMatches = codeMatches.concat(file.text_matches);
        });  
      }
    });
    return codeMatches;
  });
}

module.exports = Repositories;
