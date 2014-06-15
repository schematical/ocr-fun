'use strict';

/* Controllers */

angular.module('iraas', [ ])
    .controller(
        'DemoCtl',
        [

            '$scope',
            'Cluster',
            function($scope, Cluster) {
                //Get image dimensions
                var jImage = $('#img-demo');

                var jDemoHolder = $('#div-demo-holder');


                $("<img/>") // Make in memory copy of image to avoid css issues
                    .attr("src", jImage.attr("src"))
                    .load(function() {
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

                            var jFrame = $("<div></div>");
                            //TODO Move to CSS File
                            jFrame.css('border', 'thin black solid');
                            jFrame.css('position', 'absolute');
                            jFrame.css('top', top);
                            jFrame.css('left', left);
                            jFrame.css('width', width);
                            jFrame.css('height', height);
                            jFrame.css('background', 'url(' + cluster.data_url + ')');
                            jFrame.css('background-size', 'cover');
                            jFrame.popover({
                                trigger:'hover',
                                content:"<a href='" + cluster.uri + "/analyze'>Analyse</a>",
                                html:true,
                                delay: { show: 100, hide: 1000 }

                            });
                            jDemoHolder.append(jFrame);

                        }
                });
                $scope.enter = function(){

                   alert("Enter?");
                }
            }
        ]
    )
