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

    clusterSchema.virtual('uri').get(function(){

        return this.parent().uri + '/clusters/' + this._id;

    });
    return app.mongoose.model('Cluster', clusterSchema);
}