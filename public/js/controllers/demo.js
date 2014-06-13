'use strict';

/* Controllers */

angular.module('iraas', [])
    .controller(
        'DemoCtl',
        [
            '$scope',
            function($scope) {
                //Get image dimensions
                var jImage = $('img-demo');




                $("<img/>") // Make in memory copy of image to avoid css issues
                    .attr("src", jImage.attr("src"))
                    .load(function() {
                        var pic_real_width = this.width;   // Note: $(this).width() will not
                        var pic_real_height = this.height; // work for in memory images.

                        //Load up the bootstraped content
                        for(var i in njax_bootstrap.clusters){
                            //Render new boxes using the bounds
                            njax_bootstrap.clusters[i]
                            $()
                        }
                });
                $scope.enter = function(){

                   alert("Enter?");
                }
            }
        ]
    )
