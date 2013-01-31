define(['../basic/oo', '../basic/util', './model'], function(oo, util, model){
  'use strict';
  var ajaxModel = oo.decorator(model, {
    insert: function(methodName, instance, args){
      return instance.run();
    },
    remove: function(methodName, instance, args){
      return instance.run();
    },
    update: function(methodName, instance, args){
      return instance.run();
    },
  });
  return ajaxModel;
});