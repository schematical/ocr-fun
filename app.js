var Ocr = require('./lib');
var app = Ocr({
    img_path:__dirname + '/test1.jpg'
});
app.run();