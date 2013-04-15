define(['../MVC/MVC', './ajaxModelDecorator_test'],
  function (MVC, TestDecorator) {
  'use strict';
  return {
    RunTests: function(){
      TestDecorator.RunTests('SqlAjaxModel', MVC.SqlAjaxModel);
    }
  }
})
