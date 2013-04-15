/*
 * Base class of model. Use a object to store data in memory
 * For exmaple:
 * var model = require('./model');
 * var jobModel = new model({
 *   fields: [{name: 'field1' ,default:'my-field'}, {name:'field2'}],
 *   primary: 'field1', // Required, default value is ID,
 *   validate: function(rec) {
 *    ...
 *   }
 *  // Validation function for each record,
 *  // if is valid return true else return false
 * });
 */
define(['../basic/oo', '../basic/util', './record'], function(oo, util, Record){
  'use strict';
   var Model = oo.create({
    init: function(opt) {
      this._store = {};
      this._record = new Record(opt.fields, opt.validate);
      this._primary = opt.primary ? opt.primary : 'ID';
    },
    stat:{
      inf: oo.inf('model', ['insert', 'remove', 'update', 'load',
        'getData', 'findByKey', 'filter', 'find'])
    },
    proto: {
      _genKey: function() {
        return util.randomStr(20);
      },
      _getData: function(rec) {
        var out = util.clone(rec);
        delete out._key_;
        return out;
      },
      // Insert a record
      insert: function(obj) {
        var rec = this._record.create(obj);
        if (rec) {
          rec._key_ = this._genKey();
          this._store[rec._key_] = rec;
          this.trigger('onChange');
          this.trigger('onInsert', util.clone(rec));
        }
        return util.clone(rec);
      },
      // Delete a record
      remove: function(rec) {
        //Todo add support to remove by key
        if (!this._store[rec._key_]) {
          return;
        }
        delete this._store[rec._key_];
        this.trigger('onChange');
        this.trigger('onRemove', rec);
      },
      // Update a record
      update: function(rec, obj) {
        var tmp = util.clone(rec);
        $.extend(tmp, obj)
        if (!this._record.validate || this._record.validate(tmp)) {
          this._store[rec._key_] = tmp;
          this.trigger('onChange');
          this.trigger('onUpdate', util.clone(rec), util.clone(tmp));
          $.extend(rec, obj);
        }
      },
      // Given length of the model
      count: function() {
        var count = 0;
        for (var key in this._store) {
          if (this._store.hasOwnProperty(key)) {
            count ++;
          }
        }
        return count;
      },
      // Get all data as an array from model
      getData: function(){
        var out = [];
        $.each(this._store, function(key, value) {
          var tmp = util.clone(value);
          out.push(tmp);
        })
        return out;
      },
      // Get all data as json strong from the model
      toJSON: function(){
        var out = this.getData();
        return JSON.stringify(out);
      },
      // Filter the data with the given function
      filter: function(func) {
        var out = [];
        $.each(this.getData(), function(key, value) {
          if (func(value)) {
            out.push(value);
          };
        });
        return out;
      },
      // Reload the model with given data
      load: function(data){
        if (data) {
          var self = this;
           this._store = {};
          $.each(data, function(index, obj){
            var rec = self._record.create(obj);
            if (rec) {
              rec._key_ = self._genKey();
              self._store[rec._key_] = rec;
            } else {
              console.error('Fail to create record' , obj)
            }
          });
          this.trigger('onChange');
          this.trigger('onLoad');
        }
      },
      // Clear all data
      clear: function(){
        this._store = {};
        this.trigger('onChange');
        this.trigger('onClear');
      },
      // Find a record with its primary key
      findByKey:function(key){
        var self = this;
        var temp = this.filter(function(rec){
          var primary = self._primary;
          if (rec[primary] == key || rec._key_ == key) {
            return true;
          } else {
            return false;
          }
        });
        if (temp.length > 0) {
          return temp[0];
        } else {
          return null;
        }
      },
      // Search the model and return all the record contains the given
      // key in any field
      find: function(key) {
        var self = this;
        var temp = this.filter(function(rec){
          for (var index in rec) {
            if (rec.hasOwnProperty(index)) {
              if (key == '') {
                return true;
              }
              var value = rec[index];
              if ((typeof value == 'string') && (index != '_key_')) {
                if (value.toLowerCase().indexOf(key.
                  toString().toLowerCase()) != -1) {
                  return true;
                }
              }
              if (typeof value == 'number') {
                if (value.toString().indexOf(key.toString()) != -1) {
                  return true;
                }
              }
            }
          }
          return false;
        });
        return temp;
      }
    }
  })
  return Model
})
