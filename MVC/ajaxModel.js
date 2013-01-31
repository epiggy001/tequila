define(['../basic/oo', '../basic/util', './model'], function(oo, util, model){
  'use strict';
  var ajaxModel = oo.decorator(model, {
    insert: function(methodName, instance, args){
      var rec = args[0];
      var callbacks = args.length > 1 ? args[1] : {};
      var self = this;
      $.ajax({
        url: this._url,
        type:'POST',
        data: rec,
        dataType: 'json',
        success:function(data, textStatus , jqXHR){
          rec[self._primary] = data.primary;
          var record = instance.run();
          if (callbacks.success && (typeof callbacks.success == 'function')) {
            callbacks.success.call(self, data, record);
          }
        },
        error: function(qXHR, textStatus, errorThrown){
          if (callbacks.error && (typeof callbacks.error == 'function')) {
            callbacks.success.call(self, rec, textStatus, errorThrown);
          }
        }
      })
    },
    remove: function(methodName, instance, args){
      var rec = args[0];
      var callbacks = args.length > 1 ? args[1] : {};
      instance.run();
      var self = this;
      $.ajax({
        url: this._url + '/'+ rec[this._primary],
        type:'DELETE',
        dataType: 'json',
        success:function(data, textStatus , jqXHR){
          if (callbacks.success && (typeof callbacks.success == 'function')) {
            callbacks.success.call(self, data);
          }
        },
        error: function(qXHR, textStatus, errorThrown){
          if (callbacks.error && (typeof callbacks.error == 'function')) {
            callbacks.success.call(self, rec, textStatus, errorThrown);
          }
        }
      })
    },
    update: function(methodName, instance, args){
      var rec = args[0];
      var obj = args.length > 1 ? args[1] : {};
      var callbacks = args.length > 2 ? args[2] : {};
      var self = this;
      $.ajax({
        url: this._url + '/' + rec[self._primary],
        type:'PUT',
        data:obj,
        dataType: 'json',
        success:function(data, textStatus , jqXHR){
          instance.run();
          if (callbacks.success && (typeof callbacks.success == 'function')) {
            callbacks.success.call(self, data, util.clone(rec));
          }
        },
        error: function(qXHR, textStatus, errorThrown){
          if (callbacks.error && (typeof callbacks.error == 'function')) {
            callbacks.success.call(self, rec, textStatus, errorThrown);
          }
        }
      });
    },
  });
  ajaxModel = oo.extend(ajaxModel, {
    init: function(opt){
      this._super(opt);
      this._url = opt.url;
    }
  })
  return ajaxModel;
});