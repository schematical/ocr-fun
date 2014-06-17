var iraas_services = angular.module('iraas.cluster.service', ['ngResource']);
iraas_services.factory(
    'Cluster',
    [
        '$resource',
        function($resource){
            return $resource(
                '/images/:image/clusters/:cluster_id',
                {},
                {
                    query: {
                        method:'GET',
                        params:{
                            image:'image',
                            cluster_id:'cluster_id'
                        },
                        isArray:true
                    },
                    "analyze": {
                        'url':'/images/:image/clusters/:cluster_id/analyze',
                        'method': 'GET',
                        'params': {/*'reviews_only': "true"*/},
                        isArray: true
                    }
                }
            );
        }
    ]
);