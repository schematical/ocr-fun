var path = require('path');
var fs = require('fs');
var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function(app){

    app.routes.library = route  = {
        init:function(uri){



            if(!uri) uri = '/librarys';
            app.locals.partials._library_edit_form = 'model/_library_edit_form';
            app.param('library', route.populate)

            app.get(uri, route.render_list);
            app.get(uri + '/new', route.render_edit);

            app.get(uri + '/:library', route.render_detail);
            app.get(uri + '/:library/edit', route.render_edit);

            app.post(
                uri,
                [
                    
                    route.create
                ]
            );
            app.post(
                uri + '/new',
                [
                    
                    route.create
                ]
            );
            app.post(
                uri + '/:library',
                [
                    
                    route.update
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
            app.model.Library.findOne(query, function(err, library){
                if(err){
                    return next(err);
                }

                res.bootstrap('library', library);
                return next();
            })
            


        },
        render_list:function(req, res, next){
            app.model.Library.find({}, function(err, librarys){
                if(err) return next(err);
                res.locals.librarys = [];
                for(var i in librarys){
                    res.locals.librarys.push(
                        librarys[i].toObject()
                    );
                }
                res.render('model/library_list');
            });
        },
        render_detail:function(req, res, next){
            if(!req.library){
                return next();
            }
            res.render('model/library_detail');
        },
        render_edit:function(req, res, next){
            async.series([
                function(cb){
                    if(!req.library){
                        //return next();
                        req.library = new app.model.Library();
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
                            account_obj._selected = (req.library.account == accounts[i]._id);
                            account_objs.push(account_obj);
                        }
                        res.bootstrap('accounts', account_objs);
                        return cb();
                    });
                },
                
                function(cb){

                    res.render('model/library_edit');
                }
            ]);
        },
        create:function(req, res, next){
            if(!req.user){
                return res.redirect('/');
            }
            if(!req.library){
                req.library = new app.model.Library({
                    
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
            if(!req.library){
                return next();
                //return next(new Error('Library not found'));
            }

            
                
                    req.library.namespace = req.body.namespace;
                
            
                
                    req.library.name = req.body.name;
                
            
                
                    req.library.desc = req.body.desc;
                
            
                
                    if(req.account){
                        req.library.owner = req.account._id;
                    }else if(req.body.owner){
                        req.library.owner = req.body.owner;
                    }
                
            

            req.library.save(function(err, library){
                //app._refresh_locals();
                res.render('model/library_detail', { library: req.library.toObject() });
            });

        }
    }
    return route;

}