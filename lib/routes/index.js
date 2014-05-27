var path = require('path');
var async = require('async');
var _ = require('underscore');
module.exports = function(app){
    app.all('/', function(req, res, next){
        res.render('index');
    });
    app.all('/images/:image/analyze', function(req, res, next){

        res.locals.clusters = [];
        req.image.findClusters(function(err){
            if(err) return next(err);
            res.redirect('/images/'+ req.image._id + '/clusters');
        })



    });
    app.all('/images/:image/clusters', function(req, res, next){

        res.locals.clusters = [];

        for(var i = 0; i < req.image.clusters.length; i++){
            if( req.image.clusters[i].toObject ){
                var cluster_data =  req.image.clusters[i].toObject();
                //console.log('TOOBJURL:', cluster_data.uri);
                res.locals.clusters.push(cluster_data);
            }
        }

        res.render('image_analyze')




    });
    app.all('/images/:image/clusters/:cluster/analyze', function(req, res, next){




        res.render('cluster_analyze');




    });
    app.all('/librarys/:library/symbols/:symbol/create_from_cluster', function(req, res, next){
        async.series([
            function(cb){
                app.model.Image.findOne(
                    { $or: [
                        { _id: req.body.image },
                        { namespace: req.body.image },
                    ]}).exec(function(err, image){
                        if(err) return next(err);
                        if(!image) return next(new Error("No image with that id"));
                        res.bootstrap('image', image);
                        return cb();
                });
            },
            function(cb){
                var cluster = null;
                for(var i = 0; i < req.image.clusters.length; i++){
                    if(req.image.clusters[i]._id == req.body.cluster){
                        cluster = req.image.clusters[i];
                    }
                }
                if(!cluster) return next(new Error("No image with that id"));
                res.bootstrap('cluster', cluster);
                return cb();
            },
            function(cb){
                var cluster_pixels_raw = _.clone(req.cluster.pixels)
                var cluster_pixels = new PixelArray(cluster_pixels_raw);
                cluster_pixels = cluster_pixels.anchor().scale();
                //Scale

                //Anchor
                req.symbol.pixels = cluster_pixels.getRaw();
                req.symbol.markModified('pixels');
                req.symbol.save(function(err){
                    if(err) return next(err);
                    return cb();
                });
            }
        ],
        function(){
            //end async
            res.render('symbol_create_from_cluster');
        });



    });

    /**
     * Model Routes
     */
    require('./model/index')(app);
}