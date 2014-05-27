var async = require('async');
var _ = require('underscore');
module.exports = PixelArray = function(pixels){
    //_.extend(this, pixels);
    this.pixels = pixels;
    return this;
}
PixelArray.prototype.eachPixel = function(callback){
    for(var row in this.pixels){
        for(var col in this.pixels[row]){
            var pixel = this.pixels[row][col];
            this.apply(callback, [pixel, row, col]);
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
            var old_pixel = this.get(old_row, old_col);
            //Get/Clone the row and assign it
            var new_pixel = _.clone(old_pixel);
            new_pixel_array.set(row, col, new_pixel);
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
    var x_offset = options.x - bounds.cols.min;
    var y_offset = options.y - bounds.rows.min;
    var new_pixel_array = new PixelArray([]);
    this.eachPixel(function(pixel, row, col){
        var new_pixel = _.clone(pixel);
        new_pixel_array.set(
            row + y_offset,
            col + x_offset,
            new_pixel
        );
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