var _ = require('underscore');
var Tor = require('../utils/Tor.js');
var Data = require('../utils/Data.js');

Repositories = {
  getRepositories : function (urlPath, callback) {

    var options = _.extend({}, GITHUB_API_HTTPS);
    options.path = urlPath;

    console.log(options);

    Tor.request(options, function(res) {
      var str = '';

      res.on('data', function(d) {
        str += d;
      });

      res.on('end', function() {
        callback(str);
      });
    }).on('error', function(e) {
      console.error(e);
    });

  },

  addReposToDB: function(repos) {
    for (var i = 0; i < repos.length; i++) {
      //add repo to database
      Data.insertUser(repos[i].owner, function(result) {
        var test_repo_id = Data.insertRepository(result.insertId, repos[i], function(r) {
        });
      });
    };
  }
}

module.exports = Repositories;
