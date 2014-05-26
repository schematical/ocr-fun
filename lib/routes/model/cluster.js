var path = require('path');
var fs = require('fs');
var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function(app, uri){
    if(!uri) uri = '/images/:image/clusters';
    app.locals.partials._cluster_edit_form = 'model/_cluster_edit_form';
    app.param('cluster', populate)

    app.get(uri, render_list);
    app.get(uri + '/new', render_edit);

    app.get(uri + '/:cluster', render_detail);
    app.get(uri + '/:cluster/edit',render_edit);

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
        uri + '/:cluster',
        [
            
            update
        ]
    );


    function populate(req, res, next, id){
        var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
        
        var model = null;

        for(var i = 0; i < req.image.clusters.length; i++){
            //it is an id
            console.log(req.image.clusters[i]._id + '==' + id);
            if(checkForHexRegExp.test(id) && req.image.clusters[i]._id == id){
                model = req.image.clusters[i];
            }
        }

        if(model){
            res.bootstrap('cluster', model);
        }
        return next();


        


    }

    function render_list(req, res, next){
        app.model.Cluster.find({}, function(err, clusters){
            if(err) return next(err);
            res.locals.clusters = [];
            for(var i in clusters){
                res.locals.clusters.push(
                    clusters[i].toObject()
                );
            }
            res.render('model/cluster_list');
        });
    }
    function render_detail(req, res, next){
        if(!req.cluster){
            return next();
        }
        res.render('model/cluster_detail');
    }
    function render_edit(req, res, next){
        async.series([
            function(cb){
                if(!req.cluster){
                    //return next();
                    req.cluster = new app.model.Cluster();
                }
                return cb();
            },
            
            function(cb){

                res.render('model/cluster_edit');
            }
        ]);
    }
    function create(req, res, next){
        if(!req.user){
            return res.redirect('/');
        }
        if(!req.cluster){
            req.cluster = new app.model.Cluster({
                
                cre_date:new Date()
            });
        }
        return update(req, res, next);

    }

    function update(req, res, next){
        if(!req.user){
            return res.redirect('/');
        }
        if(!req.cluster){
            return next();
            //return next(new Error('Cluster not found'));
        }

        
            
                req.cluster.bounds = req.body.bounds;
            
        
            
                req.cluster.x = req.body.x;
            
        
            
                req.cluster.y = req.body.y;
            
        
            
                req.cluster.rotation = req.body.rotation;
            
        
            
                req.cluster.results = req.body.results;
            
        
            
                req.cluster.data_url = req.body.data_url;
            
        
            
                req.cluster.pixels = req.body.pixels;
            
        

        req.cluster.save(function(err, cluster){
            //app._refresh_locals();
            res.render('model/cluster_detail', { cluster: req.cluster.toObject() });
        });

    }

}