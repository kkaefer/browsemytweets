
require.paths.unshift(__dirname + '/plugins')

var kiwi = require('kiwi')
kiwi.require('express')
require('express/plugins')



configure(function(){
  set('root', __dirname)
  p = require("path").join(__dirname, "./public");
  use(Static, { path:p });  
  enable("show exceptions");  
})

get('/*.css', function(file){
  this.render(file + '.css.sass', { layout: false });
});

get('/', function(){
  this.render('index.html.haml',{
    locals: {
      javascript: 'index.js'
    }    
  })
})

get('/:username', function(username){
  this.render('core.html.haml',{
    locals: {
      username: username,
      javascript: 'core.js'      
    }    
  })
})

post('/api/tweets', function() {
  var post_tweets = require('./lib/post_tweets');
  post_tweets.handle.call(this);
});

get('/api/tweets/:userid', function(userid) {
  var get_tweets = require('./lib/get_solr_tweets');
  get_tweets.handle.call(this, userid);  
});

get('/loading/:username', function(username){
  this.render('loading.html.haml',{
    locals: {
      username: username,
      javascript: 'loading.js'      
    }    
  })
})


run()