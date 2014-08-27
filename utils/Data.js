var mysql = require('mysql');

var connection = mysql.createConnection({
  user : 'root',
  host : 'localhost',
  port : 3306,
  password : '',
  database : 'git_scan_db',
  debug : false
});

connection.connect();

Data = {
  insertRepository : function (ownerId, repositoryObject, $callback) {
    repositoryObject.owner_id = ownerId;

    //delete unused owner property
    delete repositoryObject.owner;
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
