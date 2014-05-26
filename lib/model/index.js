'use strict';
module.exports = function(app){
    

    
        app.model.Cluster =  require('./cluster')(app);
    
        app.model.Image =  require('./image')(app);
    app.model.Symbol =  require('./symbol')(app);
    
}