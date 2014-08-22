var https = require('https');

Repositories = {
  getUsers : function () {
  	while(true) {
	  	var options = {
		    host: 'api.github.com',
		    path: '/search/repositories?q=+language:javascript+fork:false+created:>2014-01-01+pushed:>2014-06-01&per_page=100$page=2',
		    method: 'GET',
	        headers: {'user-agent': 'node.js'}
		};

	  	https.request(options, function(res) {
		  var str = '';

		  res.on('data', function(d) {
		    str += d;
		  });

		  res.on('end', function() {
		  	var obj = JSON.parse(str);
		  	var items = obj.items;
		  	console.log(obj);
		  });
		}).on('error', function(e) {
		  console.error(e);
		}).end();
	}
  }
}

module.exports = Repositories;
