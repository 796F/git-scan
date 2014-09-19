//This module handles all data queries to mysql.  
var knex = require('knex')({
  dialect: 'mysql',
  connection: LOCAL_MYSQL_CONFIG,
  debug: false
});

ONE_RESULT = 1
FIELDS_TO_KEEP = {
  User : ['login', 'id', 'avatar_url', 'url', 'type', 'site_admin', 'html_url', 'score'],
  Code : ['name', 'url', 'path', 'sha', 'html_url', 'text_matches', 'repository_id'],
  Repository : ['id', 'name', 'full_name', 'description', 'created_at', 'updated_at', 
  'pushed_at', 'language', 'has_downloads', 'has_wiki', 'mirror_url', 'default_branch', 
  'score', 'homepage', 'html_url', 'has_pages']
}

function _filterOut(object, whitelist){
  var cleanedObject = {};
  whitelist.forEach(function(fieldName){
    cleanedObject[fieldName] = object[fieldName];
  });
  return cleanedObject;
}

Data = {
  insertRequest : function(requestObject, $callback) {
    
  },
  insertRepository : function (ownerId, repositoryObject) {
    repositoryObject = _filterOut(repositoryObject, FIELDS_TO_KEEP.Repository);
    repositoryObject.owner_id = ownerId;
    //convert string to timestamp for storage.
    repositoryObject.created_at = Date.parse(repositoryObject.created_at)/1000;
    repositoryObject.updated_at = Date.parse(repositoryObject.updated_at)/1000;
    repositoryObject.pushed_at = Date.parse(repositoryObject.pushed_at)/1000;
    
    return knex.table('repositories').insert(repositoryObject)
    .then(function(data){
      return data;
    }, function(error){
      return knex.table('repositories').select('idrepositories').where({
        id : repositoryObject.id,
        full_name : repositoryObject.full_name
      }).limit(ONE_RESULT).then(function(repositoryIds){
        if(repositoryIds.length > 0) {
          return repositoryIds[0].idrepositories;
        }else{
          throw new Error('UNEXPECTED ROW FORMAT FOR INSERT REPOS');
        }
      });
    });
  },
  appendRepositoryState : function(repositoryId, repositoryObject){
    //adds the current state about the repo
  },
  setRepositoryFlag : function(repositoryId, flag){
    //modify a repository's flag (ex meteor, famous, famous-angular, ionic, etc)
    return knex.table('repositories')
    .where({
      idrepositories: repositoryId
    })
    .update({
      flag : flag
    });
  },
  insertUser : function(userObject) {
    userObject = _filterOut(userObject, FIELDS_TO_KEEP.User);
    return knex.table('users').insert(userObject)
    .then(function(data){
      return data;
    }, function(error){
      return knex.table('users').select('idusers').where({
        login: userObject.login,
        id: userObject.id
      }).limit(ONE_RESULT).then(function(userIds){
        if(userIds.length > 0) {
          return userIds[0].idusers;
        }else{
          throw new Error('UNEXPECTED ROW FORMAT FOR SELECT USERS');
        }
      });
    })
  },
  insertCode: function(codeObject){
    debugger;
    if(codeObject && codeObject.repository) {
      return Data.getRepositoryForFullName(codeObject.repository.full_name)
      .then(function(repository_id){
        Data.setRepositoryFlag(repository_id, 'FAMOUS').then(console.log, console.log, console.log);
        codeObject.repository_id = repository_id;
        codeObject.text_matches = JSON.stringify(codeObject.text_matches);
        codeObject = _filterOut(codeObject, FIELDS_TO_KEEP.Code);
        return knex.table('code').insert(codeObject);
      });
    }else{
      return undefined;
    }
    
  },
  getRepositoryForFullName : function(full_name){
    return knex.table('repositories').select('idrepositories').where({
      full_name : full_name
    }).limit(ONE_RESULT).then(function(rows){
      if(rows.length > 0) {
        return rows[0].idrepositories;
      }else{
        throw new Error('UNEXPECTED ROW FORMAT FOR GET REPO BY FULL NAME');
      }
    });
  },
  getFullNameForId : function(userId){
    return knex.table('users').select('idusers').where({
      idusers: userId
    }).limit(ONE_RESULT).then(function(rows){
      if(rows.length > 0){

      }else{
        throw new Error('UNEXPECTED ROWS ')
      }
    });
  },
  getLimitNotScannedRepos : function(limit) {
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
  getReposNeedScan: function(limit){
    return knex.table('repositories').select('full_name')
    .orderBy('last_scanned', 'asc').limit(limit)
    .then(function(repos){
      return repos.map(function(repo){
        debug(repo.full_name);
        return repo.full_name;
      });
    });
  },
  markRepoNameAsScanned: function(full_name){
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
}

module.exports = Data;
