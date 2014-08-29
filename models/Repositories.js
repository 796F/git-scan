var https = require('https');
var Data = require('./utils/Data.js');

Repositories = {
  getRepositories : function (urlPath, callback) {
    var options = {
        host: 'api.github.com',
        path: urlPath,
        method: 'GET',
        headers: {'user-agent': 'node.js'}
    };
    https.request(options, function(res) {
      var str = '';

      res.on('data', function(d) {
        str += d;
      });

      res.on('end', function() {
        callback(str);
      });
    }).on('error', function(e) {
      console.error(e);
    }).end();
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