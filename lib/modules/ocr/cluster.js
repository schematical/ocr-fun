/**
 * The key to making this efficient is to determine the first couple of clusters orientation and context
 * then use that to make smarter guesses at the other clusters contexts
 *
 * NOTE: Probablly aut to make this extendable
 * @type {async|exports}
 */
var async = require('async');
var _ =  require('underscore');
var Canvas = require('canvas');
module.exports = Cluster = function(app, grid){
    this.grid = grid;
    this.pixels = [];
    this._app = app;
    return this;
}
Cluster.prototype.addPixel = function(pixel_data){
    if(!this.pixels[pixel_data.row]){
        this.pixels[pixel_data.row] = [];
    }
    this.pixels[pixel_data.row][pixel_data.col] = pixel_data;
    pixel_data.cluster = this;

}
Cluster.prototype.getBounds = function(){
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
Cluster.prototype.width = function(){

    var bounds = this.getBounds();
    return bounds.cols.max - bounds.cols.min;

}
Cluster.prototype.height = function(){

    var bounds = this.getBounds();
    return bounds.rows.max - bounds.rows.min;
}
Cluster.prototype.expand = function(start_pixel, callback){
    var grid = this.grid;
    //console.log("Expanding: " + start_pixel.row + ',' + start_pixel.col);
    //Got to test 9 touching pixels
    //Center
    if(!this._app.test_pixel(start_pixel)){
        return false;
    }
    if(!this.hasPixel(start_pixel)){
        this.addPixel(start_pixel);
    }
    var row_start = (start_pixel.row - this._app.options.tollerence);
    var row_end = (start_pixel.row + this._app.options.tollerence);
    //console.log("row: " + row_start + '  ----  ' + row_end);
    var results = {
        top:{
            left:{
                avg:0,
                count:0
            },
            center:{
                avg:0,
                count:0
            },
            right:{
                avg:0,
                count:0
            }
        },
        middle:{
            left:{
                avg:0,
                count:0
            },
            center:{
                avg:0,
                count:0
            },
            right:{
                avg:0,
                count:0
            }
        },
        bottom:{
            left:{
                avg:0,
                count:0
            },
            center:{
                avg:0,
                count:0
            },
            right:{
                avg:0,
                count:0
            }
        }

    }
    for(var row = row_start; row < row_end; row ++){
        var col_start = (start_pixel.col - (this._app.options.tollerence - (start_pixel.row - row)));
        var col_end = (start_pixel.col + (this._app.options.tollerence - (start_pixel.row - row)));
        //console.log("col: " + col_start + '    -----  ' + col_end);
        for(var col = col_start; col < col_end; col ++){
            //console.log(row + ', ' + col);
            var comp = (grid[row] && grid[row][col]) || null;

            if(
                comp &&
                !comp.cluster &&
                !this.hasPixel(comp)
            ){
                var result_set = null;
                if(row < start_pixel.row){
                    result_set = results.top;
                }else if(row > start_pixel.row){
                    result_set = results.bottom;
                }else{
                    result_set = results.middle;
                }
                if(col < start_pixel.col){
                    result_set = result_set.left;
                }else if(col > start_pixel.col){
                    result_set = result_set.right;
                }else{
                    result_set = result_set.center;
                }
                result_set.count += 1;

                if(this._app.test_pixel(comp)){
                    result_set.avg += 1;
                }
            }

        }
    }
    for(var row_key in results){
        for(var col_key in results[row_key]){
            var result_set = results[row_key][col_key];

            if(result_set.count/result_set.avg > .5){
                var row = start_pixel.row;
                var col = start_pixel.col;
                if(row_key == 'top'){
                    row -= 1;
                }else if(row_key == 'bottom'){
                    row += 1;
                }
                if(col_key == 'left'){
                    col -= 1;
                }else if(col_key == 'right'){
                    col += 1;
                }
                var comp = (grid[row] && grid[row][col]) || null;
                if(
                    comp &&
                    !comp.cluster &&
                    !this.hasPixel(comp)
                ){
                    //process.nextTick(_.bind(function(){
                        this.expand(comp, callback);
                    //}, this));
                }
            }
        }
    }
    //throw Error("Bangski");



}
/*Cluster.prototype.expand = function(start_pixel){
    var grid = this.grid;
    console.log("Expanding: " + start_pixel.row + ',' + start_pixel.col);
    //Got to test 9 touching pixels
    //Center
    if(!this._app.test_pixel(start_pixel)){
        return false;
    }
    if(!this.hasPixel(start_pixel)){
        this.addPixel(start_pixel);
    }
    //TOP Left

    var top_left = (grid[start_pixel.row - 1] && grid[start_pixel.row - 1][start_pixel.col - 1]) || null;
    if(
        top_left &&
            !this.hasPixel(top_left) &&
            this._app.test_pixel(top_left)
        ){
        this.expand(top_left);
    }
    //TOP Center
    var top_center = (grid[start_pixel.row - 1] && grid[start_pixel.row - 1][start_pixel.col]) || null;
    if(
        top_center &&
            !this.hasPixel(top_center) &&
            this._app.test_pixel(top_center)
        ){
        this.expand(top_center);
    }

    //TOP right
    var top_right = (grid[start_pixel.row - 1] && grid[start_pixel.row - 1][start_pixel.col + 1]) || null;
    if(
        top_right &&
            !this.hasPixel(top_right) &&
            this._app.test_pixel(top_right)
        ){
        this.expand(top_right);
    }

    //Middle Left

    var middle_left = (grid[start_pixel.row] && grid[start_pixel.row][start_pixel.col - 1]) || null;
    if(
        middle_left &&
            !this.hasPixel(middle_left) &&
            this._app.test_pixel(middle_left)
        ){
        this.expand(middle_left);
    }


    //Middle Right
    var middle_right = (grid[start_pixel.row] && grid[start_pixel.row][start_pixel.col + 1]) || null;
    if(
        middle_right &&
            !this.hasPixel(middle_right) &&
            this._app.test_pixel(middle_right)
        ){
        this.expand(middle_right);
    }


    //Bottom Left

    var bottom_left = (grid[start_pixel.row + 1] && grid[start_pixel.row + 1][start_pixel.col - 1]) || null;
    if(
        bottom_left &&
            !this.hasPixel(bottom_left) &&
            this._app.test_pixel(bottom_left)
        ){
        this.expand(bottom_left);
    }
    //Bottom Center
    var bottom_center = (grid[start_pixel.row + 1] && grid[start_pixel.row + 1][start_pixel.col]) || null;
    if(
        bottom_center &&
            !this.hasPixel(bottom_center) &&
            this._app.test_pixel(bottom_center)
        ){
        this.expand(bottom_center);
    }

    //Bottom right
    var bottom_right = (grid[start_pixel.row + 1] && grid[start_pixel.row + 1][start_pixel.col + 1]) || null;
    if(
        bottom_right &&
            !this.hasPixel(bottom_right) &&
            this._app.test_pixel(bottom_right)
        ){
        this.expand(bottom_right);
    }


}*/
Cluster.prototype.hasPixel = function(pixel){
    return (this.pixels[pixel.row] && this.pixels[pixel.row][pixel.col]);
}
Cluster.prototype.drawToCanvas = function(canvas, ctx){
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

            img_data.data[index + 3] = (this.pixels[row][col].a);

        }
    }

    ctx.putImageData(img_data, 0, 0);
}
Cluster.prototype.toDataUrl = function(callback){
    //Create a new canvas
    var bounds = this.getBounds();
    var canvas = new Canvas(
        bounds.rows.max - bounds.rows.min + 2,
        bounds.cols.max - bounds.cols.min + 2
    );

    var ctx = canvas.getContext('2d');
    var img_data = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );
    var index = 0;
    for(var row  = bounds.rows.min; row < bounds.rows.max; row++){
        for(var col = bounds.cols.min; col < bounds.cols.max; col++){
    //for(var row = 0; row < canvas.width; row++){
      //  for(var col = 0; col < canvas.height; col++){

            index = (row -bounds.rows.min)  * canvas.width * 4;
            index += (col - bounds.cols.min) * 4;

            var pixel = (this.pixels[row] && this.pixels[row][col]) || null;
                //var pixel = (this.pixels[row + bounds.rows.min] && this.pixels[row + bounds.rows.min][col + bounds.cols.min]) || null;
                if(pixel){
                    console.log("Drawing");
                    img_data.data[index] = 255;//pixel.r;

                    img_data.data[index + 1] =  0; //pixel.g;

                    img_data.data[index + 2] = 0; // pixel.b;

                    img_data.data[index + 3] = 255;//pixel.a;
                }else{
                  /*  img_data.data[index] = 0;
                    img_data.data[index + 1] = 0;
                    img_data.data[index + 2] = 0;
                    img_data.data[index + 3] = 0;*/
                }

        }
    }

    ctx.putImageData(img_data, 0, 0);
    return canvas.toDataURL();//callback);

}