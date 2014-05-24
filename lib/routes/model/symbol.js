var path = require('path');
var fs = require('fs');
var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function(app, uri){
    if(!uri) uri = '';
    app.locals.partials._symbol_edit_form = 'model/_symbol_edit_form';
    app.param('symbol', populate)

    app.get(uri, render_list);
    app.get(uri + '/new', render_edit);

    app.get(uri + '/:symbol', render_detail);
    app.get(uri + '/:symbol/edit',render_edit);

    app.post(
        uri,
        [
            
            create
        ]
    );
    app.post(
        uri + '/new',
        [
            
            create
        ]
    );
    app.post(
        uri + '/:symbol',
        [
            
            update
        ]
    );


    function populate(req, res, next, id){
        var or_condition = []


        var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
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
    }

    function render_list(req, res, next){
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
    }
    function render_detail(req, res, next){
        if(!req.symbol){
            return next();
        }
        res.render('model/symbol_detail');
    }
    function render_edit(req, res, next){
        async.series([
            function(cb){
                if(!req.symbol){
                    //return next();
                    req.symbol = new app.model.Symbol();
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
                        account_obj._selected = (req.symbol.account == accounts[i]._id);
                        account_objs.push(account_obj);
                    }
                    res.bootstrap('accounts', account_objs);
                    return cb();
                });
            },
            
            function(cb){

                res.render('model/symbol_edit');
            }
        ]);
    }
    function create(req, res, next){
        if(!req.user){
            return res.redirect('/');
        }
        if(!req.symbol){
            req.symbol = new app.model.Symbol({
                
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
        if(!req.symbol){
            return next(new Error('Symbol not found'));
        }

        
            
                req.symbol.namespace = req.body.namespace;
            
        
            
                req.symbol.name = req.body.name;
            
        
            
                req.symbol.desc = req.body.desc;
            
        
            
                req.symbol.tags = req.body.tags;
            
        
            
                if(req.account){
                    req.symbol.owner = req.account._id;
                }else if(req.body.owner){
                    req.symbol.owner = req.body.owner;
                }
            
        

        req.symbol.save(function(err, symbol){
            //app._refresh_locals();
            res.render('model/symbol_detail', { symbol: req.symbol.toObject() });
        });

    }

}