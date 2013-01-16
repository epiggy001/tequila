define(['../MVC/MVC', '../basic/util'],function (MVC, util) {
  'use strict';
  return {
    RunTests: function () {
      module('MVC: Record');
      test('Init a Record', function(){
        var validate = function(rec) {
          if (!rec.field2 || rec.field2 < 10) {
            return false;
          }
          return true;
        };
        var record1 = new MVC.Record(
          [{name:'field1', def: 1}, {name:'field2'}],
          validate
        );
        deepEqual(record1._opt, {field1:{def:1}, field2:{def:null}}, 'Test recored fields');
        equal(record1.validate, validate, 'Test Validation function');
      });
      test('Create a Record', function(){
        var validate = function(rec) {
          if (!rec.field2 || rec.field2 < 10) {
            return false;
          }
          return true;
        };
        var record1 = new MVC.Record(
          [{name:'field1', def: 1}, {name:'field2'}],
          validate
        );
        var rec1 = record1.create({field1: 2, field2: 11, field3: 1}, 'Test Field Checking');
        deepEqual(rec1, {field1: 2, field2: 11})
        var rec1 = record1.create({field2: 11});
        deepEqual(rec1, {field1: 1, field2: 11}, 'Test Default Value');
        var rec1 = record1.create({field2: 9});
        equal(rec1, null, 'Check Validation');
      });
      var model1;
      var validation = function(rec) {
        if (rec.field2 < 0) {
          return false;
        }
        return true;
      }
      var fields = [{name: 'key'}, {name: 'field1'}, {name: 'field2', def: 1}];
      module('MVC: model', {
        setup: function() {
          model1 = new MVC.Model({
            fields: fields,
            validate: validation
          });
        }
      });
      test('Create Model', function(){
        deepEqual(model1._record, new MVC.Record([{name: 'key'}, {name: 'field1'}, {name: 'field2', def: 1}], validation),
          'Record is created');
        deepEqual(model1._primary, 'ID', 'Pirmary Key is ID');
        deepEqual(model1._wrapper, null, 'Wrapper is set to null');
        var model2 = new MVC.Model({
          fields: [{name: 'key'}, {name: 'field1'}, {name: 'field2', def: 1}],
          validate: validation,
          primary: 'myKey'
        });
        deepEqual(model2._primary, 'myKey', 'Pirmary Key is set');
      });
      test('Insert record', function(){
        var data1 = {key: 1, field1: 'field1'};
        var data2 = {key: 2, field1: 'field1', field2: -1};
        var rec1 = model1.insert(data1);
        deepEqual(model1._store[rec1._key_], rec1 , 'Insert into store');
        var tmp = util.clone(rec1);
        rec1.field1 ='feild2';
        deepEqual(model1._store[rec1._key_], tmp , 'Return record set to read only');
        var rec2 = model1.insert(data2);
        equal(rec2, null, 'Reject invalidate record');
      });
      test('Remove record', function(){
        var data1 = {key: 1, field1: 'field1'};
        var data2 = {key: 2, field1: 'field1', field2: 2};
        var rec1 = model1.insert(data1);
        var rec2 = model1.insert(data2);
        model1.remove(rec1);
        equal(model1._store[rec1._key_], null, 'Remove record');
        deepEqual(model1._store[rec2._key_], rec2 , 'No side effect');
      });
      test('Update record', function(){
        var data = {key: 1, field1: 'field1'};
        var rec = model1.insert(data);
        model1.update(rec, {field1: 'field2'});
        ok(rec.key == 1 && rec.field1 == 'field2' && rec.field2 == 1, 'Return record is updated');
        deepEqual(model1._store[rec._key_], rec, 'Update success');
        model1.update(rec ,{field2: -1});
        ok(rec.key == 1 && rec.field1 == 'field2' && rec.field2 == 1, 'Return record is not updated');
        deepEqual(model1._store[rec._key_], rec, 'Reject success');
        var tmp = util.clone(rec);
        rec.field1 = 'field3';
        deepEqual(model1._store[rec._key_], tmp, 'No side effect');
      });
      test('Count record', function(){
        ok(model1.count()==0, 'Init state is ok');
        var data1 = {key: 1, field1: 'field1'};
        var data2 = {key: 2, field1: 'field1', field2: 2};
        var rec1 = model1.insert(data1);
        var rec2 = model1.insert(data2);
        ok(model1.count()==2, 'State after insert is ok');
        model1.remove(rec1);
        ok(model1.count()==1, 'State after remove is ok');
      })
    }
  }
})