var fs = require('fs');
var async = require('async');
var _ =  require('underscore');
var Canvas = require('canvas')
module.exports = function(options){
    var defaults = {
        tollerence: 5
    }
    _.extend(options, defaults);
    var ctx = null;
    var canvas = null
    var img = null;
    var img_arr = null;
    var clusters = [];
    var grid = [];
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
            canvas = new Canvas(img.width,img.height);
            ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width, img.height);
            img_arr = ctx.getImageData(0, 0, img.width, img.height).data;
            return cb();
        },
        function(cb){
            var row = 0;
            var col = 0;
            for(var i = 0; i < img_arr.length; i += 4){
                var pixel_data = {};
                pixel_data.row = Math.floor((i/4)  / img.width);
                if(!grid[pixel_data.row]){
                    grid[pixel_data.row] = [];
                }
                pixel_data.col = (i/4) - (pixel_data.row * img.width);
                pixel_data.r = i;
                pixel_data.g = i + 1;
                pixel_data.b = i + 2;
                pixel_data.a = i + 3;
                pixel_data.brightness = (
                        pixel_data.r +
                        pixel_data.g +
                        pixel_data.b
                    )/3;

                grid[pixel_data.row][pixel_data.col] = pixel_data;

                /*-------------Run cluster tests----------------------*/

                //Make sure we have enough data so far to determine a cluster
                if(pixel_data.row > options.tollerence && pixel_data.col > options.tollerence){
                    for(var ii = 0; ii < options.tollerence; ii ++){
                        //TODO: Fix slacker compair




                    }
                }


            }
            return cb();

        }
    ],
        function(){
            console.log("End!!!!");
            console.log("Row Count:" + grid.length + ' ?==? Image Height: ' + img.height);
            console.log("Cluster Count:" + clusters.length);
            //end async
        });


}