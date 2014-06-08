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
        var new_image = this;
        async.series([
            _.bind(function(cb){
                //this.clusters.unshift();
                for(var i = 0; i < this.clusters.length; i++){
                    console.log('Before Cluster Count: ' + this.clusters.length);
                    this.clusters.remove(i);//this.clusters[i]._id);

                    console.log('After Cluster Count: ' + this.clusters.length);
                }
                this.save(cb);
                //return cb();
            }, this),
            _.bind(function(cb){
                app.model.Image.findOne({ _id: this._id }).exec(function(err, image){
                    if(err) return callback(err);
                    new_image = image;
                    return cb();
                })
            }, this),
            function(cb){

                ocr.run(function(err, x){
                    if(err) return callback(err);
                    return cb();
                });
            },
            _.bind(function(cb){

                //console.log('Cluster Count: ' + this.clusters.length);
                var cluster_data = ocr.clusters();
                for(var i in cluster_data){
                    //if(i < 1){
                        var cluster_model = this.clusters.create({
                            _id:new app.mongoose.Types.ObjectId()
                        });//new app.model.Cluster();// this.clusters.create({});
                        cluster_model.parseClusterData(cluster_data[i])
                        this.clusters.push(cluster_model);
                    //}
                    console.log("Adding:" + i);

                }
                console.log(this.clusters.length);
                process.nextTick(_.bind(function(){
                    this.save(function(err, image){
                        if(err) return callback(err);
                        return cb();
                    })
                }, this));
            }, new_image)
        ],
        function(){
            //end async
            return callback();
        });


    }
    return app.mongoose.model('Image', imageSchema);
}