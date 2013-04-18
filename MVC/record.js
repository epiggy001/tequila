// Copyright 2013 Clustertech Limited. All rights reserved.
// Clustertech Cloud Management Platform.
//
// Author: jackeychen@clustertech.com

/*
 * Define a class of record for model to store
 */
define(['../basic/oo', '../basic/util'], function(oo, util) {
  'use strict';
  var Record = oo.create({
    init: function(opt, validation) {
      this._opt = {};
      for (var i=0; i<opt.length; i++) {
        var tmp = opt[i];
        this._opt[tmp.name] ={
          def: tmp.def ? tmp.def : null
        }
      }
      this.validate = validation;
    },
    proto: {
      create: function(obj) {
        var out = {}
        for (var key in this._opt) {
          if (this._opt.hasOwnProperty(key)) {
            var def = (this._opt[key]).def ? (this._opt[key]).def : null;
            out[key] = obj[key] ? obj[key] : def;
          }
        }
        if ((typeof this.validate != 'function') || this.validate(out)) {
          return out
        } else {
          console.error('Fail to validate record');
          return null
        }
      },
    }
  })
  return Record
})
