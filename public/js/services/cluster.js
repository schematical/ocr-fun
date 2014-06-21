var iraas_services = angular.module('iraas.cluster.service', ['ngResource']);
iraas_services.factory(
    'Cluster',
    [
        '$resource',
        function($resource){
            return $resource(
                '//' + njax_bootstrap.api_url + '/images/:image/clusters/:cluster_id',
                {
                    'image': "@image",
                    'cluster_id': "@cluster_id"
                },
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
                        'url': '//' + njax_bootstrap.api_url + '/images/:image/clusters/:cluster_id/analyze',
                        'method': 'GET',
                        'params': {},
                        isArray: true
                    }



                }
            );
        }
    ]
);