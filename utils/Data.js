//This module handles all data queries to mysql.  
var knex = require('knex')({
  dialect: 'mysql',
  connection: MYSQL_CONFIG,
  debug: false
});

var ONE_RESULT = 1
var FIELDS_TO_KEEP = {
  User : ['login', 'id', 'avatar_url', 'url', 'type', 'site_admin', 'html_url', 'score'],
  
  Code : ['fragment', 'object_url', 'object_type', 'property', 'text_matches', 'repository_id'],
  
  Repository : ['id', 'name', 'full_name', 'description', 'created_at', 'updated_at', 
  'pushed_at', 'language', 'has_downloads', 'has_wiki', 'mirror_url', 'default_branch', 
  'score', 'homepage', 'html_url', 'has_pages']
}

Data = {};

Data.insertRequest = function(requestObject, $callback) {
    
}

Data.insertRepository = function (ownerId, repositoryObject) {
  repositoryObject = _filterOut(repositoryObject, FIELDS_TO_KEEP.Repository);
  repositoryObject.owner_id = ownerId;
  //convert string to timestamp for storage.
  repositoryObject.created_at = Date.parse(repositoryObject.created_at) * 0.001;
  repositoryObject.updated_at = Date.parse(repositoryObject.updated_at) * 0.001;
  repositoryObject.pushed_at = Date.parse(repositoryObject.pushed_at) * 0.001;
  
  return knex.table('repositories').insert(repositoryObject)
  .then(function(data){
    return data;
  }, function(error){
    return knex.table('repositories').select('idrepositories').where({
      id : repositoryObject.id,
    }).limit(ONE_RESULT).then(function(repositoryIds){
      if(repositoryIds.length > 0) {
        console.log('duplicate repo, returning', repositoryIds);
        return repositoryIds[0].idrepositories;
      }else{
        debugger;
        throw new Error('UNEXPECTED ROW FORMAT FOR INSERT REPOS');
      }
    }, console.log);
  });
}

Data.appendRepositoryState = function(repositoryId, repositoryObject){
  //adds the current state about the repo
}

Data.setRepositoryFlag = function(repositoryId, flag){
  //modify a repository's flag (ex meteor, famous, famous-angular, ionic, etc)
  return knex.table('repositories')
  .where({
    idrepositories: repositoryId
  })
  .update({
    flag : flag
  });
}

Data.insertUser = function(userObject) {
  userObject = _filterOut(userObject, FIELDS_TO_KEEP.User);
  userObject.last_scanned = 0;
  return knex.table('users').insert(userObject)
  .then(function(data){
    return data;
  }, function(error){
    return knex.table('users').select('idusers').where({
      id: userObject.id
    }).limit(ONE_RESULT).then(function(userIds){
      if(userIds.length > 0) {
        console.log('dupliate', userIds[0].idusers);
        return userIds[0].idusers;
      }else{
        debugger;
        throw new Error('UNEXPECTED ROW FORMAT FOR SELECT USERS');
      }
    }, console.log, console.log);
  })
}

Data.insertCode= function(codeObject){
  if(codeObject && codeObject.repository) {
    return Data.getRepositoryForFullName(codeObject.repository.full_name)
    .then(function(repository_id){
      
      Data.setRepositoryFlag(repository_id, 'FAMOUS').then(console.log, console.log, console.log);
      codeObject.repository_id = repository_id;
      codeObject.text_matches = JSON.stringify(codeObject.matches);
      codeObject = _filterOut(codeObject, FIELDS_TO_KEEP.Code);
      console.log(codeObject.fragment);
      return knex.table('code').insert(codeObject);
    });
  }else{
    return undefined;
  }
  
}

Data.getRepositoryForFullName = function(full_name){
  return knex.table('repositories').select('idrepositories').where({
    full_name : full_name
  }).limit(ONE_RESULT).then(function(rows){
    if(rows.length > 0) {
      return rows[0].idrepositories;
    }else{
      throw new Error('UNEXPECTED ROW FORMAT FOR GET REPO BY FULL NAME');
    }
  });
}

Data.getFullNameForId = function(userId){
  return knex.table('users').select('idusers').where({
    idusers: userId
  }).limit(ONE_RESULT).then(function(rows){
    if(rows.length > 0){

    }else{
      throw new Error('UNEXPECTED ROWS ')
    }
  });
}

Data.getLimitNotScannedRepos = function(limit) {
  return knex.table('repositories').select('full_name').whereNull('flag')
  .limit(limit)
  .orderBy('created_at', 'desc')
  .then(function(rows){
    //rows is nested [ { owner_id: 906 }, { owner_id: 907 } ... , ... ]
    return rows.map(function(row){
      return row.full_name;
    });
  });
}, 

Data.getReposNeedScan= function(limit){
  return knex.table('repositories').select('full_name')
  .orderBy('last_scanned', 'asc').limit(limit)
  .then(function(repos){
    return repos.map(function(repo){
      console.log(repo.full_name);
      return repo.full_name;
    });
  });
}

Data.getFamousRepos = function(limit) {
  return knex.table('repositories').select()
  .where('flag', '=', 'FAMOUS')
  .orderBy('last_scanned', 'asc').limit(limit)
  .then(function(repos){
    return repos.map(function(repo){
      console.log(repo.full_name);
      return repo.full_name;
    })
  });
}

Data.getFamousRepoData = function() {
  var SQL = 'select distinct pushed_at, created_at, full_name from repositories, code where code.fragment like "%famous/core/%" AND repositories.idrepositories = code.repository_id and repositories.owner_id <> 85901 order by repositories.created_at';
  return knex.schema.raw(SQL);
}

Data.getCodeForRepository = function(repositoryId){
  return knex.table('code').select('text_matches')
  .where('repository_id', '=', repositoryId);
}

Data.markRepoNameAsScanned= function(full_name){
  //oddly enough this does not work when called from certain places.  
  //ex.  imoved the code from Repository.scanAll to Code.searchInRepo, and started working!
  return knex.table('repositories')
  .where({
    full_name: full_name
  })
  .update({
    last_scanned : Math.round(Date.now()/1000)
  });
}

Data.getLastRepoCreationScanDate = function () {
  return knex.table('repositories').orderBy('created_at', 'desc').limit(1)
  .then(function(repos){
    return new Date(repos[0].created_at * 1000);
  });
}

function _filterOut(object, whitelist){
  
  var cleanedObject = {};
  for(var key in whitelist){
    var fieldName = whitelist[key];
    cleanedObject[fieldName] = object[fieldName];
  }
  return cleanedObject;
}

module.exports = Data;
