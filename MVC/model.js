define(['../basic/oo', '../basic/util', './record'], function(oo, util, Record){
  'use strict';
   var Model = oo.create({
    init: function(opt) {
      this._store = {};
      this._record = new Record(opt.fields, opt.validate);
      this._primary = opt.primary ? opt.primary : 'ID';
      this._wrapper = opt.wrapper ? opt.wrapper : null;
    },
    stat:{
      inf: oo.inf('model', ['insert', 'remove', 'update', 'toJSON', 'filter', 'load', 'count'])
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
          if (this.wrapper) {
            var key = wrapper.insert(this._getData(rec));
            rec[this._primary] = key;
          }
        }
        return util.clone(rec);
      },
      remove: function(rec) {
        delete this._store[rec._key_];
        if (this.wrapper) {
          wrapper.remove(this._primary, rec[this._primary]);
        }
      },
      update: function(rec, obj) {
        var tmp = util.clone(rec);
        $.extend(tmp, obj)
        if (this._record.validate(tmp)) {
          this._store[rec._key_] = tmp;
          $.extend(rec, obj);
          if (this.wrapper) {
            wrapper.update(this._primary, rec);
          }
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
      }
    }
  })
  return Model
})