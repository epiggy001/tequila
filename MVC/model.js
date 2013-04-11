define(['../basic/oo', '../basic/util', './record'], function(oo, util, Record){
  'use strict';
   var Model = oo.create({
    init: function(opt) {
      this._store = {};
      this._record = new Record(opt.fields, opt.validate);
      this._primary = opt.primary ? opt.primary : 'ID';
    },
    stat:{
      inf: oo.inf('model', ['insert', 'remove', 'update', 'load', 'getData', 'findByKey', 'filter', 'find'])
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
        //Todo add support to remove by key
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
        $.each(this.getData(), function(key, value) {
          if (func(value)) {
            out.push(value);
          };
        });
        return out;
      },
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
      clear: function(){
        this._store = {};
        this.trigger('onChange');
        this.trigger('onClear');
      },
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
                if (value.toLowerCase().indexOf(key.toString().toLowerCase()) != -1) {
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