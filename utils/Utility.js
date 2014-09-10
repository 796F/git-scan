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
          console.log(JSON.stringify(result).substring(0, 100));
          if(result.incomplete_results){
            //some api calls fail on github's side when valid results are not returned
            reject(result);
          }else{
            resolve(result);
          }
        }else{
          reject(error);
        }
      });
    });
    /*
    return Q.Promise(function(resolve, reject, notify) {
      https.request(options, function(response) {
        var str = ''
        response.on('data', function (chunk) {
          str += chunk;
        });

        response.on('end', function () {
          resolve(JSON.parse(str));
        });
      }).end();
    */
  },
  retryPromiseForTor : function (options, timeout, times) {
    return Util.promiseForTor(options).then(function (content) {
        return content;
    }, function (error) {
        if (times == 0)
            throw new Error("Promise retry failed" + promise.toString());
        return Q.delay(timeout)
        .then(function () {
            console.log('retrying promise, times: ', times);
            return UTIL.retryPromiseForTor(options, timeout, times - 1);
        });
    });
  }
}
  
module.exports = UTIL;
