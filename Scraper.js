//scraper uses 
var Q = require('q'),
    Repositories = require('./models/Repositories.js'),
    Users = require('./models/Users.js'),
    color = require('colors');

DAYS_PER_YEAR = 365;
DAYS_TO_SCRAPE = 2;

Scraper = {
  start : function(){
    //this starts going back and getting repos created and stores the repo and their creator
    _getRepoAndUserData();
    //this starts looking at the repos that we found and seeing if they contain interesting code snippets.  
    // _getCodeData();
    //this starts querying for users and how they follow eachother.  
    // _getUserNetworkData();
  }
}

function _getRepoAndUserData(){
  var endDate = new Date();
  promiseForGettingData(new Date('2014-08-27'), endDate).then(function(done){
    debug('DONE = ', done);
  });
}

function promiseForGettingData(currentDate, endDate){
  return Repositories.getFromGithubForDateAndLanguage(currentDate, 'javascript')
    .then(function(repos){
      Users.saveAllFromRepos(repos)
      .then(function(userIds){
        Repositories.saveAll(userIds, repos)
        .then(function(repoIds) {
          //if we haven't gone back a year yet, call
          if(currentDate == endDate) {
            return 'DONE';
          }else{
            currentDate.setDate(currentDate.getDate() - 1);
            return promiseForGettingData(currentDate, endDate);
          }
        }, _logErrorSaveRepo);
      }, _logErrorSaveUser);
    }, _logErrorGetRepo);
}

function _logErrorSaveRepo(data) {
  console.log(('ERROR SAVING REPO ' + data).red);
}

function _logErrorSaveUser(data) {
  console.log(('ERROR SAVING USER ' + data).red);
}

function _logErrorGetRepo(data) {
  console.log(('ERROR GET REPO ' + data).red);
}
module.exports = Scraper;
