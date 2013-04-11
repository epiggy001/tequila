define(['../basic/util', '../basic/indexeddb'],function (util, db) {
  'use strict';
  return {
    RunTests: function () {
      module('Indexed db');
      asyncTest('Init database', function () {
        db.init({
          name: 'testDb', 
          version: 1,
          stores: [{
            name: 'store1',
            keypath: 'ID',
            indexes: [{name: 'field1', unique: true}, {name: 'field2', unique: false}]
          }],
          success: function(database) {
            start();
            ok(database != null, 'Success init db');
          }
        });
      });

      asyncTest('Add get and delete data', function () {
        db.init({
          name: 'testDb', 
          version: 1,
          stores: [{
            name: 'store1',
            keypath: 'ID',
            indexes: [{name: 'field1', unique: true}, {name: 'field2', unique: false}]
          }],
          success: function(database) {
            database.put('store1', {ID: 1, field1: 'field1', field2: 'field2'}, function(event){
              start();
              ok(true, 'Add record successfully');
              stop();
              database.get('store1', 1 , function(rec) {
                start();
                ok(rec.ID == 1, 'Get record successfully')
                database.delete('store1', 1, function(event){
                  start();
                  ok(true, 'Delete record successfully');
                });
              })
            });
          }
        });
      });

      asyncTest('Add and get multiple data', function () {
        db.init({
          name: 'testDb', 
          version: 1,
          stores: [{
            name: 'store1',
            keypath: 'ID',
            indexes: [{name: 'field1', unique: true}, {name: 'field2', unique: false}]
          }],
          success: function(database) {
            database.put('store1', [{ID: 1, field1: 'field1', field2: 'field2'},
              {ID: 2, field1: 'field3', field2: 'field2'}], function(event){
              start();
              ok(true, 'Add records successfully');
              stop();
              database.getAll('store1', function(recs) {
                start();
                ok(recs.length == 2, 'Get records successfully');
              })
              database.getIndex('store1', 'field1', 'field3',function(recs) {
                start();
                equal(recs.length , 1, 'Get records with index successfully');
              })
              database.filter('store1', 'field6',function(recs) {
                start();
                equal(recs.length , 0, 'Filter all data out');
              });
              database.filter('store1', 'field2',function(recs) {
                start();
                equal(recs.length , 2, 'Filter nothing out');
              });
              database.filter('store1', '3',function(recs) {
                start();
                equal(recs.length , 1, 'Filter part out');
              })
            });
          }
        });
      });
    }
  }
});