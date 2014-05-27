var Canvas = require('canvas');
var async = require('async');
var _ = require('underscore');
var fs = require('fs');

module.exports = PixelArray = function(pixels){
    //_.extend(this, pixels);
    this.pixels = pixels;
    return this;
}
PixelArray.prototype.eachPixel = function(callback){
    for(var row in this.pixels){
        for(var col in this.pixels[row]){
            var pixel = this.pixels[row][col];
            callback.apply(this, [pixel, row, col]);
        }
    }
}
PixelArray.prototype.getRaw = function(){
    return _.clone(this.pixels);
}
PixelArray.prototype.get = function(row, col){
    return (this.pixels[row] && this.pixels[row][col]) || null;
}
PixelArray.prototype.set = function(row, col, pixel){
    if(!pixel){
        throw new Error("Need to pass in a 3rd param of 'pixel' ");
    }
    if(!this.pixels[row]){
        this.pixels[row] = [];
    }
    pixel.row = row;
    pixel.col = col;
    return this.pixels[row][col] = pixel;
}
PixelArray.prototype.scaleTo = function(options){
    if(!options){
        options = {};
    }
    var bounds = this.getBounds();
    var curr_height = this.height();
    var curr_width = this.width()

    var new_height = options.height ||100;
    var new_width = options.width || null;
    var v_scale = null;
    var h_scale = null;

    if(_.isNull(new_width)){
        v_scale = new_height / curr_height;//this.height();
        h_scale = v_scale;
    }else if(_.isNull(new_height)){
        h_scale = new_width / curr_width;
        v_scale = h_scale;
    }
    var new_pixel_array = new PixelArray([]);
    var new_row_count = Math.round(v_scale * curr_height);
    var new_col_count = Math.round(h_scale * curr_width);
    for(var row = 0; row < new_row_count; row++){
        for(var col = 0; col < new_col_count; col++){
            //Calc corosponding old col and row
            var old_row = Math.floor(row * v_scale);
            var old_col = Math.floor(col * h_scale);
            var old_pixel = this.get(
                bounds.rows.min + old_row,
                bounds.cols.min + old_col
            );
            //Get/Clone the row and assign it
            if(old_pixel){
                var new_pixel = _.clone(old_pixel);
                new_pixel_array.set(
                    bounds.rows.min + row,
                    bounds.cols.min + col,
                    new_pixel
                );
            }
        }
    }
    return new_pixel_array;

}
PixelArray.prototype.anchor = function(options){
    if(!options){
        options = {};
    }
    var bounds = this.getBounds();

    var x = options.x ||0;
    var y = options.y ||0;
    var x_offset = x - bounds.cols.min;
    var y_offset = y - bounds.rows.min;
    var new_pixel_array = new PixelArray([]);
    this.eachPixel(function(pixel, row, col){
        if(pixel){
            var new_pixel = _.clone(pixel);
            new_pixel_array.set(
                row + y_offset,
                col + x_offset,
                new_pixel
            );
        }
    })
    return new_pixel_array;
}
PixelArray.prototype.rotate = function(){

}
PixelArray.prototype.hasPixel = function(pixel){
    return (this.pixels[pixel.row] && this.pixels[pixel.row][pixel.col]);
}
PixelArray.prototype.getBounds = function(){
    var max_row = null;
    var min_row = null;
    var max_col = null;
    var min_col = null;
    for(var row in this.pixels){
        if(!max_row || max_row < row){
            max_row = row;
        }
        if(!min_row || min_row > row){
            min_row = row;
        }
        for(var col in this.pixels[row]){
            if(!max_col || max_col < col){
                max_col = col;
            }
            if(!min_col || min_col > col){
                min_col = col;
            }
        }
    }


    return {
        rows:{
            max:max_row,
            min:min_row
        },
        cols:{
            max:max_col,
            min:min_col
        }
    }
}
PixelArray.prototype.width = function(){
    var bounds = this.getBounds();
    return bounds.cols.max - bounds.cols.min;
}
PixelArray.prototype.height = function(){

    var bounds = this.getBounds();
    return bounds.rows.max - bounds.rows.min;
}
PixelArray.prototype.toDataUrl = function(callback){
    //Create a new canvas
    var bounds = this.getBounds();
    var canvas = new Canvas(

        (bounds.cols.max - bounds.cols.min) + 2,
        (bounds.rows.max - bounds.rows.min) + 2
    );

    var ctx = canvas.getContext('2d');
    var img_data = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );
    var index = 0;
    for(var row  = bounds.rows.min; row <= bounds.rows.max; row++){
        for(var col = bounds.cols.min; col <= bounds.cols.max; col++){

            index = (row -bounds.rows.min)  * canvas.width * 4;
            index += (col - bounds.cols.min) * 4;

            var pixel = (this.pixels[row] && this.pixels[row][col]) || null;

            if(pixel){
                img_data.data[index] = 255;//pixel.r;

                img_data.data[index + 1] =  0; //pixel.g;

                img_data.data[index + 2] = 0; // pixel.b;

                img_data.data[index + 3] = 255;//pixel.a;
            }

        }
    }

    ctx.putImageData(img_data, 0, 0);
    return canvas.toDataURL();//callback);

}
PixelArray.prototype.toCanvas = function(options){
    if(!options){
         options = {};
    }
    var bounds = this.getBounds();
    var canvas = options.canvas;
    if(!canvas){
        canvas = new Canvas(
            (bounds.cols.max - bounds.cols.min) + 2,
            (bounds.rows.max - bounds.rows.min) + 2
        );
    }
    var ctx = canvas.getContext('2d');
    //DEBUG STUFF:
    var r = 128 + Math.floor(Math.random() * 128);
    var g = 128 + Math.floor(Math.random() * 128);
    var b = 128 + Math.floor(Math.random() * 128);


    var img_data = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );
    var index = 0;
    for(var row in this.pixels){
        for(var col in this.pixels[row]){

            index = row * canvas.width * 4;
            index += col * 4;

            img_data.data[index] = r;//this.pixels[row][col].r;

            img_data.data[index + 1] =  g;//(this.pixels[row][col].g);

            img_data.data[index + 2] =  b;//(this.pixels[row][col].b);

            img_data.data[index + 3] = 255;//(this.pixels[row][col].a);

        }
    }

    ctx.putImageData(img_data, 0, 0);
    return canvas;
}
PixelArray.prototype.toFile = function(options){
    if(!options.type){
        options.type = 'png';
    }
    if(!options.callback){
        throw new Error("Need to pass in a 'callback' to this function");
    }
    if(!options.file_path){
        options.callback(new Error('Need to pass in a "file_path"'));
    }

    var out = fs.createWriteStream(options.file_path)

    var canvas = this.toCanvas();
    var stream = null;
    switch(options.type){
        case('png'):
            stream = canvas.pngStream();
        break;
        default:
            return options.callback(new Error('Not a valid type'));
    }


    stream.on('data', function(chunk){
        out.write(chunk);
    });

    stream.on('end', function(){
        options.callback(null, out, stream);
    });
}
