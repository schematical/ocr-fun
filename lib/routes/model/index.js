module.exports = function(app){
    /**
     * Model Routes
     */

        require('./library')(app);
        require('./symbol')(app);
    
        require('./image')(app);

        require('./cluster')(app);
    

}