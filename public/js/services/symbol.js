var iraas_services = angular.module('iraas.symbol.service', ['ngResource']);
iraas_services.factory(
    'Symbol',
    [
        '$resource',
        function($resource){
            return $resource('/librarys/:library/symbols/:symbol_id', {}, {
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