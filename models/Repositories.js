var https = require('https');

Repositories = {
  getUsers : function () {
  	while(true) {
	  	var options = {
		    host: 'api.github.com',
		    path: '/search/repositories?q=+created:2014-04-05+language:javascript+fork:false&per_page=100&sort=updated&order=asc&page=2',
		    method: 'GET',
	        headers: {'user-agent': 'node.js'}
		};
		console.log("before request");
	  	https.request(options, function(res) {
		  var str = '';

		  res.on('data', function(d) {
		    str += d;
		  });

		  res.on('end', function() {
		  	console.log("request ended");
		  	var obj = JSON.parse(str);
		  	var items = obj.items;
		  	console.log(items);
		  });
		}).on('error', function(e) {
		  console.error(e);
		}).end();
		break;
	}
  }
}

module.exports = Repositories;
