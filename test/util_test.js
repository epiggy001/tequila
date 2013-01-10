define(['../basic/util'],function (util) {
  'use strict';
  return {
    RunTests: function () {
      module('Utility functions');
      test('Clone', function(){
        equal(util.clone(null), null, 'Clone null');
        equal(util.clone('string'), 'string', 'Clone string');
        equal(util.clone(1), 1, 'Clone number');
        var obj = {
          boo:1,
          foo:2
        }
        ok(util.clone(obj) !== obj, 'Deep clone object');
        deepEqual(util.clone(obj), {boo:1, foo:2}, 'Clone object');
        var array = [1, obj];
        ok(util.clone(array) !== array, 'Deep clone array');
        deepEqual(util.clone(array), [1,{boo:1, foo:2}], 'Clone array');
        ok(util.clone(array)[1] !== obj, 'Deep clone elements');
      });
    }
  }
})