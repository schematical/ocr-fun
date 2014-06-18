var path = require('path');
var async = require('async');
var _ = require('underscore');

var PixelArray = require('../../lib/modules/ocr/pixel_array');
module.exports = function(app){
    /**
     * Model Routes
     */
    require('./model/index')(app);

    app.all('/', function(req, res, next){
        if(req.user){
            res.render('home');
        }else{
            res.render('index');
        }
    });
    app.all('/demo', [
        function(req, res, next){
            console.log("LODING DEMO USER");
            app.demoUser(function(err, account){
                if(err) return next(err);
                req.user = account;
                res.bootstrap('account', account)
                return next();
            });
        },
        app.njax.s3.route(['file']),
        function(req, res, next){
            if(!req.user){
                return res.redirect('/');
            }
            if(!req.image){
                var image = new app.model.Image({
                    account:(req.account || null),
                    cre_date:new Date(),
                    image:req.njax.files.file
                });
                res.bootstrap('image', image);
            }
            return next();
        },
        app.njax.routes.image.update,
        function(req, res, next){

            res.locals.clusters = [];
            req.image.findClusters(function(err){
                if(err) return next(err);
                return next();
            })

        },
        function(req, res, next){
            res.redirect('/demo/'+ req.image._id);

        }

    ]);
    app.all('/demo/:image', function(req, res, next){
        if(!req.image){
            return next(new Error('Cannot find image'));
        }
        res.bootstrap('clusters', req.image.clusters.toObject());
        res.render('demo');
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
                res.locals.clusters.push(cluster_data);
            }
        }

        res.render('image_analyze')
    });
    app.all('/images/:image/clusters/:cluster/analyze', function(req, res, next){
        var pbp = require('../modules/ocr/methods/pixel_by_pixel')(app);
        pbp.run({
            cluster:req.cluster,
            callback:function(err, results){
                if(err) return next(err);
                var b_results = [];
                for(var i in results){

                    b_results.push({
                        match:Math.round(results[i].match * 100),
                        symbol:results[i].symbol.toObject()
                    });
                    res.bootstrap('results', b_results);
                }

                res.render('cluster_analyze', b_results);
            }
        });

    });
    app.all('/librarys/:library/symbols/:symbol/render', function(req, res, next){

        //console.log('Pixels:', req.symbol.pixels);
        var symbol_pixels = new PixelArray(req.symbol.pixels);
        var file_path = '/tmp/' + req.symbol.namespace + '.png';
        symbol_pixels.toFile({
            file_path:file_path,
            callback:function(err){
                if(err) return next(err);
                setTimeout(function(){

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


}