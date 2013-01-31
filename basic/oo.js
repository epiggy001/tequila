define(['./util'], function(util){
  'use strict';
  return ({
    inf: function(name, methods){
      var inf = {};
      inf.methods=[];
      inf.name = (typeof name === 'string') ? name : 'unamed interface';
      for (var i = 0; i<methods.length; i++) {
        if (typeof methods[i] === 'string') {
          inf.methods.push(methods[i])
        }
      }
      inf.validate = function(instance){
        if (!instance) {
          return false;
        }
        var result = true;
        for (var i = 0; i<this.methods.length; i++) {
          if (!instance[this.methods[i]] || (typeof instance[this.methods[i]] != 'function')) {
            result = false;
            console.error(this.methods[i] + ' must be implemented for interface: ' + this.name);
            break;
          }
        }
        return result;
      }
      return inf
    },
    create: function(obj) {
      var klass;
      var constructor
      if (obj.init && (typeof obj.init == 'function')) {
        klass = obj.init;
      } else {
        klass = function(){};
      }
      if (obj.stat && (typeof obj.stat == 'object')) {
        for (var key in obj.stat) {
          if (obj.stat.hasOwnProperty(key)) {
            klass[key] = obj.stat[key];
          }
        }
      }
      klass.prototype = {
        bind:function(ename, handler){
          if (!this._callbacks) {
            this._callbacks = {};
          }
          if (!this._callbacks[ename]) {
            this._callbacks[ename] = $.Callbacks();
          }
          this._callbacks[ename].add(handler);
        },
        unbind:function(ename, handler){
          if (this._callbacks[ename]) {
            if (handler == null) {
              this._callbacks[ename] = null;
              return;
            }
            this._callbacks[ename].remove(handler);
          }
        },
        trigger:function(){
          if (arguments.length > 0 ) {
           var ename = arguments[0];
          } else {
            return;
          }
          if ((this._callbacks) && (this._callbacks[ename])) {
            this._callbacks[ename].fire.apply(this, arguments);
          }
        }
      };
      if (obj.proto && (typeof obj.proto == 'object')) {
        for (var key in obj.proto) {
          if (obj.proto.hasOwnProperty(key)) {
            if (typeof obj.proto[key] == 'object') {
              console.warn('Object or array for property of class is copy by refrence. You\'beeter set it in init()')
            } 
            klass.prototype[key] = obj.proto[key];
          }
        }
      }
      return klass;
    },
    extend: function(parent, obj) {
      var klass;
      var init;
      if (obj.init && (typeof obj.init == 'function')) {
        init = obj.init;
      } else {
        init = function(){};
      }
      klass = function(){
        this._super = parent;
        init.apply(this, arguments)
      };
      // Static methids and properties cannot be inherited
      if (obj.stat && (typeof obj.stat == 'object')) {
        for (var key in obj.stat) {
          if (obj.stat.hasOwnProperty(key)) {
            klass[key] = obj.stat[key];
          }
        }
      }
      var tmp = function(){}
      tmp.prototype = parent.prototype;
      klass.prototype =new tmp();
      if (obj.proto && (typeof obj.proto == 'object')) {
        for (var key in obj.proto) {
          if (obj.proto.hasOwnProperty(key)) {
            if (typeof obj.proto[key] == 'object') {
              console.warn('Object or array for property of class is copy by refrence. You\'beeter set it in init()')
              klass.prototype[key] = obj.proto[key];
            } else if ((typeof obj.proto[key] == 'function') && (typeof parent.prototype[key] == 'function')) {
              klass.prototype[key] = (function(_super,method){
                return function(){
                  var temp = this._super;
                  this._super = _super;
                  var result = method.apply(this, arguments);
                  this._super = temp;
                  return result;
                }
              }(parent.prototype[key], obj.proto[key]))
            } else {
              klass.prototype[key] = obj.proto[key];
            }
          }
        }
      }
      return klass;
    },
    decorator: function(target, opt){
      var klass = function() {
        console.log(this);
        target.apply(this, arguments);
      };
      var tmp = function(){};
      tmp.prototype = target.stat;
      klass.stat = new tmp();
      tmp.prototype = target.prototype;
      klass.prototype = new tmp();
      if (opt) {
        $.each(opt,function(key, func){
          if (typeof func == 'function') {
            if (typeof klass.prototype[key] == 'function'){
              klass.prototype[key] = (function (method, methodName){
                return function(){
                  var args = arguments
                  var self = this;
                  var instance = {};
                  instance.run = function(){
                    return method.apply(self, args)
                  }
                  return func.call(this, methodName, instance, arguments)
                }
              }(klass.prototype[key], key))
            }
          }
        });
      }
      return klass;
    }
  })
})
