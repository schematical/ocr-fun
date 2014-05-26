var path = require('path');
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
                app.model.Image.findOne({ _id: req.body.image_id }).exec(function(err, image){
                    if(!image) return next(new Error("No image with that id"));
                    req.bootstrap('image', image);
                    return cb();
                });
            },
            function(cb){
                var cluster = req.image.clusters.id(req.body.cluster_id);
                if(!cluster) return next(new Error("No image with that id"));
                req.bootstrap('cluster', cluster);
                return cb();
            },
            function(cb){
                req.symbol.pixels = _.clone(req.cluster.pixels)
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