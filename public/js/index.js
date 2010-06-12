// On form submit redirect to /{username}
$(function(){
  $("#form").submit(function(){
    window.location.href = "/loading/" + $("#username").val();
    return false;
  });  
})