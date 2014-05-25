'use strict';
var fs = require('fs');
var async = require('async');
module.exports = function(app){

    var clusterSchema = require('./_gen/cluster_gen')(app);
    /*
    Custom Code goes here
    */
    clusterSchema.methods.parseClusterData = function(cluster_data){
        this.bounds = cluster_data.getBounds();
        this.markModified('bounds');
        this.pixels = cluster_data.pixels;
        this.markModified('pixels');
        this.data_url = cluster_data.toDataUrl();
    }
    return app.mongoose.model('Cluster', clusterSchema);
}