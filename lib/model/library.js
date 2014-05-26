'use strict';
var fs = require('fs');
var async = require('async');
module.exports = function(app){

    var librarySchema = require('./_gen/library_gen')(app);
    /*
    Custom Code goes here
    */

    return app.mongoose.model('Library', librarySchema);
}