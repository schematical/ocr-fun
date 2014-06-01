var path = require('path');
var fs = require('fs');
var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function(app){

    app.routes.symbol = route  = {
        init:function(uri){



            if(!uri) uri = '/librarys/:library/symbols';
            app.locals.partials._symbol_edit_form = 'model/_symbol_edit_form';
            app.param('symbol', route.populate)

            app.get(uri, route.render_list);
            app.get(uri + '/new', route.render_edit);

            app.get(uri + '/:symbol', route.render_detail);
            app.get(uri + '/:symbol/edit', route.render_edit);

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
                uri + '/:symbol',
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
            app.model.Symbol.findOne(query, function(err, symbol){
                if(err){
                    return next(err);
                }

                res.bootstrap('symbol', symbol);
                return next();
            })
            


        },
        render_list:function(req, res, next){
            app.model.Symbol.find({}, function(err, symbols){
                if(err) return next(err);
                res.locals.symbols = [];
                for(var i in symbols){
                    res.locals.symbols.push(
                        symbols[i].toObject()
                    );
                }
                res.render('model/symbol_list');
            });
        },
        render_detail:function(req, res, next){
            if(!req.symbol){
                return next();
            }
            res.render('model/symbol_detail');
        },
        render_edit:function(req, res, next){
            async.series([
                function(cb){
                    if(!req.symbol){
                        //return next();
                        req.symbol = new app.model.Symbol();
                    }
                    return cb();
                },
                
                function(cb){
                    if(req.library){
                        return cb();
                    }
                    app.model.Library.find({ }, function(err, librarys){
                        if(err) return next(err);
                        var library_objs = [];
                        for(var i in librarys){
                            var library_obj = librarys[i].toObject();
                            library_obj._selected = (req.symbol.library == librarys[i]._id);
                            library_objs.push(library_obj);
                        }
                        res.bootstrap('librarys', library_objs);
                        return cb();
                    });
                },
                
                function(cb){

                    res.render('model/symbol_edit');
                }
            ]);
        },
        create:function(req, res, next){
            if(!req.user){
                return res.redirect('/');
            }
            if(!req.symbol){
                req.symbol = new app.model.Symbol({
                    
                            library:(req.library || null),
                    
                    cre_date:new Date()
                });
            }
            return route.update(req, res, next);

        },
        update:function(req, res, next){
            if(!req.user){
                return res.redirect('/');
            }
            if(!req.symbol){
                return next();
                //return next(new Error('Symbol not found'));
            }

            
                
                    req.symbol.namespace = req.body.namespace;
                
            
                
                    req.symbol.name = req.body.name;
                
            
                
                    req.symbol.desc = req.body.desc;
                
            
                
                    req.symbol.tags = req.body.tags;
                
            
                
                    req.symbol.data = req.body.data;
                
            
                
                    req.symbol.pixels = req.body.pixels;
                
            
                
                    if(req.library){
                        req.symbol.library = req.library._id;
                    }else if(req.body.library){
                        req.symbol.library = req.body.library;
                    }
                
            

            req.symbol.save(function(err, symbol){
                //app._refresh_locals();
                res.render('model/symbol_detail', { symbol: req.symbol.toObject() });
            });

        }
    }
    return route;

}