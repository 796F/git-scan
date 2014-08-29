var Repositories = require('../models/Repositories.js');

Test = {
  testTorRequest : function() {
    Tor.request({ 
      protocol: 'https:',
      hostname: 'api.github.com',
      socksPort: 9050,
      port: 443,
      path: '/repos/Famous/famous/issues?state=closed&per_page=100&page=1',
      headers: { 'User-Agent' : 'xiamike' }
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
    Repositories.getRepositoriesForParams('2014-08-08', 1, 'javascript', 'head').then(function(data){
      console.log(data.total_count);
    });
  }
}

module.exports = Test;
