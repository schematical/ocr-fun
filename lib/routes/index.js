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
                res.locals.clusters.push( req.image.clusters[i].toObject());
            }else{
                console.log(req.image.clusters[i]);
            }
            /*{
                index:i,
                _id: req.image.clusters[i]._id,
                data_url: req.image.clusters[i].data_url
            });*/
        }

        res.render('image_analyze')




    });

    /**
     * Model Routes
     */
    require('./model/index')(app);
}