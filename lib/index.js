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
            return fs.readFile(__dirname + '/test1.jpg', function(err, src){
                if (err) throw err;
                img = new Canvas.Image();
                img.src = src;
                ctx.drawImage(img, 0, 0, img.width / 4, img.height / 4);
                return cb();
            });
        },
        function(cb){
            canvas = new Canvas(img.width,img.height);
            ctx = canvas.getContext('2d');
            img_arr = ctx.getImageData(0, 0, img.width, img.height);
            return cb();
        },
        function(cb){
            var row = 0;
            var col = 0;
            for(var i = 0; i < img_arr.length; i += 4){
                var pixel_data = {};
                pixel_data.row = Math.floor(i / img.width);
                if(!grid[pixel_data.row]){
                    grid[pixel_data.row] = [];
                }
                pixel_data.col = i - (row * img.width);
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
            console.log("Row Count:" + grid.length + ' ?==? Image Width: ' + img.width);
            console.log("Cluster Count:" + clusters.length);
            //end async
        });


}