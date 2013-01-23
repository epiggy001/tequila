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
  function match(url, tpl) {
    var braces = checkBrace(tpl);
    var sub;
    var reg = '';
    var keys = [];
    for (var i=0 ;i < braces.length ; i+=2) {
      sub = tpl.substring(braces[i], braces[i+1]);
      reg += sub;
      if (i < braces.length - 2) {
        reg += '([A-Za-z0-9]+)';
        keys.push(tpl.substring(braces[i+1] + 1, braces[i+2] - 1))
      }
    }
    reg = '^' + reg + '$'
    var patt=new RegExp(reg,'');
    var values = patt.exec(url);
    var data = null;
    if (values) {
      data = {};
      for (var i=0 ;i <keys.length; i++) {
        data[keys[i]] = values[i+1];
      }
    }
    return data;
  }
  var Navigator = oo.create({
    init: function(map){
      if (!map) {
        return {};
      }
      var self = this;
      self._handlers = [];
      $.each(map, function(key, value) {
        if ((typeof key == 'string') && (typeof value == 'function')) {
          self._handlers.push({tpl: key , fn: value});
        }
      });
      $(window).bind( 'hashchange', function(e){
        var url = window.location.hash.slice(1);
        $.each(self._handlers, function(key, handler){
          var tpl = handler.tpl;
          if (tpl == url) {
            handler.fn.call(self);
          } else {
            var data = match(url, tpl);
            if (data) {
              handler.fn.call(self, data)
            }
          }
        })
      })
    },
    stat: {
      _checkBrace:checkBrace,
      _match:match
    }
  })
  return Navigator
});