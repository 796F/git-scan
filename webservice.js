GLOBAL.MYSQL_CONFIG = {
  user : 'root',
  host : 'localhost',
  port : 3306,
  password : '',
  database : 'git_scan_db'
}
var restify = require('restify');
var SQL = 'select distinct created_at, pushed_at, full_name from repositories, code where code.fragment like "%famous/core/%" AND repositories.idrepositories = code.repository_id and repositories.owner_id <> 85901 order by repositories.created_at';
var mysql      = require('mysql');
var connection = mysql.createConnection(MYSQL_CONFIG);
connection.connect();
var ip_addr = '127.0.0.1';
var port    =  '8080';
 
var server = restify.createServer({
    name : "gitscan"
});

server.use(restify.queryParser());  //parses the query string, ie /repo/three.js
server.use(restify.bodyParser());   //turns requests into js objects automagically
server.use(restify.CORS());         //configures 'Cross-origin resource sharing'
 
server.listen(port ,ip_addr, function(){
    console.log('%s ws now listening on %s ', server.name , server.url);
});

server.get({ path : '/data' } , function(req, res, next){
  connection.query(SQL, function(err, rows, fields) {
    if (err) throw err;

    res.send(200, rows);
    return next();
  });
});

server.get({ path: '/.*'}, restify.serveStatic({
  directory: './public',
  default: 'index.html'
}));
