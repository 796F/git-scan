var Repositories = require('./models/Repositories.js');
var Tor = require('./utils/Tor.js');
var Data = require('./utils/Data.js');


var test_user = { 
  "login": "ZebraRoy",
  "id": 6883569,
  "avatar_url": "https://avatars.githubusercontent.com/u/6883569?v=2",
  "url": "https://api.github.com/users/ZebraRoy",
  "type": "User",
  "site_admin": false
};

Data.insertUser(test_user, function(result) {

  var test_repo = {
    "id": 22758064,
    "name": "Andy",
    "owner" : test_user,
    "full_name": "ZebraRoy/Andy",
    "description": "",
    "created_at": "2014-08-08T13:10:03Z",
    "updated_at": "2014-08-08T13:10:23Z",
    "pushed_at": "2014-08-24T13:38:23Z",
    "homepage": null,
    "size": 3408,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": "JavaScript",
    "has_issues": true,
    "has_downloads": true,
    "has_wiki": true,
    "forks_count": 0,
    "mirror_url": null,
    "open_issues_count": 0,
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "master",
    "score": 1.0
  };
  
  var test_repo_id = Data.insertRepository(result.insertId, test_repo, function(r) {
    
  });
});

Repositories.getRespositories();
// var options = {
//   protocol: 'http:',
//   hostname: 'www.telize.com',
//   socksPort: Tor.SOCKS_PORT,
//   port: this.protocol === 'https:' ? 443 : 80,
//   path: '/ip'
// };

// sendTestRequest = function() {
//   var request = Tor.request(options, function(response){
//     console.log('STATUS: ' + response.statusCode);
//     console.log('HEADERS: ' + JSON.stringify(response.headers));
//     response.setEncoding('utf8');
//     response.on('data', function (chunk) {
//       console.log('BODY: ' + chunk);
//     });
//     response.on('end', function(data) {
//       console.log('END: ', data);
//     });

//   });

//   request.on('error', function(e) {
//     console.log('problem with request: ' + e.message);
//   });

//   request.end();
// }

// Tor.init(); //initializes the tor control socket
// Tor.startRandomizer(10000, sendTestRequest); //pass randomizer a request function which gets called every interval of time.  
