require('lib');
require.paths.unshift(__dirname + '/plugins');

var express = require('express');
var app = express.createServer();

//express.static({ path: public_path }));

app.use(express.bodyDecoder());

app.configure(function(){
    //enable("show exceptions");
});

// get('/*.css', function(file){
//   this.render(file + '.css.sass', { layout: false });
// });

app.use(express.staticProvider(__dirname + '/public'));
app.get('/', function(req, res){
  res.render('index.jade',{
    layout: true,
    locals: {
      javascript: 'index.js'
    }
  });
});

app.get('/:username', function(req,res) {
  res.render('core.jade', {
    locals: {
      username: req.params.username,
      javascript: 'core.js'
    }
  });
});

app.post('/api/tweets', function(req, res) {
  var post_tweets = require('./lib/post_tweets');
  post_tweets.handle.call(this, req, res);
});

app.get('/api/tweets/:userid', function(req, res) {
  var get_tweets = require('./lib/get_solr_tweets');
  get_tweets.handle.call(this, req, res, req.params.userid);
});

app.get('/loading/:username', function(req, res){
  res.render('loading.jade', {
    locals: {
      username: req.params.username,
      javascript: 'loading.js'
    }
  });
});



app.listen(3001);
