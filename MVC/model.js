define(['../basic/oo', '../basic/util', './record'], function(oo, util, Record){
  'use strict';
   var Model = oo.create({
    init: function(opt) {
      this._store = {};
      this._record = new Record(opt.fields, opt.validate);
      this._primary = opt.primary ? opt.primary : 'ID';
    },
    stat:{
      inf: oo.inf('model', ['insert', 'remove', 'update', 'load', 'getData', 'findByKey', 'filter'])
    },
    proto: {
      _genKey: function() {
        var key = "";
        var source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < 20; i++ ) {
          key += source.charAt(Math.floor(Math.random() * source.length));
        }
        return key;
      },
      _getData: function(rec) {
        var out = util.clone(rec);
        delete out._key_;
        return out;
      },
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
      remove: function(rec) {
        if (!this._store[rec._key_]) {
          return;
        }
        delete this._store[rec._key_];
        this.trigger('onChange');
        this.trigger('onRemove', rec);
      },
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
      count: function() {
        var count = 0;
        for (var key in this._store) {
          if (this._store.hasOwnProperty(key)) {
            count ++;
          }
        }
        return count;
      },
      getData: function(){
        var out = [];
        $.each(this._store, function(key, value) {
          var tmp = util.clone(value);
          out.push(tmp);
        })
        return out;
      },
      toJSON: function(){
        var out = this.getData();
        return JSON.stringify(out);
      },
      filter: function(func) {
        var out = [];
        $.each(this._store, function(key, value) {
          var tmp = util.clone(value);
          if (func(tmp)) {
            out.push(tmp);
          };
        });
        return out;
      },
      load: function(data){
        if (data) {
          var self = this;
          this.clear();
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
      clear: function(){
        this._store = {};
      },
      findByKey:function(key){
        var temp = this.filter(function(rec){
          if (rec._key_ == key) {
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
      }
    }
  })
  return Model
})