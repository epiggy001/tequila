define(['../basic/oo'],function (oo) {
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
        var class3 =oo.extend(class1, {
          init:function(val1,val2){
            this._super(val1);
            this.val2 = val2;
          },
          proto:{
            method2:function(num) {
              return this._super() + this.val2;
            }
          }
        })
        var instance1 = new class1('val1');
        var instance2 = new class2('val1', 'val2');
        var instance3 = new class3('val1', 1);
        equal(instance1.property1, instance2.property1, 'Property in inherited');
        equal(instance1.method1(), instance2.method1(), 'Method is inherited');
        equal(instance2.property2, 3, 'Property is over written');
        equal(instance2.method2(), 3, 'Method is over wrritten');
        equal(instance2.property3, 4, 'New property is added');
        equal(instance2.method3(), 4, 'New method is added'); 
        ok((instance3.val1 == 'val1' && instance3.val2 == 1), '_super is set successfully in constructor');
        ok((instance3.method1() == 1 && instance3.method2() == 3), '_super is set successfully in method');
      })
       module('Decorator');
       test('Create decorator', function(){
        var class1 = oo.create({
          init: function(num) {
            this.num = num;
          },
          proto:{
            property1: 1,
            property2: 2,
            method1: function(val){
              return val
            },
            method2:function(){
              return 2
            },
            method3: function() {
              return this.num;
            }
          }
        });
        var class2 = oo.decorator(class1, function(methodName, method, args){
          if (methodName == 'method1') {
            args[0]+=1;
            return method(args);
          } else {
             return method(args) + 1;
          }
        });
        var instance2 = new class2(1);
        equal(instance2.method1(2), 3 , 'Arguments is set right');
        equal(instance2.method2(), 3 , 'Method is set right')
        equal(instance2.method3(), 2 , 'This is set right')
       })
    }
  }
});