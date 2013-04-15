/*
 * Merge all MVC related API together
 */
define(['./record', './model', './EJS', './controller',
  './ajaxModelDecorator', './sqlModel'], 
  function(record, model, EJS, controller, ajaxModelDecorator, sqlModel){
 'use strict';
  return {
    Record: record,
    Model: model,
    AjaxModel:ajaxModelDecorator(model),
    EJS: EJS,
    Controller: controller,
    SqlModel:sqlModel,
    SqlAjaxModel:ajaxModelDecorator(sqlModel)
  }
})
