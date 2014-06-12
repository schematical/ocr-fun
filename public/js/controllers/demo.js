'use strict';

/* Controllers */

angular.module('iraas.demo.controller', [])
    .controller(
        'DemoCtl',
        [
            '$scope',
            '$cookies',
            function($scope, $cookies) {

                $scope.enter = function(){

                    $cookies.name = $scope.name;
                    $cookies.color = $scope.colors[Math.floor(Math.random()  * $scope.colors.length)]
                    socket.emit('join', {
                        name: $cookies.name,
                        color: $cookies.color
                    });
                    document.location = '#draw';
                }
            }
        ]
    )
