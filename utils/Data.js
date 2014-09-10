//This module handles all data queries to mysql.  
var knex = require('knex')({
  dialect: 'mysql',
  connection: LOCAL_MYSQL_CONFIG,
  debug: false
});

Data = {
  insertRequest : function(requestObject, $callback) {
    
  },
  insertRepository : function (ownerId, repositoryObject) {
    repositoryObject.owner_id = ownerId;

    _deleteUnwantedFieldsFromRepository(repositoryObject);
    
    //clean ISO8601 timestamps to mysql compliant format
    repositoryObject.created_at = cleanTimestamp(repositoryObject.created_at);
    repositoryObject.updated_at = cleanTimestamp(repositoryObject.updated_at);
    repositoryObject.pushed_at = cleanTimestamp(repositoryObject.pushed_at);

    return knex.table('repositories').insert(repositoryObject);
  },
  appendRepositoryState : function(repositoryId, repositoryObject){
    //adds the current state about the repo
  },
  setRepositoryFlag : function(repositoryId, flag){
    //modify a repository's flag (ex meteor, famous, famous-angular, ionic, etc)
    return knex.table('repositories')
    .where('idrepositories', '=', repositoryId)
    .update({
      'flag' : flag
    });
  },
  insertUser : function(userObject) {
    _deleteUnwantedFieldsFromUser(userObject);

    return knex.table('users').insert(userObject);
  }
}

cleanTimestamp = function(timeString) {
  // expect 2014-08-08T13:10:03Z -> 2014-08-08 13:10:03
  return timeString.replace("T", " ").replace("Z", "");
}

function _deleteUnwantedFieldsFromUser(userObject){
  delete userObject.gravatar_id;
  delete userObject.followers_url;
  delete userObject.following_url;
  delete userObject.gists_url;
  delete userObject.starred_url;
  delete userObject.subscriptions_url;
  delete userObject.organizations_url;
  delete userObject.repos_url;
  delete userObject.events_url;
  delete userObject.received_events_url;
}

function _extractRepositoryState(repositoryObject){
  return {
    repository_id: repositoryObject.repository_id,
    has_issues: repositoryObject.has_issues,
    size: repositoryObject.size,
    stargazers_count: repositoryObject.stargazers_count,
    
    watchers: repositoryObject.watchers,
    watchers_count: repositoryObject.watchers_count,
    
    forks: repositoryObject.forks,
    forks_count: repositoryObject.forks_count,

    open_issues: repositoryObject.open_issues,
    open_issues_count: repositoryObject.open_issues_count,
    timestamp: new Date()
  }
}

function _deleteUnwantedFieldsFromRepository(repositoryObject){
  //delete time dependent properties
  delete repositoryObject.has_issues;
  delete repositoryObject.size;
  delete repositoryObject.stargazers_count;
  
  delete repositoryObject.watchers;
  delete repositoryObject.watchers_count;
  
  delete repositoryObject.forks;
  delete repositoryObject.forks_count;
  
  delete repositoryObject.open_issues;
  delete repositoryObject.open_issues_count;
  
  //delete unused properties
  delete repositoryObject.owner;
  delete repositoryObject.private;
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
}

module.exports = Data;
