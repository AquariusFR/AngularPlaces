define([],
    function () {
        'use strict';

        return function ($scope) {
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
        };
    }
);
