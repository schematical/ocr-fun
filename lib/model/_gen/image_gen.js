'use strict';
var fs = require('fs');
var async = require('async');
module.exports = function(app){

    var Schema = app.mongoose.Schema;

    var fields = {
        _id: { type: Schema.Types.ObjectId },
    
        
            namespace:{ type:String },
        
    
        
            name:{ type:String },
        
    
        
            image:{"type":"String"},
        
    
        
            desc_raw:String,
            desc_rendered:String,
        
    
        
            clusters:[app.model.Cluster.schema],
        
    
        
            owner:{ type: Schema.Types.ObjectId, ref: 'Account' },
        
    
        cre_date:Date
    };

    var imageSchema = new Schema(fields);

    imageSchema.virtual('uri').get(function(){
        
            
                return '/images/' + (this.namespace || this._id);
            
        
    });

    
        

    
        

    
        
            imageSchema.virtual('image_s3').get(function(){
                var AWS = require('aws-sdk');
                AWS.config.update(app.njax.config.aws);
                var s3 = new AWS.S3();
                var _this = this;
                return {
                    url:'http://s3.amazonaws.com/' + app.njax.config.aws.bucket_name  +  '/' + this.image,
                    getFile:function(file_path, callback){
                        if(!callback && _.isFunction(file_path)){
                            callback = file_path;
                            file_path = path.join(app.njax.config.cache_dir,_this.image);
                        }
                        async.series([
                            function(cb){
                                mkdirp(path.dirname(file_path), function (err) {
                                    if(err) return callback(err);
                                    return cb();
                                });
                            },
                            function(cb){
                                var stream = require('fs').createWriteStream(file_path);
                                var params = {
                                    Bucket: app.njax.config.aws.bucket_name,
                                    Key:this.image
                                }
                                var body = '';
                                s3.getObject(params).
                                    on('httpData',function (chunk) {
                                        stream.write(chunk);
                                        body += chunk;
                                    }).
                                    on('httpDone',function () {
                                        stream.end(null, null, function(){
                                            callback(null, body, file_path);
                                        });

                                    }).
                                    send();
                            }
                        ]);
                    },
                    setFile:function(file_path, callback){
                        var content = fs.readFileSync(file_path);
                        async.series([
                            function(cb){
                                var params = {
                                    Bucket: app.njax.config.aws.bucket_name,
                                    Key: file_path,
                                    Body: content,
                                    ACL: 'public-read',
                                    ContentLength: content.length
                                };
                                s3.putObject(params, function (err, aws_ref) {
                                    if (err) {
                                        return callback(err);
                                    }
                                    _this.image = file_path;
                                    return cb(null);
                                });
                            },
                            function(cb){
                                _this.save(function(err){
                                    if(err) return callback(err);
                                    return cb();
                                });
                            },
                            function(cb){
                                return callback();
                            }
                        ]);
                    }
                }
            });
        

    
        
            imageSchema.virtual('desc').get(function(){
                return this.desc_rendered;
            }).set(function(value){
                var markdown = require('markdown').markdown;
                this.desc_raw = value;
                this.desc_rendered = markdown.toHTML(value);
            });

        

    
        

    
        

    


    imageSchema.pre('save', function(next){
        if(!this._id){
            this._id = new app.mongoose.Types.ObjectId();
        }
        return next();
    });

    if (!imageSchema.options.toObject) imageSchema.options.toObject = {};
    imageSchema.options.toObject.transform = function (doc, ret, options) {
        ret.uri = doc.uri;
        
            

            
        
            

            
        
            
                ret.image_s3 = {
                    url:doc.image_s3.url
                }
            
        
            
                ret.desc = doc.desc_rendered;
                ret.desc_raw = doc.desc_raw;
            
        
            

            
        
            

            
        
    }

    return imageSchema;
}