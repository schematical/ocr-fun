'use strict';
var fs = require('fs');
var async = require('async');
module.exports = function(app){

    var Schema = app.mongoose.Schema;

    var fields = {
        _id: { type: Schema.Types.ObjectId },
    
        
            namespace:{ type:String },
        
    
        
            name:{ type:String },
        
    
        
            desc_raw:String,
            desc_rendered:String,
        
    
        
            tags:{},
        
    
        
            data:{},
        
    
        
            pixels:{},
        
    
        
            library:{ type: Schema.Types.ObjectId, ref: 'Library' },
        
    
        cre_date:Date
    };

    var symbolSchema = new Schema(fields);

    symbolSchema.virtual('uri').get(function(){
        
            
                return '/librarys/:library/symbols/' + (this.namespace || this._id);
            
        
    });

    
        

    
        

    
        
            symbolSchema.virtual('desc').get(function(){
                return this.desc_rendered;
            }).set(function(value){
                if(!value || value.length == 0){
                    return false;
                }
                var markdown = require('markdown').markdown;
                this.desc_raw = value;
                this.desc_rendered = markdown.toHTML(value);
            });

        

    
        

    
        

    
        

    
        

    


    symbolSchema.pre('save', function(next){
        if(!this._id){
            this._id = new app.mongoose.Types.ObjectId();
        }
        return next();
    });

    if (!symbolSchema.options.toObject) symbolSchema.options.toObject = {};
    symbolSchema.options.toObject.transform = function (doc, ret, options) {
        ret.uri = doc.uri;
        
            

            
        
            

            
        
            
                ret.desc = doc.desc_rendered;
                ret.desc_raw = doc.desc_raw;
            
        
            

            
        
            

            
        
            

            
        
            

            
        
    }

    return symbolSchema;
}