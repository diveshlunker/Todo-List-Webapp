/*global $*/
$(document).ready(function(){
   $.getJSON("/api/todos")
   .then(addTodos)
   
   $('#todoInput').keypress(function(event){
       if(event.which == 13){
           createTodo();
       }
   });
   
   $('.list').on('click','li',function(){
       updateTodo($(this));
   })
   
   $('.list').on('click','span',function(event){
       event.stopPropagation();
       deleteTodo($(this).parent())
   });
   
   
});

function addTodos(todos){
    todos.forEach(function(todo){
        addTodo(todo);
    })
}
function addTodo(todo){
    var newTodo = $('<li class="task">'+todo.name+'<span>X</span></li>');
    newTodo.data('id',todo._id);
    newTodo.data('completed',todo.completed);
    if(todo.completed){
        newTodo.addClass("done");
    }
    $('.list').append(newTodo);
}
function createTodo(){
    var userInput = $('#todoInput').val();
    $.post('api/todos',{name: userInput})
    .then(function(newTodo){
        $('#todoInput').val('');
        addTodo(newTodo);
        
    })
} 
function deleteTodo(todo){
    var idd = todo.data('id');
    var deleteUrl = '/api/todos/'+ idd;
       
    $.ajax({
       method: 'DELETE',
       url: deleteUrl
    })
    .then(function(data){
       todo.remove();
    })
    .catch(function(err){
        console.log(err);
    })
}

function updateTodo(todo){
    var idd = todo.data('id');
    var isDone = !todo.data('completed');
    var updateData = {completed: isDone}
    var updateUrl = '/api/todos/'+ idd;
    $.ajax({
        method: 'PUT',
        url: updateUrl,
        data: updateData
    })
    .then(function(updateTodo){
        todo.toggleClass("done");
        todo.data('completed', isDone);
    })
}