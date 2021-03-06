/*
 * Extend a model with ajax support. The http API is restful
 * For exmaple:
 *  var decorator = require('./ajaxModelDecorator');
 *  var model = require('./model');
 *  var ajaxModel = decorator(model);
 *  var  AjaxModel = new ajaxModel({
 *   url : 'base/url',
 *   ....
 *  })
 * */
define(['../basic/oo', '../basic/util'], function(oo, util){
 'use strict';
  var decorator = new oo.decorator({
    // Insert URL url should like
    // http://base/url/job (POST)
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
            callbacks.error.call(self, rec, textStatus, errorThrown);
          }
        }
      })
    },
    // Delete URL url should like
    // http://base/url/job/id (DELETE)
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
            callbacks.error.call(self, rec, textStatus, errorThrown);
          }
        }
      })
    },
    // Delete URL url should like
    // http://base/url/job (PUT)
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
            callbacks.error.call(self, rec, textStatus, errorThrown);
          }
        }
      });
    },
    clear: function(methodName, instance, args){
      var callbacks = args.length > 0 ? args[0] : {};
      instance.run();
      var self = this;
      $.ajax({
        url: this._url,
        type:'DELETE',
        dataType: 'json',
        success:function(data, textStatus , jqXHR){
          if (callbacks.success && (typeof callbacks.success == 'function')) {
            callbacks.success.call(self, data);
          }
        },
        error: function(qXHR, textStatus, errorThrown){
          if (callbacks.error && (typeof callbacks.error == 'function')) {
            callbacks.error.call(self, rec, textStatus, errorThrown);
          }
        }
      })
    },
  });

  var temp = decorator.apply;
  decorator.apply = function(model){
    var newModel = oo.extend(model, {
      init: function(opt) {
        this._super(opt);
        this._url = opt.url;
      },
      proto: {
        load: function(opt){
          var param = opt.param ? opt.param : null;
          var success= opt.success ? opt.success : null;
          var error= opt.error ? opt.error : null;
          var self = this;
          $.ajax({
            url: this._url,
            type:'GET',
            data:param,
            dataType: 'json',
            success:function(data, textStatus , jqXHR){
              model.prototype.load.call(self, data);
              if (success && (typeof success == 'function')) {
                  success.call(self, data, param);
              }
            },
            error: function(qXHR, textStatus, errorThrown){
              if (error && (typeof error == 'function')) {
                error.call(self, textStatus, errorThrown);
              }
            }
          });
        },
        loadRecord:function(opt) {
          var key = opt.key ? opt.key : null;
          if (!key) {
            console.error('Key must be set');
            return;
          }
          var success= opt.success ? opt.success : null;
          var error= opt.error ? opt.error : null;
          var self = this;
          $.ajax({
            url: this._url + '/' + key,
            type:'GET',
            dataType: 'json',
            success:function(data, textStatus , jqXHR){
              var rec = model.prototype.insert.call(self, data);
              if (success && (typeof success == 'function')) {
                success.call(self, util.clone(rec));
              }
            },
            error: function(qXHR, textStatus, errorThrown){
              if (error && (typeof error == 'function')) {
                error.call(self, textStatus, errorThrown);
              }
            }
          })
        }
      }
    });
    return temp.call(decorator,newModel);
  }
  return decorator;
});
