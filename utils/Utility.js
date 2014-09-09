var Q = require('q');
var https = require('https');
var TorFactory = require('./Tor.js');

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
      TorFactory.getCircuit().get(options, function(error, result) {
        if(!error){
          resolve(result);
        }else{
          reject(error);
        }
      });
    });
    // return Q.Promise(function(resolve, reject, notify) {
    //   https.request(options, function(response) {
    //     var str = ''
    //     response.on('data', function (chunk) {
    //       str += chunk;
    //     });

    //     response.on('end', function () {
    //       resolve(JSON.parse(str));
    //     });
    //   }).end();
    // });
  }
}
  
module.exports = UTIL;
