define(['../MVC/MVC', '../basic/util'],function (MVC, util) {
  'use strict';
  var setModel = function(name) {
    var model = new MVC.SqlModel({
      fields: [{name: 'id'}, {name: 'field1'}, {name: 'field2'}],
      primary: 'id',
      name: name,
      shcema: [
        'id AUTO_INC',
        'field1',
        'field2'
      ]
    });
    return model
  }

  var clearModel = function(name) {
    DomSQL.dropTable(name)
  }
  return {
    RunTests: function(){
      var model;
      module('sqlModel');
      test('Create sqlModel', function(){
        var model = setModel('testTable');
        equal(DomSQL.tableExists('local.testTable'), true, 'Model is init');
        clearModel('testTable');
      });

      test('Insert to sqlModel', function(){
        var model = setModel('testTable1');
        var temp = model.insert({field1:1, field2: 'field'});
        deepEqual(temp, {id: 1, field1:1, field2: 'field'})
        clearModel('testTable1');
      });

      test('Delete from sqlModel', function(){
        var model = setModel('testTable2');
        var rec1 = model.insert({field1:1, field2: 'field1'});
        var rec2 = model.insert({field1:2, field2: 'field2'});
        model.remove(rec1);
        var temp = DomSQL.query('select * from local.testTable2');
        equal(temp.length, 1 , 'Delete from model by rec');
        model.remove(rec2.id);
        var temp = DomSQL.query('select * from local.testTable2');
        equal(temp.length, 0 , 'Delete from model by rec');
        clearModel('testTable2');
      });

      test('Update from sqlModel', function(){
        var model = setModel('testTable3');
        var rec = model.insert({field1:1, field2: 'field1'});
        model.update(rec, {field1: 2});
        var temp = DomSQL.query('select * from local.testTable3 where id =' +
          rec.id);
        equal(rec, temp[0] , 'Update form sqlModel')
        clearModel('testTable3');
      });

      test('Count record', function() {
        var model = setModel('testTable4');
        ok(model.count()==0, 'Init state is ok');
        var data1 = {field1: 'field1'};
        var data2 = {field1: 'field1', field2: 2};
        var rec1 = model.insert(data1);
        var rec2 = model.insert(data2);
        ok(model.count()==2, 'State after insert is ok');
        model.remove(rec1);
        ok(model.count()==1, 'State after remove is ok');
        clearModel('testTable4');
      });

      test('Get all records', function() {
        var model = setModel('testTable5');
        var data1 = {field1: 'field1'};
        var data2 = {field1: 'field1', field2: 2};
        var rec1 = model.insert(data1);
        var rec2 = model.insert(data2);
        var temp = model.getData();
        deepEqual(temp, [rec1, rec2] , 'Get all data from model');
        clearModel('testTable5');
      });

      test('Clear all records', function() {
        var model = setModel('testTable6');
        var data1 = {field1: 'field1'};
        var data2 = {field1: 'field1', field2: 2};
        var rec1 = model.insert(data1);
        var rec2 = model.insert(data2);
        model.clear();
        deepEqual(model.count(), 0 , 'Get all data from model');
        clearModel('testTable6');
      });

      test('Load records', function(){
        var model = setModel('testTable7');
        var data = [{field1: 'field1'}, {field1: 'field1', field2: 2}];
        model.load(data);
        equal(model.count() , 2, 'Load data into store');
        clearModel('testTable7');
      });
    }
  }
})
