function padForTwoWithLeadingZero(number) {
  if(String(number).length == 1) {
    return '0' + number;
  }
  return String(number);
}

exports.dateFormat = function(date_string){
  date = new Date(date_string);
  var output = 
    padForTwoWithLeadingZero(date.getDate()) + '.' +
    padForTwoWithLeadingZero(date.getMonth()) + '.' +
    date.getFullYear() + ' ' +
    padForTwoWithLeadingZero(date.getHours()) + ':' +
    padForTwoWithLeadingZero(date.getMinutes());
  return output;
};

exports.buildTweetURL = function(user_permalink, tweet_id) {
  var output = "http://www.twitter.com/";
  output += user_permalink;
  output += '/status/';
  output += tweet_id;
  return output;
}
