//scraper uses 
var Q = require('q');
var Repositories = require('./models/Repositories.js');
var Users = require('./models/Repositories.js');

function _getRemainingPages(dateString, totalObjects) {
  var page = 2;
  var order = "asc";
  var numPages = Math.ceil(totalObjects / 100);
  
  if(numPages > 20) numPages = 20;

  for(var i = 1; i < numPages; i++) { 
    if (page > 10 && order === "asc") {
      page = 1;
      order = "desc";
    } 
    var urlPath = '/search/repositories?q=+created:' + dateString + '+language:javascript+fork:false&per_page=100&sort=updated&order=' + order + '&page=' + page;
    Repositories.getRepositories(urlPath, function(str) {
      var obj = JSON.parse(str);
      if(obj.total_count !== 0) {
        var items = obj.items;
        for(var i = 0; i < items.length; i++) {
          console.log(items[i]);
        }
      }
    });
    page++;
  }
}

Scraper = {
  getRepositoriesForDay : function (dateString){ 
    //make the request first, get the result.  
    Repositories.getForDay(dateString)
    .then(function(arr) {
      for (var i = 0; i < arr.length; i++) {
        var objects = arr[i].items;
        for (var j = 0; j < objects.length; j++) {
          console.log(objects[j]);
        }
      };
    });
  }
}

module.exports = Scraper;
