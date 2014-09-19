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
      if(qualifiers[key] != undefined){
        return key + ":" + qualifiers[key];  
      }
    }).join('+');
  },
  promiseForTor : function (options) {
    //takes an async function, creates a promise with its results passed.  
    return Q.Promise(function(resolve, reject, notify) {
      TorFactory.getCircuit().get(options, function(error, result) {
        if(!error){
          if(result.incomplete_results || result.message && result.message.indexOf('API rate limit exceeded') != -1){
            //some api calls fail on github's side when valid results are not returned
            //other times we hit a rate limit, so should delay.  
            reject(result);
          }else{
            resolve(result);
          }
        }else{
          reject(error);
        }
      });
    });
  },
  //unlike promiseForTor, this method will retry the TorRequest until valid results are received.  
  retryPromiseForTor : function (options, timeout, times) {
    return Util.promiseForTor(options).then(function (content) {
        return content;
    }, function (error) {
        if (times == 0)
            throw new Error("Promise retry failed" + promise.toString());
        return Q.delay(timeout)
        .then(function () {
            debug('retrying promise, times: ', times);
            return UTIL.retryPromiseForTor(options, timeout, times - 1);
        });
    });
  }
}
  
module.exports = UTIL;
