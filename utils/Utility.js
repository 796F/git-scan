var Q = require('q');

UTIL = {
  buildUrlEncodedParameters : function (params){
    return '?' + Object.keys(params).map(function(key){
      return key + '=' + params[key];
    }).join('&');
  },
  buildUrlWithPath : function (/* endpoint args */) {
    var args = arguments;
    return Object.keys(args).map(function(key, value, test) {
      return args[key];
    }).join('/');
  },

  buildGithubSearchQualifiers : function (qualifiers) {
    return '+' + Object.keys(qualifiers).map(function(key) {
      return key + ":" + qualifiers[key];
    }).join('+');
  },
  promiseForFunction : function ($asyncFn) {
    //takes an async function, creates a promise with its results passed.  
    return Q.Promise(function(resolve, reject, notify) {
      setTimeout(function() {
        //save the User from the response object using the requestId, then resolve with repository, request, and user. 
        console.log('save user using', data.requestId, data.response.owner);
        data.userId = 1;
        resolve(data);
      }, 1000);
    });
  }
}
  
module.exports = UTIL;
