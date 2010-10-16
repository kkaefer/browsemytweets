delete module.moduleCache[module.id];

helper = require('./helper');

var sys = require('sys');
var solr = require("./solr_json");
var search_fields = ['text', 'hashtag', 'mentions', 'in_reply_to_screen_name', 'url'];

var solr_client = solr.createClient();

exports.handle = function(req, res, username) {
  var query_param = req.param('q');
  if (query_param && query_param !== '*') {
    var query = [];
    search_fields.forEach(function(value){
      query.push(value + ":(" + query_param + ") ");
       // TODO: ~ = Fuzzy search
    });
    query = query.join(' OR ');
  }
  else {
    query = '*';
  }
  
  var options = {
    fq: "screen_name:" + username
  };

  solr_client.query(query, options, function(i, data){
    if (data) {
      data = JSON.parse(data);
      var response = [];
      if (data.response.docs){
        data['response']['docs'].forEach(function(tweet){
          var output_tweet = [];
          output_tweet.text = tweet.text;
          output_tweet.created_at = helper.dateFormat(tweet.created_at);
          output_tweet.tweet_url = helper.buildTweetURL(tweet.screen_name, tweet.tweet_id);
          response.push(output_tweet);

        })
      }
      res.send(res.partial('tweets.haml', { locals: { tweets: response }}));
      return;
    }
    res.send(JSON.stringify({ status: "", message: "Something went wrong with Solr. No data fetched." }));
  });
};
