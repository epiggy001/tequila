/*
 * Define the controller class there. User can bind add events
 * and render a view here
 * For example
 * var controller = require('./controller')
 * var jobController = new controller({
 *   model: myModel // Set related model,
 *   tmpl: 'joblist.ejs' //Set related the view template,
 *   renderTo: 'jobList' // Id of the DOM element to render the view,
 *   events: {
 *    event1: func1,
 *    event2: func2
 *   } // Define evnets and handlers for related view,
 *   handlers: {
 *    '.item click': function(event){
 *      ...
 *    },
 *    '#add click': function(event){
 *      ...
 *    }
 *   } // Add handlers to the related view
 * })
 */
define(['../basic/oo', '../basic/util', './EJS'], function(oo, util, EJS){
  'use strict';
  var Controller = oo.create({
    init: function(opt) {
      this.model = opt.model ? opt.model : null;
      if (!this.model) {
        this.data = opt.data ? opt.data : {};
      } else {
        this.data = this.model.getData();
      }
      this._tmpl = opt.tmpl;
      this._url = opt.url;
      this._renderTo = opt.renderTo;
      var self = this;
      if (opt.events) {
        $.each(opt.events, function(key, value) {
          if ((typeof key == 'string') && (typeof value == 'function')) {
            self.bind(key, $.proxy(value, self));
          }
        });
      }
      this._handlers = opt.handlers ? opt.handlers : [];
    },
    proto: {
      _setData: function(data, filter) {
          this.data = data;
      },
      _render: function(input){
        var self = this;
        var html = this._tmpl.render({data: input});
        var elem = $(html);
        this.trigger('BeforeRender');
        $('#' + this._renderTo).html('').append(elem);
        var self = this;
        $.each(this._handlers, function(key, rec){
          if ((typeof rec.selector == 'string')
            && (typeof rec.event == 'string') &&
            (typeof rec.handler == 'function')) {
            $('#' + self._renderTo).delegate(rec.selector,
            rec.event, function(event){
              rec.handler.call(self, event);
            });
          }
          if ((typeof key == 'string') && (typeof rec == 'function')) {
            var temp = key.split(" ");
            var event = $.trim(temp.pop());
            var selector = $.trim(temp.join(" "));
            $('#' + self._renderTo).delegate(selector, event, function(event){
              rec.call(self, event);
            });
          }
        })
        this.trigger('OnRender');
      },
      // Render a view with the model(no data is given) or the given data
      render : function(data){
        if (data) {
          this._setData(data);
        } else {
          if (this.model) {
            this.data = this.model.getData();
          }
        }
        if (!this._tmpl) {
          this._tmpl = new EJS({url: this._url});
        }
        var input = this.data;
        this._render(input);
      },
      // Render a view with the given model and filter for filtering data
      renderWithFilter: function(filter) {
        if (this.model && (typeof filter == 'function')) {
          var input = this.model.filter(filter);
        } else {
          var input = this.data
        }
        this._render(input);
      },
      // Render a view with the given model and search key for filtering data
      renderWithSearch: function(key) {
        if (this.model && (typeof key == 'string')) {
          var input = this.model.find(key);
        } else {
          var input = this.data
        }
        this.render(input);
      },
      // Destory the related veiw
      destroy: function(){
         $('#' + this._renderTo).html('');
      }
    }
  })
  return Controller
})
