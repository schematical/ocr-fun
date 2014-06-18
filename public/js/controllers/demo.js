'use strict';

/* Controllers */

angular.module('iraas.demo', [ 'iraas.cluster.service'])
    .controller(
        'DemoCtl',
        [

            '$scope',
            'Cluster',
            function($scope, Cluster) {
                //Get image dimensions
                var jImage = $('#img-demo');
                $scope.message = 'xyz';

                var jDemoHolder = $('#div-demo-holder');
                $scope.clusters = [];
                $scope.add_frame = function(){

                    var pic_real_width = this.width;   // Note: $(this).width() will not
                    var pic_real_height = this.height; // work for in memory images.
                    var h_ratio = pic_real_width/parseInt(jImage.css('width'));
                    var v_ratio = pic_real_height/parseInt(jImage.css('height'));
                    //Load up the bootstraped content
                    for(var i in njax_bootstrap.clusters){
                        //Render new boxes using the bounds
                        var cluster = njax_bootstrap.clusters[i];
                        var bounds = cluster.bounds;

                        var scale = .2;
                        var left = (bounds.cols.min/scale) / h_ratio;
                        var width = ((bounds.cols.max - bounds.cols.min)/scale) / h_ratio;

                        var top = (bounds.rows.min/scale) / v_ratio;
                        var height = ((bounds.rows.max - bounds.rows.min)/scale) / v_ratio;


                        //TODO Move to CSS File
                        cluster.pos = {
                            top:Math.round(top),
                            left:Math.round(left),
                            width:Math.round(width),
                            height:Math.round(height),
                            bottom: Math.round(top + height)
                        }
                        cluster.menu_display = 'none';
                        cluster.mouseover = function(){
                            //Expand menu
                            this.menu_display = 'block';
                        }
                        cluster.mouseleave = function(){
                            //Hide menu
                            this.menu_display = 'none';
                        }
                        cluster.click = function(){
                            //nothing
                            Cluster.analyze(
                                {
                                    'image': njax_bootstrap.image._id,
                                    'cluster_id':this._id
                                },{'Id':1});
                        }

                        $scope.clusters.push(cluster);



                    }

                    $scope.$apply(function($scope){
                        console.log($scope);
                        jFrame.popover({
                            trigger:'hover',
                            content:"<a href='" + cluster.uri + "/analyze'>Analyse</a>",
                            html:true,
                            delay: { show: 100, hide: 1000 }

                        });

                    });
                }



                $("<img/>") // Make in memory copy of image to avoid css issues
                    .attr("src", jImage.attr("src"))
                    .load($scope.add_frame);
                $scope.enter = function(){

                   alert("Enter?");
                }
            }
        ]
    )
