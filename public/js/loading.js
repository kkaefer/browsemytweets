// Fetching all Tweets

$(function(){
  var twitterAPI = "http://api.twitter.com/1/";
  var max_pages = 16; // 3200 tweets = 16 pages
  var tweets_per_call = 200; // 200 is twitter limit on this
  var retryLimit = 3;
  
  var max_tweets = (max_pages) * 200;
  var username = $("#username").val();
  var user_id;
  var fetched_tweets = 0;
  
  // this function will be called after user has been fetched
  function fetchTweetsRecursively(page) {
    var tryCount = 0;    
    if(page <= max_pages) {
      $.ajax({
        url: url,
        cache: false,
        data: {
          user_id: user_id,
          count: tweets_per_call,
          skip_user: true,
          include_entities: true,
          page: page
        },
        dataType: "jsonp",
        type: "GET",
        success: function(data){
          if(data && data.length > 0){
            // fetch more tweets
            fetchTweetsRecursively(page + 1);
                        
            // TODO: send data to solr
            
            // update progress bar
            
            // $("#tweets").append(page);
            // $(data).each(function(id, element){
            //   $("#tweets").append("|");  
            // });      
            // $("#tweets").append(data.length);
            // $("#tweets").append("<br />");   
            // $("#tweets").append(data[0].text);  
            // $("#tweets").append("<br />");             
            // $("#tweets").append(data[data.length-1].text);               
            // $("#tweets").append("<br />");              
            
            fetched_tweets += data.length;
            if(fetched_tweets >= max_tweets) {
              fetched_tweets = max_tweets;
            }
            $("#fetched-tweets").text(fetched_tweets);

            // Check if all tweets have been fetched
            if(fetched_tweets >= max_tweets) {
              window.location.href = "/" + $("#username").val();
            }
          } else {
            // stop recursion, because no more tweets
          }
        }
        // error: function(xhr, textStatus, errorThrown){
        //   
        //   if (xhr.status == 404 || xhr.status == 500 || xhr.status == 502) {
        //     this.tryCount++;
        //     if (this.tryCount <= this.retryLimit) {
        //       //try again
        //       $.ajax(this);
        //       return;
        //     }
        //     alert('We have tried ' + this.retryLimit + ' times and it is still not working. We give in. Sorry.');
        //     return;
        //   }
        // }
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
      //$("#full_name").text(data.name);
      $("#username").text(data.screen_name);
      //$("#total-tweets-number").text(data.statuses_count);

      $("#fetched-tweets").text('0');      
      if(data.statuses_count > max_tweets) {
        $("#total-available-tweets").text(max_tweets);            
      } else {
        $("#total-available-tweets").text(data.statuses_count);                    
      }     
      
      user_id = data.id;
      statuses_count = data.statuses_count;
      
      if(!data['protected']){
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
});