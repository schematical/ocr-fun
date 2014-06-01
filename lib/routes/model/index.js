module.exports = function(app){
    /**
     * Model Routes
     */
    
        require('./symbol')(app);
    
        require('./library')(app);
    
        require('./cluster')(app);
    
        require('./image')(app);
    

}