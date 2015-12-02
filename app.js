var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var cls = require('continuation-local-storage');
cls.createNamespace('poc');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var startContext = function(functionToCall, endContext)
{
  var poc = cls.getNamespace('poc');
  //Set whatever context that needs to be set. Will be set from uuid and request values
  poc.set('body',Math.random());

  // Function that needs to run within the context. To be replaces by routes / next()
  // 
  functionToCall(function(){
    endContext();
  });
}


var testFunction = function(done)
{
  var poc = cls.getNamespace('poc');

  fs.appendFile('req.text', poc.get('body'), function (err) {

    // Callback after the function completes processing. Routes will take care later.
    done();
  });

}


app.use(function(req,res,next){
  // Get Namespace that was created for the app
  var poc = cls.getNamespace('poc');
  // Create a new Context. Run creates context
  poc.run(function(){
    // Anything within this function will keep the context.
    startContext(testFunction,function(){
      // Write any code needed after ending context
      res.send('Its written');
    })
  })
});


module.exports = app;
