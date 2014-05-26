'use strict';
var fs = require('fs');
var async = require('async');
module.exports = function(app){

    var Schema = app.mongoose.Schema;

    var fields = {
        _id: { type: Schema.Types.ObjectId },
    
        
            bounds:{},
        
    
        
            x:{"type":"Number"},
        
    
        
            y:{"type":"Number"},
        
    
        
            rotation:{"type":"Number"},
        
    
        
            results:{ type:String },
        
    
        
            data_url:{ type:String },
        
    
        
            pixels:{},
        
    
        cre_date:Date
    };

    var clusterSchema = new Schema(fields);

    clusterSchema.virtual('uri').get(function(){
        
            console.log("URL:", this.parent().uri + '/clusters/' + this._id);
                return this.parent().uri + '/clusters/' + this._id;
            
        
    });

    
        

    
        

    
        

    
        

    
        

    
        

    
        

    


    clusterSchema.pre('save', function(next){
        if(!this._id){
            this._id = new app.mongoose.Types.ObjectId();
        }
        return next();
    });

    if (!clusterSchema.options.toObject) clusterSchema.options.toObject = {};
    clusterSchema.options.toObject.transform = function (doc, ret, options) {
        ret.uri = doc.uri;
        
            

            
        
            

            
        
            

            
        
            

            
        
            

            
        
            

            
        
            

            
        
    }

    return clusterSchema;
}