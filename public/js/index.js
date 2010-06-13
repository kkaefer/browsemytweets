// On form submit redirect to /{username}
$(function(){
  $("#form").submit(function(){
    window.location.href = "/loading/" + $("#username").val();
    return false;
  });  
})

$(function() {
  var default_text = '<enter username>';
  $('#username')
    .focus(function() {
      if (this.value == default_text) {
        this.value = '';
      }
    })
    .blur(function() {
      if (this.value == '') {
        this.value = default_text;
      }
    })
    .focus();
});