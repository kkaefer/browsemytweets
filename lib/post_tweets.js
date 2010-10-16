delete module.moduleCache[module.id];

var sys = require('sys');
var solr = require("./solr_json");

function ISODateString(d) {
 function pad(n) { return n < 10 ? '0' + n : n; }
 return d.getUTCFullYear() + '-'
       +  pad(d.getUTCMonth() + 1) + '-'
       +  pad(d.getUTCDate()) + 'T'
       +  pad(d.getUTCHours()) + ':'
       +  pad(d.getUTCMinutes()) + ':'
       +  pad(d.getUTCSeconds()) + 'Z';
}

function getKey(key) {
  return function (obj) {
    if (typeof obj[key] == 'string')
      return escape(obj[key]);
    else
      return obj[key];
  };
}

function escape(str) {
  return str.replace(/([&<>\u0080-\uffff])/g, function(s) { return '&#' + s.charCodeAt(0) + ';'; });
}

var solr_client = solr.createClient();

function resolveURL(url, tweet, settings) {
  // todo
}

function addTweetHandler(err, response) {
  if (err) {
    sys.puts(err);
    sys.puts(response);
    throw err;
  }
  sys.puts("Document added");

  solr_client.commit();
}

function addTweet(source, i) {
  var tweet = {
    id: "tweet-" + source.id,
    type: "tweet",
    tweet_id: source.id,
    user_id: source.user.id,
    screen_name: this.screen_name,
    text: escape(source.text),
    created_at: ISODateString(new Date(source.created_at)),
    favorited: source.favorited,
    original_tweet: JSON.stringify(source)
  };

  ['in_reply_to_user_id', 'in_reply_to_screen_name', 'in_reply_to_user_id'].forEach(function(key) {
    if (source[key]) {
      tweet[key] = source[key];
    }
  });

  if (source.entities.hashtags.length) {
    tweet.hashtag = source.entities.hashtags.map(getKey('text'));
  }
  if (source.entities.user_mentions.length) {
    tweet.mentions = source.entities.user_mentions.map(getKey('screen_name')).concat(source.entities.user_mentions.map(getKey('name')));
  }

  var client = source.source.match(/^<a href="([^"]+)" rel="nofollow">([^<]+)<\/a>$/);
  if (client) {
    tweet.client_url = escape(client[1]);
    tweet.client_name = escape(client[2]);
  }
  else {
    tweet.client_name = escape(source.source);
  }

  // Resolve URLs
  source.entities.urls.forEach(function(url) {
    process.nextTick(function() {
      resolveURL(url, tweet);
    });
  });

  // Write it to Solr.
  solr_client.add(tweet, {}, addTweetHandler);
}

exports.handle = function(req, res) {
  if (req.param('tweets')) {
    var tweets = JSON.parse(req.param('tweets'));
    
    this.screen_name = req.param('screen_name');
    if (tweets) {
      tweets.forEach(addTweet, this);
      res.send(JSON.stringify({ status: 'ok' }));
      return;
    }
  }

  res.send(JSON.stringify({ status: "", message: "Couldn't parse tweets." }));
};
