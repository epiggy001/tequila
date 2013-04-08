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

    setIndexedDB: function() {
      window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
      window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    }
  }
})