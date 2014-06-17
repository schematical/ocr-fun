'use strict';


// Declare app level module which depends on filters, and services
angular.module(
        'iraas',
    [
        'ngRoute',
        'ngCookies',
        
            'iraas.symbol.service',
            'iraas.symbol.controller',
        
            'iraas.library.service',
            'iraas.library.controller',
        
            'iraas.cluster.service',
            'iraas.cluster.controller',
        
            'iraas.image.service',
            'iraas.image.controller',
        
        'iraas.filters',
        'iraas.directives',
        
        'iraas.demo'
    ]
).config(
        [
            '$routeProvider',
            '$interpolateProvider',
            function($routeProvider, $interpolateProvider){
                $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
                $routeProvider.when('/', { templateUrl: 'partials/welcome.html', controller: 'WelcomeCtl'});
                $routeProvider.when('/home', { templateUrl: 'partials/home.html', controller: 'HomeCtl'});
                $routeProvider.when('/draw', { templateUrl: 'partials/draw.html', controller: 'DrawCtl'});
                $routeProvider.when('/suggest', { templateUrl: 'partials/suggest.html', controller: 'SuggestCtl'});
                $routeProvider.when('/display', { templateUrl: 'partials/display.html', controller: 'DisplayCtl'});
                $routeProvider.otherwise({redirectTo: '/'});
        }
    ]
);