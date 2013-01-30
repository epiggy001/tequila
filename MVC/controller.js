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
          if ((typeof rec.selector == 'string') && (typeof rec.event == 'string') && (typeof rec.handler == 'function')) {
            $('#' + self._renderTo).delegate(rec.selector, rec.event, function(event){
              rec.handler.call(self, event);
            });
          }
        })
        this.trigger('OnRender');
      },
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
        this._render(input)
      },
      renderWithFilter: function(filter) {
        if (this.model && (typeof filter == 'function')) {
          var input = this.model.filter(filter);
        } else {
          var input = this.data
        }
        this._render(input);
      },
      destroy: function(){
         $('#' + this._renderTo).html('');
      }
    }
  })
  return Controller
})