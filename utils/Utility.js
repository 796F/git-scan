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
  }
}
  
module.exports = UTIL;
