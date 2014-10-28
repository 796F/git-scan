var Q = require('q');
var Repositories = require('./models/Repositories.js');
var Users = require('./models/Users.js');
var color = require('colors');

var DAYS_PER_YEAR = 365;
var DAYS_TO_SCRAPE = 2;

Scraper = {}

Scraper.start = function(){

}
 
Scraper.run = function() {
  return Q.Promise(function(resolve, reject, notify){
    // notify(progress);
    //this starts going back and getting repos created and stores the repo and their creator
    // _getRepoAndUserData();
    //this starts looking at the repos that we found and seeing if they contain interesting code snippets.  
    _getCodeData();
    //this starts querying for users and how they follow eachother.  
    // _getUserNetworkData();
    // _famousRepoRoutine();
  });
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
  var today = new Date();
  Data.getLastRepoCreationScanDate().then(function(lastScanDate){
    lastScanDate.setDate(lastScanDate.getDate());  //bump to after the last scanned date.  
    promiseForGettingRepos(lastScanDate, today).then(function(done){
      debug('DONE = ', done);
    }, console.log);
  });
  
}

function _famousRepoRoutine(){
  /*
  beta users are your customeres
    we need to answer those questions
    aka not doing customer service.
  
  repositories are not acive, look at their push frequencies across the year, 
  find the most active repos,
  look at creation frequencies this past year, when were more repos created?  

  is conversion rate bad?

  for reach repo flagged famous, find its user
  look at all the users repos
  get the languages of each repo
  for each repo, grab the frequency of pushes,
  see how famous ranks in activity compare to a user's other repos
    what do famous users spend time on?  

  people who have famous reposiories have a k factor of ?  
  how many followeres?  
  are they influencial?  

  */

  //get all repos that have famous_confirmed flagged
  //get its user
  //get all that user's repositories
  //
  Data.getCodeForRepository(39080).then(console.log);
}

function _famousRepoValidityCheck(n) {
  Data.getFamousRepos(1)
  .then(Repositories.scanAll) //scans them for code snippets that match signatures
  .then(Code.saveAll)         //saves those snippets, flagging the repos.
  .then(function(saved){
    _famousRepoValidityCheck(n+1)

  });
  //get all code snippets
  //scan to see which onese actually have famous/core/engines
  //ones that do flag 'FAMOUS_CONFIRM'
}

//gets repos from a starting date to a finish date
function promiseForGettingRepos(startDate, endDate){
  return Repositories.getFromGithubForDateAndLanguage(startDate, 'javascript')
    .then(function(repos){
      debugger;
      Users.saveAllFromRepos(repos).then(function(userIds){
        debugger;
        Repositories.saveAll(userIds, repos).then(function(repoIds) {

          if(startDate.getDate() == endDate.getDate()) {
            return 'DONE';
          }else{
            startDate.setDate(startDate.getDate()+1);
            return promiseForGettingRepos(startDate, endDate);
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
