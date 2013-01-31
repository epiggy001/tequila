define(['./record', './model', './EJS', './controller', './ajaxModel'], function(record, model, EJS, controller, ajaxModel){
 'use strict';
  return {
    Record: record,
    Model: model,
    AjaxModel:ajaxModel,
    EJS: EJS,
    Controller: controller
  }
})