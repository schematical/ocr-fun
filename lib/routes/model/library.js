var path = require('path');
var fs = require('fs');
var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function(app, uri){
    if(!uri) uri = '/librarys';
    app.locals.partials._library_edit_form = 'model/_library_edit_form';
    app.param('library', populate)

    app.get(uri, render_list);
    app.get(uri + '/new', render_edit);

    app.get(uri + '/:library', render_detail);
    app.get(uri + '/:library/edit',render_edit);

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
        uri + '/:library',
        [
            
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
        app.model.Library.findOne(query, function(err, library){
            if(err){
                return next(err);
            }

            res.bootstrap('library', library);
            return next();
        })
        


    }

    function render_list(req, res, next){
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
    }
    function render_detail(req, res, next){
        if(!req.library){
            return next();
        }
        res.render('model/library_detail');
    }
    function render_edit(req, res, next){
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
    }
    function create(req, res, next){
        if(!req.user){
            return res.redirect('/');
        }
        if(!req.library){
            req.library = new app.model.Library({
                
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