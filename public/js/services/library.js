var iraas_services = angular.module('iraas.library.service', ['ngResource']);
iraas_services.factory(
    'Library',
    [
        '$resource',
        function($resource){
            return $resource('/libraryss/:library_id', {}, {
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