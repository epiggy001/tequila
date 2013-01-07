define(['../util/oo'],function (oo) {
  return {
    RunTests: function () {
      module('Interface');
      test('Create Interface', function () {
        var inf1 = oo.inf('inf1', ['function1', 'function2']);
        equal(inf1.name , "inf1", "Interface name is right" );
        var function3 = 0;
        var inf2 = oo.inf('inf2', ['function1', 'function2', function3])
        equal(inf2.methods.length, 2 ,'Only string is accepted as method name')
      });
      test('Validate Interface', function(){
        var inf1 = oo.inf('inf1', ['bar', 'foo']);
        var instance1 = {
          bar: function(){},
          foo: function(){}
        };
        var instance2 = {
          bar: function(){}
        };
        var instance3 = {
          bar: function(){},
          foo: 1
        }
        equal(inf1.validate(instance1), true, 'Instance is validate');
        equal(inf1.validate(instance2), false, 'Not all methods is implemented');
        equal(inf1.validate(instance3), false, 'Method must be implemented with a function')
      });
      module('Class');
      test('Create Class', function() {
        var class1 = oo.create({});
        ok(new class1(), 'Success create empty class');
        var class2 = oo.create({
          init: function(val){
            this.val = val;
          },
          stat:{
            statValue: 1,
            statMethod: function(){
              return 'method';
            }
          },
          proto:{
            value: 2,
            method: function(){
              return 'non static method'
            }
          }
        });
        var instance = new class2('value');
        var instance2 =new class2('value');
        equal(instance.val, 'value', 'Constructor is OK');
        equal(instance.value, 2 , 'Set property');
        equal(instance.method(), 'non static method', 'Set mothod');
        equal(class2.statValue, 1 , 'Set static property');
        equal(class2.statMethod(), 'method' ,'Set static method');
      });
      test('Extend Class', function(){
        var class1 = oo.create({
          init:function(val1){
            this.val1 = val1;
          },
          proto:{
            property1: 1,
            property2: 2,
            method1: function(){
              return 1
            },
            method2:function(){
              return 2
            }
          }
        });
        var class2 = oo.extend(class1, {
          inint:function(val1, val2){
            this.val1 = val1;
            this.val2 = val2
          },
          proto:{
            property2:3,
            property3:4,
            method2:function(){
              return 3
            },
            method3:function(){
              return 4;
            }
          }
        });
        var instance1 = new class1('val1');
        var instance2 = new class2('val1', 'val2');
        equal(instance1.property1, instance2.property1, 'Property in inherited');
        equal(instance1.method1(), instance2.method1(), 'Method is inherited');
        equal(instance2.property2, 3, 'Property is over written');
        equal(instance2.method2(), 3, 'Method is over wrritten');
        equal(instance2.property3, 4, 'New property is added');
        equal(instance2.method3(), 4, 'New method is added'); 
      })
    }
  }
});