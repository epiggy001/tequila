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
    AjaxModel:ajaxModelDecorator.apply(model),
    EJS: EJS,
    Controller: controller,
    SqlModel:sqlModel,
    SqlAjaxModel:ajaxModelDecorator.apply(sqlModel)
  }
})
