'use strict';
var fs = require('fs');
var async = require('async');
var _ = require('underscore');
var path = require('path');

module.exports = function(app){

    var imageSchema = require('./_gen/image_gen')(app);
    /*
    Custom Code goes here
    */
    imageSchema.methods.findClusters = function(callback){
        var ocr = app.Ocr({
            img_path:path.join(__dirname, '..', '..', 'test1.jpg')
            //img_path:'/home/user1a/Pictures/bkgd.jpg'
        });
        async.series([
            _.bind(function(cb){
                this.clusters.unshift();
                this.clusters = [];
                this.save(cb);
            }, this),
            function(cb){
                ocr.run(function(err, x){
                    if(err) return callback(err);
                    return cb();
                });
            },
            _.bind(function(cb){

                var cluster_data = ocr.clusters();
                for(var i in cluster_data){
                    var cluster_model = new app.model.Cluster();
                    cluster_model.parseClusterData(cluster_data[i])
                    this.clusters.push(cluster_model);
                }
                this.save(cb)
            }, this)
        ],
        function(){
            //end async
            return callback();
        });


    }
    return app.mongoose.model('Image', imageSchema);
}