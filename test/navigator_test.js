define(['../basic/util', '../navigator/navigator'],function (util, navigator) {
  'use strict';
  return {
    RunTests: function () {
      module('Naviagtor', {setup: function(){
        $(window).unbind('hashchange')
          window.location.href.split('#')[0]
      }, teardown:function(){
      }});
      asyncTest('Test event rigger', function(){
        expect(1);
        var nav = new navigator({
          'test': function(){
            ok(true, 'Handler trigger');
             start()
          }
        });
        window.location.hash = 'test';
      });
      asyncTest('Test excactly match', function(){
        expect(1);
        var nav = new navigator({
          'test1': function(){
            ok(true, 'Handler trigger');
             start()
          },
          'test': function(){}
        });
        window.location.hash = 'test1';
      });
      asyncTest('Test reg match', function(){
        expect(1);
        var nav = new navigator({
          'test/{param}': function(data){
            equal(data.param, '123', 'Handler trigger');
             start()
          }
        });
        window.location.hash = 'test/123';
      });
      asyncTest('Test reg match the most ', function(){
        expect(2);
        var nav = new navigator({
          'test/': function(){},
          'test/{param1}&q={param2}': function(data){
            equal(data.param1, '123', 'Handler trigger');
            equal(data.param2, '456', 'Handler trigger');
             start()
          },
          'test/{param}/{id}': function(){}
        });
        window.location.hash = 'test/123&q=456';
      });
    }
  }
})