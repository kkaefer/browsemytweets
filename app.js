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

run()