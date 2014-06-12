'use strict';
var fs = require('fs');
var async = require('async');
var _ = require('underscore');
module.exports = function(app){

    var clusterSchema = require('./_gen/cluster_gen')(app);
    /*
    Custom Code goes here
    */
    clusterSchema.methods.parseClusterData = function(cluster_data){
        this.bounds = cluster_data.getBounds();
        this.markModified('bounds');
        this.pixels = [];
        for(var row in cluster_data.pixels){
            for(var col in cluster_data.pixels[row]){
                var pixel = _.clone(cluster_data.pixels[row][col]);

                delete(pixel.cluster);
                pixel.cluster = null;
                if(!this.pixels[row]){
                    this.pixels[row] = [];
                }
                this.pixels[row][col] = pixel;

            }
        }
        this.markModified('pixels');
        this.data_url = cluster_data.toDataUrl();
    }
    clusterSchema.methods.eachPixel = function(callback){
        for(var row in this.pixels){
            for(var col in this.pixels[row]){
                var pixel = this.pixels[row][col];
                this.apply(callback, [pixel, row, col]);
            }
        }
    }
    if (!clusterSchema.options.toObject) clusterSchema.options.toObject = {};
    clusterSchema.options.toObject.transform = function (doc, ret, options) {
        delete(ret.pixels);
    }
    return app.mongoose.model('Cluster', clusterSchema);
}