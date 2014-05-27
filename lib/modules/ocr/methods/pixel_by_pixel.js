var async = require('async');
var _ = require('underscore');
var PixelArray = require('../pixel_array');

module.exports = function(app){
    return {
        run:function(options){


            var cluster = options.cluster;
            var libraries = options.libraries;

            //Load Symbols
            var symbols = null;
            async.series([
                function(cb){
                    app.model.Symbol.find().exec(function(err, _symbols){
                        if(err) return next(err);
                        symbols = _symbols;
                    })
                },
                function(cb){
                    var cluster_pixels = new PixelArray(cluster.pixels);
                    cluster_pixels = cluster_pixels.anchor().scale();
                    //Scale

                    //Anchor

                    async.eachSeries(
                        symbols,
                        function(symbol, _cb){
                            var symbol_pixels = new PixelArray(symbol.pixels);
                            this.test_single({
                                cluster:cluster_pixels,
                                symbol:symbol_pixels,
                                callback:_cb
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
            });



        },
        test_single:function(options){
            var cluster = options.cluster;
            var symbol = options.symbol;


        }

    }
}