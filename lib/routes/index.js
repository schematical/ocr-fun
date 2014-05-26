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

    /**
     * Model Routes
     */
    require('./model/index')(app);
}