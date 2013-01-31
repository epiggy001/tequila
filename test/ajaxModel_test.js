define(['../MVC/MVC', '../basic/util', '../lib/jquery.mockjax'],function (MVC, util) {
  'use strict';
  return {
    RunTests: function(){
      $.mockjax({
        url:  'test',
        type:'POST',
        responseText: { primary:1}
      });
      $.mockjax({
        url:  'test/1',
        type: 'PUT',
        responseText: { status:'200'}
      });
      $.mockjax({
        url:  'test/1',
        type: 'DELETE',
        responseText: { status:'ok'}
      });
      module('AjaxModel');
      test('Create AjaxModel', function(){
        var model = new MVC.AjaxModel({
          url:'test',
          fields: [{name: 'ID'}, {name: 'field1'}, {name: 'field2'}],
        });    
        equal(model._url, 'test', 'Url is set');
      });
      asyncTest('Insert a record', function(){
        expect(6)
        var model = new MVC.AjaxModel({
          url:'test',
          fields: [{name: 'ID'}, {name: 'field1'}, {name: 'field2'}],
        });
        model.bind('onChange', function(){
          ok(true, 'onChange');
        });
        model.bind('onInsert', function(event, rec){
          ok(rec.ID ==  1, 'onInsert is trigger');
        });
        var data = {field1:'data1', field2:'data2'}
        model.insert(data,{
          success:function(myData, rec) {
            start();
            ok(myData.primary , 1, 'Response is right');
            ok(rec.ID ==  1, 'Rec ID is set right');
            ok(rec.field1 ==  'data1', 'Rec field1 is set right');
            ok(rec.field2 ==  'data2', 'Rec field2 is set right');
          }
        });
      });
      asyncTest('Update a record', function(){
        expect(5);
        var model = new MVC.AjaxModel({
          url:'test',
          fields: [{name: 'ID'}, {name: 'field1'}, {name: 'field2'}],
        });
        model.bind('onChange', function(){
          ok(true, 'onChange');
        });
        model.bind('onUpdate', function(event, rec, newRec){
          equal(newRec.field2, 'data3', 'onInsert is trigger');
        });
        var data = {field1:'data1', field2:'data2'}
        model.insert(data,{
          success:function(myData, rec) {
            var record= rec;
            model.update(record, {field2: 'data3'}, {success:function(data){
              start();
              equal(record.field2, 'data3', 'Update at local')
              equal(data.status, '200', 'Update at server');
            }});
          }
        });
      });
      asyncTest('Remove a record', function(){
        expect(5);
        var model = new MVC.AjaxModel({
          url:'test',
          fields: [{name: 'ID'}, {name: 'field1'}, {name: 'field2'}],
        });
        model.bind('onChange', function(){
          ok(true, 'onChange');
        });
        model.bind('onRemove', function(event, rec){
          ok(rec.ID ==  1, 'onInsert is trigger');
        });
        var data = {field1:'data1', field2:'data2'}
        model.insert(data,{
          success:function(myData, rec) {
            var record= rec;
            model.remove(record, {success:function(data){
              start();
              equal(data.status, 'ok', 'Delete from server');
            }});
            equal(model.count(), 0, 'Delete from local')
          }
        });
      });
    }
  }
})