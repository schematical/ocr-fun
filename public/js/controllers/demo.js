'use strict';

/* Controllers */

angular.module('iraas', [])
    .controller(
        'DemoCtl',
        [
            '$scope',
            function($scope) {
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
                            var bounds = njax_bootstrap.clusters[i].bounds;

                            var scale = .1;
                            var left = (bounds.cols.min/scale) / h_ratio;
                            var width = ((bounds.cols.max - bounds.cols.min)/scale) / h_ratio;

                            var top = (bounds.rows.min/scale) / v_ratio;
                            var height = ((bounds.rows.max - bounds.rows.min)/scale) / v_ratio;

                            var jFrame = $("<div></div>");
                            //TODO Move to CSS File
                            jFrame.css('border', 'thin red solid');
                            jFrame.css('position', 'absolute');
                            jFrame.css('top', top);
                            jFrame.css('left', left);
                            jFrame.css('width', width);
                            jFrame.css('height', height);
                            jDemoHolder.append(jFrame);
                            console.log(jDemoHolder);
                        }
                });
                $scope.enter = function(){

                   alert("Enter?");
                }
            }
        ]
    )
