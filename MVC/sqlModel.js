/*
 * The model with a sql like db to store data
 */
define(['../basic/oo', '../basic/util', './model', '../lib/dom-sql'], 
  function(oo, util, model) {
  'use strict';
  var sqlModel = oo.extend(model, {
    init: function(opt) {
      this._super(opt);
      if (!opt.name) {
        opt.name = util.randomStr(10);
      }
      this.name = 'local.' + opt.name;
      DomSQL.defineTable( this.name, opt.shcema);
    },
    proto: {
      insert: function(obj) {
        var rec = this._record.create(obj);
        if (rec) {
          var temp = DomSQL.insert(this.name, [rec]);
          this.trigger('onChange');
          this.trigger('onInsert', util.clone(rec));
        }
        return rec;
      },

      remove: function(o) {
        if (typeof o != 'object') {
          var id = o;
        } else {
          var id = o[this._primary];
        }
        var sql = 'delete from ' + this.name +
          ' where ' + this._primary + ' = ' + id;
        DomSQL.query(sql);
        this.trigger('onChange');
        this.trigger('onRemove', o);
      },

      update: function(rec, obj) {
        var tmp = util.clone(rec);
        $.extend(tmp, obj)
        if (!this._record.validate || this._record.validate(tmp)) {
          var sql = '';
          $.each(obj, function(index, value) {
            sql += index + ' = ' + value + ' , ';
          });
          sql = sql.substr(0, sql.length - 3);
          sql = 'update ' + this.name + ' set ' + sql + ' where ' +
            this._primary + ' = ' + rec[this._primary];
          DomSQL.query(sql);
          this.trigger('onChange');
          this.trigger('onUpdate', util.clone(rec), util.clone(tmp));
          $.extend(rec, obj);
        }
      },

      count: function() {
        var temp = DomSQL.query('select * from ' + this.name);
        return temp.length;
      },

      getData: function(){
        var out = [];
        var temp = DomSQL.query('select * from ' + this.name);
        $.each(temp, function(key, value) {
          out.push(value);
        })
        return out;
      },

      clear: function(){
        DomSQL.query('delete from ' + this.name);
        this.trigger('onChange');
        this.trigger('onClear');
      },

      load: function(data){
        if (data) {
          var self = this;
          DomSQL.query('delete from ' + this.name);
          $.each(data, function(index, obj){
            var rec = self._record.create(obj);
            if (rec) {
              DomSQL.insert(self.name, [rec]);
            } else {
              console.error('Fail to create record' , obj)
            }
          });
          this.trigger('onChange');
          this.trigger('onLoad');
        }
      },

      destroy: function() {
        console.log(1)
        DomSQL.dropTable(this.name);
      }
    }
  });
  return sqlModel;
});
