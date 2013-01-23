QUnit.config.autostart = false;
require(['oo_test', 'util_test', 'MVC_test', 'navigator_test'],
  function () {
    QUnit.start();
    for (var i=0; i<arguments.length; i++) {
      arguments[i].RunTests();
    }
  }
);
