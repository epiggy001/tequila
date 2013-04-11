define([], function(){
  'use strict';
  return {
    clone: function clone(obj) {
      if (null == obj || typeof obj != 'object') {
        return obj;
      }
      if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
      }
      // Handle Array
      if (obj instanceof Array) {
        var copy = [];
        for (var i = 0; i < obj.length; ++i) {
          copy[i] = clone(obj[i]);
        }
        return copy;
      }
      // Handle Object
      if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
          if (obj.hasOwnProperty(attr)) {
            copy[attr] = clone(obj[attr]);
          }
        }
        return copy;
      }
    },

    randomStr: function(length, src) {
      var key = "";
      if (src) {
        var source = src;
      } else {
        var source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      }
      for( var i=0; i < length; i++ ) {
        key += source.charAt(Math.floor(Math.random() * source.length));
      }
      return key;
    }
  }
})
