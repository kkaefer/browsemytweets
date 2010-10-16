// core

jQuery.fn.highlight = function (text, o) {
  return this.each( function(){
    var replace = o || '<span class="highlight">$1</span>';
    $(this).html( $(this).html().replace( new RegExp('('+text+'(?![\\w\\s?&.\\/;#~%"=-]*>))', "ig"), replace) );
  });
}

jQuery.fn.autolink = function () {
  return this.each( function(){
    var re = /((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g;
    $(this).html( $(this).html().replace(re, '<a href="$1">$1</a> ') );
  });
}

jQuery.fn.mailto = function () {
  return this.each( function() {
    var re = /(([a-z0-9*._+]){1,}\@(([a-z0-9]+[-]?){1,}[a-z0-9]+\.){1,}([a-z]{2,4}|museum)(?![\w\s?&.\/;#~%"=-]*>))/g
    $(this).html( $(this).html().replace( re, '<a href="mailto:$1">$1</a>' ) );
  });
}

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
    $('#main').html(data).autolink();
  });

  $('#form').submit(function() {
    $.get('/api/tweets/' + username, { q: $('#searchfield').val() }, function(data) {
      console.log(data);
      $('#main').html(data).autolink();
    });
    $('#searchfield')[0].select();
        
    return false;
  });
});
