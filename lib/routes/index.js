var path = require('path');
module.exports = function(app){
    app.all('/', function(req, res, next){
        res.render('index');
    });
    app.all('/images/:image/analyze', function(req, res, next){

        res.locals.clusters = [];
      /*  req.image.findClusters(function(err){
            if(err) return next(err);*/
            for(var i = 0; i < req.image.clusters.length; i++){

                res.locals.clusters.push({
                    index:i,
                    _id: req.image.clusters[i]._id,
                    data_url: req.image.clusters[i].data_url
                });
            }

            res.render('image_analyze')
            //res.render('index');
       // })



    });

    /**
     * Model Routes
     */
    require('./model/index')(app);
}