'use strict';
var fs = require('fs');
var async = require('async');
module.exports = function(app){

    var symbolSchema = require('./_gen/symbol_gen')(app);
    /*
    Custom Code goes here
    */



    return app.mongoose.model('Symbol', symbolSchema);
}