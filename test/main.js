QUnit.config.autostart = false;
require(['oo_test'],
  function (oo_test) {
    QUnit.start();
    oo_test.RunTests();
  }
);
