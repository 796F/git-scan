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
    // _getRepoAndUserData();
    //this starts looking at the repos that we found and seeing if they contain interesting code snippets.  
    _getCodeData();
    //this starts querying for users and how they follow eachother.  
    // _getUserNetworkData();
  }
}

function _getCodeData(){
  Repositories.needScan()     //gets the top repos that should be scanned
  .then(Repositories.scanAll) //scans them for code snippets that match signatures
  .then(Code.saveAll)         //saves those snippets, flagging the repos.
  .then(function(saved){
    _getCodeData();
  });
}

function _getRepoAndUserData(){
  //TODO maybe you should try to find the most recent date in repositories, and start from there going forwards?  
  var endDate = new Date();
  promiseForGettingRepos(new Date('2014-04-13'), endDate).then(function(done){
    debug('DONE = ', done);
  });
}


function promiseForGettingRepos(currentDate, endDate){
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
            return promiseForGettingRepos(currentDate, endDate);
          }
        }, _logErrorSaveRepo);
      }, _logErrorSaveUser);
    }, _logErrorGetRepo);
}

function _logErrorSaveCode(data){
  console.log('ERROR SAVING CODE', data);
}

function _logErrorSearchUserForCode(data){
  console.log('ERROR SEARCHING USER FOR CODE', data);
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
