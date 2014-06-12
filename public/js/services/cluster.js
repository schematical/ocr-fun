var iraas_services = angular.module('iraas.cluster.service', ['ngResource']);
iraas_services.factory(
    'Cluster',
    [
        '$resource',
        function($resource){
            return $resource('/images/:image/clusterss/:cluster_id', {}, {
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