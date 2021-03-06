define(['../basic/oo'],function (oo) {
  'use strict';
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
        equal(inf1.validate(instance2),
          false, 'Not all methods is implemented');
        equal(inf1.validate(instance3),
          false, 'Method must be implemented with a function')
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
      test('Basic functions', function(){
        var class1 = oo.create({
          proto: {
            val1: 1,
            val2:2
          }
        });
        var instance = new class1();
        var func1 = function(){
          instance.val1 += 1;
        }
        var func2 = function() {
          instance.val2 += 1;
        }
        var s = 0;
        var sum = function() {
          for (var i=0; i<arguments.length; i++) {
            s+=arguments[i];
          }
        }
        instance.bind('event1', func1);
        instance.bind('event1', func2);
        instance.bind('event2', sum);
        instance.trigger('event1');
        instance.trigger('event2', 1, 2, 3);
        equal(s, 6, 'Arguments is passed');
        equal(instance.val1, 2, 'Trigger func1');
        equal(instance.val2, 3, 'Trigger func2');
        instance.unbind('event1', func1);
        instance.trigger('event1');
        equal(instance.val1, 2, 'func1 unbinded');
        equal(instance.val2, 4, 'Trigger func2');
        instance.unbind('event1');
        instance.trigger('event1');
        equal(instance.val2, 4, 'func2 unbinded');
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
        equal(instance1.property1, instance2.property1,
          'Property in inherited');
        equal(instance1.method1(), instance2.method1(), 'Method is inherited');
        equal(instance2.property2, 3, 'Property is over written');
        equal(instance2.method2(), 3, 'Method is over wrritten');
        equal(instance2.property3, 4, 'New property is added');
        equal(instance2.method3(), 4, 'New method is added'); 
        ok((instance3.val1 == 'val1' && instance3.val2 == 1),
          '_super is set successfully in constructor');
        ok((instance3.method1() == 1 && instance3.method2() == 3),
          '_super is set successfully in method');
      })
       module('Decorator');
       test('Create Decorator', function(){
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
        var decorator = new oo.decorator({
          method1: function(methodName, instance, args){
            args[0]+=1;
            return instance.run();
          },
          method2: function(methodName, instance, args){
            return true;
          },
          method3: function(methodName, instance, args){
             return instance.run() + 1;
          },
        });
        var class2 = decorator.apply(class1);
        var instance2 = new class2(1);
        equal(instance2.method1(2), 3 , 'Arguments is not read-only');
        equal(instance2.method2(), true , 'Method is set right')
        equal(instance2.method3(), 2 , 'This is set right')
       })
    }
  }
});
