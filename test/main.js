QUnit.config.autostart = false;
require(['oo_test', 'util_test', 'MVC_test', 'navigator_test', 'ajaxModel_test', 'sqlModel_test', 'sqlAjaxModel_test'],
  function () {
    QUnit.start();
    for (var i=0; i<arguments.length; i++) {
      arguments[i].RunTests();
    }
  }
);
