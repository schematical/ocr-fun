/**
 * The key to making this efficient is to determine the first couple of clusters orientation and context
 * then use that to make smarter guesses at the other clusters contexts
 *
 * NOTE: Probablly aut to make this extendable
 * @type {async|exports}
 */
var async = require('async');
var _ =  require('underscore');
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
    //TODO: Write this
}
Cluster.prototype.expand = function(start_pixel){
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


}
Cluster.prototype.hasPixel = function(pixel){
    return (this.pixels[pixel.row] && this.pixels[pixel.row][pixel.col]);
}