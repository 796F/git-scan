var Repositories = require('../models/Repositories.js'),
    TorFactory = require('../utils/Tor.js'),
    Issues = require('../models/Issues.js'),
    Users = require('../models/Users.js'),
    Code = require('../models/Code.js'),
    Data = require('../utils/Data.js'),
    strftime = require('strftime');

Test = {
  testGetReposParam : function () {
    Repositories.getForParams('2014-08-08', 2, 'javascript', 'head')
    .then(function(repos){
      console.log('get repos for params returned total count', repos.total_count);
      console.log('inc results', repos.incomplete_results);
      console.log('this batch had length', repos.items.length);
      console.log('first one is ', repos.items[0]);
    });
  },
  testIssuesGetParam : function() {
    Issues.getForParams('Famous', 'famous', 'open')
    .then(function(issues){
      console.log('get issues for params returned', issues.length);
      console.log('first one is ', issues[0]);
    });
  },
  testUsersJsGetReposForName : function () {
    console.log('RUNNING TEST testUsersJsGetReposForName')
    Users.getReposForName('jaysingh')
    .then(function(repos) {
      console.log('get repos for name returned', repos.length);
      console.log('first one is ', repos[0]);
    });
  },
  testUsersJsGetStarredForName : function() {
    console.log('RUNNING TEST testUsersJsGetStarredForName')
    Users.getStarredForName('jaysingh')
    .then(function(starred){
      console.log('get starred for name returned', starred.length);
      console.log('first one is ', starred[0]);
    });
  },
  testTorFactory : function() {
    //make and terminate circuits.  
    TorFactory.makeCircuits(5, 9500, 15000);
    setTimeout(TorFactory.closeCircuits, 5000);
  },
  searchUserForString: function() {
    //searches user readfwd for string famous/core/engine
    Code.searchForUser('sagittaros', 'famous/core/engine')
    .then(function(matches) {
      console.log(JSON.stringify(matches));
    });
  },
  testDataInsertUser: function() {
    var userObject = {
      "login": "xiamike",
      "id": 888943,
      "avatar_url": "https://avatars.githubusercontent.com/u/888943?v=2",
      "gravatar_id": "a01beda6a1b8f917e69539ee8e443a1e",
      "url": "https://api.github.com/users/xiamike",
      "html_url": "https://github.com/xiamike",
      "followers_url": "https://api.github.com/users/xiamike/followers",
      "following_url": "https://api.github.com/users/xiamike/following{/other_user}",
      "gists_url": "https://api.github.com/users/xiamike/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/xiamike/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/xiamike/subscriptions",
      "organizations_url": "https://api.github.com/users/xiamike/orgs",
      "repos_url": "https://api.github.com/users/xiamike/repos",
      "events_url": "https://api.github.com/users/xiamike/events{/privacy}",
      "received_events_url": "https://api.github.com/users/xiamike/received_events",
      "type": "User",
      "site_admin": false,
      "score": 38.9686
    }
    Data.insertUser(userObject).then(function(rows){
      console.log(rows);
    });
  },
  testDataInsertRepository: function() {
    var repositoryObject = {
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
      "description": "I ADDED THIS FOR A TEST",
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
      "homepage": "I ADDED THIS HOMEPAGE FOR TEST",
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
    }
    Data.insertRepository(1, repositoryObject).then(console.log);
  }
}

module.exports = Test;
