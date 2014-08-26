var https = require('https');

function _getRemainingPages(dateString, totalObjects) {
	var page = 2;
	var order = "asc";
	while(true) {
		//IF THE PAGE IS EMPTY THEN BREAK
		if (page > 10 && order === "asc") {
			page = 1;
			order = "desc";
		} else if(page > 10) {
			break;
		}
		var options = {
		    host: 'api.github.com',
		    path: '/search/repositories?q=+created:' + dateString + '+language:javascript+fork:false&per_page=100&sort=updated&order=' + order + '&page=' + page,
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
				if(obj.total_count !== 0) {
					var items = obj.items;
					console.log(items.id);
				}
			});
		}).on('error', function(e) {
			console.error(e);
		}).end();
		page++;
	}
}

Repositories = {
  getUsers : function () {

  	var today = new Date();
  	
  	var date = new Date(2014, 0, 1);
  	while(true) {
  		var day = date.getDay();
	  	var month = date.getMonth() + 1;
	  	var year = date.getFullYear();
	  	if(day < 10) {
		    day = '0' + day
		} 

		if(month < 10) {
		    month = '0' + month
		}
  		if(date === today) break;
	  	var dateString = year + "-" + month + "-" + day;
	  	var page = 1;
	  	var order = "asc";
	  	var options = {
		    host: 'api.github.com',
		    path: '/search/repositories?q=+created:' + dateString + '+language:javascript+fork:false&per_page=100&sort=updated&order=' + order + '&page=' + page,
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
				if(obj.total_count !== 0) {
					var items = obj.items;
					for(var z = 0; z < items.length; z++) {
						console.log(items[z].id);
					}
					//_getRemainingPages(dateString, obj.total_count);
				}
			});
		}).on('error', function(e) {
			console.error(e);
		}).end();

		date.setDate(date.getDate()+1);		 
		break;
	}
  }
}

module.exports = Repositories;
