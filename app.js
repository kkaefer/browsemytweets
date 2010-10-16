require.paths.unshift(__dirname + '/plugins')

var public_path = p = require("path").join("root", "./public");
var express = require('express');
var app = express.createServer();

app.use(express.staticProvider(__dirname + '/public'));
//express.static({ path: public_path }));

app.configure(function(){
    //enable("show exceptions");
})

// get('/*.css', function(file){
//   this.render(file + '.css.sass', { layout: false });
// });

app.get('/', function(req, res){
  res.render('index.haml',{
    layout: true,
    locals: {
      javascript: 'index.js'
    }
  })
})

app.get('/:username', function(req,res) {
  res.render('core.haml',{
    locals: {
      username: req.params.username,
      javascript: 'core.js'
    }
  })
})

app.post('/api/tweets', function(req, res) {
  var post_tweets = require('./lib/post_tweets');
  post_tweets.handle.call(this);
});

app.get('/api/tweets/:userid', function(req, res) {
  var get_tweets = require('./lib/get_solr_tweets');
  get_tweets.handle.call(this, req.params.userid);
});

app.get('/loading/:username', function(req, res){
  res.render('loading.haml',{
    locals: {
      username: req.params.username,
      javascript: 'loading.js'
    }
  })
})


app.listen(3001);
