var iraas_services = angular.module('iraas.symbol.service', ['ngResource']);
iraas_services.factory(
    'Symbol',
    [
        '$resource',
        function($resource){
            return $resource(
                '//' + njax_bootstrap.api_url + '/librarys/:library/symbols/:symbol_id',
                {
                    library:'@library',
                    symbol:'@id'
                },
                {
                    query: {
                        method:'GET',
                        params:{

                        },
                        isArray:true
                    },
                    "create_from_cluster": {
                        'url': '//' + njax_bootstrap.api_url + '/librarys/:library/symbols/:symbol/create_from_cluster',
                        'method': 'POST',
                        'params': {
                            image:'image',
                            cluster:'cluster'
                        },
                        isArray: false
                    }
                }
            );
        }
    ]
);