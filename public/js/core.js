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
  var twitterAPI = "http://api.twitter.com/1/";
  var max_pages = 16; // 3200 tweets = 16 pages
  var tweets_per_call = 200; // 200 is twitter limit on this
  var retryLimit = 3;
  
  var max_tweets = (max_pages) * 200;
  var username = $("#username").val();
  var user_id;
  var fetched_tweets = 0;  
  
  // fetch user
  var url = twitterAPI + "users/show.json";  
  $.ajax({
    url: url,
    cache: false,
    data: {screen_name: username},
    dataType: "jsonp",
    type: "GET",
    success: function(data){
      $("#avatar").attr("src", data.profile_image_url);
      $("#full_name").text(data.name);
      $("#screen_name").text("(" + data.screen_name + ")");
      $("#total-tweets-number").text(data.statuses_count);

      $("#fetched-tweets").text('0');      
      if(data.statuses_count > max_tweets) {
        $("#total-available-tweets").text(max_tweets);            
      } else {
        $("#total-available-tweets").text(data.statuses_count);                    
      }     
      
      user_id = data.id;
      statuses_count = data.statuses_count;
      
      if(!data.protected){
        // write user to datastore
        url = twitterAPI + "statuses/user_timeline.json"; 
        fetchTweetsRecursively(1);        
      } else {
        // error message if tweets are protected :(        
        $("#tweets").html("<h1>Sorry, but your Tweets are protected and we can't read them :(</h2>");
        $("#status").hide();
      }
    }
});