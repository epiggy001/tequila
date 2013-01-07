define(['../util/oo'],function (oo) {
  return {
    RunTests: function () {
      test('Create Interface', function () {
        var inf1 = oo.inf('inf1', ['function1', 'function2']);
        ok( inf1.name == "inf1", "Passed!" );
      })
    }
  }
});