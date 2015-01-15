angular
    .module('demo', ['ngAnimate', 'AutoCompletePlaces'])
    .controller('DemoController', ['$scope',
        function ($scope) {
            'use strict';
            $scope.created = false;
            $scope.loading = false;
            $scope.error = false;
            $scope.jobOffer = {
                localisations: []
            };
            $scope.angularLoaded = true;
            $scope.inscription = function () {
                $scope.loading = true;
            };
    }]);
