var fs = require('fs');
var async = require('async');
var _ =  require('underscore');
var Canvas = require('canvas')
var Cluster  = require('./cluster');
module.exports = function(options){
    var defaults = {
        tollerence: 3,
        scale:.2,
        min_size:10
    }
    _.extend(options, defaults);
    var ctx = null;
    var canvas = null
    var img = null;
    var img_arr = null;
    var clusters = [];
    var grid = [];
    var app = {
        options:options,
        run: function(callback){

            async.series([
                function(cb){
                    return fs.readFile(options.img_path, function(err, src){
                        if (err) throw err;
                        img = new Canvas.Image();
                        img.src = src;

                        return cb();
                    });
                },
                function(cb){
                    canvas = new Canvas(img.width * options.scale,img.height * options.scale);
                    ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, img.width * options.scale, img.height * options.scale);
                    img.width = 40;
                    img.height = 40;
                    img_arr = ctx.getImageData(
                        0,
                        0,
                        img.width * options.scale,
                        img.height * options.scale
                    ).data;
                    return cb();
                },
                function(cb){
                    var row = 0;
                    var col = 0;
                    for(var i = 0; i < img_arr.length; i += 4){
                        var pixel_data = {};
                        pixel_data.row = Math.floor((i/4)  / canvas.width);
                        if(!grid[pixel_data.row]){
                            grid[pixel_data.row] = [];
                        }
                        pixel_data.col = (i/4) - (pixel_data.row * canvas.width);
                        pixel_data.r = img_arr[i];
                        pixel_data.g = img_arr[i + 1];
                        pixel_data.b = img_arr[i + 2];
                        pixel_data.a = img_arr[i + 3];
                        pixel_data.brightness = (
                                pixel_data.r +
                                pixel_data.g +
                                pixel_data.b
                            )/3;

                        grid[pixel_data.row][pixel_data.col] = pixel_data;

                    }
                    return cb();
                },
                function(cb){

                    for(var row in grid){

                        for(var col in grid[row]){
                            /*-------------Run cluster tests----------------------*/

                            //Make sure we have enough data so far to determine a cluster
                            var pixel = grid[row][col];
                            if(!pixel){
                                throw new Error("Missing Pixel at " + row + '/' + col);
                            }
                            if(
                                !pixel.cluster &&
                                app.test_pixel(pixel)
                            ){
                                //Create new cluster
                                var cluster = new Cluster(app, grid);
                                clusters.push(cluster);
                                cluster.expand(pixel);
                            }


                        }
                    }
                    return cb();
                }
            ],
            function(){
                //Check min size
                var _clusters = []
                for(var i in clusters){
                    if(clusters[i].width() > options.min_size || clusters[i].height() > options.min_size){
                        _clusters.push(clusters[i]);
                    }
                }
                clusters = _clusters;
                console.log("End!!!!");
                console.log("Row Count:" + grid.length + ' ?==? Image Height: ' + img.height);
                console.log("Cluster Count:" + clusters.length);

                //DEBUG: Draw clusters on with color

                var out = fs.createWriteStream(__dirname + '/test1.out.png')
                for(var i in clusters){
                    clusters[i].drawToCanvas(canvas, ctx);
                }
                var stream = canvas.pngStream();

                stream.on('data', function(chunk){
                    out.write(chunk);
                });

                stream.on('end', function(){
                    console.log('saved png');
                });
                //end async
                if(callback){
                    return callback(null, clusters);
                }
            });

        },
        test_pixel:function(pixel_data){

            if(pixel_data.brightness > 128){
                return false;
            }
            return true;
        },
        clusters:function(){
            return clusters;
        }

    }
    return app;




}