// Copyright 2013 Clustertech Limited. All rights reserved.
// Clustertech Cloud Management Platform.
//
// Author: jackeychen@clustertech.com

define(['../MVC/MVC', './ajaxModelDecorator_test'],
  function (MVC, TestDecorator) {
  'use strict';
  return {
    RunTests: function(){
      TestDecorator.RunTests('AjaxModel', MVC.AjaxModel);
    }
  }
})
