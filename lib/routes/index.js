var path = require('path');
module.exports = function(app){
    app.all('/', function(req, res, next){
        res.render('index');
    });
    app.all('/images/:image/analyze', function(req, res, next){

        var ocr = app.Ocr({
            img_path:path.join(__dirname, '..', '..', 'test1.jpg')
            //img_path:'/home/user1a/Pictures/bkgd.jpg'
        });

        ocr.run(function(err, x){
            if(err) return next(err);
            res.locals.clusters = [];
            var clusters = ocr.clusters();

            for(var i in clusters){
                res.locals.clusters.push({ data_url:clusters[i].toDataUrl() });
            }
            //console.log(res.locals.clusters);
            res.render('image_analyze')
            //res.render('index');
        });
    });

    /**
     * Model Routes
     */
    require('./model/index')(app);
}