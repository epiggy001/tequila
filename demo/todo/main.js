require(['../../MVC/MVC', '../../navigator/navigator'],
  function (MVC, navigator) {
    todos= new MVC.Model({
      fields: [{name: 'title', def:'New todo'}, {name: 'detail'}],
      validate: function(rec) {
        if ((typeof rec.title != 'string') || (typeof rec.detail != 'string')) {
          return false;
        }
        return true;
      }
    });
    todos.insert({title:'Prepare lunch', detail:'Banana and eggs. Nothing more'});
    todos.insert({title:'Go to sleep', detail:'Get up at tomorrow 8:30'});
    var todosController = new MVC.Controller({
      model: todos,
      url: 'tmpl/todolist.ejs',
      renderTo: 'left'
    });
    todos.bind('onChange', function(){
      todosController.render();
    })
    var todoDetail = new MVC.Controller({
      url: 'tmpl/todo.ejs',
      renderTo: 'right',
      handlers: [{
        event: 'click',
        selector: '.edit',
        handler: function(event){
          $('#view-block').css('display', 'none');
          $('#edit-block').css('display', 'block');
        }
      }, {
        event: 'click',
        selector:'.save',
        handler: function(event){
          var title = $('input').val();
          var detail = $('textarea').val();
          todos.update(todoDetail.data, {title:title, detail:detail});
          todoDetail.render();
        }
      }]
    });
    var nav = new navigator({
      'todo/{id}': function(data){
        var rec = todos.findByKey(data.id); 
        todoDetail.render(rec)
      }
    });
    $(function(){
      todosController.render();
    })
  }
);