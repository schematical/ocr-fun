var Ocr = require('./lib');
var app = Ocr({
    img_path:__dirname + '/test1.jpg'
    //img_path:'/home/user1a/Pictures/bkgd.jpg'
});
app.run();