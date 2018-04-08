$(document).ready(function() {
  $.getJSON("/api/todos")
  .then(addTodos)

  $('#todoInput').keypress(function(event) {
    if (event.which == 13) {
      createTodo();
    }
  });

  $('.list').on('click', 'li', function() {
    updateTodo($(this));
  });

  $('.list').on('click', 'span', function(e) {
    e.stopPropagation();
    removeTodo($(this).parent());
  });

});

function addTodos(todos) {
  //add todos to page
  todos.forEach(function(todo) {
    addTodo(todo);
  });
}

function addTodo(todo) {
  var newTodo = $('<li>' + todo.name + ' <span>X</span></li>');
  newTodo.data('id', todo._id);
  newTodo.data('completed', todo.completed);

  newTodo.addClass("task");
  if(todo.completed) {
    newTodo.addClass("done");
  }
  $('.list').append(newTodo);
}

function createTodo() {
  //send request to create new todo
  var usrInput = $('#todoInput').val();

  $.post('/api/todos', {name: usrInput})
  .then(function(newTodo) {
    $('#todoInput').val('');
    addTodo(newTodo);
  })
  .catch(function(err) {
    console.log(err);
  });
}

function removeTodo(todo) {
  var clickedId = todo.data('id');
  var deletedUrl = 'api/todos/' + clickedId;
  $.ajax({
    method: 'DELETE',
    url: deletedUrl
  })
  .then(function(data) {
    todo.remove();
  })
  .catch(function(err) {
    console.log(err);
  });
}

function updateTodo(todo) {
  var updateUrl = '/api/todos/' + todo.data('id');
  var isDone = !todo.data('completed');
  var updateData = {completed: isDone};

  $.ajax({
    method: 'PUT',
    url: updateUrl,
    data: updateData
  })
  .then(function(updatedTodo) {
    todo.toggleClass("done");
    todo.data('completed', isDone);
  })
  .catch(function(err) {
    console.log(err);
  });
}
