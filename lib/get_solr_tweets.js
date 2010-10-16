delete module.moduleCache[module.id];

var sys = require('sys');
var solr = require("./solr_json");
var search_fields = ['text', 'hashtag', 'mentions', 'in_reply_to_screen_name', 'url'];

var solr_client = solr.createClient();


exports.handle = function(req, res, username) {
  var query_param = req.param('q');
  var query = [];
  search_fields.forEach(function(value){
    query.push(value + ":(" + query_param + ") ");
     // TODO: ~ = Fuzzy search
  });
  query = query.join(' OR ');
  var options = {
    fq: "screen_name:" + username
  };

  solr_client.query(query, options, function(i, data){
    if (data) {
      data = JSON.parse(data);
      var response = [];
      if (data.response.docs){
        data['response']['docs'].forEach(function(tweet){
          response.push(JSON.parse(tweet.original_tweet));
        })
      }
      res.send(res.partial('tweets.haml', { locals: { tweets: response }}));
      return;
    }
    res.send(JSON.stringify({ status: "", message: "Something went wrong with Solr. No data fetched." }));
  });
};
