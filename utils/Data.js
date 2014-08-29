//This module handles all data queries to mysql.  

var mysql = require('mysql');
var connection = mysql.createConnection(MYSQL_CONFIG);

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }else{
    console.log('MYSQL connected as id ' + connection.threadId);  
  }
});

Data = {
  insertRequest : function(requestObject, $callback) {
    connection.query('INSERT INTO requests SET ?', requestObject, function (err, result) {
      if (err) 
        throw err;
      else
        $callback(result);
    });
  },
  insertRepository : function (ownerId, requestId, repositoryObject, $callback) {
    repositoryObject.owner_id = ownerId;
    repositoryObject.request_id = requestId;

    //delete unused properties
    delete repositoryObject.owner;
    delete repositoryObject.private;
    delete repositoryObject.html_url;
    delete repositoryObject.fork;
    delete repositoryObject.url;
    delete repositoryObject.forks_url;
    delete repositoryObject.keys_url;
    delete repositoryObject.collaborators_url;
    delete repositoryObject.teams_url;
    delete repositoryObject.hooks_url;
    delete repositoryObject.issue_events_url;
    delete repositoryObject.events_url;
    delete repositoryObject.assignees_url;
    delete repositoryObject.branches_url;
    delete repositoryObject.tags_url;
    delete repositoryObject.blobs_url;
    delete repositoryObject.git_tags_url;
    delete repositoryObject.git_refs_url;
    delete repositoryObject.trees_url;
    delete repositoryObject.statuses_url;
    delete repositoryObject.languages_url;
    delete repositoryObject.stargazers_url;
    delete repositoryObject.contributors_url;
    delete repositoryObject.subscribers_url;
    delete repositoryObject.subscription_url;
    delete repositoryObject.commits_url;
    delete repositoryObject.git_commits_url;
    delete repositoryObject.comments_url;
    delete repositoryObject.issue_comment_url;
    delete repositoryObject.contents_url;
    delete repositoryObject.compare_url;
    delete repositoryObject.merges_url;
    delete repositoryObject.archive_url;
    delete repositoryObject.downloads_url;
    delete repositoryObject.issues_url;
    delete repositoryObject.pulls_url;
    delete repositoryObject.milestones_url;
    delete repositoryObject.notifications_url;
    delete repositoryObject.labels_url;
    delete repositoryObject.releases_url;
    delete repositoryObject.git_url;
    delete repositoryObject.ssh_url;
    delete repositoryObject.clone_url;
    delete repositoryObject.svn_url;
    
    //clean ISO8601 timestamps to mysql compliant format
    repositoryObject.created_at = cleanTimestamp(repositoryObject.created_at);
    repositoryObject.updated_at = cleanTimestamp(repositoryObject.updated_at);
    repositoryObject.pushed_at = cleanTimestamp(repositoryObject.pushed_at);

    connection.query('INSERT INTO repositories SET ?', repositoryObject, function (err, result) {
      if (err) 
        throw err;
      else
        $callback(result);
    });
  },
  insertUser : function(userObject, $callback) {
    delete userObject.gravatar_id;
    delete userObject.html_url;
    delete userObject.followers_url;
    delete userObject.following_url;
    delete userObject.gists_url;
    delete userObject.starred_url;
    delete userObject.subscriptions_url;
    delete userObject.organizations_url;
    delete userObject.repos_url;
    delete userObject.events_url;
    delete userObject.received_events_url;

    connection.query('INSERT INTO users SET ?', userObject, function (err, result){
      if (err) 
        throw err;
      else
        $callback(result);
    });
  }
}

cleanTimestamp = function(timeString) {
  // expect 2014-08-08T13:10:03Z -> 2014-08-08 13:10:03
  return timeString.replace("T", " ").replace("Z", "");
}

module.exports = Data;
