exports.buildTweetURL = function(user_permalink, tweet_id) {
  var output = "http://www.twitter.com/";
  output += user_permalink;
  output += '/status/';
  output += tweet_id;
  return output;
};

var entityFormatters = {
  user_mentions: function(text, entity) {
    return '<a href="http://twitter.com/' + entity.screen_name + '">' + text + '</a>';
  },
  urls: function(text, entity) {
    return '<a href="' + entity.url + '" rel="nofollow">' + text + '</a>';
  },
  hashtags: function(text, entity) {
    return '<a href="http://twitter.com/#search/%23' + entity.text + '">' + text + '</a>';
  }
};

exports.highlightEntities = function(text, entities) {
  var all = [];
  
  // Merge all into one array.
  for (var type in entities) {
    for (var i = 0; i < entities[type].length; i++) {
      entities[type][i].type = type;
      all.push(entities[type][i]);
    }
  }
  
  // Sort them backwards so that higher indices come first.
  all.sort(function(a, b) {
    return a.indices[0] < b.indices[0];
  });
  
  for (var i = 0; i < all.length; i++) {
    text =
      text.substring(0, all[i].indices[0]) +
      entityFormatters[all[i].type](text.substring(all[i].indices[0], all[i].indices[1]), all[i]) +
      text.substring(all[i].indices[1]);
  }

  return text;
};
