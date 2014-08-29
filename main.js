var _ = require('underscore');

_.extend(GLOBAL, {
  GITHUB_API_ROOT_URL : 'https://api.github.com',
  TOR_SOCKS_PORT : 9050,
  TOR_CONTROL_PORT : 9051,
  TOR_AUTH_SIGNAL : 'AUTHENTICATE\n',
  TOR_RANDOM_IP_SIGNAL : 'SIGNAL NEWNYM\r\n',
});

GLOBAL.MYSQL_CONFIG = {
  user : 'root',
  host : 'localhost',
  port : 3306,
  password : '',
  database : 'git_scan_db',
  debug : false
}

GLOBAL.GITHUB_API_HTTPS = {
  protocol: 'https:',
  hostname: 'api.github.com',
  socksPort: TOR_SOCKS_PORT,
  port: 443,
  path: '/'
}

GLOBAL.GITHUB_API_HTTP = {
  protocol: 'http',
  hostname: 'api.github.com',
  socksPort: TOR_SOCKS_PORT,
  port: 80,
  path: '/'
}

//get utils
var Tor = require('./utils/Tor.js');
var Data = require('./utils/Data.js');
var Q = require('q');

//get models
var Repositories = require('./models/Repositories.js');
var Users = require('./models/Repositories.js');

Tor.init();                   //initializes the tor control socket
Tor.startRandomizer(10000);   //start randomizing our exit ip

var test_data = {
      "id": 18476263,
      "name": "apps",
      "full_name": "Grant42/apps",
      "owner": {
        "login": "Grant42",
        "id": 5448265,
        "avatar_url": "https://avatars.githubusercontent.com/u/5448265?v=2",
        "gravatar_id": "ecee67b637c46f79c4dffe0529c25907",
        "url": "https://api.github.com/users/Grant42",
        "html_url": "https://github.com/Grant42",
        "followers_url": "https://api.github.com/users/Grant42/followers",
        "following_url": "https://api.github.com/users/Grant42/following{/other_user}",
        "gists_url": "https://api.github.com/users/Grant42/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/Grant42/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/Grant42/subscriptions",
        "organizations_url": "https://api.github.com/users/Grant42/orgs",
        "repos_url": "https://api.github.com/users/Grant42/repos",
        "events_url": "https://api.github.com/users/Grant42/events{/privacy}",
        "received_events_url": "https://api.github.com/users/Grant42/received_events",
        "type": "User",
        "site_admin": false
      },
      "private": false,
      "html_url": "https://github.com/Grant42/apps",
      "description": "",
      "fork": false,
      "url": "https://api.github.com/repos/Grant42/apps",
      "forks_url": "https://api.github.com/repos/Grant42/apps/forks",
      "keys_url": "https://api.github.com/repos/Grant42/apps/keys{/key_id}",
      "collaborators_url": "https://api.github.com/repos/Grant42/apps/collaborators{/collaborator}",
      "teams_url": "https://api.github.com/repos/Grant42/apps/teams",
      "hooks_url": "https://api.github.com/repos/Grant42/apps/hooks",
      "issue_events_url": "https://api.github.com/repos/Grant42/apps/issues/events{/number}",
      "events_url": "https://api.github.com/repos/Grant42/apps/events",
      "assignees_url": "https://api.github.com/repos/Grant42/apps/assignees{/user}",
      "branches_url": "https://api.github.com/repos/Grant42/apps/branches{/branch}",
      "tags_url": "https://api.github.com/repos/Grant42/apps/tags",
      "blobs_url": "https://api.github.com/repos/Grant42/apps/git/blobs{/sha}",
      "git_tags_url": "https://api.github.com/repos/Grant42/apps/git/tags{/sha}",
      "git_refs_url": "https://api.github.com/repos/Grant42/apps/git/refs{/sha}",
      "trees_url": "https://api.github.com/repos/Grant42/apps/git/trees{/sha}",
      "statuses_url": "https://api.github.com/repos/Grant42/apps/statuses/{sha}",
      "languages_url": "https://api.github.com/repos/Grant42/apps/languages",
      "stargazers_url": "https://api.github.com/repos/Grant42/apps/stargazers",
      "contributors_url": "https://api.github.com/repos/Grant42/apps/contributors",
      "subscribers_url": "https://api.github.com/repos/Grant42/apps/subscribers",
      "subscription_url": "https://api.github.com/repos/Grant42/apps/subscription",
      "commits_url": "https://api.github.com/repos/Grant42/apps/commits{/sha}",
      "git_commits_url": "https://api.github.com/repos/Grant42/apps/git/commits{/sha}",
      "comments_url": "https://api.github.com/repos/Grant42/apps/comments{/number}",
      "issue_comment_url": "https://api.github.com/repos/Grant42/apps/issues/comments/{number}",
      "contents_url": "https://api.github.com/repos/Grant42/apps/contents/{+path}",
      "compare_url": "https://api.github.com/repos/Grant42/apps/compare/{base}...{head}",
      "merges_url": "https://api.github.com/repos/Grant42/apps/merges",
      "archive_url": "https://api.github.com/repos/Grant42/apps/{archive_format}{/ref}",
      "downloads_url": "https://api.github.com/repos/Grant42/apps/downloads",
      "issues_url": "https://api.github.com/repos/Grant42/apps/issues{/number}",
      "pulls_url": "https://api.github.com/repos/Grant42/apps/pulls{/number}",
      "milestones_url": "https://api.github.com/repos/Grant42/apps/milestones{/number}",
      "notifications_url": "https://api.github.com/repos/Grant42/apps/notifications{?since,all,participating}",
      "labels_url": "https://api.github.com/repos/Grant42/apps/labels{/name}",
      "releases_url": "https://api.github.com/repos/Grant42/apps/releases{/id}",
      "created_at": "2014-04-05T20:45:21Z",
      "updated_at": "2014-07-16T22:37:46Z",
      "pushed_at": "2013-12-18T12:14:53Z",
      "git_url": "git://github.com/Grant42/apps.git",
      "ssh_url": "git@github.com:Grant42/apps.git",
      "clone_url": "https://github.com/Grant42/apps.git",
      "svn_url": "https://github.com/Grant42/apps",
      "homepage": "",
      "size": 15556,
      "stargazers_count": 0,
      "watchers_count": 0,
      "language": "JavaScript",
      "has_issues": false,
      "has_downloads": true,
      "has_wiki": false,
      "forks_count": 0,
      "mirror_url": null,
      "open_issues_count": 0,
      "forks": 0,
      "open_issues": 0,
      "watchers": 0,
      "default_branch": "master",
      "score": 1.0
    };

test_request = {
  query : '',
  created : '2014-08-08', 
  language : 'javascript',
  fork : false,
  per_page : 100,
  sort : 'updated',
  order : 'asc',
  page_num : '1',
  total_count : 1062,
  incomplete_result : false
}

//make the request first, get the result.  

Data.insertRequest(test_request, function(result) {
  var request_id = result.insertId;
  console.log(request_id);
  Data.insertUser(test_data.owner, function(result) {
    var user_id = result.insertId;
    console.log(user_id);
    Data.insertRepository(user_id, request_id, test_data, function(result) {
      console.log(result);
    });
  });
});




// Repositories.getRepositoryForDay('2014-08-08') //this gives us a list of repos
// .then(injectRequestObject)
// .then(saveAllRepos)


// function getRepositoryForDay(dateString) {
//   return Q.Promise(function(resolve, reject, notify) {
//     //make request to api.github.com, resolve if http status 200
//     setTimeout(function(){
//       console.log('got all repos for day', dateString);
//       resolve(['hello', 'world']);
//     }, 1000);
//   });
// }

// require('./models/Issues.js').getIssuesForRepository('Famous', 'famous', 'closed');

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
