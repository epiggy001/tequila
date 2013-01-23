define(['../basic/oo', '../basic/util', './EJS'], function(oo, util, EJS){
  'use strict';
  var View = oo.create({
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
      if (opt.event) {
        $.each(opt.event, function(key, value) {
          if ((typeof key == 'string') && (typeof value == 'function')) {
            this.bind(key, $.proxy(value, self));
          }
        });
      }
      this._handlers = opt.handlers ? opt.handlers : [];
    },
    proto: {
      render : function(){
        if (!this._tmpl) {
          this._tmpl = new EJS({url: this._url});
        }
        var html = this._tmpl.render({data: this.data});
        var elem = $(html);
        this.trigger('BeforeRender')
        $('#' + this._renderTo).html('').append(elem);
        $.each(this._handlers, function(key, rec){
          if ((typeof rec.selector == 'string') && (typeof rec.event == 'string') && (typeof rec.handler == 'function')) {
            elem.delegate(rec.selector, rec.event, rec.handler);
          }
        })
        this.trigger('OnRender');
      }
    }
  })
  return View
})