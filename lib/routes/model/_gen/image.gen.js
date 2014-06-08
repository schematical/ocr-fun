var path = require('path');
var fs = require('fs');
var async = require('async');
var _ = require('underscore');
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function(app){

     var route = app.njax.routes.image = {
        
            owner_query:function(req){
                if(!req.user){
                    return null;
                }
                return {
                    owner:req.user._id
                }
            },
        
        init:function(uri){

            if(!uri) uri = '/images';
            app.locals.partials._image_edit_form = 'model/_image_edit_form';
            app.param('image', route.populate)

            app.get(uri, route.render_list);
            app.get(uri + '/new', route.render_edit);

            app.get(uri + '/:image', route.render_detail);
            app.get(uri + '/:image/edit', route.render_edit);

            app.post(
                uri,
                [
                    
                        app.njax.s3.route(['image']),
                    
                    route.create
                ]
            );
            app.post(
                uri + '/new',
                [
                    
                        app.njax.s3.route(['image']),
                    
                    route.create,
                    route.render_detail
                ]
            );
            app.post(
                uri + '/:image',
                [
                    
                    app.njax.s3.route(['image']),
                    
                    route.update,
                    route.render_detail
                ]
            );

        },
        populate:function(req, res, next, id){
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
            
            var or_condition = []

            if(checkForHexRegExp.test(id)){
                or_condition.push({ _id:new ObjectId(id) });
            }
            
                or_condition.push({ namespace:id });
            
            if(or_condition.length == 0){
                return next();
            }
            var query = { $or: or_condition };
            app.model.Image.findOne(query, function(err, image){
                if(err){
                    return next(err);
                }

                res.bootstrap('image', image);
                return next();
            })
            


        },
        render_list:function(req, res, next){
            var query = _.clone(route.owner_query(req));
            if(!query){
                return next();
            }
            app.model.Image.find(query, function(err, images){
                if(err) return next(err);
                res.locals.images = [];
                for(var i in images){
                    res.locals.images.push(
                        images[i].toObject()
                    );
                }
                res.render('model/image_list');
            });
        },
        render_detail:function(req, res, next){
            if(!req.image){
                return next();
            }
            res.render('model/image_detail');
        },
        render_edit:function(req, res, next){
            async.series([
                function(cb){
                    if(!req.image){
                        //return next();
                        req.image = new app.model.Image();
                    }
                    return cb();
                },
                
                function(cb){
                    if(req.account){
                        return cb();
                    }
                    app.model.Account.find({ }, function(err, accounts){
                        if(err) return next(err);
                        var account_objs = [];
                        for(var i in accounts){
                            var account_obj = accounts[i].toObject();
                            account_obj._selected = (req.image.account == accounts[i]._id);
                            account_objs.push(account_obj);
                        }
                        res.bootstrap('accounts', account_objs);
                        return cb();
                    });
                },
                
                function(cb){

                    res.render('model/image_edit');
                }
            ]);
        },
        create:function(req, res, next){
            if(!req.user){
                return res.redirect('/');
            }
            if(!req.image){
                req.image = new app.model.Image({
                    
                            account:(req.account || null),
                    
                    cre_date:new Date()
                });
            }
            return route.update(req, res, next);

        },
        update:function(req, res, next){
            if(!req.user){
                return res.redirect('/');
            }
            if(!req.image){
                return next();
                //return next(new Error('Image not found'));
            }

            
                
                    req.image.namespace = req.body.namespace;
                
            
                
                    req.image.name = req.body.name;
                
            
                
                    if(req.files.image){
                        req.image.image = req.files.image.s3_path;
                    }
                
            
                
                    req.image.desc = req.body.desc;
                
            
                
                    //Do nothing it is an array
                    //req.image.clusters = req.body.clusters;
                
            
                
                    if(req.account){
                        req.image.owner = req.account._id;
                    }else if(req.body.owner){
                        req.image.owner = req.body.owner;
                    }
                
            

            req.image.save(function(err, image){
                //app._refresh_locals();
                return next();
                //res.render('model/image_detail', { image: req.image.toObject() });
            });

        }
    }
    return route;

}