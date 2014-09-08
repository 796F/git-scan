var Q = require('q');
var HTTPS = require('https');
var Tor = require('./Tor.js');

UTIL = {
  buildUrlEncodedParameters : function (params){
    return '?' + Object.keys(params).map(function(key){
      return key + '=' + params[key];
    }).join('&');
  },
  buildUrlWithPath : function (/* endpoint args */) {
    var args = arguments;
    return '/' + Object.keys(args).map(function(key, value, test) {
      return args[key];
    }).join('/');
  },
  buildGithubSearchQualifiers : function (qualifiers) {
    return '+' + Object.keys(qualifiers).map(function(key) {
      return key + ":" + qualifiers[key];
    }).join('+');
  },
  promiseForTor : function (options) {
    //takes an async function, creates a promise with its results passed.  
    return Q.Promise(function(resolve, reject, notify) {
      Tor.request(options, function(response) {
        var data = '';
        response.on('data', function (chunk) {
          data += chunk;
        });

        response.on('end', function() {
          resolve(JSON.parse(data));
        });

        response.on('error', function(error) {
          reject(error);
        });
      });
    });
  }
}
  
module.exports = UTIL;
