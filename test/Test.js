var Repositories = require('../models/Repositories.js');
var Tor = require('../utils/Tor.js');
var Issues = require('../models/Issues.js');

var strftime = require('strftime');

Test = {
  testTorRequest : function() {
    Tor.request({ 
        protocol: 'https:',
        hostname: 'api.github.com',
        socksPort: 9050,
        port: 443,
        path: '/repos/Famous/famous/issues?state=open&per_page=100&page=1',
        headers: { 'user-agent': 'node.js' }
    },
    function(response) {
      console.log('STATUS: ' + response.statusCode);
      console.log('HEADERS: ' + JSON.stringify(response.headers));
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
      });
      response.on('end', function(data) {
        console.log('END: ', data);
      });
    });
  }, 
  testGetRepos : function () {
    var today = new Date();
        
    var date = new Date(2014, 0, 1);
    while(true) {
      if(date === today) break;

      var dateString = strftime('%F', date);
      Scraper.getRepositoriesForDay(dateString);
      date.setDate(date.getDate()+1);    
      break;
    }
  },
  testParamGenerator : function() {
    Repositories.getForParams('2014-08-08', 1, 'javascript', 'head').then(function(data){
      console.log(data.total_count);
    });
  },
  testIssuesGetParam : function() {
    Issues.getForParams('Famous', 'famous', 'closed', 1).then(function(data) {
      console.log(data[0]);
    });
  },
  testRecursePromise : function () {
    Issues.getClosedForRepository ('Famous', 'famous').then(function(data) {
      test = {}
      data.forEach(function(issue){
        if(!test[issue.number]) {
          test[issue.number] = true;
        }else{
          console.log(issue.number);
        }
      });
    });
  }
}

module.exports = Test;
