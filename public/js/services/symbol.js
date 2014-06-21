var iraas_services = angular.module('iraas.symbol.service', ['ngResource']);
iraas_services.factory(
    'Symbol',
    [
        '$resource',
        function($resource){
            return $resource(
                '/librarys/:library/symbols/:symbol_id',
                {
                    library:'@library',
                    symbol_id:'@symbol_id'
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
                            cluster:'cluster'
                        },
                        isArray: true
                    }
                }
            );
        }
    ]
);