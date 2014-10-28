var Q = require('q');
var https = require('https');
var TorFactory = require('./TorFactory.js');

UTIL = {}
  
UTIL.buildUrlEncodedParameters = function (params){
  return '?' + Object.keys(params).map(function(key){
    return key + '=' + params[key];
  }).join('&');
}

UTIL.buildUrlWithPath = function (/* endpoint args */) {
  var args = arguments;
  return '/' + Object.keys(args).map(function(key, value, test) {
    return args[key];
  }).join('/');
}

UTIL.buildGithubSearchQualifiers = function (qualifiers) {
  return '+' + Object.keys(qualifiers).map(function(key) {
    if(qualifiers[key] != undefined){
      return key + ":" + qualifiers[key];  
    }
  }).join('+');
}

UTIL.retriedTorRequest = function (options, timeout, times) {
  
  //default values for timeout and times to try
  if(!timeout) timeout = 1000;
  if(!times) times = 10;

  return TorFactory.getCircuit().get(options)
  .then(function (result) {
    //content returned

    if(result == undefined || result.incomplete_results || result.message && result.message.indexOf('API rate limit exceeded') != -1){
      //if content returned was incomplete or we hit rate limit, retry anyways.  
      return _delayAndRetry(options, timeout, times-1);
    }else{
      return result;
    }
  }, function (error){
    //error retrieving content
    if (times == 0){
      throw new Error ('promise retry failed' + promise.toString());
    }else{
      return _delayAndRetry(options, timeout, times-1);
    }
  });
}

_delayAndRetry = function (options, timeout, times) {
  return Q.delay(timeout)
  .then(function() {
    debug('retrying promise, times left: ', times);
    return UTIL.retriedTorRequest(options, timeout, times-1);
  });
}

module.exports = UTIL;
