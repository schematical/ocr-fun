var async = require('async');
var _ = require('underscore');
var PixelArray = require('../pixel_array');

module.exports = function(app){
    var method = {
        run:function(options){


            var cluster = options.cluster;
            var libraries = options.libraries;
            var results = {};
            //Load Symbols
            var symbols = null;
            async.series([
                function(cb){
                    app.model.Symbol.find().exec(function(err, _symbols){
                        if(err) return next(err);
                        symbols = _symbols;
                        return cb();
                    })
                },
                function(cb){
                    var cluster_pixels = new PixelArray(cluster.pixels);
                    cluster_pixels = cluster_pixels.anchor();//.scaleTo();
                    //Scale

                    //Anchor

                    async.eachSeries(
                        symbols,
                        function(symbol, _cb){
                            var symbol_pixels = new PixelArray(symbol.pixels);
                            method.test_single({
                                cluster:cluster_pixels,
                                symbol:symbol_pixels,
                                callback:function(err, match){
                                    if(err) return next(err);
                                    results[symbol.namespace] = {
                                        match:match,
                                        symbol:symbol
                                    }
                                    return _cb();
                                }
                            })

                        },
                        function(errs){
                            return cb();
                        }
                    )
                }
            ],
            function(){
                //end async
                
                results = _.sortBy(results, function(data){
                    return data.match;
                });
                options.callback(null, results);
            });



        },
        test_single:function(options){
            var cluster = options.cluster;
            var symbol = options.symbol;
            //Iterate through each pixels - figure out how many match
            var test_ct = 0;
            var match_ct = 0;
            cluster.eachPixel(function(pixel, row, col){
                test_ct += 1;
                var comp_pixel = symbol.get(row, col);
                if(comp_pixel && pixel){
                    match_ct += 1;
                }

            });

            options.callback(null, match_ct / test_ct);

        }

    }
    return method;
}