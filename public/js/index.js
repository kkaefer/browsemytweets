// On form submit redirect to /{username}
$(function(){
  $("#form").submit(function(){
    window.location.href = "/" + $("#username").val();
    return false;
  });  
})