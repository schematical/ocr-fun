var path = require('path');
var async = require('async');
var _ = require('underscore');

var PixelArray = require('../../lib/modules/ocr/pixel_array');
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
    app.all('/librarys/:library/symbols/:symbol/render', function(req, res, next){

        //console.log('Pixels:', req.symbol.pixels);
        var symbol_pixels = new PixelArray(req.symbol.pixels);
        var file_path = '/tmp/' + req.symbol.namespace + '.png';
        symbol_pixels.toFile({
            file_path:file_path,
            callback:function(err){
                if(err) return next(err);
                var fs = require('fs');
                setTimeout(function(){
                console.log("Content:" + fs.readFileSync(file_path).toString());
                if(err) return next(err);
                res.sendfile(file_path);
                }, 1000);
            }
        });

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


                var cluster_pixels = new PixelArray(req.cluster.pixels);

                cluster_pixels = cluster_pixels.anchor();
                //console.log('raw', cluster_pixels.getRaw());
                //cluster_pixels = cluster_pixels.scaleTo();
                //Scale
                var fs = require('fs');
                fs.writeFileSync('/tmp/test.json', JSON.stringify(cluster_pixels.getRaw()));
                //Anchor
                cluster_pixels.toFile({
                    file_path:'/tmp/test.png',
                    callback:function(err){
                        if(err) return next(err);
                        console.log("Finished");
                    }
                })
                req.symbol.pixels = cluster_pixels.getRaw();
                //console.log('saving', req.symbol.pixels)
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