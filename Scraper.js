//scraper uses 
var Q = require('q');
var Repositories = require('./models/Repositories.js');
var Users = require('./models/Repositories.js');

Scraper = {
  getRepositoriesForDay : function (dateString){ 
    //make the request first, get the result.  
    //var page = 1;
    //var order = "asc";
    //var urlPath = '/search/repositories?q=+created:' + dateString + '+language:javascript+fork:false&per_page=100&sort=updated&order=' + order + '&page=' + page;
    Repositories.getForDay(dateString)
    .then(function(arr) {
      for (var i = 0; i < arr.length; i++) {
        var objects = arr[i].items;
        for (var j = 0; j < objects.length; j++) {
          console.log(objects[j]);
        }
      };
    })
    .then(function() {
    });
  }

}

module.exports = Scraper;
