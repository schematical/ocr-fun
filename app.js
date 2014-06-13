var async = require('async');
var _ = require('underscore');

var njax = require('njax');
var njaxBootstrap = require('njax-bootstrap');
var models = require('./lib/model');
var config = require('./config');

var app = njax(config);
models(app);
njaxBootstrap(app);
app.demoUser = function(callback){
   if(app._demo_user){
       return callback(null, app._demo_user);
   }
   app.model.Account.findOne({ email: 'demo@demo.com' }, function(err, demo_user){
       if(err) return next(err);
       app._demo_user = demo_user;
       return callback(null, app._demo_user);
   });
};
app.Ocr = require('./lib/modules/ocr');
app.locals.ng_app = 'iraas';
app.locals.partials._navbar = '_navbar';
app.locals.partials._meta = '_meta';

app.locals.partials._meta_footer = '_meta_footer';
app.locals.partials._modal = '_modal';
app.locals.partials._header_angular = '_header.angular.hjs';

var routes = require(__dirname + '/lib/routes');
routes(app);

app.start(function(err, _app, server){
    var socket_io = require('socket.io');
    var io = socket_io.listen(server);
    io.sockets.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });
});