define([], function(){
  return ({
    inf: function(name, methods){
      var inf = {};
      inf.methods=[];
      inf.name = (typeof name === 'string') ? name : 'unamed interface';
      for (var i =0; i<methods.length; i++) {
        if (typeof methods[i] === 'string') {
          inf.methods.push(methods[i])
        }
        if (inf.methods.length === 0) {
          console.error('No methods is defined in interface')
          return null;
        }
      }
      inf.validate = function(){
        return '';
      }
      return inf
    }
  })
})
