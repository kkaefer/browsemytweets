// core

$(function() {
  var default_text = '<enter search terms>';
  $('#searchfield')
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


$(function() {
  var username = $("#username_hidden").val();

  // set image
  var avatar_url = "http://twivatar.azzag.co.uk/" + username + "/normal";
  $("#avatar").attr("src", avatar_url);


  $.get('/api/tweets/' + username, { q: '*' }, function(data) {
    $('#main').html(data);
  });

  $('#form').submit(function() {
      $.ajax({
        url: '/api/tweets/' + username,
        data: { q: $('#searchfield').val() },
        success: function(data) {
          if (data)
            $('#main').html(data);
          else
            $('#main').html('Request failed.');
          $('#searchfield')[0].select();
        },
        error: function() {
          $('#main').html('Request failed.');
        }
      });


    return false;
  });
});
