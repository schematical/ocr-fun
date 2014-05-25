var path = require('path');
module.exports = function(app){
    app.all('/', function(req, res, next){
        res.render('index');
    });
    app.all('/images/:image/analyze', function(req, res, next){

        res.locals.clusters = [];
        req.image.findClusters(function(){
            for(var i in req.image.clusters){
                res.locals.clusters.push({ data_url:req.image.clusters[i].data_url });
            }
            //console.log(res.locals.clusters);
            res.render('image_analyze')
            //res.render('index');
        })



    });

    /**
     * Model Routes
     */
    require('./model/index')(app);
}