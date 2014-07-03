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
                    symbol:'@id',
                    namespace:'@namespace',
                    name:'@name'
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
                            cluster:'cluster',
                            name:'name',
                            namespace:'namespace'
                        },
                        isArray: true
                    }
                }
            );
        }
    ]
);