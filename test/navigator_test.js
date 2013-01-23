define(['../basic/util', '../navigator/navigator'],function (util, navigator) {
  'use strict';
  return {
    RunTests: function () {
      module('Naviagtor');
      test('Test check brace', function(){
        var nav = new navigator();
        var result = navigator._checkBrace('/test/{module}/{id}&q={param1}');
        navigator._match('/test/{module}/{id}&q={param1}&q=1');
        deepEqual(result,[0,6,14,15,19,22,30,30], 'Brace is indicated');
      });
    }
  }
})