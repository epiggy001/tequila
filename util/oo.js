define([], function(){
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
        var result = true;
        for (var i = 0; i<this.methods.length; i++) {
          if (!instance[this.methods[i]] || (typeof instance[this.methods[i]] != 'function')) {
            result = false;
            break;
          }
        }
        return result;
      }
      return inf
    },
    create: function(obj) {
      var klass;
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
      klass.prototype = {};
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
      
    }
  })
})
