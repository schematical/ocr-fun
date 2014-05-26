var path = require('path');
var fs = require('fs');
var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function(app, uri){
    if(!uri) uri = '/images';
    app.locals.partials._image_edit_form = 'model/_image_edit_form';
    app.param('image', populate)

    app.get(uri, render_list);
    app.get(uri + '/new', render_edit);

    app.get(uri + '/:image', render_detail);
    app.get(uri + '/:image/edit',render_edit);

    app.post(
        uri,
        [
            
                app.njax.s3.route(['image']),
            
            create
        ]
    );
    app.post(
        uri + '/new',
        [
            
                app.njax.s3.route(['image']),
            
            create
        ]
    );
    app.post(
        uri + '/:image',
        [
            
            app.njax.s3.route(['image']),
            
            update
        ]
    );


    function populate(req, res, next, id){
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
        


    }

    function render_list(req, res, next){
        app.model.Image.find({}, function(err, images){
            if(err) return next(err);
            res.locals.images = [];
            for(var i in images){
                res.locals.images.push(
                    images[i].toObject()
                );
            }
            res.render('model/image_list');
        });
    }
    function render_detail(req, res, next){
        if(!req.image){
            return next();
        }
        res.render('model/image_detail');
    }
    function render_edit(req, res, next){
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
    }
    function create(req, res, next){
        if(!req.user){
            return res.redirect('/');
        }
        if(!req.image){
            req.image = new app.model.Image({
                
                        account:(req.account || null),
                
                cre_date:new Date()
            });
        }
        return update(req, res, next);

    }

    function update(req, res, next){
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
            
        
            
                req.image.clusters = req.body.clusters;
            
        
            
                if(req.account){
                    req.image.owner = req.account._id;
                }else if(req.body.owner){
                    req.image.owner = req.body.owner;
                }
            
        

        req.image.save(function(err, image){
            //app._refresh_locals();
            res.render('model/image_detail', { image: req.image.toObject() });
        });

    }

}