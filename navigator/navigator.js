define(['../basic/oo', '../basic/util'], function(oo, util){
  'use strict';
  function checkBrace(url) {
    var out = [0];
    var level = 0;
    for (var i=0; i < url.length ; i++) {
      if (url[i] == '{') {
        level++;
        if (level == 1) {
          out.push(i);
        } else {
          console.error('Bad url template');
          return null;
        }
      } else if (url[i] == '}') {
        level--;
        if (level == 0) {
          out.push(i+1);
        } else {
          console.error('Bad url template');
          return null;
        }
      }
    }
    if (level != 0) {
      console.error('Bad url template');
      return null;
    }
    out.push(url.length)
    return out;
  }
  function match(url) {
    var braces = checkBrace(url);
    var sub;
    var reg = '';
    for (var i=0 ;i < braces.length ; i+=2) {
      sub = url.substring(braces[i], braces[i+1]);
      reg += sub;
      if (i < braces.length - 1) {
        reg += '([A-Za-z0-9]+)'
      }
    }
    console.log(reg)
  }
  var Navigator = oo.create({
    init: function(map){
      if (!map) {
        return {};
      }
      $.each(map, function(key, value) {
        this._handlers = {};
        if ((typeof key == 'string') && (typeof value == 'function')) {
          this._handlers[key] = value;
        }
      });
      var self = this;
      $(window).hashchange( function(){
        var url = location.hash;
       
      })
    },
    stat: {
      _checkBrace:checkBrace,
      _match:match
    }
  })
  return Navigator
});