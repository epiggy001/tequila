define(['../MVC/MVC', '../basic/util', '../lib/jquery.mockjax'],
  function (MVC, util) {
  'use strict';
  return {
    RunTests: function(moduleName, modelClass){
      $.mockjax({
        url:  'test',
        type:'POST',
        responseText: { primary:1}
      });
      var loadData = [{ID:1, field1:'data1', field2:'data2'},
        {ID:2, field1:'data3', field2:'data4'}];
      $.mockjax({
        url:  'test',
        type:'GET',
        responseText: loadData
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
      $.mockjax({
        url:  'test',
        type: 'DELETE',
        responseText: { status:'ok'}
      });
      $.mockjax({
        url:  'test/1',
        type: 'GET',
        responseText: {ID:1, field1:'data1', field2:'data2'}
      });
      module(moduleName);
      test('Create AjaxModel', function(){
        var model = new modelClass({
          url:'test',
          fields: [{name: 'ID'}, {name: 'field1'}, {name: 'field2'}],
        });
        equal(model._url, 'test', 'Url is set');
        if (typeof model.destroy == 'function') {
          model.destroy();
        }
      });
      asyncTest('Insert a record', function(){
        expect(6)
        var model = new modelClass({
          url:'test',
          fields: [{name: 'ID'}, {name: 'field1'}, {name: 'field2'}],
        });
        model.bind('onChange', function(){
          ok(true, 'onChange');
        });
        model.bind('onInsert', function(rec){
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
            if (typeof model.destroy == 'function') {
              model.destroy();
            }
          }
        });
      });
      asyncTest('Load records', function(){
        expect(4);
        var model = new modelClass({
          url:'test',
          fields: [{name: 'ID'}, {name: 'field1'}, {name: 'field2'}],
        });
        model.bind('onChange', function(){
          ok(true, 'onChange');
        });
        model.bind('onLoad', function(){
          ok(true, 'onLoad is trigger');
        });
        var conditions = {condtion1: 'condtion1'}
        model.load({param:conditions, success: function(data, param){
          start();
          deepEqual(conditions, param, 'Param is set');
          deepEqual(data, loadData, 'Data is set');
          if (typeof model.destroy == 'function') {
            model.destroy();
          }
        }})
      });
      asyncTest('Load a record', function(){
        expect(7);
        var model = new modelClass({
          url:'test',
          fields: [{name: 'ID'}, {name: 'field1'}, {name: 'field2'}],
        });
        model.bind('onChange', function(){
          ok(true, 'onChange');
        });
        model.bind('onInsert', function(rec){
          ok(rec.ID ==  1, 'onInsert: Rec ID is set right');
          ok(rec.field1 ==  'data1', 'onInsert: Rec field1 is set right');
          ok(rec.field2 ==  'data2', 'onInsert: Rec field2 is set right');
        });
        model.loadRecord({key:1, success: function(rec){
          start();
          ok(rec.ID ==  1, 'Rec ID is set right');
          ok(rec.field1 ==  'data1', 'Rec field1 is set right');
          ok(rec.field2 ==  'data2', 'Rec field2 is set right');
          if (typeof model.destroy == 'function') {
            model.destroy();
          }
        }})
      });
      asyncTest('Update a record', function(){
        expect(5);
        var model = new modelClass({
          url:'test',
          fields: [{name: 'ID'}, {name: 'field1'}, {name: 'field2'}],
        });
        model.bind('onChange', function(){
          ok(true, 'onChange');
        });
        model.bind('onUpdate', function(rec, newRec){
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
              if (typeof model.destroy == 'function') {
                model.destroy();
              }
            }});
          }
        });
      });
      asyncTest('Remove a record', function(){
        expect(5);
        var model = new modelClass({
          url:'test',
          fields: [{name: 'ID'}, {name: 'field1'}, {name: 'field2'}],
        });
        model.bind('onChange', function(){
          ok(true, 'onChange');
        });
        model.bind('onRemove', function(rec){
          ok(rec.ID ==  1, 'onInsert is trigger');
        });
        var data = {field1:'data1', field2:'data2'}
        model.insert(data,{
          success:function(myData, rec) {
            var record= rec;
            model.remove(record, {success:function(data){
              start();
              equal(data.status, 'ok', 'Delete from server');
              if (typeof model.destroy == 'function') {
                model.destroy();
              }
            }});
            equal(model.count(), 0, 'Delete from local')
          }
        });
      });
      asyncTest('Remove all records', function(){
        expect(4);
        var model = new modelClass({
          url:'test',
          fields: [{name: 'ID'}, {name: 'field1'}, {name: 'field2'}],
        });
        model.bind('onChange', function(){
          ok(true, 'onChange');
        });
        model.bind('onClear', function(){
          ok(true, 'onClear is trigger');
        });
        var conditions = {condtion1: 'condtion1'}
        model.load({param:conditions, success: function(data, param){
          model.clear({success: function(data){
            start();
            equal(data.status, 'ok', 'Delete all records');
            if (typeof model.destroy == 'function') {
              model.destroy();
            }
          }})
        }});
      });
    }
  }
})
