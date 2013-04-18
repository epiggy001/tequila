// Copyright 2013 Clustertech Limited. All rights reserved.
// Clustertech Cloud Management Platform.
//
// Author: jackeychen@clustertech.com

/*
 * All utility functions defined there
 */
define([], function() {
  'use strict';
  return {
    /*
     * Deap clone an object
     */
    clone: function clone(obj) {
      if (null === obj || typeof obj != 'object') {
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

    /*
     * Generate a random string with given length and source
     * If source is not given, use all letters (both cases) and numbers
     * for default
     */
    randomStr: function(length, src) {
      var key = "";
      if (src) {
        var source = src;
      } else {
        var source =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      }
      for( var i=0; i < length; i++ ) {
        key += source.charAt(Math.floor(Math.random() * source.length));
      }
      return key;
    }
  }
})
