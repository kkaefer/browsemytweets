// Fetching all Tweets

$(function(){
  var twitterAPI = "http://api.twitter.com/1/";
  var max_pages = 1; // 3200 tweets = 16 pages
  
  var max_tweets = max_pages+1 * 200;
  var username = $("#username").val();
  var user_id;
  
  // this function will be called after user has been fetched
  function fetchTweetsRecursively(page) {
    if(page <= max_pages) {
      $.ajax({
        url: url,
        cache: false,
        data: {
          id: user_id,
          count: 200,
          skip_user: true,
          include_entities: true,
          page: page
        },
        dataType: "jsonp",
        type: "GET",
        success: function(data){
          if(data){
            // send data to solr
            
            // update progress bar
            $(data).each(function(id, element){
              $("#tweets").append("|");  
            });      
            $("#tweets").append(data.length);            
            $("#fetched-tweets").text(parseInt($("#fetched-tweets").text()) + 200);            
            
            // fetch more tweets
            fetchTweetsRecursively(page + 1);
          } else {
            // stop recursion, because no more tweets
          }
        }
      });
    } else {
      // stop recursion, because page limit hit
    }
  };
  
  
  
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
        fetchTweetsRecursively(0);        
      } else {
        // error message to front if tweets are protected :(
      }
    }
  })    
  
  
  
    





})