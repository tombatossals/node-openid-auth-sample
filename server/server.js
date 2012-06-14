var express = require('express')
  , routes = require('./routes')
  , auth = require('./auth')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , mongoStore = require('connect-mongodb');

// Connect to Mongo
var conn = 'mongodb://localhost/powermeter';
mongoose.connect(conn);
mongoose.connection.on('open', function() {
  console.log('We have connected to mongodb');
});

var app = express.createServer();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/../static'));
  app.use(express.session({ 
    cookie: {maxAge: 60000 * 20},
    store: new mongoStore( { url: conn } )
  , secret: 'applecake'
  }, function() {
    app.use(app.router);
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

require('./routes')(app);
app.listen(3000);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
