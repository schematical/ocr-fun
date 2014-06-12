var iraas_services = angular.module('iraas.image.service', ['ngResource']);
iraas_services.factory(
    'Image',
    [
        '$resource',
        function($resource){
            return $resource('/imagess/:image_id', {}, {
                query: {
                    method:'GET',
                    params:{
                        phoneId:'phones'
                    },
                    isArray:true
                }
            });
        }
    ]
);