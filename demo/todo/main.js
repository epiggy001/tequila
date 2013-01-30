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
          editTodo.render(this.data)
        }
      },{
        event: 'click',
        selector: '.delete',
        handler: function(event){
          this.destroy();
          todos.remove(this.data)
        }
      }]
    });
    
    var editTodo = new MVC.Controller({
      url: 'tmpl/editTodo.ejs',
      renderTo:'right',
      handlers: [{
        event: 'click',
        selector: '.save',
        handler: function(event){
          var title = $('#edit-title').val();
          var detail = $('#edit-detail').val();
          if (editTodo.data._key_) {
            todos.update(this.data, {title:title, detail:detail});
            todoDetail.render(editTodo.data);
          } else {
            var rec = todos.insert({title:title, detail:detail});
            todoDetail.render(rec);
          }
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
      $('#search').bind('keyup', function(){
        var key = $('#search').val();
        if (key == null || key == '') {
          todosController.render();
        }
        todosController.renderWithFilter(function(rec){
          if (rec.title.indexOf(key) != -1) {
            return true;
          }
          return false;
        })
      });
      $("#add").click(function(event){
        editTodo.render({});
      })
    })
  }
);