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
        deepEqual(record1._opt,
        {field1:{def:1}, field2:{def:null}}, 'Test recored fields');
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
        var rec1 = record1.create({field1: 2, field2: 11, field3: 1});
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
        deepEqual(model1._record, new MVC.Record([{name: 'key'},
          {name: 'field1'}, {name: 'field2', def: 1}], validation),
          'Record is created');
        deepEqual(model1._primary, 'ID', 'Pirmary Key is ID');
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
        deepEqual(model1._store[rec1._key_], tmp ,
          'Return record set to read only');
        var rec2 = model1.insert(data2);
        equal(rec2, null, 'Reject invalidate record');
      });
      test('Find by key', function(){
        var data1 = {key: 1, field1: 'field1'};
        var rec1 = model1.insert(data1);
        deepEqual(model1.findByKey(rec1._key_), rec1 , 'Find by key');
        deepEqual(model1.findByKey("123412"), null , 'Test wrong key');
      });
      test('Find', function(){
        var data1 = {key: 123, field1: 'num'};
        var data2 = {key: 145, field1: 'number'};
        model1.insert(data1);
        model1.insert(data2);
        equal(model1.find(1).length, 2 , 'Find with number');
        equal(model1.find(12).length, 1 , 'Find with number');
        equal(model1.find('num').length, 2 , 'Find with string');
        equal(model1.find('numb').length, 1 , 'Find with string');
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
        var out = model1.update(rec, {field1: 'field2'});
        ok(rec.key == 1 && rec.field1 == 'field2' && rec.field2 == 1,
          'Return record is updated');
        deepEqual(model1._store[rec._key_], rec, 'Update success');
        model1.update(rec ,{field2: -1});
        ok(rec.key == 1 && rec.field1 == 'field2' && rec.field2 == 1,
          'Return record is not updated');
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
      });
      test('Clear store', function(){
        var data1 = {key: 1, field1: 'field1'};
        var data2 = {key: 2, field1: 'field1', field2: 2};
        var rec1 = model1.insert(data1);
        var rec2 = model1.insert(data2);
        model1.clear();
        ok(model1.count() == 0, 'Clear all data');
      });
      test('Load records', function(){
        var data = [{key: 1, field1: 'field1'},
          {key: 2, field1: 'field1', field2: 5}];
        model1.load(data);
        equal(model1.count() , 2, 'Load data into store')
        data = [{key: 1, field1: 'field1'},
          {key: 2, field1: 'field1', field2: -1}];
        model1.load(data);
        equal(model1.count() , 1, 'Load data into store with validation');
      });
      test('Filter record', function(){
        var data1 = {key: 1, field1: 'field1'};
        var data2 = {key: 2, field1: 'field1', field2: 2};
        var rec1 = model1.insert(data1);
        var rec2 = model1.insert(data2);
        var func = function(rec){
          if (rec.field2 > 1) {
            return  true;
          }
          return false;
        }
        var out = model1.filter(func);
        ok(out.length, 1 , 'Get right number of records');
        deepEqual(out[0], rec2 , 'Get right record');
      });
      test('Model to JSON', function(){
        var data1 = {key: 1, field1: 'field1'};
        var data2 = {key: 2, field1: 'field1', field2: 2};
        var rec1 = model1.insert(data1);
        var rec2 = model1.insert(data2);
        ok(model1.toJSON() , [{"key":1,"field1":"field1","field2":1},
          {"key":2,"field1":"field1","field2":2}],
          'JSON format is right');
      });
      test('Trigger Event', function(){
        expect(7);
        model1.bind('onChange', function(){
          ok(true, 'onChange');
        });
        model1.bind('onInsert', function(rec){
          deepEqual(rec, this._store[rec._key_], 'OnInsert');
        });
        model1.bind('onUpdate', function(old, now){
          deepEqual(tmp, old, 'onUpdate: old');
          ok(now.field2 == 3, 'onUpdate: new');
        });
        model1.bind('onRemove', function(rec){
          deepEqual(rec1, rec);
        });
        var data1 = {key: 2, field1: 'field1', field2: 2};
        var rec1 = model1.insert(data1);
        var tmp = util.clone(rec1);
        model1.update(rec1, {field2: 3});
        model1.remove(rec1);
      });
      module('MVC: EJS');
      test('Render EJS', function(){
        var tmpl = new MVC.EJS({url: 'test/hello.ejs'}).
          render({message: 'hello, world'});
        equal($.trim(tmpl) , 'hello, world', 'Render template')
      });
      module('MVC: Controller', {
        setup:function(){
          $("#qunit-fixture").append("<div id='target'></div>");
        }
      });
      test('Create Controller', function(){
        expect(16);
        var model = new MVC.Model({
          fields: [{name: 'field1', primary: true}],
        });
        model.insert({field1: 1});
        model.insert({field1: 2});
        var controller = new MVC.Controller({
          model: model,
          url: 'test/test.ejs',
          renderTo: 'target',
          events:{
            'BeforeRender': function(){
              ok(true, 'BeforeRender Event trigger');
            },
            'OnRender': function(){
              ok(true, 'OnRender trigger');
            },
            'Customize': function(){
              equal(this.model, model, 'Test key word of this');
            }
          },
          handlers: [{
            event: 'click',
            selector: '.item',
            handler: function(event){
              equal(this, controller, 'This is set');
              ok(true, 'Div click is triggered');
            }
          }]
        });
        controller.render();
        $('.item').trigger('click');
        controller.trigger('Customize');
        equal(controller.model, model, 'Set model');
        deepEqual(controller.data, model.getData(), 'Set data');
        equal($('#target').html(),
          '<div class="item">1</div>\n\n   <div class="item">2</div>',
          'Render template');
        controller.renderWithFilter(function(rec){
          if (rec.field1 > 1) {
            return true;
          } else {
            return false;
          }
        });
        equal($('#target').html(), '<div class="item">2</div>',
          'Render template with filter');
        controller.render([{field1:3}]);
        equal($('#target').html(), '<div class="item">3</div>',
          'Render template with data');
      });

      test('Create Search with filter', function(){
        var model = new MVC.Model({
          fields: [{name: 'field1', primary: true}],
        });
        model.insert({field1: 1});
        model.insert({field1: 2});
        var controller = new MVC.Controller({
          model: model,
          url: 'test/test.ejs',
          renderTo: 'target',
        });
        controller.renderWithSearch('2');
        equal($('#target').html(), '<div class="item">2</div>',
          'Render template with search');
      });

      test('Create handler with simplified format', function(){
        expect(4);
        var model = new MVC.Model({
          fields: [{name: 'field1', primary: true}],
        });
        model.insert({field1: 1});
        model.insert({field1: 2});
        var controller = new MVC.Controller({
          model: model,
          url: 'test/test.ejs',
          renderTo: 'target',
          handlers: {
            ".item a click": function(event){
              equal(this, controller, 'This is set');
              ok(true, 'Div click is triggered');
            }
          }
        });
        controller.render();
        var a = $('<a>');
        $('.item').append(a);
        $('.item a').trigger('click');
      });
    }
  }
})
