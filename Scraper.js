//scraper uses 
var Q = require('q');
var Repositories = require('./models/Repositories.js');
var Users = require('./models/Repositories.js');

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
